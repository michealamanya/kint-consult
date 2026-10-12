import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { company, enquiryAreas } from "@/data/site";
import { validateEnquiry } from "@/lib/contact-validation.mjs";
import { allowEnquiry, contactDeliveryReady } from "@/lib/contact";

export const runtime = "nodejs";
const respond = (body: unknown, status: number) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

async function limitedJson(request: NextRequest): Promise<unknown> {
  if (!request.body) throw new Error("empty");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 24000) {
      await reader.cancel();
      throw new Error("large");
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const trustedOrigin = new URL(company.url).origin;
  const devOrigin =
    process.env.NODE_ENV !== "production" && origin === request.nextUrl.origin;
  if (origin !== trustedOrigin && !devOrigin)
    return respond({ error: "This request is not permitted." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return respond({ error: "Use a JSON enquiry." }, 415);
  let input: unknown;
  try {
    input = await limitedJson(request);
  } catch {
    return respond({ error: "The enquiry is invalid or too large." }, 400);
  }
  const { value, errors } = validateEnquiry(input, enquiryAreas);
  if (!value)
    return respond({ error: "Please check the enquiry details.", errors }, 400);
  if (!contactDeliveryReady())
    return respond(
      {
        error:
          "Live enquiry delivery is not available. You can save a draft from the contact page.",
      },
      503,
    );
  const key = createHash("sha256")
    .update(value.email.toLowerCase())
    .digest("hex");
  if (!allowEnquiry(key))
    return respond(
      { error: "Please wait before submitting another enquiry." },
      429,
    );

  if (process.env.TURNSTILE_SECRET_KEY) {
    const token = (input as Record<string, unknown>).token;
    if (typeof token !== "string" || token.length > 2048 || !token)
      return respond(
        { error: "Please complete the spam protection check." },
        400,
      );
    try {
      const verification = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: token,
          }),
          signal: AbortSignal.timeout(10000),
        },
      );
      const result = await verification.json();
      if (
        !verification.ok ||
        !result.success ||
        result.action !== "contact" ||
        result.hostname !== new URL(company.url).hostname
      )
        return respond(
          {
            error:
              "Spam protection could not verify this request. Please try again.",
          },
          400,
        );
    } catch {
      return respond(
        {
          error:
            "Spam protection is temporarily unavailable. Please try again.",
        },
        503,
      );
    }
  }

  try {
    const delivered = await fetch(process.env.CONTACT_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}`,
      },
      body: JSON.stringify({
        ...value,
        source: "kint-corporate-website",
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (!delivered.ok) throw new Error("receiver");
    return respond(
      {
        message:
          "Your enquiry has been received. Thank you for contacting KINT.",
      },
      200,
    );
  } catch {
    return respond(
      {
        error:
          "Delivery could not be confirmed. Please save your draft and try again later.",
      },
      502,
    );
  }
}

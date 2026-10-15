/** Server-side transport. Never import this module into a client component. */
export function graphReady(env = process.env) {
  return Boolean(
    /^[a-f\d-]{36}$/i.test(env.M365_TENANT_ID || "") &&
    env.M365_CLIENT_ID &&
    env.M365_CLIENT_SECRET &&
    env.M365_SENDER &&
    env.CONTACT_RECIPIENT,
  );
}

export async function deliverEnquiry(
  enquiry,
  env = process.env,
  transport = fetch,
) {
  const options = { signal: AbortSignal.timeout(10000), redirect: "error" };
  if (graphReady(env)) {
    const auth = await transport(
      `https://login.microsoftonline.com/${env.M365_TENANT_ID}/oauth2/v2.0/token`,
      {
        ...options,
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: env.M365_CLIENT_ID,
          client_secret: env.M365_CLIENT_SECRET,
          scope: "https://graph.microsoft.com/.default",
          grant_type: "client_credentials",
        }),
      },
    );
    if (!auth.ok) throw new Error("Mail authentication unavailable");
    const token = await auth.json();
    if (typeof token.access_token !== "string" || !token.access_token)
      throw new Error("Mail authentication invalid");
    const content = [
      `Reference: ${enquiry.reference}`,
      `Submitted: ${enquiry.submittedAt}`,
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Phone: ${enquiry.phone || "Not supplied"}`,
      `Organisation: ${enquiry.organisation || "Not supplied"}`,
      `Area: ${enquiry.area}`,
      `Privacy notice acknowledged: ${enquiry.consent === true ? "Yes" : "No"}`,
      "",
      enquiry.message,
    ].join("\n");
    const sent = await transport(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(env.M365_SENDER)}/sendMail`,
      {
        ...options,
        signal: AbortSignal.timeout(10000),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token}`,
        },
        body: JSON.stringify({
          message: {
            subject: `KINT website enquiry · ${enquiry.reference}`,
            body: { contentType: "Text", content },
            toRecipients: [
              { emailAddress: { address: env.CONTACT_RECIPIENT } },
            ],
            replyTo: [
              { emailAddress: { address: enquiry.email, name: enquiry.name } },
            ],
          },
          saveToSentItems: true,
        }),
      },
    );
    if (sent.status !== 202) throw new Error("Mail submission unavailable");
    return;
  }
  const url = new URL(env.CONTACT_WEBHOOK_URL || "");
  if (url.protocol !== "https:" || !env.CONTACT_WEBHOOK_TOKEN)
    throw new Error("Mail transport not configured");
  const result = await transport(url.href, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.CONTACT_WEBHOOK_TOKEN}`,
    },
    body: JSON.stringify(enquiry),
  });
  if (!result.ok) throw new Error("Receiver unavailable");
}

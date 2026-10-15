import { test } from "node:test";
import assert from "node:assert/strict";
import { deliverEnquiry, graphReady } from "../src/lib/mail-delivery.mjs";
const env = {
  M365_TENANT_ID: "12345678-1234-1234-1234-123456789abc",
  M365_CLIENT_ID: "test-app",
  M365_CLIENT_SECRET: "private",
  M365_SENDER: "admin@kintconsult.com",
  CONTACT_RECIPIENT: "admin@kintconsult.com",
};
const enquiry = {
  reference: "KINT-test",
  submittedAt: "2026-10-15T00:00:00Z",
  name: "A Person",
  email: "visitor@example.org",
  phone: "0740470116",
  organisation: "Example",
  area: "General enquiry",
  message: "A legitimate test enquiry",
  consent: true,
};
test("Graph submits text mail with a reference and replies directed to the visitor", async () => {
  const requests = [];
  await deliverEnquiry(enquiry, env, async (url, options) => {
    requests.push({ url, options });
    return requests.length === 1
      ? new Response(JSON.stringify({ access_token: "test-token" }))
      : new Response(null, { status: 202 });
  });
  assert.equal(requests.length, 2);
  assert.ok(requests[0].url.startsWith("https://login.microsoftonline.com/"));
  const body = JSON.parse(requests[1].options.body);
  assert.equal(
    body.message.toRecipients[0].emailAddress.address,
    env.CONTACT_RECIPIENT,
  );
  assert.equal(body.message.replyTo[0].emailAddress.address, enquiry.email);
  assert.match(body.message.body.content, /KINT-test/);
  assert.equal(body.message.body.contentType, "Text");
  assert.ok(!requests[1].options.body.includes("private"));
});
test("authentication and mail failures are surfaced without disclosing provider responses", async () => {
  await assert.rejects(
    deliverEnquiry(
      enquiry,
      env,
      async () => new Response("private provider details", { status: 401 }),
    ),
    /Mail authentication unavailable/,
  );
  let count = 0;
  await assert.rejects(
    deliverEnquiry(enquiry, env, async () =>
      ++count === 1
        ? new Response(JSON.stringify({ access_token: "token" }))
        : new Response(null, { status: 429 }),
    ),
    /Mail submission unavailable/,
  );
  assert.equal(
    graphReady({ ...env, M365_TENANT_ID: "../../another-host" }),
    false,
  );
});
test("configured webhook receives the same reference and rejects failure", async () => {
  await deliverEnquiry(
    enquiry,
    {
      CONTACT_WEBHOOK_URL: "https://receiver.example/enquiries",
      CONTACT_WEBHOOK_TOKEN: "test",
    },
    async (url, options) => {
      assert.equal(JSON.parse(options.body).reference, enquiry.reference);
      assert.equal(options.headers.Authorization, "Bearer test");
      return new Response(null, { status: 204 });
    },
  );
  await assert.rejects(
    deliverEnquiry(
      enquiry,
      {
        CONTACT_WEBHOOK_URL: "http://receiver.example",
        CONTACT_WEBHOOK_TOKEN: "test",
      },
      async () => {
        throw Error("must not call");
      },
    ),
    /not configured/,
  );
});

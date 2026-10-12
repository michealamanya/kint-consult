import { test } from "node:test";
import assert from "node:assert/strict";
import { validateEnquiry } from "../src/lib/contact-validation.mjs";
const areas = ["ERP / Odoo", "General enquiry"];
const valid = {
  name: "  Alex Example  ",
  email: "alex@example.com",
  organisation: "Example business",
  area: "ERP / Odoo",
  message: "We would like to discuss inventory and procurement workflows.",
  consent: true,
  website: "",
};
test("accepts and normalises a legitimate enquiry", () => {
  const result = validateEnquiry(valid, areas);
  assert.equal(result.value.name, "Alex Example");
  assert.deepEqual(result.errors, {});
});
test("rejects missing fields and an unrecognised service", () => {
  const result = validateEnquiry(
    { ...valid, name: "", area: "unknown", consent: "true", message: "short" },
    areas,
  );
  assert.equal(result.value, null);
  for (const key of ["name", "area", "consent", "message"])
    assert.ok(result.errors[key]);
});
test("rejects malformed payloads without throwing", () => {
  for (const payload of [null, [], "hello", 42, { email: {}, name: [] }])
    assert.equal(validateEnquiry(payload, areas).value, null);
});
test("rejects spam honeypot and line breaks in identity fields", () => {
  assert.equal(
    validateEnquiry({ ...valid, website: "spam.example" }, areas).value,
    null,
  );
  assert.ok(
    validateEnquiry({ ...valid, name: "Alex\r\nInjected" }, areas).errors.name,
  );
  assert.ok(
    validateEnquiry(
      { ...valid, email: "a@example.com\r\nCc:b@example.com" },
      areas,
    ).errors.email,
  );
});
test("enforces field size limits", () => {
  const result = validateEnquiry(
    {
      ...valid,
      name: "x".repeat(101),
      organisation: "x".repeat(151),
      message: "x".repeat(5001),
    },
    areas,
  );
  for (const key of ["name", "organisation", "message"])
    assert.ok(result.errors[key]);
});

/**
 * Shared validation; the server always runs this independently of the browser.
 * @param {unknown} input
 * @param {string[]} areas
 */
export function validateEnquiry(input, areas) {
  /** @type {Record<string, string>} */
  const errors = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { errors: { form: "Please provide a valid enquiry." }, value: null };
  }
  const record = /** @type {Record<string, unknown>} */ (input);
  const text = (/** @type {string} */ key) =>
    typeof record[key] === "string" ? record[key].trim() : "";
  const value = {
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    organisation: text("organisation"),
    area: text("area"),
    message: text("message"),
    consent: record.consent === true,
  };
  if (
    value.name.length < 2 ||
    value.name.length > 100 ||
    /[\r\n\x00-\x1f]/.test(value.name)
  )
    errors.name = "Enter your name (2–100 characters).";
  if (
    value.email.length > 254 ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value.email)
  )
    errors.email = "Enter a valid email address.";
  if (value.phone && !/^[+()\d .-]{7,30}$/.test(value.phone))
    errors.phone = "Enter a valid phone number, or leave it blank.";
  if (
    value.organisation.length > 150 ||
    /[\r\n\x00-\x1f]/.test(value.organisation)
  )
    errors.organisation = "Use up to 150 characters for your organisation.";
  if (!areas.includes(value.area)) errors.area = "Select an area of interest.";
  if (
    value.message.length < 20 ||
    value.message.length > 5000 ||
    /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value.message)
  )
    errors.message = "Describe your enquiry in 20–5,000 characters.";
  if (!value.consent) errors.consent = "Please acknowledge the privacy notice.";
  if (text("website")) errors.form = "The enquiry could not be processed.";
  return { errors, value: Object.keys(errors).length ? null : value };
}

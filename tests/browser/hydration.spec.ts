import { test, expect } from "@playwright/test";

test("header hydrates with current labels on initial load and navigation", async ({
  page,
  request,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydrat|server rendered|didn't match/i.test(message.text())
    )
      errors.push(message.text());
  });
  const html = await (await request.get("/")).text();
  expect(html).toContain('aria-label="KINT Consult Limited home"');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const header = page.locator(".site-header");
  await expect(header.locator(".wordmark")).toHaveAttribute(
    "aria-label",
    "KINT Consult Limited home",
  );
  await expect(header.locator(".header-contact")).toHaveText("Contact");
  await header.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(header.getByRole("navigation")).toBeVisible();
  expect(errors).toEqual([]);
  await header.getByRole("button", { name: "More", exact: true }).click();
  await header.getByRole("link", { name: "Partners", exact: true }).click();
  await expect(page).toHaveURL(/\/partners$/, {timeout:30000});
  await page.reload();
  await expect(header.locator(".header-contact")).toHaveText("Contact");
  await header.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(header.getByRole("navigation")).toBeVisible();
  expect(errors).toEqual([]);
});

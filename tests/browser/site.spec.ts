import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage, desktop navigation and accessibility", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    "href",
    /^\/icon(?:\?|$)/,
  );
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    "href",
    /^\/apple-icon(?:\?|$)/,
  );
  for (const path of ["/icon", "/apple-icon"]) {
    const icon = await request.get(path);
    expect(icon.status(), path).toBe(200);
    expect(icon.headers()["content-type"]).toContain("image/png");
    expect((await icon.body()).subarray(0, 8).toString("hex")).toBe(
      "89504e470d0a1a0a",
    );
    expect((await icon.body()).byteLength).toBeGreaterThan(800);
  }
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Industrial intelligence.",
  );
  await expect(page.locator(".hero-image img")).toBeVisible();
  await expect(page.locator(".hero-footnote")).toContainText(
    "KINT Intelligence is in development.",
  );
  await expect(
    page
      .locator(".contact-cta")
      .getByRole("link", { name: "admin@kintconsult.com" }),
  ).toHaveAttribute("href", "mailto:admin@kintconsult.com");
  await expect(
    page.locator(".footer-connect").getByRole("link", { name: "0740470116" }),
  ).toHaveAttribute("href", "tel:0740470116");
  await expect
    .poll(() =>
      page
        .locator(".hero-image img")
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.screenshot({ path: ".qa/home-desktop.png", fullPage: true });
  await page.screenshot({ path: ".qa/hero-desktop.png" });
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.getByRole("link", { name: "Explore KINT", exact: true }).click();
  await expect(page).toHaveURL(/#what-we-do$/);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Solutions", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Digital systems",
  );
  await page
    .getByRole("link", { name: /ERP & Odoo/ })
    .first()
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "ERP & Odoo",
  );
});

test("mobile navigation, focus, layout and intelligence status", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menu" });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await page.screenshot({ path: ".qa/home-mobile.png", fullPage: true });
  await page.screenshot({ path: ".qa/hero-mobile.png" });
  await page
    .locator(".data-section")
    .screenshot({ path: ".qa/data-flow-mobile.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "KINT Intelligence" })
    .click();
  await expect(
    page.getByText("In development", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Connecting information",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("contact validates and saves an honest local draft", async ({ page }) => {
  await page.goto("/contact?area=ERP%20%2F%20Odoo");
  await expect(
    page
      .locator(".contact-aside")
      .getByRole("link", { name: "admin@kintconsult.com" }),
  ).toHaveAttribute("href", "mailto:admin@kintconsult.com");
  await expect(page.getByLabel("Area of interest")).toHaveValue("ERP / Odoo");
  await page.getByRole("button", { name: "Save enquiry draft" }).click();
  await expect(
    page.getByText("Enter your name (2–100 characters)."),
  ).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeFocused();
  await page.getByLabel("Full name").fill("Alex Example");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page
    .getByLabel("How can we help?")
    .fill("We need a clear inventory and procurement workflow.");
  await page.getByRole("checkbox").check();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save enquiry draft" }).click();
  expect((await download).suggestedFilename()).toBe("kint-enquiry-draft.txt");
  await expect(page.getByRole("status")).toContainText(
    "It has not been sent to KINT.",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("all published routes resolve and unknown topics return 404", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname,
  );
  expect(urls.length).toBe(28);
  for (const url of urls) {
    expect((await request.get(url)).status(), url).toBe(200);
  }
  expect((await request.get("/solutions/nonexistent")).status()).toBe(404);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/opengraph-image")).status()).toBe(200);
});

test("contact API rejects bad origins and malformed input", async ({
  request,
}) => {
  const allowedOrigin = "https://kintconsults.com";
  const value = {
    name: "Alex Example",
    email: "alex@example.com",
    organisation: "Example",
    area: "ERP / Odoo",
    message: "We need inventory and procurement systems.",
    consent: true,
  };
  expect(
    (
      await request.post("/api/contact", {
        headers: { origin: "https://example.com" },
        data: value,
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/contact", {
        headers: { origin: allowedOrigin },
        data: { ...value, message: "short" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/contact", {
        headers: { origin: allowedOrigin },
        data: value,
      })
    ).status(),
  ).toBe(503);
  expect(
    (
      await request.post("/api/contact", {
        headers: { origin: allowedOrigin, "content-type": "text/plain" },
        data: "hello",
      })
    ).status(),
  ).toBe(415);
});

test("narrow screens have no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  for (const path of [
    "/",
    "/about",
    "/industries",
    "/solutions",
    "/intelligence",
    "/insights",
    "/contact",
    "/insights/data-foundations-industrial-intelligence",
  ]) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((element) => {
          const bounds = element.getBoundingClientRect();
          return bounds.right > innerWidth + 1 && bounds.width > 0;
        })
        .map((element) => ({
          tag: element.tagName,
          class: element.className,
          width: Math.round(element.getBoundingClientRect().width),
        })),
    );
    expect(overflow, path).toEqual([]);
  }
});

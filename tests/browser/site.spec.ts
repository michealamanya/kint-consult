import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage, desktop navigation and accessibility", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const policy = (await request.get("/")).headers()["content-security-policy"];
  expect(policy).toContain("script-src 'self'");
  expect(policy).not.toContain("'unsafe-eval'");
  expect(policy).not.toContain(" ws:");
  expect(policy).not.toContain(" wss:");
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
  await page
    .locator(".capability-section")
    .screenshot({ path: ".qa/capabilities-desktop.png" });
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
  await page.locator(".capability-section").screenshot({
    path: ".qa/capabilities-mobile.png",
    // Keep fixed navigation out of this tall section-only capture.
    style: ".site-header, .skip-link { visibility: hidden !important; }",
  });
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
  const allowedOrigin = "https://kintconsult.com";
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
  test.setTimeout(90000);
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of [
      "/",
      "/about",
      "/industries",
      "/solutions",
      "/intelligence",
      "/insights",
      "/contact",
      "/insights/data-foundations-industrial-intelligence",
      "/industries/petroleum",
      "/solutions/erp-odoo",
      "/intelligence/supplier",
      "/privacy",
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
      expect(overflow, `${path} at ${width}px`).toEqual([]);
    }
  }
});

test("layout grows with large screens and reflows on resize", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto("/");
  let previousWidth = 0;
  for (const width of [1440, 1920, 2560, 3440]) {
    await page.setViewportSize({ width, height: 1080 });
    await page.evaluate(() => document.fonts.ready);
    const container = await page.locator(".hero > .container").boundingBox();
    expect(container!.width).toBeGreaterThan(width * 0.85);
    expect(container!.width).toBeGreaterThan(previousWidth);
    previousWidth = container!.width;
    const diagram = await page.locator(".connection-visual").boundingBox();
    expect(diagram!.width).toBeGreaterThan(container!.width * 0.4);
    for (const path of [
      "/",
      "/industries",
      "/solutions",
      "/contact",
      "/insights/erp-implementation-process-first",
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      if (path.startsWith("/insights/")) {
        const article = await page.locator(".article-body").boundingBox();
        const frame = await page
          .locator(".content-section > .container")
          .boundingBox();
        expect(
          article!.width,
          "insight article fills its fluid container",
        ).toBeGreaterThan(frame!.width * 0.95);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${path} at ${width}px`,
      ).toBe(true);
    }
    await page.goto("/");
    if (width === 1920 || width === 3440) {
      await page.screenshot({ path: `.qa/responsive-${width}.png` });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("button", { name: "Menu", exact: true }),
  ).toBeVisible();
  const copy = await page.locator(".hero-copy").boundingBox();
  const visual = await page.locator(".hero-visual").boundingBox();
  expect(visual!.y).toBeGreaterThanOrEqual(copy!.y + copy!.height);
});

test("clay theme accessibility across core and detail pages", async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const path of [
    "/about",
    "/industries",
    "/solutions",
    "/insights",
    "/privacy",
    "/industries/petroleum",
    "/solutions/erp-odoo",
    "/intelligence/supplier",
    "/insights/erp-implementation-process-first",
  ]) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    if (["/about", "/solutions", "/insights"].includes(path)) {
      await page.screenshot({ path: `.qa/clay-${path.slice(1)}.png` });
    }
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      audit.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
        })),
      })),
      path,
    ).toEqual([]);
  }
});

test("gold hover and keyboard states retain accessible contrast", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto("/");
  const primary = page.getByRole("link", { name: "Explore KINT", exact: true });
  await primary.hover();
  await page.waitForTimeout(250);
  await page.screenshot({ path: ".qa/gold-hover-hero.png" });
  for (const locator of [
    primary,
    page.locator(".intelligence-topics a").first(),
    page.locator(".capability-grid article:first-child a"),
  ]) {
    await locator.hover();
    await page.waitForTimeout(250);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
  }
  await page.goto("/solutions");
  const topic = page.locator(".topic-link").first();
  await topic.hover();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await topic.hover();
  await expect(topic).toHaveCSS("transform", "none");
  await topic.focus();
  await page.keyboard.press("Tab");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

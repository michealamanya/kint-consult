import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.setTimeout(90000);

test("insights search and filters work without requiring a client search service", async ({
  page,
}) => {
  await page.goto("/insights");
  const cards = page.locator(".insight-item");
  const originalCount = await cards.count();
  if (!originalCount) {
    await expect(page.getByRole("status")).toContainText("No insights match");
    return;
  }
  const sampleTitle = await cards.first().locator("h3").innerText();
  const sampleCategory = (await cards
    .first()
    .locator(".insight-meta span")
    .first()
    .textContent())!.trim();
  await page.getByLabel("Search insights").fill(sampleTitle);
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.locator(".insight-item").first()).toContainText(
    sampleTitle,
  );
  await page.getByRole("link", { name: "Clear filters" }).click();
  await expect(page.locator(".insight-item")).toHaveCount(originalCount);
  await page
    .getByLabel("Category", { exact: true })
    .selectOption(sampleCategory);
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.locator(".insight-item").first()).toContainText(
    sampleTitle,
  );
  await page.getByLabel("Search insights").fill("no matching article 9283");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.getByRole("status")).toContainText("No insights match");
});

test("advisory content, accessible filters, safe empty pages and disabled editor", async ({
  page,
  request,
}) => {
  await page.goto("/solutions/market-opportunity");
  for (const heading of ["The challenge", "Our response", "Intended outcome"])
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
  await page.getByRole("link", { name: "Discuss your requirements" }).click();
  await expect(page.getByLabel("Area of interest *")).toHaveValue(
    "Market & opportunity intelligence",
  );
  await expect(page.getByLabel("Phone number (optional)")).toBeVisible();
  await page.goto("/careers");
  await expect(
    page.getByText(/There are no advertised vacancies/),
  ).toBeVisible();
  await page.goto("/insights");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  expect((await request.get("/api/health")).status()).toBe(200);
  await page.goto("/admin");
  await expect(page.getByRole("status")).toContainText(
    "Editorial access has not been configured",
  );
  const response = await request.get("/admin/index.html");
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
  expect(response.headers()["content-security-policy"]).toContain(
    "https://cdn.jsdelivr.net",
  );
});

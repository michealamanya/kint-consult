import { test, expect } from "@playwright/test";

test("public pages have unique titles, canonical URLs, sharing metadata and valid schemas", async ({
  page,
  request,
}) => {
  test.setTimeout(180000);
  const sitemapResponse = await request.get("/sitemap.xml");
  const xml = await sitemapResponse.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => new URL(match[1]),
  );
  const sitemapDates = await page.evaluate((source) => {
    const document = new DOMParser().parseFromString(source, "application/xml");
    return Object.fromEntries(
      Array.from(document.getElementsByTagName("url")).map((entry) => [
        new URL(entry.getElementsByTagName("loc")[0].textContent!).href,
        entry.getElementsByTagName("lastmod")[0]?.textContent,
      ]),
    );
  }, xml);
  const titles = new Set<string>();
  for (const url of urls) {
    const response = await request.get(url.pathname);
    expect(response.status(), url.pathname).toBe(200);
    const head = await page.evaluate(
      (html) => {
        const document = new DOMParser().parseFromString(html, "text/html");
        const meta = (name: string) =>
          document
            .querySelector(`meta[name="${name}"],meta[property="${name}"]`)
            ?.getAttribute("content");
        const schemas = Array.from(
          document.querySelectorAll('script[type="application/ld+json"]'),
        ).map((script) => JSON.parse(script.textContent || "null"));
        return {
          title: document.title,
          description: meta("description"),
          canonical: document
            .querySelector('link[rel="canonical"]')
            ?.getAttribute("href"),
          headingCount: document.querySelectorAll("h1").length,
          ogTitle: meta("og:title"),
          ogImage: meta("og:image"),
          twitter: meta("twitter:card"),
          robots: meta("robots"),
          schemas,
        };
      },
      await response.text(),
    );
    expect(head.title, url.pathname).toContain("KINT Consult");
    expect(titles.has(head.title), `Unique title for ${url.pathname}`).toBe(
      false,
    );
    titles.add(head.title);
    expect(head.description?.trim().length, url.pathname).toBeGreaterThan(30);
    expect(new URL(head.canonical!).href, url.pathname).toBe(url.href);
    expect(head.headingCount, url.pathname).toBe(1);
    expect(head.ogTitle, url.pathname).toBeTruthy();
    expect(head.ogImage, url.pathname).toMatch(/^https:\/\//);
    expect(head.twitter, url.pathname).toBe("summary_large_image");
    expect(head.robots, url.pathname).not.toContain("noindex");
    expect(head.schemas.length, url.pathname).toBeGreaterThan(0);
    for (const schema of head.schemas)
      expect(schema["@context"]).toBe("https://schema.org");
    if (url.pathname.startsWith("/insights/")) {
      const article = head.schemas.find(
        (schema) => schema["@type"] === "Article",
      );
      expect(article?.image).toMatch(/^https:\/\//);
      expect(Number.isFinite(Date.parse(article?.datePublished))).toBe(true);
      expect(Date.parse(sitemapDates[url.href]!)).toBe(
        Date.parse(article.dateModified),
      );
    }
  }
  await page.goto("/insights?q=data");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://kintconsult.com/insights",
  );
  const unknown = await request.get("/page-that-does-not-exist");
  expect(unknown.status()).toBe(404);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /admin/");
  expect(robots).toContain("Disallow: /api/");
  expect(robots).toContain("Sitemap: https://kintconsult.com/sitemap.xml");
});

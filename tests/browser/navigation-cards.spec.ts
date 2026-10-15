import { test, expect } from "@playwright/test";

test.setTimeout(90000);

test("secondary pages are in the header with keyboard and mobile access", async ({
  page,
}) => {
  await page.goto("/");
  const header = page.locator(".site-header");
  const more = header.getByRole("button", { name: "More", exact: true });
  await more.click();
  await page.screenshot({ path: ".qa/header-more-desktop.png" });
  for (const name of ["Projects", "Partners", "Careers"]) {
    await expect(header.getByRole("link", { name, exact: true })).toBeVisible();
    await expect(
      page.locator("footer").getByRole("link", { name, exact: true }),
    ).toHaveCount(0);
  }
  await page.keyboard.press("Escape");
  await expect(more).toBeFocused();
  await expect(more).toHaveAttribute("aria-expanded", "false");
  await more.click();
  await header.getByRole("link", { name: "Partners", exact: true }).click();
  await expect(page).toHaveURL(/\/partners$/);
  await expect(more).toHaveAttribute("aria-expanded", "false");
  await page.setViewportSize({ width: 390, height: 844 });
  await header.getByRole("button", { name: "Menu", exact: true }).click();
  await more.click();
  await page.screenshot({ path: ".qa/header-more-mobile.png" });
  await header.getByRole("link", { name: "Careers", exact: true }).click();
  await expect(page).toHaveURL(/\/careers$/);
  await expect(
    header.getByRole("button", { name: "Menu", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("cards fit their grids and align actions at mobile and desktop sizes", async ({
  page,
}) => {
  test.setTimeout(180000);
  for (const width of [390, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/solutions",
      "/industries",
      "/intelligence",
      "/insights",
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const images = page.locator(
        ".topic-list img,.insight-grid img,.capability-grid img,.sector-index img,.intelligence-detail img",
      );
      await images.evaluateAll((elements) =>
        elements.forEach((element) => {
          (element as HTMLImageElement).loading = "eager";
        }),
      );
      await expect
        .poll(
          () =>
            images.evaluateAll((elements) =>
              elements
                .filter(
                  (element) =>
                    !(element as HTMLImageElement).complete ||
                    !(element as HTMLImageElement).naturalWidth,
                )
                .map((element) =>
                  (element as HTMLImageElement).getAttribute("src"),
                ),
            ),
          {
            timeout: 45000,
            message: `Card artwork loads on ${route} at ${width}px`,
          },
        )
        .toEqual([]);
      const issues = await page.evaluate(() => {
        const problems: string[] = [];
        for (const grid of document.querySelectorAll(
          ".topic-list,.insight-grid,.capability-grid,.sector-index",
        )) {
          const cards = Array.from(grid.children).filter((el) =>
            el.matches(".topic-link,.insight-item,article,.sector-item"),
          );
          const rows = new Map<number, number[]>();
          for (const card of cards) {
            const rect = card.getBoundingClientRect();
            if (card.scrollWidth > card.clientWidth + 1)
              problems.push("Card content overflows");
            if (rect.left < 0 || rect.right > innerWidth + 1)
              problems.push("Card outside viewport");
            const key = Math.round(rect.top);
            rows.set(key, [...(rows.get(key) || []), rect.height]);
          }
          for (const heights of rows.values())
            if (Math.max(...heights) - Math.min(...heights) > 2)
              problems.push("Unequal card heights in a row");
          const actions = cards.map((card) =>
            card.querySelector(".text-link")?.getBoundingClientRect(),
          );
          if (
            grid.matches(".insight-grid,.capability-grid") &&
            cards.length > 1 &&
            Math.abs(
              cards[0].getBoundingClientRect().top -
                cards[1].getBoundingClientRect().top,
            ) < 2 &&
            actions.every(Boolean)
          ) {
            const bottoms = actions.map((rect) => rect!.bottom);
            if (Math.max(...bottoms) - Math.min(...bottoms) > 2)
              problems.push("Card actions are misaligned");
          }
        }
        return problems;
      });
      expect(issues, `${route} at ${width}px`).toEqual([]);
      if (
        (width === 390 || width === 1280) &&
        (route === "/solutions" || route === "/insights")
      ) {
        await page
          .locator(route === "/solutions" ? ".topic-link" : ".insight-item")
          .first()
          .screenshot({
            path: `.qa/final-${route.slice(1)}-card-${width}.png`,
            style: ".site-header {visibility:hidden}",
          });
      }
    }
  }
});

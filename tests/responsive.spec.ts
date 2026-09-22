import { expect, test, type Page } from "@playwright/test";

const viewportCases = [
  { name: "mobile-320", width: 320, height: 568 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1024", width: 1024, height: 768 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "iphone-landscape", width: 844, height: 390 },
] as const;

const primaryRoutes = [
  { name: "today", path: "/today" },
  { name: "pray", path: "/pray?tab=daily" },
  { name: "read", path: "/read?read=daily" },
  { name: "learn", path: "/learn?tab=creed" },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(dimensions.body, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport + 1);
}

for (const viewport of viewportCases) {
  test(`${viewport.name} keeps the Learn experience within the viewport`, async ({ page, browserName }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/learn?tab=creed", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    if (browserName === "chromium") {
      await page.screenshot({ path: testInfo.outputPath(`${viewport.name}-learn.png`), fullPage: true, animations: "disabled" });
    }
  });
}

for (const route of primaryRoutes) {
  for (const viewport of [
    { name: "mobile", width: 375, height: 812 },
    { name: "desktop", width: 1024, height: 768 },
  ]) {
    test(`${route.name} is reflow-safe on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("#main-content")).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });
  }
}

test("1024px tablet-width header stays uncluttered", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/today", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Mobile primary navigation" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("desktop navigation does not collide at its first breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 1120, height: 800 });
  await page.goto("/today", { waitUntil: "domcontentloaded" });

  const appHeader = page.locator("header").first();
  const desktopNav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(desktopNav).toBeVisible();
  const [headerBox, navBox] = await Promise.all([appHeader.boundingBox(), desktopNav.boundingBox()]);
  expect(headerBox).not.toBeNull();
  expect(navBox).not.toBeNull();
  expect(headerBox!.x + headerBox!.width).toBeLessThanOrEqual(navBox!.x);
  await expectNoHorizontalOverflow(page);
});

test("200% zoom equivalent reflows to the mobile shell", async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 900 });
  await page.goto("/learn", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("navigation", { name: "Mobile primary navigation" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeHidden();
  await expectNoHorizontalOverflow(page);
});

test("large-text accessibility mode remains reflow-safe", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("app:settings", JSON.stringify({
      __wrapped: 1,
      ts: Date.now(),
      v: {
        calendarMode: "gregorian",
        jurisdiction: "oca",
        language: "en",
        reminders: { enableNotifications: false, morningHour: 7, eveningHour: 21 },
        accessibility: { largeText: true, highContrast: false, reduceMotion: false },
        personalization: { showGroundingOnToday: true },
      },
    }));
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/learn?tab=creed", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/a11y-large-text/);
  await expectNoHorizontalOverflow(page);
});

test("long Learn tabs scroll and keep the focused tab visible", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/learn", { waitUntil: "domcontentloaded" });

  const tabList = page.locator(".premium-tabs").first();
  const metrics = await tabList.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    overflowX: getComputedStyle(element).overflowX,
  }));
  expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
  expect(metrics.overflowX).toBe("auto");

  const lastTab = tabList.getByRole("tab").last();
  await lastTab.focus();
  await expect.poll(async () => lastTab.evaluate((tab) => {
    const tabRect = tab.getBoundingClientRect();
    const listRect = tab.parentElement!.getBoundingClientRect();
    return tabRect.left >= listRect.left - 1 && tabRect.right <= listRect.right + 1;
  })).toBe(true);
});

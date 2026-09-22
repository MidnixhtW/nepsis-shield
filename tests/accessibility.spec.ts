import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/today",
  "/pray?tab=daily",
  "/read?read=daily",
  "/learn?tab=creed",
  "/settings",
  "/about",
  "/privacy",
  "/download",
  "/field-manual",
] as const;

for (const route of routes) {
  test(`${route} has no critical accessibility violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    const critical = results.violations.filter((violation) => violation.impact === "critical");
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
}

test("keyboard users can reveal and use the skip link", async ({ page }) => {
  await page.goto("/today", { waitUntil: "domcontentloaded" });
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("large text and high contrast preserve critical accessibility", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("app:settings", JSON.stringify({
      __wrapped: 1,
      ts: Date.now(),
      v: {
        calendarMode: "gregorian",
        jurisdiction: "oca",
        language: "en",
        reminders: { enableNotifications: false, morningHour: 7, eveningHour: 21 },
        accessibility: { largeText: true, highContrast: true, reduceMotion: true },
        personalization: { showGroundingOnToday: true },
      },
    }));
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/learn?tab=creed", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveClass(/a11y-large-text/);
  await expect(page.locator("html")).toHaveClass(/a11y-high-contrast/);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  const critical = results.violations.filter((violation) => violation.impact === "critical");
  expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
});

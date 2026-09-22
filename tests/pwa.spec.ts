import { expect, test } from "@playwright/test";

test.describe("production PWA", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Service-worker offline flow is validated in Chromium.");

  test("manifest and service worker provide an offline app shell", async ({ page, context }) => {
    await page.goto("/today", { waitUntil: "load" });
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

    const manifestResponse = await page.request.get("/manifest.webmanifest");
    expect(manifestResponse.ok()).toBe(true);
    const manifest = await manifestResponse.json();
    expect(manifest.start_url).toBe("/today");
    expect(manifest.display).toBe("standalone");
    expect(manifest.orientation).toBe("any");

    await context.setOffline(true);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page).toHaveURL(/\/today$/);
  });
});

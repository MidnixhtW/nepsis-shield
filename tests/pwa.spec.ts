import { expect, test } from "./fixtures";

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

  test("an app update clears old app caches but keeps recordings saved for offline", async ({ page }) => {
    // Before the service worker exists: an old app-shell cache and one saved recording.
    await page.goto("/robots.txt");
    await page.evaluate(async () => {
      await (await caches.open("nepsis-shield-pwa-v0")).put("/old-shell", new Response("old"));
      await (await caches.open("nepsis-audio-v1")).put("/audio/abba/saved.mp3", new Response("audio"));
    });
    await page.goto("/today", { waitUntil: "load" });
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await expect.poll(() => page.evaluate(() => caches.has("nepsis-shield-pwa-v0"))).toBe(false);
    expect(await page.evaluate(async () => Boolean(await (await caches.open("nepsis-audio-v1")).match("/audio/abba/saved.mp3")))).toBe(true);
  });
});

import { expect, test } from "./fixtures";
import type { Page } from "@playwright/test";

// The app's service worker would take over the page's requests, and WebKit then skips the routes below.
test.use({ serviceWorkers: "block" });

const MARKER = "In the beginning was the Word, kept for a day with no signal.";

const BOOKS = [
  "Genesis", "Exodus", "Psalms", "Psalm", "Matthew", "Mark", "Luke", "John",
].map((name, index) => ({ bookid: index + 1, name, chapters: 150 }));

const CORS = { "access-control-allow-origin": "*" };

async function serveBible(page: Page) {
  await page.route("https://bible-api.com/**", (route) =>
    route.fulfill({
      headers: CORS,
      json: {
        reference: "John 1",
        verses: [{ book_name: "John", chapter: 1, verse: 1, text: MARKER }],
        text: MARKER,
        translation_id: "kjv",
        translation_name: "KJV",
      },
    }),
  );
  await page.route("https://bolls.life/get-books/**", (route) => route.fulfill({ headers: CORS, json: BOOKS }));
  await page.route("https://bolls.life/get-text/**", (route) => route.fulfill({ headers: CORS, json: [{ pk: 1, verse: 1, text: MARKER }] }));
}

test("a Bible chapter read once still opens when the Bible sites are down", async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("onboarding:quickstart_done", JSON.stringify({ __wrapped: 1, v: true, ts: Date.now() }));
  });
  const first = await context.newPage();
  await serveBible(first);
  await first.goto("/read?read=bible");
  await expect(first.getByText(MARKER).first()).toBeVisible();
  // Give the device copy a moment to be written.
  await first.waitForTimeout(500);
  await first.close();

  // A new tab starts with empty session storage, and both Bible sites now fail.
  const second = await context.newPage();
  await second.route("https://bible-api.com/**", (route) => route.abort());
  await second.route("https://bolls.life/**", (route) => route.abort());
  await second.goto("/read?read=bible");
  await expect(second.getByText(MARKER).first()).toBeVisible();
});

test("each public page names itself as the canonical address", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.nepsisshield.com/about");
  await expect(page).toHaveTitle("About · Nepsis Shield");
  await page.goto("/privacy");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.nepsisshield.com/privacy");
  await page.goto("/today");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.nepsisshield.com/");
});

test("the built privacy page has its own canonical link and text before any script runs", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.request.get("/privacy.html");
  const html = await response.text();
  expect(html).toContain('<link rel="canonical" href="https://www.nepsisshield.com/privacy" />');
  expect(html).toContain("Your data stays in your hands");
  expect(html).not.toContain("Loading…");
  await context.close();
});

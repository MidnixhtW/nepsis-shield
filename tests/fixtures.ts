import { test as base } from "@playwright/test";

export { expect } from "@playwright/test";

// A fresh browser opens on the quick-start dialog, which covers the app shell.
// Mark it as completed before any page script runs so tests start on the real screens.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "onboarding:quickstart_done",
        JSON.stringify({ __wrapped: 1, v: true, ts: Date.now() }),
      );
    });
    await use(page);
  },
});

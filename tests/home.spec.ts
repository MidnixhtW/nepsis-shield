// Uses the plain Playwright test (not ./fixtures) because a first visit must not have finished setup.
import { expect, test } from "@playwright/test";

test("a first visit lands on the homepage, and Start opens setup", async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("nepsis-shield:st-michael-intro-seen:historic-icon-v1", "true");
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Ancient faith for modern focus." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Build consistency without the guilt." })).toBeVisible();

  await page.getByRole("link", { name: /Start now/ }).first().click();
  await expect(page).toHaveURL(/\/today$/);
  await expect(page.getByRole("heading", { name: "Quiet your heart. Begin with one faithful step." })).toBeVisible();
});

test("someone who has set up their rule goes straight to Today", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("onboarding:quickstart_done", JSON.stringify({ __wrapped: 1, v: true, ts: Date.now() }));
  });
  await page.goto("/");
  await expect(page).toHaveURL(/\/today$/);

  // The 60-second reset is one tap from the header.
  await page.getByRole("button", { name: "60-second reset" }).click();
  const reset = page.getByRole("dialog");
  await expect(reset.getByRole("heading", { name: "Breathe" })).toBeVisible();
  await reset.getByRole("button", { name: "Exit reset" }).click();
  await expect(reset).toBeHidden();
});

import { expect, test } from "./fixtures";

test("Me holds favorites and opens the menu, which holds the theme picker", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/today");
  await page.getByRole("navigation", { name: "Mobile primary navigation" }).getByRole("radio", { name: /Go to Me/ }).click();
  await expect(page).toHaveURL(/\/me$/);
  await expect(page.getByRole("heading", { name: "Your prayer life" })).toBeVisible();
  await expect(page.getByLabel("Prayed on 0 of the last 7 days")).toBeVisible();
  await page.getByRole("button", { name: "Menu, search and themes" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu.getByRole("link", { name: /Settings/ })).toBeVisible();
  await expect(menu.getByRole("button", { name: /Theme: Olive & Brass/ })).toBeVisible();
});

test("Open Help on Today opens the Help panel", async ({ page }) => {
  await page.goto("/today");
  await page.getByRole("button", { name: "Open Help" }).click();
  await expect(page.getByRole("dialog").getByText("Take 60 seconds. Breathe, pray, re-center.")).toBeVisible();
});

test("Pray opens on tiles, and old links still open their practice", async ({ page }) => {
  await page.goto("/pray?tab=sleep");
  await expect(page.getByRole("heading", { name: "Sleep", level: 2 })).toBeVisible();
  await page.getByRole("link", { name: "Pray", exact: true }).click();
  await expect(page).toHaveURL(/\/pray$/);
  await page.getByRole("link", { name: /^Names/ }).click();
  await expect(page).toHaveURL(/tab=names/);
  await expect(page.getByRole("heading", { name: "Names to remember" })).toBeVisible();
});

test("a starred practice shows on Me and Today, and Recently opened lists it", async ({ page }) => {
  await page.goto("/pray");
  await page.getByRole("button", { name: "Add Services to favorites" }).click();
  await page.getByRole("link", { name: /^Services/ }).click();
  await expect(page.getByRole("heading", { name: "Pray with the whole Church." })).toBeVisible();
  await page.goto("/me");
  await expect(page.getByRole("link", { name: /Services Pray$/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Services Services ·|Services Pray ·/ })).toBeVisible();
  await page.goto("/today");
  await expect(page.getByRole("navigation", { name: "Favorites" }).getByRole("link", { name: "Services" })).toBeVisible();
});

test("Begin on Today opens the prayer for the hour full screen", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 5, 19, 0));
  await page.goto("/today");
  await expect(page.getByRole("heading", { name: "Evening prayers", level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "Begin" }).click();
  await expect(page.getByRole("dialog").getByText(/Evening prayer · 1 \//)).toBeVisible();
  await expect(page).toHaveURL(/tab=daily$/);
});

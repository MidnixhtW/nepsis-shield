import { expect, test } from "./fixtures";

test("Me holds the prayer log and Settings, and the menu holds search and the theme picker", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/today");
  await page.getByRole("navigation", { name: "Mobile primary navigation" }).getByRole("radio", { name: /Go to Me/ }).click();
  await expect(page).toHaveURL(/\/me$/);
  await expect(page.getByRole("heading", { name: "Your prayer life" })).toBeVisible();
  await expect(page.getByRole("region", { name: /Prayer log/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Settings/ }).first()).toBeVisible();
  await page.getByRole("button", { name: "Menu, search and themes" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu.getByRole("searchbox", { name: "Go to a part of the app" })).toBeVisible();
  await expect(menu.getByRole("button", { name: /Theme: Church Year/ })).toBeVisible();
});

test("I'm feeling… on Today opens the Help panel", async ({ page }) => {
  await page.goto("/today");
  await page.getByRole("button", { name: "I'm feeling…" }).click();
  await expect(page.getByRole("dialog").getByText("Take 60 seconds. Breathe, pray, re-center.")).toBeVisible();
});

test("Pray opens on tiles, and old links still open their practice", async ({ page }) => {
  await page.goto("/pray?tab=sleep");
  await expect(page.getByRole("heading", { name: "Sleep", level: 2 })).toBeVisible();
  await page.getByRole("link", { name: "Pray", exact: true }).click();
  await expect(page).toHaveURL(/\/pray$/);
  // Your own lists live on Me now, and open back to Me.
  await page.goto("/me");
  await page.getByRole("link", { name: /^Prayer list/ }).click();
  await expect(page).toHaveURL(/tab=names/);
  await expect(page.getByRole("heading", { name: "Names to remember" })).toBeVisible();
  await page.getByRole("link", { name: "Me", exact: true }).click();
  await expect(page).toHaveURL(/\/me$/);
});

test("the Rosary shows on Pray only for Western Rite parishes", async ({ page }) => {
  await page.goto("/pray");
  await expect(page.getByRole("link", { name: /^Rosary and Angelus/ })).toHaveCount(0);
  await page.goto("/settings");
  await page.getByRole("switch", { name: "Western Rite parish" }).click();
  await page.goto("/pray");
  await expect(page.getByRole("link", { name: /^Rosary and Angelus/ })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "Evening prayers", level: 2 })).toBeVisible();
  await page.getByRole("link", { name: "Begin" }).click();
  await expect(page.getByRole("dialog").getByText(/Evening prayer · 1 \//)).toBeVisible();
  await expect(page).toHaveURL(/tab=daily$/);
});

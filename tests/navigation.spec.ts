import { expect, test } from "./fixtures";

test("More opens the menu, which holds the theme picker", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/today");
  await page.getByRole("button", { name: "More: open the menu" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu.getByRole("link", { name: /Settings/ })).toBeVisible();
  await expect(menu.getByRole("button", { name: /Theme: Olive & Brass/ })).toBeVisible();
});

test("Open Help on Today opens the Help panel", async ({ page }) => {
  await page.goto("/today");
  await page.getByRole("button", { name: "Open Help" }).click();
  await expect(page.getByRole("dialog").getByText("Take 60 seconds. Breathe, pray, re-center.")).toBeVisible();
});

test("Pray groups its practices into four tabs and keeps old links working", async ({ page }) => {
  await page.goto("/pray?tab=sleep");
  await expect(page.getByRole("tab", { name: "Stillness", selected: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sleep", pressed: true })).toBeVisible();
  await page.getByRole("tab", { name: "Prayers" }).click();
  await expect(page).toHaveURL(/tab=prayers/);
  await page.getByRole("button", { name: "Names" }).click();
  await expect(page.getByRole("heading", { name: "Names to remember" })).toBeVisible();
});

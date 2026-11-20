import { expect, test } from "./fixtures";

// The public guide to the Church year: feasts, fasts and saints, each on its own page.

test("the feasts index lists the great feasts and the fasts, and opens a feast", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 18, 9, 0));
  await page.goto("/feasts");
  await expect(page.getByRole("heading", { level: 1, name: "Feasts and fasts of the Orthodox Church" })).toBeVisible();
  await expect(page.getByRole("link", { name: "The Nativity Fast" })).toBeVisible();
  await page.getByRole("link", { name: "Theophany, the Baptism of the Lord" }).click();
  await expect(page).toHaveURL(/\/feasts\/theophany$/);
  await expect(page.getByText(/Wednesday, January 6, 2027 on the New Calendar, and Tuesday, January 19, 2027 on the Old Calendar/)).toBeVisible();
  await expect(page).toHaveTitle(/^Theophany, the Baptism of the Lord: date and meaning/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.nepsisshield.com/feasts/theophany");
});

test("a fast's page gives both calendars and every day of the fast", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 18, 9, 0));
  await page.goto("/fasts/nativity-fast");
  await expect(page.getByRole("heading", { level: 1, name: "The Nativity Fast 2026" })).toBeVisible();
  await expect(page.getByText(/November 28 to Wednesday, January 6, 2027 on the Old Calendar/)).toBeVisible();
  await expect(page.getByText("Day 40, Thursday, December 24")).toBeVisible();
});

test("a saint's page has the prayer and the feast day", async ({ page }) => {
  await page.goto("/saint-prayers");
  await page.getByRole("link", { name: "Saint Nicholas the Wonderworker" }).click();
  await expect(page).toHaveURL(/\/saints\/nicholas-the-wonderworker$/);
  await expect(page.getByText(/Holy Father Nicholas, wonderworker and shepherd/)).toBeVisible();
  await expect(page.getByText("December 6 on the New Calendar, December 19 on the Old Calendar.")).toBeVisible();
});

test("an unknown guide address shows the not-found page", async ({ page }) => {
  await page.goto("/feasts/not-a-feast");
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(/not-a-feast/i);
  await expect(page.getByText(/not found|can't find|cannot find/i).first()).toBeVisible();
});

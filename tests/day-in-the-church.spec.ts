import { expect, test } from "./fixtures";

test("Today names the fast and its day in one line under the icon", async ({ page }) => {
  // Friday 20 November 2026: the sixth day of the Nativity Fast (New Calendar).
  await page.clock.setFixedTime(new Date(2026, 10, 20, 18, 0));
  await page.goto("/today");
  const day = page.getByRole("region", { name: "Today's feast or season" });
  await expect(day.getByRole("heading", { level: 1 })).toHaveText("Nativity Fast");
  await expect(day).toContainText("Day 6 of 40.");
  // The fast is named once there, not again on the prayer below it.
  await expect(page.locator("section[aria-labelledby=pray-now-title]")).not.toContainText("Nativity Fast");
});

test("an ordinary day has no fast in its line", async ({ page }) => {
  // Tuesday 13 October 2026, 7 in the morning.
  await page.clock.setFixedTime(new Date(2026, 9, 13, 7, 0));
  await page.goto("/today");
  const day = page.getByRole("region", { name: "Today's feast or season" });
  await expect(day).not.toContainText(" of 40");
  await expect(page.locator("section[aria-labelledby=pray-now-title]")).toContainText("Morning prayers");
});

test("full-screen prayer reads aloud from a round button in the footer", async ({ page }) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = function play() {
      return Promise.resolve();
    };
  });
  await page.goto("/pray?tab=daily&begin=morning");
  const dialog = page.getByRole("dialog");
  const ring = dialog.getByRole("button", { name: "Read aloud" });
  await ring.click();
  await expect(dialog.getByRole("button", { name: "Stop reading" })).toHaveAttribute("aria-pressed", "true");
  await dialog.getByRole("button", { name: "Stop reading" }).click();
  await expect(dialog.getByRole("button", { name: "Read aloud" })).toBeVisible();
});

test("the Jesus Prayer counts on a ring you tap", async ({ page }) => {
  await page.goto("/pray?tab=counter");
  const ring = page.getByRole("button", { name: /^Count a prayer/ });
  await expect(ring).toHaveAccessibleName(/0 of 100 today/);
  await ring.click();
  await ring.click();
  await expect(ring).toHaveAccessibleName(/2 of 100 today/);
});

test("Today shows the day's prayer as a line that fills in", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 9, 13, 7, 0));
  await page.goto("/today");
  const line = page.getByRole("navigation", { name: /Today's prayer/ });
  await expect(line).toHaveAccessibleName("Today's prayer: 0 of 4 done");
  await expect(line.getByRole("link", { name: "Morning: not yet" })).toBeVisible();
  await page.goto("/read?read=daily");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("daily_rhythm:v1") ?? ""), { timeout: 20_000 }).toContain('"reading":true');
  await page.goto("/today");
  await expect(page.getByRole("navigation", { name: /Today's prayer/ }).getByRole("link", { name: "Readings: done" })).toBeVisible();
});

import { expect, test } from "./fixtures";

test("Pray now shows the Church season's color and the light of the hour", async ({ page }) => {
  // Friday 20 November 2026, 6 in the evening: the Nativity Fast, at dusk.
  await page.clock.setFixedTime(new Date(2026, 10, 20, 18, 0));
  await page.goto("/today");
  const card = page.locator("section[aria-labelledby=pray-now-title]");
  await expect(card).toHaveAttribute("data-season", "nativity-fast");
  await expect(card).toHaveAttribute("data-sky", "dusk");
  await expect(card).toContainText("In the Nativity Fast");
});

test("an ordinary morning has the gold band and no season label", async ({ page }) => {
  // Tuesday 13 October 2026, 7 in the morning.
  await page.clock.setFixedTime(new Date(2026, 9, 13, 7, 0));
  await page.goto("/today");
  const card = page.locator("section[aria-labelledby=pray-now-title]");
  await expect(card).toHaveAttribute("data-season", "ordinary");
  await expect(card).toHaveAttribute("data-sky", "dawn");
  await expect(card).not.toContainText("In the");
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

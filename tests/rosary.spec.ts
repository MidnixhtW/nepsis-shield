import { expect, test } from "./fixtures";

test("the Rosary steps bead by bead through a decade", async ({ page }) => {
  await page.goto("/pray?tab=rosary");
  await expect(page.getByText("Added with Western Rite Orthodoxy in mind.")).toBeVisible();

  await page.getByRole("radio", { name: "Sorrowful" }).click();
  await expect(page.getByText(/prayed on Tuesday and Friday/)).toBeVisible();

  const next = page.getByRole("button", { name: /^Next/ });
  await expect(page.getByRole("heading", { name: "On the Cross" })).toBeVisible();
  await next.click(); // Creed
  await next.click(); // Our Father
  await expect(next).toHaveText("Next bead (1 of 3)");
  await next.click();
  await next.click();
  await next.click(); // three Hail Marys
  await next.click(); // Glory be
  await expect(page.getByRole("heading", { name: "First Sorrowful Mystery: The Agony in the Garden" })).toBeVisible();
  await next.click();
  await expect(next).toHaveText("Next bead (1 of 10)");

  await page.getByRole("button", { name: "Previous bead" }).click();
  await expect(page.getByRole("heading", { name: /First Sorrowful Mystery/ })).toBeVisible();
});

test("the Angelus is on the Rosary page", async ({ page }) => {
  await page.goto("/pray?tab=rosary");
  await expect(page.getByRole("heading", { name: /The Angelus|Regina Caeli/ })).toBeVisible();
});

test("Read it to me plays the recorded Rosary in the chosen reader's voice", async ({ page }) => {
  await page.addInitScript(() => {
    const played: string[] = [];
    (window as unknown as { __played: string[] }).__played = played;
    HTMLMediaElement.prototype.play = function play(this: HTMLMediaElement) {
      played.push(this.src);
      return Promise.resolve();
    };
  });
  await page.goto("/pray?tab=rosary");
  await page.getByRole("button", { name: "Read it to me" }).first().click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __played: string[] }).__played.join(" "))).toMatch(/\/audio\/abba\/[0-9a-f]{16}\.mp3/);
});

test("Saints of the West lists Western saints and sets a patron", async ({ page }) => {
  await page.goto("/saints");
  await page.getByRole("heading", { name: "Saints of the West" }).click();
  await expect(page.getByRole("heading", { name: "Saint Benedict of Nursia" })).toBeVisible();
  await page.getByRole("button", { name: "Make Saint Martin of Tours my patron saint" }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("patron-saint:v1"))).toContain("Martin of Tours");
});

test("the Rosary picks the day's mysteries by itself, in either weekly pattern", async ({ page }) => {
  // Thursday 5 November 2026.
  await page.clock.install({ time: new Date(2026, 10, 5, 10, 0) });
  await page.goto("/pray?tab=rosary");
  const sets = page.getByRole("group", { name: "Mysteries" });
  await expect(sets.getByRole("radio", { name: "Joyful" })).toHaveAttribute("aria-checked", "true");
  await expect(sets.getByRole("radio", { name: "Luminous" })).toHaveCount(0);

  await page.getByRole("radio", { name: "With Luminous (20)" }).click();
  await expect(sets.getByRole("radio", { name: "Luminous" })).toHaveAttribute("aria-checked", "true");
  await expect(page.getByText(/Luminous Mysteries, prayed on Thursday/)).toBeVisible();

  // The choice is remembered.
  await page.reload();
  await expect(page.getByRole("group", { name: "Mysteries" }).getByRole("radio", { name: "Luminous" })).toHaveAttribute("aria-checked", "true");
});

test("left open past midnight, the Rosary moves to the next day's mysteries", async ({ page }) => {
  // Thursday 5 November 2026, a minute before midnight.
  await page.clock.install({ time: new Date(2026, 10, 5, 23, 59) });
  await page.goto("/pray?tab=rosary");
  const sets = page.getByRole("group", { name: "Mysteries" });
  await expect(sets.getByRole("radio", { name: "Joyful" })).toHaveAttribute("aria-checked", "true");
  await page.clock.runFor(2 * 60_000);
  await expect(sets.getByRole("radio", { name: "Sorrowful" })).toHaveAttribute("aria-checked", "true");
});

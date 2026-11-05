import { expect, test } from "./fixtures";

test("the Rosary steps bead by bead through a decade", async ({ page }) => {
  await page.goto("/pray?tab=rosary");
  await expect(page.getByText("Added with Western Rite Orthodoxy in mind.")).toBeVisible();

  await page.getByRole("radio", { name: "Sorrowful" }).click();
  await expect(page.getByText(/traditionally prayed on Tuesday and Friday/)).toBeVisible();

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

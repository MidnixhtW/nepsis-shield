import { expect, test } from "./fixtures";

test("the Reader setting plays recorded prayers in the chosen voice", async ({ page }) => {
  // Some test browsers cannot play audio, so record which file the app asks to play instead of playing it.
  await page.addInitScript(() => {
    const played: string[] = [];
    (window as unknown as { __played: string[] }).__played = played;
    HTMLMediaElement.prototype.play = function play(this: HTMLMediaElement) {
      played.push(this.src);
      return Promise.resolve();
    };
  });
  await page.goto("/settings#reader");
  const readers = page.getByRole("radiogroup", { name: "Reader" });
  await expect(readers.getByRole("radio", { name: /Abba/ })).toHaveAttribute("aria-checked", "true");

  await readers.getByRole("radio", { name: /Timba/ }).click();
  await expect(readers.getByRole("radio", { name: /Timba/ })).toHaveAttribute("aria-checked", "true");

  // "Hear" plays that reader's recording of the opening prayers.
  await page.getByRole("button", { name: "Hear Timba" }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __played: string[] }).__played.join(" "))).toMatch(/\/audio\/timba\/[0-9a-f]{16}\.mp3/);
  await expect(page.getByRole("region", { name: "Reading aloud" })).toContainText("Sample: Timba");

  await page.reload();
  await expect(page.getByRole("radiogroup", { name: "Reader" }).getByRole("radio", { name: /Timba/ })).toHaveAttribute("aria-checked", "true");
});

test("the full-screen prayer offers a reader choice", async ({ page }) => {
  await page.goto("/pray?tab=daily&begin=morning");
  const reader = page.getByRole("dialog").getByRole("combobox", { name: "Reader" });
  await expect(reader).toHaveValue("abba");
  await reader.selectOption("maria");
  await page.goto("/settings#reader");
  await expect(page.getByRole("radiogroup", { name: "Reader" }).getByRole("radio", { name: /Maria/ })).toHaveAttribute("aria-checked", "true");
});

import { expect, test } from "./fixtures";

// Settings saved with setStoredItem that an encrypted backup has to carry and bring back.
const SETTINGS: Record<string, unknown> = {
  "journey:becoming-orthodox:v1": { done: ["inquirer"] },
  "rosary:pattern": "luminous",
  "services:font-size": 20,
  "jesus_prayer_pulse": "4",
  "jesus_prayer_view": "rope",
  "jesus_prayer_marker_pause": true,
  "parish:v1": { code: "abcd2345ef", name: "St. Nicholas" },
  "app-reminders:v1": { feasts: true },
  "ison:on": true,
};

const PASSPHRASE = "Vigil-Lamp-2026-Kept";

test("an encrypted backup restores the app settings it carries", async ({ page }, testInfo) => {
  await page.goto("/privacy");
  await page.evaluate((settings) => {
    for (const [key, v] of Object.entries(settings)) {
      localStorage.setItem(key, JSON.stringify({ __wrapped: 1, v, ts: Date.now() }));
    }
  }, SETTINGS);

  await page.getByPlaceholder("Export passphrase").fill(PASSPHRASE);
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download encrypted backup" }).click();
  const backupPath = testInfo.outputPath("backup.json");
  await (await downloading).saveAs(backupPath);

  await page.evaluate((keys) => {
    for (const key of keys) localStorage.removeItem(key);
  }, Object.keys(SETTINGS));

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByPlaceholder("Import passphrase").fill(PASSPHRASE);
  await page.locator('input[type="file"]').setInputFiles(backupPath);
  await expect(page.getByRole("button", { name: "Undo last import" })).toBeVisible();

  const restored = await page.evaluate((keys) => {
    const out: Record<string, unknown> = {};
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      out[key] = raw ? (JSON.parse(raw) as { v: unknown }).v : null;
    }
    return out;
  }, Object.keys(SETTINGS));
  expect(restored).toEqual(SETTINGS);
});

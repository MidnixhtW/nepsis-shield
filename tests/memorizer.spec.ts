import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const STORAGE_KEY = "orthodox-app:nicene-creed-progress:v1";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "onboarding:quickstart_done",
      JSON.stringify({ __wrapped: 1, v: true, ts: Date.now() }),
    );
    sessionStorage.setItem("nepsis-shield:st-michael-intro-seen:historic-icon-v1", "true");
  });
});

test("Creed mastery persists after reload", async ({ page }) => {
  await page.goto("/learn?tab=creed", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "I know this section" }).click();
  await expect(page.getByText("1 / 6", { exact: true })).toBeVisible();

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByText("1 / 6", { exact: true })).toBeVisible();
  const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
  expect(JSON.parse(stored ?? "null").completedLines).toEqual([0]);
});

test("reset requires confirmation and clears persisted progress", async ({ page }) => {
  await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [
    STORAGE_KEY,
    JSON.stringify({ completedLines: [0, 2], bestQuiz: 75 }),
  ] as const);
  await page.goto("/learn?tab=creed", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("2 / 6", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Reset progress" }).click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Keep progress" }).click();
  await expect(page.getByText("2 / 6", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Reset progress" }).click();
  await dialog.getByRole("button", { name: "Reset progress" }).click();
  await expect(page.getByText("0 / 6", { exact: true })).toBeVisible();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByText("0 / 6", { exact: true })).toBeVisible();
});

test("progress can be exported as a portable JSON record", async ({ page }) => {
  await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [
    STORAGE_KEY,
    JSON.stringify({ completedLines: [0, 1, 2], bestQuiz: 100 }),
  ] as const);
  await page.goto("/learn?tab=creed", { waitUntil: "domcontentloaded" });

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export progress" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^nicene-creed-progress-\d{4}-\d{2}-\d{2}\.json$/);
  const path = await download.path();
  expect(path).not.toBeNull();
  const exported = JSON.parse(await readFile(path!, "utf8"));
  expect(exported).toMatchObject({
    format: "nepsis-shield-nicene-creed-progress",
    version: 1,
    completedSections: [0, 1, 2],
    bestFillInScore: 100,
  });
});

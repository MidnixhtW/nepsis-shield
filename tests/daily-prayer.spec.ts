import { expect, test } from "@playwright/test";

test("complete the guided daily prayer flow", async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("daily-prayer-test-initialized")) {
      localStorage.clear();
      sessionStorage.setItem("daily-prayer-test-initialized", "true");
    }
    localStorage.setItem(
      "onboarding:quickstart_done",
      JSON.stringify({ __wrapped: 1, v: true, ts: Date.now() }),
    );
    sessionStorage.setItem("nepsis-shield:st-michael-intro-seen:historic-icon-v1", "true");
  });
  await page.goto("/pray?tab=daily");

  await expect(page.getByRole("heading", { name: "Daily prayer", level: 2 })).toBeVisible();

  await page.getByRole("button", { name: /Morning Offer the day/ }).click();
  await expect(page.getByText("Step 1 of 4")).toBeVisible();
  await expect(page.getByRole("heading", { name: /: Begin$/ })).toBeVisible();

  await page.getByRole("button", { name: "Begin prayer" }).click();
  // Praying opens the full-screen reader, one step at a time.
  const reader = page.getByRole("dialog");
  await expect(reader.getByRole("heading", { name: "Morning prayer" })).toBeVisible();

  await reader.getByRole("button", { name: "Next" }).click();
  await expect(reader.getByRole("heading", { name: /Jesus Prayer/ })).toBeVisible();

  await reader.getByRole("button", { name: "Next" }).click();
  await expect(reader.getByRole("heading", { name: "Close", exact: true })).toBeVisible();

  await reader.getByRole("button", { name: "Mark complete" }).click();

  // A closing screen: glory to God, and the Church praying the same prayers.
  await expect(reader.getByRole("heading", { name: "Glory to God" })).toBeVisible();
  await expect(reader.getByText(/The Church prays these same prayers this morning/)).toBeVisible();
  await reader.getByRole("button", { name: "Done" }).click();
  await expect(reader).toHaveCount(0);
  await expect(page.getByText("Complete", { exact: true })).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");

  const storedRhythm = await page.evaluate(() => {
    const raw = localStorage.getItem("daily_rhythm:v1");
    return raw ? JSON.parse(raw) : null;
  });
  expect(storedRhythm?.v?.prayerResume).toBeUndefined();
  expect(Object.values(storedRhythm?.v?.records ?? {}).some(
    (record) => (record as { habits?: { prayer?: boolean } }).habits?.prayer === true,
  )).toBe(true);

  await page.reload();
  await expect(page.getByText("Complete", { exact: true })).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
});

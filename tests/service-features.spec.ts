import { expect, test } from "./fixtures";

test("the header shows the hour of prayer, in 24-hour time for service roles", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 9, 1, 15, 30)); // 15:30, the Ninth Hour
  await page.goto("/today");
  await expect(page.getByText("Thu, Oct 1 · Ninth Hour")).toBeVisible();

  await page.evaluate(() =>
    localStorage.setItem("nepsis:responder-mode", JSON.stringify({ __wrapped: 1, v: "military", ts: Date.now() })),
  );
  await page.reload();
  await expect(page.getByText("1530 · Ninth Hour · Oct 1")).toBeVisible();
});

test("the Help panel offers Psalm 90", async ({ page }) => {
  await page.goto("/today");
  await page.getByRole("button", { name: "Need help now" }).click();
  await page.getByRole("button", { name: "Psalm 90 · prayer of protection" }).click();
  await expect(page.getByText("He that dwelleth in the secret place of the most High")).toBeVisible();
});

test("St. Seraphim's rule is a prayer length", async ({ page }) => {
  await page.goto("/pray?tab=daily");
  await page.getByRole("radio", { name: "St. Seraphim" }).click();
  await expect(page.getByRole("heading", { name: "Begin" })).toBeVisible();
  await page.getByRole("button", { name: "Begin prayer" }).first().click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "St. Seraphim's rule" })).toBeVisible();
});

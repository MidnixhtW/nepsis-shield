import { expect, test } from "./fixtures";

test("before the Nativity Fast, Today shows the countdown and a preview", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 2, 10, 0)); // November 2, 2026
  await page.goto("/today");
  await expect(page.getByText("Coming up · in 13 days")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nativity Fast begins Sunday, November 15" })).toBeVisible();
  await page.getByRole("button", { name: "Preview the journey" }).click();
  await expect(page.getByRole("heading", { name: "The Nativity Fast begins" })).toBeVisible();
});

test("during the fast, today's day can be marked kept and stays kept", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 21, 10, 0)); // November 21, 2026
  await page.goto("/today");
  await expect(page.getByText("Nativity Fast · Day 7 of 40")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Entrance of the Theotokos into the Temple" })).toBeVisible();

  await page.getByRole("button", { name: "Mark today as kept" }).click();
  await expect(page.getByRole("button", { name: "Kept today" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Kept today" })).toBeVisible();
  await expect(page.getByText("1 of 40 days kept", { exact: false })).toBeVisible();
});

import { expect, test } from "./fixtures";

test("names added to the list are prayed in the daily prayer flow", async ({ page }) => {
  await page.goto("/pray?tab=names");
  await page.getByRole("textbox", { name: "Add a name: For the health of" }).fill("Nicholas");
  await page.getByRole("button", { name: "Add", exact: true }).first().click();
  await page.getByRole("textbox", { name: "Add a name: For the repose of" }).fill("Helen");
  await page.getByRole("button", { name: "Add", exact: true }).last().click();
  await expect(page.getByRole("button", { name: "Remove Nicholas" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: "Remove Helen" })).toBeVisible();

  await page.getByRole("link", { name: "Pray", exact: true }).click();
  await page.getByRole("link", { name: /Morning prayers/ }).click();
  const prayer = page.getByRole("dialog");
  await prayer.getByRole("button", { name: "Begin prayer" }).click();
  // Step through until the commemoration step appears (it sits just before the closing prayer).
  for (let i = 0; i < 12; i++) {
    if (await prayer.getByRole("heading", { name: "Remember, O Lord" }).isVisible()) break;
    await prayer.getByRole("button", { name: /^Next/ }).click();
  }
  await expect(prayer.getByText(/have mercy on Thy servants Nicholas/)).toBeVisible();
  await expect(prayer.getByText(/departed servants Helen/)).toBeVisible();
});

test("the backup reminder appears after a month and can be put off", async ({ page }) => {
  await page.addInitScript(() => {
    const longAgo = Date.now() - 40 * 86_400_000;
    localStorage.setItem("backup:first-seen", JSON.stringify({ __wrapped: 1, v: longAgo, ts: longAgo }));
  });
  await page.goto("/today");
  const reminder = page.getByRole("region", { name: "Backup reminder" });
  await expect(reminder).toBeVisible();
  await expect(reminder.getByRole("link", { name: "Back up now" })).toHaveAttribute("href", "/privacy#backup");
  await reminder.getByRole("button", { name: "Remind me later" }).click();
  await expect(reminder).toBeHidden();
  await page.reload();
  await expect(page.getByRole("region", { name: "Backup reminder" })).toBeHidden();
});

test("during a fast the rule card is compact and can be expanded", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 21, 10, 0)); // Nativity Fast
  await page.goto("/today");
  await expect(page.getByText("Your rule:")).toBeVisible();
  await page.getByRole("button", { name: "Show rule" }).click();
  await expect(page.getByText("Today’s Rule")).toBeVisible();
});

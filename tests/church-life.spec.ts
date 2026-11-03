import { expect, test } from "./fixtures";

test("a repose date shows the next memorial and a card on Today", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 3, 9, 0)); // November 3, 2026
  await page.goto("/pray?tab=names");
  await page.getByRole("textbox", { name: "Add a name: For the repose of" }).fill("Helen");
  await page.getByLabel("Date of repose (optional)").fill("2026-11-02");
  await page.getByRole("button", { name: "Add" }).last().click();
  await expect(page.getByText(/Reposed Nov 2, 2026 · next: 3rd day, Wed Nov 4/)).toBeVisible();

  await page.goto("/today");
  const card = page.getByRole("region", { name: "Remembering the departed" });
  await expect(card).toBeVisible();
  await expect(card.getByText("3rd day for Helen")).toBeVisible();
});

test("the patron saint is greeted on the name day", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 11, 6, 9, 0)); // December 6, 2026
  await page.goto("/settings");
  await page.getByLabel("Saint", { exact: true }).fill("St. Nicholas");
  await page.getByLabel("Feast month").selectOption("12");
  await page.getByLabel("Day", { exact: true }).fill("6");
  await page.getByRole("button", { name: "Save" }).click();
  await page.goto("/today");
  const card = page.getByRole("region", { name: "Your name day" });
  await expect(card).toBeVisible();
  await expect(card.getByText("Holy Nicholas, pray to God for me.")).toBeVisible();
});

test("Today offers the Nativity greeting on the feast", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 11, 25, 9, 0));
  await page.goto("/today");
  const card = page.getByRole("region", { name: "Feast greeting" });
  await expect(card.getByText("Christ is born!")).toBeVisible();
  await expect(card.getByText("Glorify Him!")).toBeVisible();
});

test("Prepare includes Communion preparation", async ({ page }) => {
  await page.goto("/pray?tab=communion");
  await expect(page.getByRole("heading", { name: "Preparing for Holy Communion" })).toBeVisible();
  await expect(page.getByText(/I believe, O Lord, and I confess that Thou art truly the Christ/)).toBeVisible();
});

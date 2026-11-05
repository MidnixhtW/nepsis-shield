import { expect, test } from "./fixtures";

test("Services lists the Church's prayers and opens one to pray", async ({ page }) => {
  await page.goto("/pray?tab=services");
  await expect(page.getByRole("heading", { name: "Pray with the whole Church." })).toBeVisible();
  for (const title of ["Small Compline", "The Hours", "Akathist to the Theotokos", "The Three Canons", "Panikhida", "Canon for the Fallen in Battle"]) {
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  }
  await page.getByRole("button", { name: "Pray Small Compline" }).click();
  await expect(page).toHaveURL(/service=compline/);
  await expect(page.getByRole("heading", { name: "Psalm 50 (51)" })).toBeVisible();
  await expect(page.getByText(/Orthodox Daily Prayers \(St\. Tikhon's Seminary Press, 1982\)/)).toBeVisible();

  await page.getByRole("button", { name: "All services" }).click();
  await expect(page).not.toHaveURL(/service=/);
});

test("the Hours can jump straight to the Sixth Hour", async ({ page }) => {
  await page.goto("/pray?tab=services&service=hours");
  await page.getByRole("combobox", { name: /^Go to/ }).selectOption({ label: "The Sixth Hour" });
  await expect(page.getByRole("heading", { name: "The Sixth Hour" })).toBeInViewport();
  await expect(page.getByRole("heading", { name: "Psalm 90 (91)" })).toBeVisible();
});

test("a memorial day links to the Panikhida", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 3, 9, 0));
  await page.goto("/pray?tab=names");
  await page.getByRole("textbox", { name: "Add a name: For the repose of" }).fill("Helen");
  await page.getByLabel("Date of repose (optional)").fill("2026-11-02");
  await page.getByRole("button", { name: "Add", exact: true }).last().click();
  await page.goto("/today");
  await page.getByRole("region", { name: "Remembering the departed" }).getByRole("link", { name: "Pray the Panikhida" }).click();
  await expect(page.getByRole("heading", { name: "Panikhida", level: 2 })).toBeVisible();
  await expect(page.getByText("Memory eternal! (Thrice.)")).toBeVisible();
});

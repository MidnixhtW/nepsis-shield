import { expect, test } from "./fixtures";

test("Family has an evening prayer, prayers to learn, saint stories and notes for parents", async ({ page }) => {
  await page.goto("/pray?tab=family");
  await expect(page.getByRole("heading", { name: "Pray as a household." })).toBeVisible();
  await expect(page.getByText("Gather at the icons")).toBeVisible();
  await expect(page.getByText(/The Lord bless thee, and keep thee/)).toBeVisible();

  const sections = page.getByRole("group", { name: "Family sections" });
  await sections.getByRole("button", { name: "Prayers to learn" }).click();
  await expect(page.getByText("Holy Guardian Angel, pray to God for me!")).toBeVisible();

  await sections.getByRole("button", { name: "Saint stories" }).click();
  await page.getByRole("button", { name: /The monk and the lion/ }).click();
  await expect(page.getByText(/found a sharp thorn stuck deep inside/)).toBeVisible();

  await sections.getByRole("button", { name: "For parents" }).click();
  await page.getByRole("link", { name: "Start a family group" }).click();
  await expect(page).toHaveURL(/tab=groups/);
});

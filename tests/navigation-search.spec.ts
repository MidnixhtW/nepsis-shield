import { expect, test } from "./fixtures";

test("the menu's Go to search finds sections by name or keyword", async ({ page }) => {
  await page.goto("/today");
  await page.getByRole("button", { name: "Open menu" }).click();
  const search = page.getByRole("searchbox", { name: "Go to a part of the app" });
  await search.fill("compline");
  await page.getByRole("link", { name: /Small Compline/ }).click();
  await expect(page).toHaveURL(/service=compline/);
  await expect(page.getByRole("heading", { name: "Small Compline", level: 2 })).toBeVisible();

  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("searchbox", { name: "Go to a part of the app" }).fill("veterans");
  await expect(page.getByRole("link", { name: /Canon for the Fallen in Battle/ })).toBeVisible();
  await page.getByRole("searchbox", { name: "Go to a part of the app" }).fill("zzzz");
  await expect(page.getByText("Nothing found")).toBeVisible();
});

test("every theme can be chosen, including the new ones", async ({ page }) => {
  for (const [label, cls] of [["Lenten Violet", "lenten"], ["Midnight", "midnight"], ["Paschal White", "paschal"]] as const) {
    await page.goto("/today");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("button", { name: /^Theme: / }).click();
    await page.getByRole("menuitem", { name: new RegExp(label) }).click();
    const classes = async () => ((await page.locator("html").getAttribute("class")) ?? "").split(" ");
    await expect.poll(classes).toContain(cls);
    if (cls !== "paschal") await expect.poll(classes).toContain("dark");
    else await expect.poll(classes).not.toContain("dark"); // Paschal White is light
  }
});

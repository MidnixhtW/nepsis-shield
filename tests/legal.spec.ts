import { expect, test } from "./fixtures";

test("the policies are linked from every page's footer", async ({ page }) => {
  await page.goto("/about");
  const policies = page.getByRole("navigation", { name: "Policies" }).last();
  await policies.getByRole("link", { name: "Terms of Use" }).click();
  await expect(page.getByRole("heading", { name: "Terms of Use", level: 1 })).toBeVisible();
  await expect(page.getByText("there is nothing to refund")).toBeVisible();
  await page.getByRole("navigation", { name: "Policies" }).first().getByRole("link", { name: "Cookie Policy" }).click();
  await expect(page.getByRole("heading", { name: "No cookies" })).toBeVisible();
  await page.getByRole("navigation", { name: "Policies" }).first().getByRole("link", { name: "Privacy Policy" }).click();
  await expect(page.getByRole("heading", { name: "What leaves your device, and who receives it" })).toBeVisible();
});

test("the icon of the day and the install QR code come from the site itself", async ({ page }) => {
  const outside: string[] = [];
  page.on("request", (request) => {
    if (/wikimedia\.org|qrserver\.com/.test(request.url())) outside.push(request.url());
  });
  await page.goto("/today");
  await expect(page.locator("#main-content")).toBeVisible();
  await page.goto("/download");
  const qr = page.getByRole("img", { name: "QR code that opens the Nepsis Shield install page" });
  await expect(qr).toHaveAttribute("src", "/install-qr.svg");
  await expect.poll(() => qr.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  expect(outside).toEqual([]);
});

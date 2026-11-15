import { expect, test } from "@playwright/test";

test("create a personalized daily rule during onboarding", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.setItem("nepsis-shield:st-michael-intro-seen:historic-icon-v1", "true");
  });
  await page.goto("/today");

  const onboarding = page.getByRole("dialog");
  await expect(onboarding.getByRole("heading", {
    name: "Quiet your heart. Begin with one faithful step.",
  })).toBeVisible();

  await onboarding.getByRole("button", { name: "Continue" }).click();
  await onboarding.getByRole("button", { name: "Continue" }).click(); // theme (keep Church Year)
  // Every role keeps the same look; a role only tints the accent color.
  const html = page.locator("html");
  await onboarding.getByRole("button", { name: /^Military/ }).click();
  await expect(html).toHaveClass(/seasonal/);
  await expect(html).toHaveAttribute("data-role", "military");
  await onboarding.getByRole("button", { name: /EMS \/ medical/ }).click();
  await expect(html).toHaveClass(/seasonal/);
  await expect(html).toHaveAttribute("data-role", "ems");
  await onboarding.getByRole("button", { name: "Continue" }).click();
  await onboarding.getByRole("button", { name: "Continue" }).click(); // calendar (keep New Calendar)

  await onboarding.getByRole("button", { name: /Discipline in prayer/ }).click();
  await onboarding.getByRole("button", { name: "Continue" }).click();

  await onboarding.getByRole("button", { name: /Smallest faithful step/ }).click();
  await onboarding.getByRole("button", { name: "Continue" }).click();

  await expect(onboarding.getByText("Your daily prayer plan")).toBeVisible();
  await onboarding.getByRole("button", { name: "Seal this Daily Rule" }).click();

  await expect(page).toHaveURL(/\/today$/);
  await expect(onboarding).toBeHidden();
  // Today shows the rule compactly; open it to see the whole rule.
  await page.getByRole("button", { name: "Show rule" }).click();
  await expect(page.getByRole("heading", { name: "Rule for Steady Prayer" })).toBeVisible();
});

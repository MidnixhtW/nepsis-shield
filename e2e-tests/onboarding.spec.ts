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
  await onboarding.getByRole("button", { name: /EMS \/ medical/ }).click();
  await onboarding.getByRole("button", { name: "Continue" }).click();

  await onboarding.getByRole("button", { name: /Discipline in prayer/ }).click();
  await onboarding.getByRole("button", { name: "Continue" }).click();

  await onboarding.getByRole("button", { name: /Smallest faithful step/ }).click();
  await onboarding.getByRole("button", { name: "Continue" }).click();

  await expect(onboarding.getByText("Your Rule of Vigilance")).toBeVisible();
  await onboarding.getByRole("button", { name: "Seal this Daily Rule" }).click();

  await expect(page).toHaveURL(/\/today$/);
  await expect(onboarding).toBeHidden();
  await expect(page.getByText("EMS mode active")).toBeVisible();
});

import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { addIntention, createGroup, markPrayed, removeIntention, viewGroup } from "../api/_lib/groups";
import { memoryStore } from "../api/_lib/store";

// These tests replace the network, so keep the offline service worker out of the way.
test.use({ serviceWorkers: "block" });

// Stands in for /api/groups with the real group rules and an in-memory store.
async function fakeGroupService(page: Page) {
  const store = memoryStore();
  await page.route("**/api/groups**", async (route) => {
    const request = route.request();
    const respond = (status: number, body: unknown) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    try {
      if (request.method() === "GET") {
        const url = new URL(request.url());
        return respond(200, await viewGroup(store, { id: url.searchParams.get("id"), date: url.searchParams.get("date"), memberId: request.headers()["x-member-id"] }));
      }
      const body = request.postDataJSON();
      if (body.action === "create") return respond(200, await createGroup(store, body));
      if (body.action === "intention") return respond(200, await addIntention(store, body));
      if (body.action === "prayed") return respond(200, await markPrayed(store, body));
      if (body.action === "remove") return respond(200, await removeIntention(store, body));
      return respond(400, { error: "Unknown action." });
    } catch (error) {
      return respond((error as { status?: number }).status ?? 500, { error: (error as Error).message });
    }
  });
  return store;
}

test("create a group, share a request, and mark prayer", async ({ page }) => {
  await fakeGroupService(page);
  await page.goto("/pray?tab=groups");
  await expect(page.getByRole("heading", { name: "Carry one another's burdens." })).toBeVisible();
  await page.getByLabel("Group name").fill("Our family");
  await page.getByLabel("Your first name").fill("Anna");
  await page.getByRole("button", { name: "Create group" }).click();

  await expect(page.getByRole("heading", { name: "Our family", level: 2 })).toBeVisible();
  await expect(page.getByText("You pray here as Anna.")).toBeVisible();
  await page.getByLabel("Ask the group to pray").fill("For Grandpa's surgery on Friday");
  await page.getByRole("button", { name: "Share request" }).click();
  await expect(page.getByText("For Grandpa's surgery on Friday")).toBeVisible();

  await page.getByRole("button", { name: "I prayed for the group today" }).click();
  await expect(page.getByText("Prayed today: Anna")).toBeVisible();
  await expect(page.getByRole("button", { name: "You prayed today" })).toBeDisabled();

  await page.getByRole("button", { name: "Remove the request from Anna" }).click();
  await expect(page.getByText("No requests yet. Share the first one.")).toBeVisible();
});

test("an invite link lets someone join under their own name", async ({ page }) => {
  const store = await fakeGroupService(page);
  const group = await createGroup(store, { name: "St. Michael parish" });
  await page.goto(`/pray?tab=groups&join=${group.id}`);
  await expect(page.getByRole("heading", { name: "Join a prayer group" })).toBeVisible();
  await page.getByLabel("Your first name").fill("Peter");
  await page.getByRole("button", { name: "Join group" }).click();
  await expect(page.getByRole("heading", { name: "St. Michael parish", level: 2 })).toBeVisible();
  await expect(page.getByText("You pray here as Peter.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Close the group for everyone" })).toHaveCount(0);
});

test("groups explain when the service is not switched on", async ({ page }) => {
  await page.route("**/api/groups**", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Prayer groups are not switched on yet." }) }));
  await page.goto("/pray?tab=groups");
  await page.getByLabel("Group name").fill("Our family");
  await page.getByLabel("Your first name").fill("Anna");
  await page.getByRole("button", { name: "Create group" }).click();
  await expect(page.getByText("Prayer groups are not switched on yet.")).toBeVisible();
});

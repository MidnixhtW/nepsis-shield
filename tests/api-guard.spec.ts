// Request guards shared by the API routes, run in Node.
import { expect, test } from "@playwright/test";
import { MAX_BODY_BYTES, clientIp, overLimit, readJsonBody } from "../api/_lib/guard";
import { memoryStore } from "../api/_lib/store";

function post(body: string, headers: Record<string, string> = {}) {
  return new Request("https://nepsisshield.com/api/groups", { method: "POST", body, headers });
}

test("the platform IP wins over a forwarded header the caller could fake", () => {
  const request = new Request("https://nepsisshield.com/api/groups", {
    headers: { "x-forwarded-for": "1.1.1.1", "x-real-ip": "9.9.9.9" },
  });
  expect(clientIp(request)).toBe("9.9.9.9");
});

test("bodies that are too large, not JSON, or not an object are refused", async () => {
  expect(await readJsonBody(post(JSON.stringify({ action: "create", name: "x".repeat(MAX_BODY_BYTES) })))).toBeNull();
  expect(await readJsonBody(post("not json"))).toBeNull();
  expect(await readJsonBody(post("[1,2,3]"))).toBeNull();
  expect(await readJsonBody(post(JSON.stringify({ action: "create", name: "Parish" })))).toEqual({ action: "create", name: "Parish" });
});

test("the limiter lets requests through until the limit, then stops them", async () => {
  const store = memoryStore();
  for (let i = 0; i < 3; i++) expect(await overLimit(store, "create:1.2.3.4", 3, 86_400)).toBe(false);
  expect(await overLimit(store, "create:1.2.3.4", 3, 86_400)).toBe(true);
  expect(await overLimit(store, "create:5.6.7.8", 3, 86_400)).toBe(false);
});

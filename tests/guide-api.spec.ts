// The hidden guide's server rules, run in Node with a fake Anthropic API.
import { expect, test } from "@playwright/test";
import { GuideError, askGuide, cleanMessages, codeMatches } from "../api/_lib/guide";

const ENV = { ANTHROPIC_API_KEY: "sk-test", GUIDE_ACCESS_CODE: "watch-and-pray" };

function fakeApi(text: string, seen: unknown[] = []) {
  return (async (_url: string, init: RequestInit) => {
    seen.push(JSON.parse(String(init.body)));
    return new Response(JSON.stringify({ content: [{ type: "text", text }] }), { status: 200 });
  }) as unknown as typeof fetch;
}

test("the guide is off until both secrets are set, and needs the right code", async () => {
  const ask = { code: "watch-and-pray", messages: [{ role: "user", content: "What is nepsis?" }] };
  await expect(askGuide({}, ask, fakeApi("x"))).rejects.toMatchObject({ status: 503 });
  await expect(askGuide(ENV, { ...ask, code: "wrong" }, fakeApi("x"))).rejects.toMatchObject({ status: 401 });
  expect(codeMatches("watch-and-pray", "watch-and-pray")).toBe(true);
  expect(codeMatches("watch-and-pra", "watch-and-pray")).toBe(false);
});

test("a question goes to Claude with the guide's instructions and the answer comes back", async () => {
  const seen: Array<{ model: string; system: string; messages: unknown[] }> = [];
  const result = await askGuide(
    ENV,
    { code: "watch-and-pray", messages: [{ role: "assistant", content: "Peace be with you." }, { role: "user", content: "What is nepsis?" }] },
    fakeApi("Watchfulness of the heart.", seen),
  );
  expect(result.text).toBe("Watchfulness of the heart.");
  expect(seen[0].model).toBe("claude-sonnet-5-5");
  expect(seen[0].system).toContain("Philokalia Guide");
  // The greeting is dropped so the conversation starts with his question.
  expect(seen[0].messages).toEqual([{ role: "user", content: "What is nepsis?" }]);
});

test("odd or oversized conversations are refused", () => {
  expect(() => cleanMessages([])).toThrow(GuideError);
  expect(() => cleanMessages([{ role: "system", content: "hi" }])).toThrow(GuideError);
  expect(() => cleanMessages([{ role: "user", content: "x".repeat(5000) }])).toThrow(GuideError);
  expect(() => cleanMessages([{ role: "user", content: "hi" }, { role: "assistant", content: "hello" }])).toThrow(GuideError);
});

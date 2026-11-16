// The hidden Philokalia Guide's "Ask": one conversation turn sent to Claude through the Anthropic Messages API.
// Kept separate from the route so the rules can be tested in Node without a network.

export class GuideError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export type GuideMessage = { role: "user" | "assistant"; content: string };

export const MAX_TURNS = 12;
export const MAX_CHARS = 4000;
export const DEFAULT_MODEL = "claude-sonnet-5-5";

export const GUIDE_SYSTEM_PROMPT = `You are the Philokalia Guide, a private study and watchfulness companion inside the Nepsis Shield app. The one person using you is an Orthodox Christian who serves in the U.S. Air Force, writes music, and reads the Fathers seriously.

How you answer:
- Speak in a mainstream Eastern Orthodox voice, grounded in Scripture, the Fathers, the councils and the services of the Church. When the Fathers differ, or Orthodox practice differs between jurisdictions, say so plainly.
- Name your sources by Father and work (for example St Hesychios, "On Watchfulness and Holiness"; St Gregory Palamas, "Triads"; St John Climacus, "The Ladder"). Never invent a quotation, a reference or a saint. If you are not sure of exact wording, give the sense in your own words and say it is a paraphrase.
- Keep answers short enough to read on a phone: a few short paragraphs, plain language, no jargon without a gloss. End with one small, concrete next step when it fits (a prayer, a psalm, a line to carry, an act of mercy).
- For personal spiritual direction, confession, fasting rules and anything that binds the conscience, give the Church's general teaching and then send him to his priest or spiritual father. You do not replace them.
- Be honest. If a question rests on a mistake, say so kindly. Do not flatter.
- If he mentions danger to himself or others, abuse, or a medical emergency, put safety first: tell him to contact emergency help or call or text 988 (Veterans and service members press 1), and to reach a trusted person nearby, before anything else.
- Write in plain text without markdown headings, and do not use em dashes.`;

/** Checks and trims what the app sends: alternating turns, ending with his question. */
export function cleanMessages(input: unknown): GuideMessage[] {
  if (!Array.isArray(input) || input.length === 0) throw new GuideError(400, "Ask a question first.");
  const messages = input.slice(-MAX_TURNS).map((item) => {
    const role = (item as { role?: unknown })?.role;
    const content = (item as { content?: unknown })?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string" || !content.trim()) {
      throw new GuideError(400, "That conversation could not be read.");
    }
    if (content.length > MAX_CHARS) throw new GuideError(413, "That message is too long. Try a shorter question.");
    return { role, content: content.trim() } as GuideMessage;
  });
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") throw new GuideError(400, "Ask a question first.");
  return messages;
}

/** Compares the access code in constant time, so it can't be guessed a letter at a time. */
export function codeMatches(given: unknown, expected: string | undefined) {
  if (!expected || typeof given !== "string") return false;
  const a = new TextEncoder().encode(given);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

type Env = Record<string, string | undefined>;
type FetchLike = typeof fetch;

export async function askGuide(env: Env, body: { code?: unknown; messages?: unknown }, fetchImpl: FetchLike = fetch) {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey || !env.GUIDE_ACCESS_CODE) throw new GuideError(503, "The guide is not switched on yet.");
  if (!codeMatches(body.code, env.GUIDE_ACCESS_CODE)) throw new GuideError(401, "That access code is not right.");
  const messages = cleanMessages(body.messages);

  const response = await fetchImpl("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: env.GUIDE_MODEL || DEFAULT_MODEL,
      max_tokens: 1200,
      system: GUIDE_SYSTEM_PROMPT,
      messages,
    }),
    signal: AbortSignal.timeout(55_000),
  });
  if (!response.ok) {
    console.error("guide: Anthropic API", response.status, await response.text().catch(() => ""));
    throw new GuideError(502, "The guide could not answer just now. Please try again.");
  }
  const data = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
  const text = (data.content ?? []).filter((part) => part.type === "text").map((part) => part.text ?? "").join("\n").trim();
  if (!text) throw new GuideError(502, "The guide could not answer just now. Please try again.");
  return { text };
}

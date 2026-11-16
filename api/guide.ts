// /api/guide: the hidden Philokalia Guide's "Ask" (Vercel function). See api/_lib/guide.ts.
//   POST /api/guide { code, messages: [{ role, content }] } -> { text }
// Needs ANTHROPIC_API_KEY and GUIDE_ACCESS_CODE in the Vercel environment; GUIDE_MODEL is optional.
import { GuideError, askGuide } from "./_lib/guide.js";
import { upstashStore } from "./_lib/store.js";

const ALLOWED_ORIGINS = new Set([
  "https://www.nepsisshield.com",
  "https://nepsisshield.com",
  "https://localhost", // the Android app
  "capacitor://localhost",
  "http://localhost:8080", // local development
]);

function headers(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const out: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
  if (ALLOWED_ORIGINS.has(origin)) {
    out["Access-Control-Allow-Origin"] = origin;
    out["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    out["Access-Control-Allow-Headers"] = "Content-Type";
    out["Access-Control-Max-Age"] = "600";
  }
  return out;
}

function reply(request: Request, status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: headers(request) });
}

function clientIp(request: Request) {
  return (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: headers(request) });
}

export async function POST(request: Request) {
  // A cap per address, so a leaked code can't run up the API bill (only when the Upstash store is set up).
  const store = upstashStore(process.env);
  if (store) {
    const hour = Math.floor(Date.now() / 3_600_000);
    if ((await store.incr(`rl:guide:${clientIp(request)}:${hour}`, 3700)) > 40) {
      return reply(request, 429, { error: "That's a lot of questions for one hour. Please rest a while." });
    }
  }

  let body: { code?: unknown; messages?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return reply(request, 400, { error: "That request could not be read." });
  }

  try {
    return reply(request, 200, await askGuide(process.env, body));
  } catch (error) {
    if (error instanceof GuideError) return reply(request, error.status, { error: error.message });
    console.error(error);
    return reply(request, 500, { error: "Something went wrong. Please try again." });
  }
}

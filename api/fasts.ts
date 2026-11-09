// /api/fasts: the anonymous "keeping the fast together" count (Vercel function). See api/_lib/fasts.ts.
//   GET  /api/fasts?fast=nativity-fast&year=2026            -> { count }
//   POST /api/fasts { fast, year, deviceId }                 -> { count }
import { GroupError } from "./_lib/groups.js";
import { fastCount, keepFast } from "./_lib/fasts.js";
import { type Store, upstashStore } from "./_lib/store.js";

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
    out["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
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

async function handle(request: Request, run: (store: Store) => Promise<unknown>, limit: number) {
  const store = upstashStore(process.env);
  if (!store) return reply(request, 503, { error: "The fast count is not switched on yet." });
  try {
    const minute = Math.floor(Date.now() / 60_000);
    if ((await store.incr(`rl:fasts:${clientIp(request)}:${minute}`, 120)) > limit) {
      return reply(request, 429, { error: "Too many requests. Please wait a minute." });
    }
    return reply(request, 200, await run(store));
  } catch (error) {
    if (error instanceof GroupError) return reply(request, error.status, { error: error.message });
    console.error(error);
    return reply(request, 500, { error: "Something went wrong. Please try again." });
  }
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: headers(request) });
}

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  return handle(request, (store) => fastCount(store, { fast: params.get("fast"), year: params.get("year") }), 60);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return reply(request, 400, { error: "That request could not be read." });
  }
  return handle(request, (store) => keepFast(store, { fast: body.fast, year: body.year, deviceId: body.deviceId }), 10);
}

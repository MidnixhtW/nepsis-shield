// /api/push: where a phone or browser registers for notifications.
//   GET    /api/push                                  -> { publicKey } (the VAPID public key)
//   POST   /api/push { subscription, timeZone, reminders: { morning: "07:00", ... }, updates } -> saves it
//   DELETE /api/push { endpoint }                     -> forgets it
import { PushError, removeEntry, saveEntry } from "./_lib/push.js";
import { upstashStore } from "./_lib/store.js";
import { vapidKeys } from "./_lib/vapid.js";

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
    out["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS";
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

async function run(request: Request, action: (body: Record<string, unknown>) => Promise<unknown>) {
  const store = upstashStore(process.env);
  if (!store) return reply(request, 503, { error: "Notifications are not switched on yet." });
  try {
    const minute = Math.floor(Date.now() / 60_000);
    if ((await store.incr(`rl:push:${clientIp(request)}:${minute}`, 120)) > 20) {
      return reply(request, 429, { error: "Too many requests. Please wait a minute." });
    }
    const text = await request.text();
    if (text.length > 4000) return reply(request, 413, { error: "Too large." });
    const body = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    return reply(request, 200, await action(body));
  } catch (error) {
    if (error instanceof PushError) return reply(request, error.status, { error: error.message });
    if (error instanceof SyntaxError) return reply(request, 400, { error: "Bad request." });
    console.error(error);
    return reply(request, 500, { error: "Something went wrong. Please try again." });
  }
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: headers(request) });
}

export async function GET(request: Request) {
  const store = upstashStore(process.env);
  if (!store) return reply(request, 503, { error: "Notifications are not switched on yet." });
  try {
    return reply(request, 200, { publicKey: (await vapidKeys(store)).publicKey });
  } catch (error) {
    console.error(error);
    return reply(request, 500, { error: "Something went wrong. Please try again." });
  }
}

export function POST(request: Request) {
  return run(request, (body) => saveEntry(upstashStore(process.env)!, body));
}

export function DELETE(request: Request) {
  return run(request, (body) => removeEntry(upstashStore(process.env)!, body));
}

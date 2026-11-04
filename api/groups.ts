// /api/groups: the prayer-group service (Vercel function). See api/_lib/groups.ts for the rules.
//   GET  /api/groups?id=...&date=yyyy-mm-dd   (header x-member-id)  -> the group
//   POST /api/groups { action: "create" | "intention" | "remove" | "prayed" | "close", ... }
import { GroupError, addIntention, closeGroup, createGroup, markPrayed, removeIntention, viewGroup } from "./_lib/groups.js";
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
    out["Access-Control-Allow-Headers"] = "Content-Type, x-member-id";
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

async function limited(store: Store, request: Request, kind: "read" | "write") {
  const minute = Math.floor(Date.now() / 60_000);
  const count = await store.incr(`rl:${kind}:${clientIp(request)}:${minute}`, 120);
  return count > (kind === "read" ? 120 : 30);
}

function getStore() {
  return upstashStore(process.env);
}

async function handle(request: Request, run: (store: Store) => Promise<unknown>, kind: "read" | "write") {
  const store = getStore();
  if (!store) return reply(request, 503, { error: "Prayer groups are not switched on yet." });
  try {
    if (await limited(store, request, kind)) return reply(request, 429, { error: "Too many requests. Please wait a minute." });
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
  return handle(
    request,
    (store) => viewGroup(store, { id: params.get("id"), date: params.get("date"), memberId: request.headers.get("x-member-id") ?? undefined }),
    "read",
  );
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return reply(request, 400, { error: "That request could not be read." });
  }
  return handle(
    request,
    (store) => {
      switch (body.action) {
        case "create":
          return createGroup(store, { name: body.name });
        case "intention":
          return addIntention(store, { id: body.id, memberId: body.memberId, memberName: body.memberName, text: body.text });
        case "remove":
          return removeIntention(store, { id: body.id, intentionId: body.intentionId, memberId: body.memberId, adminKey: body.adminKey });
        case "prayed":
          return markPrayed(store, { id: body.id, memberId: body.memberId, memberName: body.memberName, date: body.date });
        case "close":
          return closeGroup(store, { id: body.id, adminKey: body.adminKey });
        default:
          throw new GroupError(400, "Unknown action.");
      }
    },
    "write",
  );
}

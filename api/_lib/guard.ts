// Shared request guards for the API routes: who is calling, how big the request is, and how often.
import type { Store } from "./store";

/** Largest JSON body the API accepts. Every real request is well under 2 KB. */
export const MAX_BODY_BYTES = 4096;

/**
 * The caller's IP. On Vercel, x-real-ip and x-vercel-forwarded-for are set by the platform and
 * cannot be faked by the caller, so they come first. x-forwarded-for is the last resort.
 */
export function clientIp(request: Request) {
  const fromVercel = request.headers.get("x-real-ip") ?? request.headers.get("x-vercel-forwarded-for");
  const raw = fromVercel ?? request.headers.get("x-forwarded-for") ?? "";
  const ip = raw.split(",")[0].trim().slice(0, 64);
  return ip || "unknown";
}

/** Reads a JSON object body, refusing anything too large or not an object. Returns null when the body is unusable. */
export async function readJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return null;
  let text: string;
  try {
    text = await request.text();
  } catch {
    return null;
  }
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return null;
  try {
    const body = JSON.parse(text) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) return null;
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Counts a request in a fixed window and reports whether the caller has gone over the limit. */
export async function overLimit(store: Store, key: string, limit: number, windowSeconds: number) {
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const count = await store.incr(`rl:${key}:${bucket}`, windowSeconds * 2);
  return count > limit;
}

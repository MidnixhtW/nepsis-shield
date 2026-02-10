type CacheEntry<T> = {
  v: 1;
  ts: number;
  ttlMs: number;
  data: T;
};

function now() {
  return Date.now();
}

function safeSessionGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSessionSet(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // ignore (disabled / quota)
  }
}

function safeJsonParse(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readCache<T>(key: string): T | null {
  const parsed = safeJsonParse(safeSessionGet(key));
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    (parsed as { v?: unknown }).v !== 1
  ) {
    return null;
  }

  const entry = parsed as Partial<CacheEntry<T>>;
  if (typeof entry.ts !== "number" || typeof entry.ttlMs !== "number") {
    return null;
  }

  if (entry.ts + entry.ttlMs <= now()) return null;
  return (entry.data ?? null) as T | null;
}

function writeCache<T>(key: string, data: T, ttlMs: number) {
  const entry: CacheEntry<T> = { v: 1, ts: now(), ttlMs, data };
  safeSessionSet(key, JSON.stringify(entry));
}

export async function fetchJsonCached<T>(
  url: string,
  opts?: RequestInit,
  cache?: { key: string; ttlMs: number },
): Promise<T> {
  if (cache) {
    const cached = readCache<T>(cache.key);
    if (cached !== null) return cached;
  }

  const res = await fetch(url, {
    ...opts,
    // Privacy: avoid leaking the app URL as a referrer to third parties.
    referrerPolicy: "no-referrer",
  });

  if (!res.ok) throw new Error(`Request failed (${res.status})`);

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw new Error("Unexpected content type");
  }

  const data = (await res.json()) as T;
  if (cache) writeCache(cache.key, data, cache.ttlMs);
  return data;
}

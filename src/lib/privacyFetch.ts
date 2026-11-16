import { TEXT_KEEP_MS, keepText, readKeptText } from "@/lib/textCache";

type CacheEntry<T> = {
  v: 1;
  ts: number;
  ttlMs: number;
  data: T;
};

type CacheOptions = {
  key: string;
  ttlMs: number;
  forceRefresh?: boolean;
  staleIfError?: boolean;
  /** Also keep a copy on the device (IndexedDB) that outlives the session and stands in when the network fails. */
  keep?: boolean;
  onCacheUsed?: (savedAt: number, stale: boolean) => void;
};

function readCache<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as Partial<CacheEntry<T>>;
    if (entry?.v !== 1 || typeof entry.ts !== "number" || typeof entry.ttlMs !== "number" || entry.data == null) return null;
    return entry as CacheEntry<T>;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T, ttlMs: number) {
  try {
    const entry: CacheEntry<T> = { v: 1, ts: Date.now(), ttlMs, data };
    window.sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Storage may be disabled or full.
  }
}

export async function fetchJsonCached<T>(
  url: string,
  opts?: RequestInit,
  cache?: CacheOptions,
): Promise<T> {
  const cached = cache ? readCache<T>(cache.key) : null;
  if (cached && !cache?.forceRefresh && cached.ts + cached.ttlMs > Date.now()) {
    cache?.onCacheUsed?.(cached.ts, false);
    return cached.data;
  }

  const kept = cache?.keep && !cache.forceRefresh ? await readKeptText<T>(cache.key) : undefined;
  if (kept && cache && kept.savedAt + cache.ttlMs > Date.now()) {
    writeCache(cache.key, kept.data, kept.savedAt + cache.ttlMs - Date.now());
    cache.onCacheUsed?.(kept.savedAt, false);
    return kept.data;
  }

  try {
    const res = await fetch(url, {
      ...opts,
      // Avoid leaking the app URL as a referrer to third parties.
      referrerPolicy: "no-referrer",
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) throw new Error("Unexpected content type");
    const data = (await res.json()) as T;
    if (cache) writeCache(cache.key, data, cache.ttlMs);
    if (cache?.keep) void keepText(cache.key, data);
    return data;
  } catch (error) {
    if (cache?.staleIfError && cached) {
      cache.onCacheUsed?.(cached.ts, true);
      return cached.data;
    }
    const fallback = kept ?? (cache?.keep ? await readKeptText<T>(cache.key) : undefined);
    if (cache && fallback && fallback.savedAt + TEXT_KEEP_MS > Date.now()) {
      cache.onCacheUsed?.(fallback.savedAt, true);
      return fallback.data;
    }
    throw error;
  }
}

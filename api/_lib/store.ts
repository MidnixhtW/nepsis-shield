// Storage for prayer groups: Upstash Redis over its REST API in production, a Map in tests.
// Files under api/_lib are not routes (Vercel skips names starting with "_").

export type Store = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  del(...keys: string[]): Promise<void>;
  hset(key: string, field: string, value: string, ttlSeconds: number): Promise<void>;
  hgetall(key: string): Promise<Record<string, string>>;
  hdel(key: string, field: string): Promise<void>;
  /** How many fields a hash has. */
  hlen(key: string): Promise<number>;
  expire(key: string, ttlSeconds: number): Promise<void>;
  /** Increments a counter that expires after ttlSeconds; returns the new value. */
  incr(key: string, ttlSeconds: number): Promise<number>;
};

type Env = Record<string, string | undefined>;

/** Upstash Redis via REST, using the variables Vercel's Upstash integration adds. Null when not set up. */
export function upstashStore(env: Env): Store | null {
  const url = env.KV_REST_API_URL ?? env.UPSTASH_REDIS_REST_URL;
  const token = env.KV_REST_API_TOKEN ?? env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  async function pipeline(commands: (string | number)[][]) {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
    });
    if (!response.ok) throw new Error(`Storage error ${response.status}`);
    const results = (await response.json()) as { result?: unknown; error?: string }[];
    const failed = results.find((item) => item.error);
    if (failed) throw new Error(failed.error);
    return results.map((item) => item.result);
  }

  return {
    async get(key) {
      const [value] = await pipeline([["GET", key]]);
      return (value as string | null) ?? null;
    },
    async set(key, value, ttl) {
      await pipeline([["SET", key, value, "EX", ttl]]);
    },
    async del(...keys) {
      if (keys.length) await pipeline([["DEL", ...keys]]);
    },
    async hset(key, field, value, ttl) {
      await pipeline([["HSET", key, field, value], ["EXPIRE", key, ttl]]);
    },
    async hgetall(key) {
      const [flat] = await pipeline([["HGETALL", key]]);
      const list = (flat as string[] | null) ?? [];
      const out: Record<string, string> = {};
      for (let i = 0; i + 1 < list.length; i += 2) out[list[i]] = list[i + 1];
      return out;
    },
    async hdel(key, field) {
      await pipeline([["HDEL", key, field]]);
    },
    async hlen(key) {
      const [count] = await pipeline([["HLEN", key]]);
      return Number(count ?? 0);
    },
    async expire(key, ttl) {
      await pipeline([["EXPIRE", key, ttl]]);
    },
    async incr(key, ttl) {
      const [count] = await pipeline([["INCR", key], ["EXPIRE", key, ttl, "NX"]]);
      return Number(count);
    },
  };
}

/** In-memory store for tests. Expiry is ignored. */
export function memoryStore(): Store {
  const strings = new Map<string, string>();
  const hashes = new Map<string, Map<string, string>>();
  return {
    async get(key) {
      return strings.get(key) ?? null;
    },
    async set(key, value) {
      strings.set(key, value);
    },
    async del(...keys) {
      for (const key of keys) {
        strings.delete(key);
        hashes.delete(key);
      }
    },
    async hset(key, field, value) {
      if (!hashes.has(key)) hashes.set(key, new Map());
      hashes.get(key)!.set(field, value);
    },
    async hgetall(key) {
      return Object.fromEntries(hashes.get(key) ?? []);
    },
    async hdel(key, field) {
      hashes.get(key)?.delete(field);
    },
    async hlen(key) {
      return hashes.get(key)?.size ?? 0;
    },
    async expire() {},
    async incr(key) {
      const next = Number(strings.get(key) ?? 0) + 1;
      strings.set(key, String(next));
      return next;
    },
  };
}

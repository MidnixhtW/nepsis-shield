// The push keys (VAPID) for Nepsis Shield. Made once, the first time they are needed, and kept in the same Upstash
// database as the subscriptions, so no one has to copy a private key anywhere. SET NX means that if two requests
// race on the very first run, both end up using the one pair that was stored.
import webpush from "web-push";
import type { Store } from "./store";

const KEY = "push:vapid";

export type VapidKeys = { publicKey: string; privateKey: string };

export async function vapidKeys(store: Store): Promise<VapidKeys> {
  const existing = await store.get(KEY);
  if (existing) return JSON.parse(existing) as VapidKeys;
  const fresh = webpush.generateVAPIDKeys();
  await store.setIfAbsent(KEY, JSON.stringify(fresh));
  const stored = await store.get(KEY);
  return stored ? (JSON.parse(stored) as VapidKeys) : fresh;
}

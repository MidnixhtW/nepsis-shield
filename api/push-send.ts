// /api/push-send: sends the notifications that are due. Called every 15 minutes by the "Send prayer reminders" GitHub
// workflow, and by "Announce new version" with ?kind=update. Only those workflows can call it: each sends a GitHub
// OIDC token, checked in _lib/githubOidc.ts. No password is stored anywhere.
//   POST /api/push-send                 -> prayer reminders that are due
//   POST /api/push-send?kind=update     -> "Nepsis Shield has been updated" to everyone opted in
import webpush from "web-push";
import { PUSH_HASH, PUSH_TTL_SECONDS, REMINDER_TEXT, dueReminders, type PushEntry } from "./_lib/push.js";
import { upstashStore } from "./_lib/store.js";
import { fromOurWorkflow } from "./_lib/githubOidc.js";
import { vapidKeys } from "./_lib/vapid.js";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!(await fromOurWorkflow(request.headers.get("authorization")))) return json(401, { error: "Not allowed." });
  const store = upstashStore(process.env);
  if (!store) return json(503, { error: "Not configured." });
  const keys = await vapidKeys(store);
  webpush.setVapidDetails("https://www.nepsisshield.com", keys.publicKey, keys.privateKey);

  const kind = new URL(request.url).searchParams.get("kind") === "update" ? "update" : "reminders";
  const now = new Date();
  const all = await store.hgetall(PUSH_HASH);
  let sent = 0;
  let removed = 0;

  for (const [id, raw] of Object.entries(all)) {
    let entry: PushEntry;
    try {
      entry = JSON.parse(raw) as PushEntry;
    } catch {
      await store.hdel(PUSH_HASH, id);
      continue;
    }
    // Not opened in four months: forget it.
    if (!entry.seenAt || now.getTime() - entry.seenAt > PUSH_TTL_SECONDS * 1000) {
      await store.hdel(PUSH_HASH, id);
      removed += 1;
      continue;
    }

    const messages =
      kind === "update"
        ? entry.updates
          ? [{ key: null, date: null, payload: { title: "Nepsis Shield has been updated", body: "Open the app to get the newest version.", url: "/release-notes", tag: "update" } }]
          : []
        : dueReminders(entry, now).map(({ key, date }) => ({ key, date, payload: { ...REMINDER_TEXT[key], tag: key } }));

    let gone = false;
    for (const message of messages) {
      try {
        await webpush.sendNotification(entry.subscription, JSON.stringify(message.payload), { TTL: 60 * 60, urgency: "normal" });
        sent += 1;
        if (message.key && message.date) entry.sent[message.key] = message.date;
      } catch (error) {
        const status = (error as { statusCode?: number }).statusCode;
        // The browser threw this address away (app removed, notifications turned off): forget it.
        if (status === 404 || status === 410) {
          gone = true;
          break;
        }
        console.error("push failed", status);
      }
    }
    if (gone) {
      await store.hdel(PUSH_HASH, id);
      removed += 1;
    } else if (messages.length && kind === "reminders") {
      await store.hset(PUSH_HASH, id, JSON.stringify(entry), PUSH_TTL_SECONDS);
    }
  }

  return json(200, { kind, checked: Object.keys(all).length, sent, removed });
}

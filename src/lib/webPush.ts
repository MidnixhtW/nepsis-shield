// Prayer reminders as real notifications in the browser and the installed web app (Android Chrome, desktop, and
// iPhone once the app is added to the Home Screen). The Android app uses its own on-device notifications instead.
//
// What leaves the device: the push address the browser gives us (it names no person), the time zone, and the chosen
// reminder times. It is kept by /api/push so the server can send each reminder at its time.
import { Capacitor } from "@capacitor/core";

export type PushReminders = Partial<Record<"morning" | "evening" | "night" | "scroll" | "angelus", string>>;

export function webPushSupported() {
  return (
    !Capacitor.isNativePlatform() &&
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/** iPhone and iPad only deliver web notifications to an app added to the Home Screen. */
export function needsHomeScreenInstall() {
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
  return ios && !standalone;
}

function urlBase64ToBytes(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

async function registration() {
  const existing = await navigator.serviceWorker.getRegistration();
  return existing ?? navigator.serviceWorker.register("/sw.js");
}

export type PushResult = { ok: true } | { ok: false; reason: "unsupported" | "install-first" | "denied" | "unavailable" | "failed" };

/**
 * Sends the current reminder times to the server, subscribing first if needed. With no reminders on, it unsubscribes
 * and the server forgets this device. `ask` allows the permission prompt; pass it only from a tap.
 */
export async function syncWebPush(reminders: PushReminders, ask: boolean): Promise<PushResult> {
  if (!webPushSupported()) return { ok: false, reason: "unsupported" };
  const anyOn = Object.values(reminders).some(Boolean);
  try {
    const reg = await registration();
    let subscription = await reg.pushManager.getSubscription();

    if (!anyOn) {
      if (subscription) {
        await fetch("/api/push", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        }).catch(() => {});
        await subscription.unsubscribe().catch(() => {});
      }
      return { ok: true };
    }

    if (needsHomeScreenInstall()) return { ok: false, reason: "install-first" };
    if (Notification.permission === "denied") return { ok: false, reason: "denied" };
    if (Notification.permission !== "granted") {
      if (!ask) return { ok: false, reason: "denied" };
      if ((await Notification.requestPermission()) !== "granted") return { ok: false, reason: "denied" };
    }

    if (!subscription) {
      const keyResponse = await fetch("/api/push");
      if (!keyResponse.ok) return { ok: false, reason: "unavailable" };
      const { publicKey } = (await keyResponse.json()) as { publicKey: string };
      subscription = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToBytes(publicKey) });
    }

    const response = await fetch("/api/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        reminders,
        updates: true,
      }),
    });
    if (response.status === 503) return { ok: false, reason: "unavailable" };
    return response.ok ? { ok: true } : { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

/** Whether this browser already has notifications on for Nepsis Shield. */
export async function webPushActive() {
  if (!webPushSupported() || Notification.permission !== "granted") return false;
  const reg = await navigator.serviceWorker.getRegistration();
  return Boolean(await reg?.pushManager.getSubscription());
}

/**
 * On each app open, re-send the saved reminder times if notifications are on. This keeps the server's copy current
 * and tells it the device is still in use (entries unused for four months are deleted). Never prompts.
 */
export async function refreshWebPushOnOpen(saved: Record<string, { enabled?: boolean; time?: string }> | null) {
  if (!saved || !(await webPushActive())) return;
  const reminders: PushReminders = {};
  for (const [key, value] of Object.entries(saved)) {
    if (value?.enabled && value.time) reminders[key as keyof PushReminders] = value.time;
  }
  if (Object.keys(reminders).length) await syncWebPush(reminders, false);
}

import { Capacitor } from "@capacitor/core";
import { toast } from "sonner";
import { APK_DOWNLOAD_URL } from "@/lib/apkDownload";
import { PUBLIC_SITE_URL } from "@/lib/publicSite";

let shown = false;

/** A new version of the web app has taken over: offer a refresh once, and leave it to the person when. */
export function announceUpdate() {
  if (shown) return;
  shown = true;
  toast("A new version of Nepsis Shield is ready.", {
    duration: Infinity,
    action: { label: "Refresh", onClick: () => window.location.reload() },
  });
}

function newer(a: string, b: string) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i += 1) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0);
  }
  return false;
}

const CHECKED_KEY = "nepsis:update-checked";

/**
 * The Android app carries its own copy of the site, so it only changes when a new app file is installed. Once a day,
 * when it opens with signal, it asks the website which version is current and offers the download if it is newer.
 */
export async function checkAndroidUpdate() {
  if (!Capacitor.isNativePlatform() || !navigator.onLine) return;
  try {
    const last = Number(localStorage.getItem(CHECKED_KEY) || 0);
    if (Date.now() - last < 24 * 60 * 60 * 1000) return;
    localStorage.setItem(CHECKED_KEY, String(Date.now()));
  } catch {
    // Storage blocked: check anyway, it is one small request.
  }
  try {
    const response = await fetch(`${PUBLIC_SITE_URL}/version.json`, { cache: "no-store", referrerPolicy: "no-referrer" });
    if (!response.ok) return;
    const { version } = (await response.json()) as { version?: string };
    if (typeof version !== "string" || !newer(version, __APP_VERSION__)) return;
    toast(`Nepsis Shield ${version.replace(/\.0$/, "")} is out.`, {
      description: "Install the new version to get the latest prayers and fixes.",
      duration: 15000,
      action: { label: "Get it", onClick: () => window.open(APK_DOWNLOAD_URL, "_blank", "noopener") },
    });
  } catch {
    // No signal or the site is down; try again tomorrow.
  }
}

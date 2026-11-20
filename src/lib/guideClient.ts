import { Capacitor } from "@capacitor/core";
import { PUBLIC_SITE_URL } from "@/lib/publicSite";

const CODE_KEY = "nepsis-shield:guide-access-code";

export type GuideTurn = { role: "user" | "assistant"; content: string };

export class GuideRequestError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function storedGuideCode() {
  try {
    return window.localStorage.getItem(CODE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function storeGuideCode(code: string) {
  try {
    if (code) window.localStorage.setItem(CODE_KEY, code);
    else window.localStorage.removeItem(CODE_KEY);
  } catch {
    // Storage may be off; the code then lasts only while the page is open.
  }
}

/** Sends the conversation to the site's /api/guide, which asks Claude. Android calls the website. */
export async function askGuideServer(code: string, turns: GuideTurn[]): Promise<string> {
  const base = Capacitor.isNativePlatform() ? PUBLIC_SITE_URL : "";
  let response: Response;
  try {
    response = await fetch(`${base}/api/guide`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, messages: turns }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    throw new GuideRequestError(0, "No connection to the guide right now.");
  }
  const data = (await response.json().catch(() => ({}))) as { text?: string; error?: string };
  if (!response.ok || !data.text) throw new GuideRequestError(response.status, data.error ?? "The guide could not answer just now.");
  return data.text;
}

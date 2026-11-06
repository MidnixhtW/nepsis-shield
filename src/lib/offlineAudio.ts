// Recorded prayers kept on the device, so a reader can be heard on a flight or with no signal. Stored with the Cache
// API in the page itself (not the service worker), which also works inside the Android app. Playback asks
// `playableUrl` first: a saved recording plays from the device, anything else streams as before.
import { Capacitor } from "@capacitor/core";
import { NARRATION_CLIPS } from "@/content/narrationManifest";
import { PUBLIC_SITE_URL } from "@/lib/publicSite";

const AUDIO_CACHE = "nepsis-audio-v1";
const CHANGE_EVENT = "nepsis:offline-audio-change";

function hasCacheApi() {
  return typeof caches !== "undefined";
}

function clipPath(reader: string, id: string) {
  const base = Capacitor.isNativePlatform() ? PUBLIC_SITE_URL : "";
  return `${base}/audio/${reader}/${id}.mp3`;
}

/** The recordings a reader has, as the URLs the app plays. */
export function readerClipUrls(reader: string) {
  return (NARRATION_CLIPS[reader] ?? []).map((id) => clipPath(reader, id));
}

export async function savedClipCount(reader: string) {
  if (!hasCacheApi()) return 0;
  try {
    const cache = await caches.open(AUDIO_CACHE);
    const keys = new Set((await cache.keys()).map((request) => new URL(request.url).pathname));
    return readerClipUrls(reader).filter((url) => keys.has(new URL(url, window.location.href).pathname)).length;
  } catch {
    return 0;
  }
}

/** Saves every recording of a reader, reporting progress. Already-saved clips are skipped. */
export async function saveReaderOffline(reader: string, onProgress?: (done: number, total: number) => void) {
  if (!hasCacheApi()) throw new Error("This browser cannot save recordings.");
  const cache = await caches.open(AUDIO_CACHE);
  const urls = readerClipUrls(reader);
  let done = 0;
  for (const url of urls) {
    if (!(await cache.match(url))) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Could not download a recording (${response.status}).`);
      await cache.put(url, response);
    }
    done += 1;
    onProgress?.(done, urls.length);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export async function removeReaderOffline(reader: string) {
  if (!hasCacheApi()) return;
  const cache = await caches.open(AUDIO_CACHE);
  await Promise.all(readerClipUrls(reader).map((url) => cache.delete(url)));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function onOfflineAudioChange(listener: () => void) {
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}

const objectUrls = new Map<string, string>();

/** A saved recording as a local object URL, or the original URL when it is not saved. */
export async function playableUrl(url: string): Promise<string> {
  if (!hasCacheApi()) return url;
  const known = objectUrls.get(url);
  if (known) return known;
  try {
    const cached = await (await caches.open(AUDIO_CACHE)).match(url);
    if (!cached) return url;
    const local = URL.createObjectURL(await cached.blob());
    objectUrls.set(url, local);
    return local;
  } catch {
    return url;
  }
}

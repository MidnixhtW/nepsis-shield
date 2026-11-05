import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { NARRATION_CLIPS } from "@/content/narrationManifest";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { clipId, spokenText } from "@/lib/narrationText";
import { PUBLIC_SITE_URL } from "@/lib/publicSite";

// Recorded readers for prayers and stories (ElevenLabs), with the device's own voice as the fallback.
export type ReaderId = "omar" | "empa" | "iris" | "liam" | "device";

export const READERS: Array<{ id: ReaderId; name: string; note: string }> = [
  { id: "omar", name: "Omar", note: "Warm and unhurried" },
  { id: "empa", name: "Empa", note: "The voice of the app's creator" },
  { id: "iris", name: "Iris", note: "Gentle and clear" },
  { id: "liam", name: "Liam", note: "Calm and steady" },
  { id: "device", name: "Device voice", note: "Your phone's built-in voice" },
];

export const READER_KEY = "read-aloud:voice";
const CHANGE_EVENT = "nepsis:reader-change";

function isReader(value: unknown): value is ReaderId {
  return READERS.some((reader) => reader.id === value);
}

export function getReader(): ReaderId {
  const saved = getStoredItem<unknown>(READER_KEY);
  return isReader(saved) ? saved : "omar";
}

export function setReader(id: ReaderId) {
  setStoredItem(READER_KEY, id);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useReader(): [ReaderId, (id: ReaderId) => void] {
  const [reader, setLocal] = useState<ReaderId>(getReader);
  useEffect(() => {
    const refresh = () => setLocal(getReader());
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return [reader, setReader];
}

const clipSets = new Map<string, Set<string>>();
function clipsFor(reader: string) {
  let set = clipSets.get(reader);
  if (!set) {
    set = new Set(NARRATION_CLIPS[reader] ?? []);
    clipSets.set(reader, set);
  }
  return set;
}

/**
 * The recording of these lines in this reader's voice. When that reader has not recorded them yet, Omar's
 * recording is used (unless `exact`), so a prayer stays in a recorded voice instead of switching to the device's.
 * The Android app plays recordings from the website.
 */
export function clipUrl(reader: ReaderId, lines: string[], exact = false): string | undefined {
  if (reader === "device") return undefined;
  const id = clipId(spokenText(lines));
  const voice = clipsFor(reader).has(id) ? reader : !exact && clipsFor("omar").has(id) ? "omar" : undefined;
  if (!voice) return undefined;
  const base = Capacitor.isNativePlatform() ? PUBLIC_SITE_URL : "";
  return `${base}/audio/${voice}/${id}.mp3`;
}

export function readerName(reader: ReaderId) {
  return READERS.find((item) => item.id === reader)?.name ?? "Reader";
}

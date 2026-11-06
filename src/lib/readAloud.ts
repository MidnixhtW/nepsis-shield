import { useSyncExternalStore } from "react";
import { playableUrl } from "@/lib/offlineAudio";

// One shared "read aloud" for the whole app, so listening keeps going while you move between screens
// and the player bar above the tabs can pause, skip or stop it. A part plays its recording when it has one,
// and otherwise the device's own voice reads it.

export type ReadAloudPart = { text: string; audio?: string };

export type ReadAloudState = {
  title: string | null;
  parts: ReadAloudPart[];
  index: number;
  playing: boolean;
};

const IDLE: ReadAloudState = { title: null, parts: [], index: 0, playing: false };
let state: ReadAloudState = IDLE;
const listeners = new Set<() => void>();
// Each start gets a new id, so a cancelled part's end event cannot move the new reading along.
let runId = 0;
let player: HTMLAudioElement | null = null;
// The recording the player holds, by its original URL (a saved recording plays from a local blob URL).
let playerSource: string | null = null;

export function canReadAloud() {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

/** True when these items can be heard: a recording exists for each, or the device can speak. */
export function canPlayItems(items: Array<{ text?: string; audio?: string }>) {
  return items.length > 0 && (canReadAloud() || items.every((item) => !!item.audio));
}

function setState(next: ReadAloudState) {
  state = next;
  listeners.forEach((listener) => listener());
}

/** Removes counting marks meant for the eye, such as "(3x)" or "(Thrice)". */
export function cleanForSpeech(text: string) {
  return text
    .replace(/\(\s*\d+x\s*\)/gi, "")
    .replace(/\((Thrice|[A-Za-z ]*times)[^)]*\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Some voices stop partway through long text, so long passages are spoken a few sentences at a time.
export function splitForSpeech(texts: string[], maxLength = 320): string[] {
  const parts: string[] = [];
  for (const raw of texts) {
    const text = cleanForSpeech(raw);
    if (!text) continue;
    const sentences = text.match(/[^.!?;:]+[.!?;:]*["”’)]*\s*/g) ?? [text];
    let chunk = "";
    for (const sentence of sentences) {
      if (chunk && (chunk + sentence).length > maxLength) {
        parts.push(chunk.trim());
        chunk = "";
      }
      chunk += sentence;
    }
    if (chunk.trim()) parts.push(chunk.trim());
  }
  return parts;
}

function silence() {
  if (player) {
    player.onended = null;
    player.onerror = null;
    player.pause();
  }
  if (canReadAloud()) window.speechSynthesis.cancel();
}

function speakText(text: string, id: number, index: number) {
  if (!canReadAloud()) {
    playFrom(index + 1);
    return;
  }
  const utterance = new SpeechSynthesisUtterance(cleanForSpeech(text));
  utterance.rate = 0.88;
  utterance.onend = () => {
    if (id === runId && state.playing) playFrom(index + 1);
  };
  window.speechSynthesis.speak(utterance);
}

function playFrom(index: number, resumeAudio = false) {
  const id = ++runId;
  if (index >= state.parts.length) {
    silence();
    setState(IDLE);
    return;
  }
  const part = state.parts[index];
  if (!resumeAudio) silence();
  setState({ ...state, index, playing: true });

  if (part.audio) {
    const original = part.audio;
    const audio = (player ??= new Audio());
    const start = (src?: string) => {
      if (id !== runId) return;
      if (src) {
        audio.src = src;
        audio.currentTime = 0;
        playerSource = original;
      }
      audio.onended = () => {
        if (id === runId && state.playing) playFrom(index + 1);
      };
      // If the recording cannot be played (offline and not saved, say), the device voice reads it instead.
      audio.onerror = () => {
        if (id === runId && state.playing) speakText(part.text, id, index);
      };
      audio.play().catch(() => {
        if (id === runId && state.playing) speakText(part.text, id, index);
      });
    };
    if (resumeAudio && playerSource === original) start();
    else void playableUrl(original).then(start);
    return;
  }
  speakText(part.text, id, index);
}

/** Read items aloud: each item plays its recording if it has one, or is read by the device voice in short pieces. */
export function startNarration(title: string, items: ReadAloudPart[]) {
  const parts = items.flatMap((item) => (item.audio ? [item] : splitForSpeech([item.text]).map((text) => ({ text }))));
  if (!parts.length || !canPlayItems(parts)) return;
  state = { title, parts, index: 0, playing: true };
  playFrom(0);
}

/** Read plain text with the device voice. */
export function startReadAloud(title: string, texts: string[]) {
  startNarration(title, texts.map((text) => ({ text })));
}

// Recordings pause where they are; the device voice is cancelled and starts the part again, since its own pause is unreliable on phones.
export function pauseReadAloud() {
  runId++;
  if (player) player.pause();
  if (canReadAloud()) window.speechSynthesis.cancel();
  setState({ ...state, playing: false });
}

export function resumeReadAloud() {
  if (!state.title) return;
  const part = state.parts[state.index];
  playFrom(state.index, !!part?.audio);
}

export function skipReadAloud(direction: -1 | 1) {
  if (!state.title) return;
  playFrom(Math.max(0, Math.min(state.parts.length - 1, state.index + direction)));
}

export function stopReadAloud() {
  runId++;
  silence();
  setState(IDLE);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useReadAloud() {
  return useSyncExternalStore(subscribe, () => state, () => IDLE);
}

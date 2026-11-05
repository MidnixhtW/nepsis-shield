import { useSyncExternalStore } from "react";

// One shared "read aloud" for the whole app, so listening keeps going while you move between screens
// and the player bar above the tabs can pause, skip or stop it. Uses the device's own voice.

export type ReadAloudState = {
  title: string | null;
  parts: string[];
  index: number;
  playing: boolean;
};

const IDLE: ReadAloudState = { title: null, parts: [], index: 0, playing: false };
let state: ReadAloudState = IDLE;
const listeners = new Set<() => void>();
// Each start gets a new id, so a cancelled utterance's end event cannot move the new reading along.
let runId = 0;

export function canReadAloud() {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
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

function speakFrom(index: number) {
  if (!canReadAloud()) return;
  const id = ++runId;
  window.speechSynthesis.cancel();
  if (index >= state.parts.length) {
    setState(IDLE);
    return;
  }
  setState({ ...state, index, playing: true });
  const utterance = new SpeechSynthesisUtterance(state.parts[index]);
  utterance.rate = 0.88;
  utterance.onend = () => {
    if (id === runId && state.playing) speakFrom(index + 1);
  };
  window.speechSynthesis.speak(utterance);
}

export function startReadAloud(title: string, texts: string[]) {
  const parts = splitForSpeech(texts);
  if (!parts.length || !canReadAloud()) return;
  state = { title, parts, index: 0, playing: true };
  speakFrom(0);
}

// Pausing cancels and remembers the place; the browsers' own pause is unreliable on phones.
export function pauseReadAloud() {
  runId++;
  if (canReadAloud()) window.speechSynthesis.cancel();
  setState({ ...state, playing: false });
}

export function resumeReadAloud() {
  if (state.title) speakFrom(state.index);
}

export function skipReadAloud(direction: -1 | 1) {
  if (!state.title) return;
  speakFrom(Math.max(0, Math.min(state.parts.length - 1, state.index + direction)));
}

export function stopReadAloud() {
  runId++;
  if (canReadAloud()) window.speechSynthesis.cancel();
  setState(IDLE);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useReadAloud() {
  return useSyncExternalStore(subscribe, () => state, () => IDLE);
}

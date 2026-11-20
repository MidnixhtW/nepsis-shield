// The ison: the held note under Byzantine chant, here a quiet drone under the narrated prayers. It is made on the
// phone with the Web Audio API (no recordings, nothing to download): a low tone, its octave and fifth, softened and
// faded in and out. Off until turned on in Settings > Reader.
import { useSyncExternalStore } from "react";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

export const ISON_KEY = "ison:on";
const CHANGE_EVENT = "nepsis:ison-change";

// Pa (D) is the tonic of the first tone; a low D sits under any reading voice without crowding it.
const BASE_HZ = 73.42; // D2
const LEVEL = 0.05;
const FADE_S = 2.5;

type Drone = { context: AudioContext; master: GainNode; sources: OscillatorNode[] };
let drone: Drone | null = null;
let stopTimer: number | null = null;

export function isonEnabled() {
  return getStoredItem<boolean>(ISON_KEY) === true;
}

export function setIsonEnabled(on: boolean) {
  setStoredItem(ISON_KEY, on);
  if (!on) stopIson();
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useIsonEnabled() {
  return useSyncExternalStore(
    (listener) => {
      window.addEventListener(CHANGE_EVENT, listener);
      return () => window.removeEventListener(CHANGE_EVENT, listener);
    },
    isonEnabled,
    () => false,
  );
}

function audioContext(): AudioContext | null {
  const Context = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return Context ? new Context() : null;
}

export function startIson() {
  if (stopTimer !== null) {
    window.clearTimeout(stopTimer);
    stopTimer = null;
  }
  if (drone) {
    const now = drone.context.currentTime;
    drone.master.gain.cancelScheduledValues(now);
    drone.master.gain.linearRampToValueAtTime(LEVEL, now + FADE_S);
    return;
  }
  const context = audioContext();
  if (!context) return;
  const master = context.createGain();
  master.gain.value = 0;
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 600;
  filter.connect(master);
  master.connect(context.destination);

  // The tonic carries the sound; the octave and fifth only colour it. A slight detune keeps it from sounding electric.
  const voices: Array<[number, number, OscillatorType]> = [
    [BASE_HZ, 1, "sawtooth"],
    [BASE_HZ * 2 * 1.002, 0.35, "triangle"],
    [BASE_HZ * 1.5 * 0.998, 0.18, "sine"],
  ];
  const sources = voices.map(([frequency, level, type]) => {
    const oscillator = context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    const gain = context.createGain();
    gain.gain.value = level;
    oscillator.connect(gain).connect(filter);
    oscillator.start();
    return oscillator;
  });
  master.gain.linearRampToValueAtTime(LEVEL, context.currentTime + FADE_S);
  drone = { context, master, sources };
}

export function stopIson() {
  if (!drone || stopTimer !== null) return;
  const { context, master, sources } = drone;
  const now = context.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + FADE_S);
  stopTimer = window.setTimeout(() => {
    sources.forEach((source) => source.stop());
    void context.close();
    drone = null;
    stopTimer = null;
  }, FADE_S * 1000 + 100);
}

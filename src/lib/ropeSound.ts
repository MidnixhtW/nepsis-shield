import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

// A soft wooden click for each knot, for phones that cannot vibrate from a web page (iPhone). Made on the phone with
// the Web Audio API, so there is no sound file to download. Off unless chosen on the Jesus Prayer page.
export const ROPE_CLICK_KEY = "jesus_prayer_click";

export function ropeClickOn() {
  return getStoredItem<boolean>(ROPE_CLICK_KEY) === true;
}

export function setRopeClick(on: boolean) {
  setStoredItem(ROPE_CLICK_KEY, on);
}

let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  ctx ??= new window.AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

// One short tap of wood: a burst of noise through a narrow band, gone in a few hundredths of a second.
function tick(at: number, frequency: number, level: number) {
  const ac = audio();
  if (!ac) return;
  const length = Math.floor(ac.sampleRate * 0.04);
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
  const source = ac.createBufferSource();
  source.buffer = buffer;
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = frequency;
  band.Q.value = 6;
  const gain = ac.createGain();
  gain.gain.value = level;
  source.connect(band).connect(gain).connect(ac.destination);
  source.start(ac.currentTime + at);
}

export function knotClick() {
  if (ropeClickOn()) tick(0, 2200, 0.9);
}

export function markerClick() {
  if (!ropeClickOn()) return;
  tick(0, 900, 1.1);
  tick(0.12, 900, 1.1);
}

export function ruleDoneClick() {
  if (!ropeClickOn()) return;
  [0, 0.14, 0.28].forEach((at) => tick(at, 700, 1.1));
}

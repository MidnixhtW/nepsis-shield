import { buildFlow, savedFlowExtras, type PrayerTime } from "@/content/dailyPrayerSteps";
import { getStoredItem } from "@/lib/deviceStorage";
import { clipUrl, getReader, READERS } from "@/lib/narration";
import { PRAYER_PREFS_KEY, savedPrayerMode } from "@/lib/prayerLength";

/** One recorded piece of a prayer: the file, and the words it speaks (shown as the text while it plays). */
export type AudioSegment = { url: string; title: string; lines: string[] };

export type AudioTrack = {
  id: string;
  title: string;
  /** Shown under the title in the player. */
  subtitle: string;
  kind: "prayer" | "radio";
  /** A live stream (radio). It has no length, so the player shows "Live" instead of a progress bar. */
  url?: string;
  /** A recorded prayer, played piece by piece. */
  segments?: AudioSegment[];
};

export type AmbientTrack = {
  id: string;
  title: string;
  url: string;
};

// Ancient Faith Radio's two live stations (Antiochian Archdiocese): chant and hymns around the clock, and talks.
export const RADIO_TRACKS: AudioTrack[] = [
  {
    id: "afr-music",
    title: "Ancient Faith Music",
    subtitle: "Live radio: Orthodox chant and hymns, day and night",
    kind: "radio",
    url: "https://ancientfaith.streamguys1.com/music",
  },
  {
    id: "afr-talk",
    title: "Ancient Faith Talk",
    subtitle: "Live radio: talks, homilies and podcasts",
    kind: "radio",
    url: "https://ancientfaith.streamguys1.com/talk",
  },
];

const PRAYER_TITLES: Record<PrayerTime, string> = {
  morning: "Morning prayers",
  evening: "Evening prayers",
  night: "Night prayers",
};

// The daily prayers at the length the person chose, read aloud by their chosen reader from the app's own recordings.
// Steps that have no recording yet are left out, so the prayer never falls silent mid-way.
function prayerTrack(time: PrayerTime): AudioTrack | null {
  const reader = getReader();
  const steps = buildFlow(time, savedPrayerMode(), savedFlowExtras(getStoredItem<{ humility?: boolean }>(PRAYER_PREFS_KEY)));
  const segments = steps
    .map((step) => ({ url: clipUrl(reader === "device" ? "abba" : reader, step.body), title: step.title, lines: step.body }))
    .filter((segment): segment is AudioSegment => !!segment.url);
  if (!segments.length) return null;
  const name = READERS.find((item) => item.id === (reader === "device" ? "abba" : reader))?.name ?? "Abba";
  return { id: `prayers-${time}`, title: PRAYER_TITLES[time], subtitle: `Read by ${name}`, kind: "prayer", segments };
}

/** Everything the sanctuary can play, in order: the daily prayers first, then the radio. */
export function sanctuaryTracks(): AudioTrack[] {
  const prayers = (["morning", "evening", "night"] as const).map(prayerTrack).filter((track): track is AudioTrack => !!track);
  return [...prayers, ...RADIO_TRACKS];
}

// Older buttons ask for these ids; they open the closest real thing.
const ALIASES: Record<string, string> = {
  "evening-prayer-demo": "prayers-evening",
  "byzantine-ison": "afr-music",
  "psalmody-vigil": "prayers-night",
};

export function getSanctuaryTrack(id: string) {
  const tracks = sanctuaryTracks();
  const wanted = ALIASES[id] ?? id;
  return tracks.find((track) => track.id === wanted) ?? tracks[0];
}

// Ambient sound is made on the phone (no files): candle crackle and rain from filtered noise, and a low held ison.
export const ambientTracks: AmbientTrack[] = [
  { id: "candle", title: "Beeswax candle", url: "" },
  { id: "rain", title: "Monastic rain", url: "" },
  { id: "ison", title: "Soft ison", url: "" },
];

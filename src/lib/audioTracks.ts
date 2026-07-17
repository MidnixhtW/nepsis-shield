export type AudioTrack = {
  id: string;
  title: string;
  url: string;
  category: "prayer" | "chant" | "patristic";
};

export type AmbientTrack = {
  id: string;
  title: string;
  url: string;
};

export const sanctuaryTracks: AudioTrack[] = [
  {
    id: "evening-prayer-demo",
    title: "The Evening Prayer of St. Macarius",
    url: "",
    category: "prayer",
  },
  {
    id: "byzantine-ison",
    title: "Soft Byzantine Ison",
    url: "",
    category: "chant",
  },
  {
    id: "psalmody-vigil",
    title: "Psalmody Vigil Tone",
    url: "",
    category: "patristic",
  },
];

export const ambientTracks: AmbientTrack[] = [
  { id: "candle", title: "Beeswax candle", url: "" },
  { id: "rain", title: "Monastic rain", url: "" },
  { id: "ison", title: "Soft ison", url: "" },
];

export function getSanctuaryTrack(id: string) {
  return sanctuaryTracks.find((track) => track.id === id) ?? sanctuaryTracks[0];
}

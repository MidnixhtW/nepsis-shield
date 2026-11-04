// The church services in the app: what each is, when it is prayed, where the text comes from.
// The texts are loaded only when opened, so they do not slow the first visit.
import type { ServiceText } from "./types";

export type ServiceId = "compline" | "hours" | "akathist" | "three-canons" | "panikhida" | "fallen-warriors";

export type ServiceInfo = {
  id: ServiceId;
  title: string;
  when: string;
  summary: string;
  minutes: string;
  source: string;
  load: () => Promise<{ default: ServiceText }>;
};

const HAPGOOD = "Isabel F. Hapgood, Service Book of the Holy Orthodox-Catholic Apostolic Church (1906), public domain.";
const ST_TIKHON = "Orthodox Daily Prayers (St. Tikhon's Seminary Press, 1982), released through Project Gutenberg.";

export const SERVICES: ServiceInfo[] = [
  {
    id: "compline",
    title: "Small Compline",
    when: "Evening, before sleep",
    summary: "The Church's prayer at the close of the day: Psalm 50, the Creed, the troparia of the day and prayers for a peaceful night.",
    minutes: "20–25 min",
    source: ST_TIKHON,
    load: () => import("./compline"),
  },
  {
    id: "hours",
    title: "The Hours",
    when: "Morning to mid-afternoon",
    summary: "The First, Third, Sixth and Ninth Hours: three psalms and short prayers that sanctify the working day.",
    minutes: "10–15 min each",
    source: HAPGOOD,
    load: () => import("./hours"),
  },
  {
    id: "akathist",
    title: "Akathist to the Theotokos",
    when: "Fridays of Lent, or any time",
    summary: "The great hymn of praise to the Mother of God, sung standing: twenty-four stanzas of \"Hail\" and \"Alleluia\".",
    minutes: "20 min",
    source: "The Akathist Hymn and Little Compline (London: Williams & Norgate, 1919), public domain in the United States.",
    load: () => import("./akathist"),
  },
  {
    id: "three-canons",
    title: "The Three Canons",
    when: "The evening before Communion",
    summary: "The Canon of Repentance, the Canon to the Theotokos and the Canon to the Guardian Angel, ode by ode.",
    minutes: "30 min",
    source: ST_TIKHON,
    load: () => import("./threeCanons"),
  },
  {
    id: "panikhida",
    title: "Panikhida",
    when: "Memorial days and Saturdays of Souls",
    summary: "The service of prayer for the departed, served on the 3rd, 9th and 40th days, on anniversaries and whenever we remember them.",
    minutes: "15–20 min",
    source: HAPGOOD,
    load: () => import("./panikhida"),
  },
  {
    id: "fallen-warriors",
    title: "Canon for the Fallen in Battle",
    when: "Memorial Day, Veterans Day, anniversaries",
    summary: "The Church's canon for those who gave their lives in battle, read with the Panikhida or on its own.",
    minutes: "15 min",
    source: HAPGOOD,
    load: () => import("./fallenWarriors"),
  },
];

export function isServiceId(value: string | null): value is ServiceId {
  return SERVICES.some((service) => service.id === value);
}

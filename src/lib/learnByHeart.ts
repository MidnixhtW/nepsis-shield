// Progress for "Learn by heart", saved on this device.
// Each section moves through four steps (read, fade, first letters, tap in order). Once it is learned it comes back
// for review after 1, 3, 7, 14 and then every 30 days; a missed review starts the spacing over.
import { useEffect, useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { CREED_SECTIONS, PRAYERS_TO_LEARN, type PrayerToLearn } from "@/content/prayersToLearn";

export const LEARN_KEY = "learn-by-heart:v1";
const OLD_CREED_KEY = "orthodox-app:nicene-creed-progress:v1";
const CHANGED = "learn-by-heart-changed";

export const STEPS = ["Read", "Fade", "First letters", "Tap in order"] as const;
export const REVIEW_DAYS = [1, 3, 7, 14, 30];

/** level: the step being practiced (0-3). Once learned, `due` is the next review day (yyyy-MM-dd). */
export type SectionProgress = { level: number; learned?: boolean; step?: number; due?: string };
export type LearnState = Record<string, Record<number, SectionProgress>>;

const dayKey = (date: Date) => format(date, "yyyy-MM-dd");

function migrateOldCreed(state: LearnState): LearnState {
  if (state.creed) return state;
  try {
    const old = JSON.parse(window.localStorage.getItem(OLD_CREED_KEY) ?? "null") as { completedLines?: unknown } | null;
    const lines = Array.isArray(old?.completedLines) ? old.completedLines : [];
    const known = lines.filter((line): line is number => Number.isInteger(line) && line >= 0 && line < CREED_SECTIONS.length);
    if (!known.length) return state;
    const due = dayKey(addDays(new Date(), 1));
    return { ...state, creed: Object.fromEntries(known.map((line) => [line, { level: STEPS.length, learned: true, step: 0, due }])) };
  } catch {
    return state;
  }
}

export function getLearnState(): LearnState {
  const saved = getStoredItem<LearnState>(LEARN_KEY);
  return migrateOldCreed(saved && typeof saved === "object" ? saved : {});
}

function save(state: LearnState) {
  setStoredItem(LEARN_KEY, state);
  window.dispatchEvent(new Event(CHANGED));
}

function update(prayerId: string, section: number, change: (current: SectionProgress) => SectionProgress) {
  const state = getLearnState();
  const current = state[prayerId]?.[section] ?? { level: 0 };
  save({ ...state, [prayerId]: { ...state[prayerId], [section]: change(current) } });
}

/** A step was finished. A clean run moves to the next step; finishing "Tap in order" marks the section learned. */
export function finishStep(prayerId: string, section: number, clean: boolean, today = new Date()) {
  update(prayerId, section, (current) => {
    if (!clean) return current;
    const level = current.level + 1;
    if (level < STEPS.length) return { level };
    return { level, learned: true, step: 0, due: dayKey(addDays(today, REVIEW_DAYS[0])) };
  });
}

/** A review was done. Remembered: wait longer next time. Missed: start the spacing over, from tomorrow. */
export function finishReview(prayerId: string, section: number, remembered: boolean, today = new Date()) {
  update(prayerId, section, (current) => {
    const step = remembered ? Math.min((current.step ?? 0) + 1, REVIEW_DAYS.length - 1) : 0;
    return { ...current, learned: true, step, due: dayKey(addDays(today, REVIEW_DAYS[step])) };
  });
}

export function practiceAgain(prayerId: string, section: number) {
  update(prayerId, section, () => ({ level: 0 }));
}

export function resetPrayer(prayerId: string) {
  // Clear the old Creed memorizer's progress first, or it would be brought back in.
  if (prayerId === "creed") {
    try {
      window.localStorage.removeItem(OLD_CREED_KEY);
    } catch {
      // nothing to clear
    }
  }
  const state = getLearnState();
  delete state[prayerId];
  save(state);
}

export type DueReview = { prayer: PrayerToLearn; section: number };

export function dueReviews(state: LearnState, today = new Date()): DueReview[] {
  const todayKey = dayKey(today);
  return PRAYERS_TO_LEARN.flatMap((prayer) =>
    prayer.sections
      .map((_, section) => section)
      .filter((section) => {
        const progress = state[prayer.id]?.[section];
        return progress?.learned && progress.due && progress.due <= todayKey;
      })
      .map((section) => ({ prayer, section })),
  );
}

export function learnedCount(state: LearnState, prayer: PrayerToLearn) {
  return prayer.sections.filter((_, section) => state[prayer.id]?.[section]?.learned).length;
}

export function formatDue(due: string | undefined, today = new Date()) {
  if (!due) return "";
  const date = parseISO(due);
  const days = Math.round((date.getTime() - parseISO(dayKey(today)).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "tomorrow";
  return `on ${format(date, "MMMM d")}`;
}

export function useLearnState() {
  const [state, setState] = useState<LearnState>(getLearnState);
  useEffect(() => {
    const refresh = () => setState(getLearnState());
    window.addEventListener(CHANGED, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGED, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return state;
}

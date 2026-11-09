import { useEffect, useMemo, useState } from "react";
import { useCurrentDay } from "@/hooks/useCurrentDay";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

export type DailyHabitKey = "prayer" | "reading" | "reflection" | "mercy";
export type PrayerTimeKey = "morning" | "evening" | "night" | "personal";
export type PrayerModeKey = "short" | "standard" | "long" | "seraphim" | "watch" | "personal";
export type QuickStateKey = "anxious" | "tired" | "tempted" | "grateful" | "angry" | "dry" | "lonely" | "sleepless" | "scrolling";

export type ResumeTarget = {
  section?: "today" | "pray" | "read" | "learn" | "me";
  tab?: string;
  read?: string;
  path?: string;
};

export type GlobalResume = {
  label: string;
  helper: string;
  target: ResumeTarget;
  updatedAt: number;
};

export type PrayerResume = {
  date: string;
  time: Exclude<PrayerTimeKey, "personal">;
  mode: PrayerModeKey;
  stepIndex: number;
  totalSteps: number;
  title: string;
  updatedAt: number;
};

export type Intention = {
  id: string;
  text: string;
  createdAt: number;
  answered: boolean;
};

export type CustomRuleStep = {
  id: string;
  label: string;
  createdAt: number;
};

export type DailyRecord = {
  date: string;
  habits: Record<DailyHabitKey, boolean>;
  prayers: Partial<Record<PrayerTimeKey, boolean>>;
  quickState?: QuickStateKey;
  updatedAt: number;
};

export type HabitStore = {
  records: Record<string, DailyRecord>;
  intentions: Intention[];
  prayerResume?: PrayerResume;
  globalResume?: GlobalResume;
  favoritePrayerIds: string[];
  customRuleSteps: CustomRuleStep[];
};

export type DailyRhythm = {
  todayKey: string;
  today: DailyRecord;
  intentions: Intention[];
  prayerResume?: PrayerResume;
  globalResume?: GlobalResume;
  favoritePrayerIds: string[];
  customRuleSteps: CustomRuleStep[];
  streak: number;
  weekActiveDays: number;
  /** The last seven days, oldest first, for a quiet row of dots (no streak to protect). */
  week: Array<{ key: string; weekday: string; active: boolean; isToday: boolean }>;
  /** The Watchfulness Log: the last twelve weeks, Monday-first columns, true where a prayer rule was kept. */
  log: Array<Array<{ key: string; kept: boolean; future: boolean }>>;
  /** Days in a row the rule was kept, counting today only once it is kept (so the day is never "broken" before evening). */
  ruleDays: number;
  completedToday: number;
};

const STORE_KEY = "daily_rhythm:v1";
const CHANGE_EVENT = "daily-rhythm:change";

const EMPTY_HABITS: Record<DailyHabitKey, boolean> = {
  prayer: false,
  reading: false,
  reflection: false,
  mercy: false,
};

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function dayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function emptyRecord(date = dayKey()): DailyRecord {
  return {
    date,
    habits: { ...EMPTY_HABITS },
    prayers: {},
    updatedAt: Date.now(),
  };
}

function getStore(): HabitStore {
  if (!canUseBrowserStorage()) {
    return { records: {}, intentions: [], favoritePrayerIds: [], customRuleSteps: [] };
  }

  const saved = getStoredItem<Partial<HabitStore>>(STORE_KEY);
  return {
    records: saved?.records ?? {},
    intentions: saved?.intentions ?? [],
    prayerResume: saved?.prayerResume,
    globalResume: saved?.globalResume,
    favoritePrayerIds: saved?.favoritePrayerIds ?? [],
    customRuleSteps: saved?.customRuleSteps ?? [],
  };
}

function saveStore(store: HabitStore) {
  if (!canUseBrowserStorage()) return;

  setStoredItem(STORE_KEY, store);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function mutateStore(mutator: (store: HabitStore) => void) {
  const store = getStore();
  mutator(store);
  saveStore(store);
}

function activeRecord(record: DailyRecord | undefined) {
  if (!record) return false;
  return Object.values(record.habits).some(Boolean) || Object.values(record.prayers).some(Boolean);
}

function keptRule(record: DailyRecord | undefined) {
  return !!record && Object.values(record.prayers).some(Boolean);
}

const LOG_WEEKS = 12;

function buildLog(store: HabitStore) {
  const now = new Date();
  const mondayOffset = (now.getDay() + 6) % 7;
  const start = addDays(now, -mondayOffset - (LOG_WEEKS - 1) * 7);
  return Array.from({ length: LOG_WEEKS }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const date = addDays(start, week * 7 + day);
      const key = dayKey(date);
      return { key, kept: keptRule(store.records[key]), future: date > now && key !== dayKey(now) };
    }),
  );
}

function countRuleDays(store: HabitStore) {
  let count = 0;
  const startOffset = keptRule(store.records[dayKey()]) ? 0 : 1;
  for (let offset = startOffset; offset < 3650; offset += 1) {
    if (!keptRule(store.records[dayKey(addDays(new Date(), -offset))])) break;
    count += 1;
  }
  return count;
}

function getTodayRecord(store: HabitStore) {
  const today = dayKey();
  return store.records[today] ?? emptyRecord(today);
}

function buildRhythm(): DailyRhythm {
  const store = getStore();
  const today = dayKey();
  const todayRecord = getTodayRecord(store);

  let streak = 0;
  for (let offset = 0; offset < 365; offset += 1) {
    const key = dayKey(addDays(new Date(), -offset));
    if (!activeRecord(store.records[key])) break;
    streak += 1;
  }

  const week = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i - 6);
    const key = dayKey(date);
    return {
      key,
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      active: activeRecord(store.records[key]),
      isToday: i === 6,
    };
  });
  const weekActiveDays = week.filter((day) => day.active).length;

  return {
    todayKey: today,
    today: todayRecord,
    intentions: store.intentions,
    prayerResume: store.prayerResume?.date === today ? store.prayerResume : undefined,
    globalResume: store.globalResume,
    favoritePrayerIds: store.favoritePrayerIds,
    customRuleSteps: store.customRuleSteps,
    streak,
    weekActiveDays,
    week,
    log: buildLog(store),
    ruleDays: countRuleDays(store),
    completedToday: Object.values(todayRecord.habits).filter(Boolean).length,
  };
}

export function useDailyRhythm() {
  const [version, setVersion] = useState(0);
  const today = useCurrentDay();

  useEffect(() => {
    if (!canUseBrowserStorage()) return;

    const update = () => setVersion((v) => v + 1);
    window.addEventListener(CHANGE_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CHANGE_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return useMemo(() => buildRhythm(), [version, today]);
}

export function markHabitComplete(habit: DailyHabitKey, completed = true) {
  mutateStore((store) => {
    const today = dayKey();
    const record = store.records[today] ?? emptyRecord(today);
    record.habits = { ...EMPTY_HABITS, ...record.habits, [habit]: completed };
    record.updatedAt = Date.now();
    store.records[today] = record;
  });
}

export function markPrayerComplete(time: PrayerTimeKey, mode: PrayerModeKey) {
  mutateStore((store) => {
    const today = dayKey();
    const record = store.records[today] ?? emptyRecord(today);
    record.habits = { ...EMPTY_HABITS, ...record.habits, prayer: true };
    record.prayers = { ...record.prayers, [mode === "personal" ? "personal" : time]: true };
    record.updatedAt = Date.now();
    store.records[today] = record;
    if (store.prayerResume?.date === today) store.prayerResume = undefined;
  });
}

export function savePrayerResume(resume: Omit<PrayerResume, "date" | "updatedAt">) {
  mutateStore((store) => {
    store.prayerResume = {
      ...resume,
      date: dayKey(),
      updatedAt: Date.now(),
    };
    store.globalResume = {
      label: "Continue prayer",
      helper: `${resume.title} · step ${resume.stepIndex + 1} of ${resume.totalSteps}`,
      target: { section: "pray", tab: "daily" },
      updatedAt: Date.now(),
    };
  });
}

export function clearPrayerResume() {
  mutateStore((store) => {
    store.prayerResume = undefined;
  });
}

export function getPrayerResume() {
  const resume = getStore().prayerResume;
  return resume?.date === dayKey() ? resume : undefined;
}

export function saveGlobalResume(resume: Omit<GlobalResume, "updatedAt">) {
  mutateStore((store) => {
    store.globalResume = { ...resume, updatedAt: Date.now() };
  });
}

export function setQuickState(state: QuickStateKey) {
  mutateStore((store) => {
    const today = dayKey();
    const record = store.records[today] ?? emptyRecord(today);
    record.quickState = state;
    record.updatedAt = Date.now();
    store.records[today] = record;
  });
}

export function addIntention(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return false;

  mutateStore((store) => {
    store.intentions = [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text: trimmed,
        createdAt: Date.now(),
        answered: false,
      },
      ...store.intentions,
    ].slice(0, 12);
  });

  return true;
}

export function toggleIntention(id: string) {
  mutateStore((store) => {
    store.intentions = store.intentions.map((item) =>
      item.id === id ? { ...item, answered: !item.answered } : item,
    );
  });
}

export function removeIntention(id: string) {
  mutateStore((store) => {
    store.intentions = store.intentions.filter((item) => item.id !== id);
  });
}

export function toggleFavoritePrayer(id: string) {
  mutateStore((store) => {
    store.favoritePrayerIds = store.favoritePrayerIds.includes(id)
      ? store.favoritePrayerIds.filter((item) => item !== id)
      : [id, ...store.favoritePrayerIds].slice(0, 24);
  });
}

export function addCustomRuleStep(label: string) {
  const trimmed = label.trim();
  if (!trimmed) return false;

  mutateStore((store) => {
    store.customRuleSteps = [
      ...store.customRuleSteps,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        label: trimmed,
        createdAt: Date.now(),
      },
    ].slice(-12);
  });

  return true;
}

export function removeCustomRuleStep(id: string) {
  mutateStore((store) => {
    store.customRuleSteps = store.customRuleSteps.filter((item) => item.id !== id);
  });
}

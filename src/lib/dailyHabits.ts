import { useEffect, useMemo, useState } from "react";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

export type DailyHabitKey = "prayer" | "reading" | "reflection" | "mercy";
export type PrayerTimeKey = "morning" | "evening" | "night" | "personal";
export type PrayerModeKey = "short" | "standard" | "long" | "personal";
export type QuickStateKey = "anxious" | "tired" | "tempted" | "grateful";

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

type DailyRecord = {
  date: string;
  habits: Record<DailyHabitKey, boolean>;
  prayers: Partial<Record<PrayerTimeKey, boolean>>;
  quickState?: QuickStateKey;
  updatedAt: number;
};

type HabitStore = {
  records: Record<string, DailyRecord>;
  intentions: Intention[];
  prayerResume?: PrayerResume;
};

export type DailyRhythm = {
  todayKey: string;
  today: DailyRecord;
  intentions: Intention[];
  prayerResume?: PrayerResume;
  streak: number;
  weekActiveDays: number;
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
  const saved = getStoredItem<Partial<HabitStore>>(STORE_KEY);
  return {
    records: saved?.records ?? {},
    intentions: saved?.intentions ?? [],
    prayerResume: saved?.prayerResume,
  };
}

function saveStore(store: HabitStore) {
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

  let weekActiveDays = 0;
  for (let offset = 0; offset < 7; offset += 1) {
    const key = dayKey(addDays(new Date(), -offset));
    if (activeRecord(store.records[key])) weekActiveDays += 1;
  }

  return {
    todayKey: today,
    today: todayRecord,
    intentions: store.intentions,
    prayerResume: store.prayerResume?.date === today ? store.prayerResume : undefined,
    streak,
    weekActiveDays,
    completedToday: Object.values(todayRecord.habits).filter(Boolean).length,
  };
}

export function useDailyRhythm() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const update = () => setVersion((v) => v + 1);
    window.addEventListener(CHANGE_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CHANGE_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return useMemo(() => buildRhythm(), [version]);
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
  if (!trimmed) return;

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

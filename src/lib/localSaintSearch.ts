import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import type { CalendarMode } from "@/lib/settings";
import { findPatronNeeds, patronNeeds, scorePatronNeed, tokenizeSaintQuery, type PatronNeed } from "@/lib/patronSaints";

const DAILY_SAINT_INDEX_KEY = "saints:daily-index:v1";
const MAX_STORED_DAYS = 370;

type StoredDailySaintDay = {
  dateKey: string;
  calendarMode: CalendarMode;
  saints: string[];
  sourceUrl: string;
  updatedAt: number;
};

type StoredDailySaintIndex = {
  days: StoredDailySaintDay[];
};

export type LocalSaintNameResult = {
  name: string;
  source: "today" | "daily" | "patron";
  dateKey?: string;
  calendarMode?: CalendarMode;
  sourceUrl?: string;
  updatedAt?: number;
};

export type LocalSaintSearchResults = {
  patrons: PatronNeed[];
  saintNames: LocalSaintNameResult[];
};

function normalizeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function readDailySaintIndex(): StoredDailySaintIndex {
  const stored = getStoredItem<StoredDailySaintIndex>(DAILY_SAINT_INDEX_KEY);
  if (!stored || !Array.isArray(stored.days)) return { days: [] };

  return {
    days: stored.days
      .filter((day) => day?.dateKey && Array.isArray(day.saints))
      .map((day) => ({
        dateKey: day.dateKey,
        calendarMode: day.calendarMode,
        saints: day.saints.filter(Boolean),
        sourceUrl: day.sourceUrl,
        updatedAt: typeof day.updatedAt === "number" ? day.updatedAt : 0,
      })),
  };
}

function writeDailySaintIndex(index: StoredDailySaintIndex) {
  setStoredItem(DAILY_SAINT_INDEX_KEY, {
    days: index.days
      .slice()
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
      .slice(0, MAX_STORED_DAYS),
  });
}

export function upsertDailySaints(params: {
  dateKey: string;
  calendarMode: CalendarMode;
  saints: string[];
  sourceUrl: string;
}) {
  const saints = Array.from(new Set(params.saints.map((saint) => saint.trim()).filter(Boolean)));
  if (!saints.length) return;

  const index = readDailySaintIndex();
  const nextDay: StoredDailySaintDay = {
    dateKey: params.dateKey,
    calendarMode: params.calendarMode,
    saints,
    sourceUrl: params.sourceUrl,
    updatedAt: Date.now(),
  };

  const days = index.days.filter(
    (day) => !(day.dateKey === params.dateKey && day.calendarMode === params.calendarMode),
  );
  writeDailySaintIndex({ days: [nextDay, ...days] });
}

function storedDailySaintResults(): LocalSaintNameResult[] {
  return readDailySaintIndex().days.flatMap((day) =>
    day.saints.map((name) => ({
      name,
      source: "daily" as const,
      dateKey: day.dateKey,
      calendarMode: day.calendarMode,
      sourceUrl: day.sourceUrl,
      updatedAt: day.updatedAt,
    })),
  );
}

function patronSaintNameResults(): LocalSaintNameResult[] {
  return patronNeeds.flatMap((item) =>
    item.search
      .split(/\s+(?:and|&)\s+|,\s*/i)
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ name, source: "patron" as const })),
  );
}

function scoreSaintName(result: LocalSaintNameResult, query: string) {
  const tokens = tokenizeSaintQuery(query);
  if (!tokens.length) return 0;

  const haystack = [result.name, result.dateKey, result.calendarMode].filter(Boolean).join(" ").toLowerCase();
  const normalizedQuery = normalizeName(query);
  const normalizedName = normalizeName(result.name);
  let score = normalizedName === normalizedQuery ? 20 : normalizedName.includes(normalizedQuery) ? 8 : 0;

  for (const token of tokens) {
    if (haystack.includes(token)) score += 2;
  }

  if (result.source === "today") score += 3;
  if (result.source === "patron") score += 1;

  return score;
}

export function searchLocalSaintNames(
  query: string,
  currentDaily?: { dateKey: string; calendarMode: CalendarMode; saints: string[]; sourceUrl: string },
  limit = 20,
) {
  const currentResults: LocalSaintNameResult[] = currentDaily
    ? currentDaily.saints.map((name) => ({
        name,
        source: "today",
        dateKey: currentDaily.dateKey,
        calendarMode: currentDaily.calendarMode,
        sourceUrl: currentDaily.sourceUrl,
        updatedAt: Date.now(),
      }))
    : [];

  const scored = [...currentResults, ...storedDailySaintResults(), ...patronSaintNameResults()]
    .map((result) => ({ result, score: scoreSaintName(result, query) }))
    .filter(({ score }) => score > 0);

  const deduped = new Map<string, { result: LocalSaintNameResult; score: number }>();
  for (const item of scored) {
    const key = normalizeName(item.result.name);
    const existing = deduped.get(key);
    if (!existing || item.score > existing.score || item.result.source === "today") deduped.set(key, item);
  }

  return Array.from(deduped.values())
    .sort((a, b) => b.score - a.score || (b.result.updatedAt ?? 0) - (a.result.updatedAt ?? 0) || a.result.name.localeCompare(b.result.name))
    .slice(0, limit)
    .map(({ result }) => result);
}

export function searchLocalSaintLibrary(
  query: string,
  currentDaily?: { dateKey: string; calendarMode: CalendarMode; saints: string[]; sourceUrl: string },
): LocalSaintSearchResults {
  return {
    patrons: query.trim()
      ? patronNeeds
          .map((item) => ({ item, score: scorePatronNeed(item, query) }))
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score || a.item.need.localeCompare(b.item.need))
          .map(({ item }) => item)
      : patronNeeds,
    saintNames: query.trim() ? searchLocalSaintNames(query, currentDaily) : [],
  };
}

export function getLocalSaintIndexStats() {
  const index = readDailySaintIndex();
  const names = new Set(index.days.flatMap((day) => day.saints.map(normalizeName)));
  return { days: index.days.length, saints: names.size };
}

export { findPatronNeeds };

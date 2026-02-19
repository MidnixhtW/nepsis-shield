import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

export type CalendarMode = "gregorian" | "julian";
export type Jurisdiction = "oca" | "goarch" | "antiochian" | "rocor";
export type AppLanguage = "en" | "el" | "ru" | "ar";

export type AppSettings = {
  calendarMode: CalendarMode;
  jurisdiction: Jurisdiction;
  language: AppLanguage;
  // If enabled, show a simple seasonal callout in Today/Prayer.
  seasonalHints: boolean;
};

const DEFAULT_SETTINGS: AppSettings = {
  calendarMode: "gregorian",
  jurisdiction: "oca",
  language: "en",
  seasonalHints: true,
};

function settingsKey() {
  return "app:settings";
}

export function getSettings(): AppSettings {
  const saved = getStoredItem<Partial<AppSettings>>(settingsKey());
  return { ...DEFAULT_SETTINGS, ...(saved ?? {}) } as AppSettings;
}

export function setSettings(next: AppSettings) {
  setStoredItem(settingsKey(), next, { ttlMs: 1000 * 60 * 60 * 24 * 365 * 2 });
}

export function updateSettings(patch: Partial<AppSettings>) {
  const cur = getSettings();
  setSettings({ ...cur, ...patch });
}

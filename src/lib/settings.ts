import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

export type CalendarMode = "gregorian" | "julian";
export type Jurisdiction = "oca" | "goarch" | "antiochian" | "rocor";
export type LanguagePref = "en" | "el" | "ru" | "ar";

export type ReminderPrefs = {
  enableNotifications: boolean; // best-effort; may be unsupported
  morningHour: number; // 0-23
  eveningHour: number; // 0-23
};

export type AppSettings = {
  calendarMode: CalendarMode;
  jurisdiction: Jurisdiction;
  language: LanguagePref;
  reminders: ReminderPrefs;
};

const KEY = "app:settings";

export const DEFAULT_SETTINGS: AppSettings = {
  calendarMode: "gregorian",
  jurisdiction: "oca",
  language: "en",
  reminders: {
    enableNotifications: false,
    morningHour: 7,
    eveningHour: 21,
  },
};

export function getSettings(): AppSettings {
  const stored = getStoredItem<Partial<AppSettings>>(KEY);
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    reminders: {
      ...DEFAULT_SETTINGS.reminders,
      ...(stored?.reminders ?? {}),
    },
  };
}

export function setSettings(next: AppSettings) {
  setStoredItem(KEY, next);
}

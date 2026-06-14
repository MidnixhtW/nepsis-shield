import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

export type CalendarMode = "gregorian" | "julian";
export type Jurisdiction = "oca" | "goarch" | "antiochian" | "rocor";
export type LanguagePref = "en" | "el" | "ru" | "ar";

export type ReminderPrefs = {
  enableNotifications: boolean;
  morningHour: number;
  eveningHour: number;
};

export type AccessibilityPrefs = {
  largeText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
};

export type PersonalizationPrefs = {
  showGroundingOnToday: boolean;
};

export type AppSettings = {
  calendarMode: CalendarMode;
  jurisdiction: Jurisdiction;
  language: LanguagePref;
  reminders: ReminderPrefs;
  accessibility: AccessibilityPrefs;
  personalization: PersonalizationPrefs;
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
  accessibility: {
    largeText: false,
    highContrast: false,
    reduceMotion: false,
  },
  personalization: {
    showGroundingOnToday: true,
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
    accessibility: {
      ...DEFAULT_SETTINGS.accessibility,
      ...(stored?.accessibility ?? {}),
    },
    personalization: {
      ...DEFAULT_SETTINGS.personalization,
      ...(stored?.personalization ?? {}),
    },
  };
}

export function setSettings(next: AppSettings) {
  setStoredItem(KEY, next);
}

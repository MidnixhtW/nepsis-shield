import { useEffect, useState } from "react";
import {
  getSettings,
  setSettings,
  type AppSettings,
  DEFAULT_SETTINGS,
  type ReminderPrefs,
} from "@/lib/settings";

const EVENT = "app:settings_changed";

export function broadcastSettingsChanged() {
  window.dispatchEvent(new Event(EVENT));
}

type SettingsPatch = Partial<Omit<AppSettings, "reminders">> & {
  reminders?: Partial<ReminderPrefs>;
};

export function useSettings() {
  const [settings, setState] = useState<AppSettings>(() => getSettings());

  useEffect(() => {
    function onChange() {
      setState(getSettings());
    }
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  function updateSettings(patch: SettingsPatch) {
    const prev = getSettings();
    const next: AppSettings = {
      ...prev,
      ...patch,
      reminders: {
        ...prev.reminders,
        ...(patch.reminders ?? {}),
      },
    };
    setSettings(next);
    broadcastSettingsChanged();
    setState(next);
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
    broadcastSettingsChanged();
    setState(DEFAULT_SETTINGS);
  }

  return { settings, updateSettings, resetSettings };
}
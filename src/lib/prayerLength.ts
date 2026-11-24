import { getStoredItem } from "@/lib/deviceStorage";
import { buildFlow, knownPrayerMode, savedFlowExtras, type PrayerMode, type PrayerTime } from "@/content/dailyPrayerSteps";

export const PRAYER_PREFS_KEY = "daily_prayer_flow:prefs";

export function savedPrayerMode(): PrayerMode {
  const saved = getStoredItem<{ mode?: PrayerMode }>(PRAYER_PREFS_KEY);
  return knownPrayerMode(saved?.mode) ?? "short";
}

// Minutes for the morning, evening or night prayers at the length the person chose, read slowly and aloud
// (about 110 words a minute). The Watch rule is a single minute.
export function prayerMinutes(time: PrayerTime, mode: PrayerMode = savedPrayerMode()) {
  if (mode === "watch") return 1;
  const words = buildFlow(time, mode, savedFlowExtras(getStoredItem<{ humility?: boolean }>(PRAYER_PREFS_KEY)))
    .reduce((sum, step) => sum + step.body.join(" ").split(/\s+/).length, 0);
  return Math.max(2, Math.round(words / 110));
}

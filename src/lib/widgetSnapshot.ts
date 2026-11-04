// What the Android home-screen widget shows: two weeks of days, so it stays right even if the app
// is not opened for a while. The widget reads this from the app's saved preferences and picks today.
import { Capacitor } from "@capacitor/core";
import { SAYINGS_SOURCE, sayingForDay } from "@/content/fathersSayings";
import { addDays, currentSeason, isoDate, nextSeason, type ChurchCalendar } from "@/lib/fastingSeasons";
import { feastGreeting } from "@/lib/feastGreetings";

export const WIDGET_KEY = "widget:today";
const DAYS = 14;

export type WidgetDay = {
  date: string; // yyyy-mm-dd, local
  headline: string; // the feast greeting, the season and its day, or the next fast
  detail: string; // a second line, such as today's fast
  saying: string;
  who: string;
};

function seasonLine(day: Date, calendar: ChurchCalendar) {
  const active = currentSeason(day, calendar);
  if (active) return `${active.season.name} · Day ${active.index + 1} of ${active.season.length}`;
  const upcoming = nextSeason(day, calendar);
  if (upcoming && upcoming.daysUntil <= 7) {
    return upcoming.daysUntil === 1 ? `${upcoming.season.name} begins tomorrow` : `${upcoming.season.name} begins in ${upcoming.daysUntil} days`;
  }
  return "";
}

export function buildWidgetDays(from: Date, calendar: ChurchCalendar, todayFast?: string): WidgetDay[] {
  return Array.from({ length: DAYS }, (_, i) => {
    const day = addDays(from, i);
    const greeting = feastGreeting(day, calendar);
    const season = seasonLine(day, calendar);
    const saying = sayingForDay(day);
    return {
      date: isoDate(day),
      headline: greeting ? `${greeting.greeting} ${greeting.response}` : season || "Watch and pray",
      detail: i === 0 && todayFast ? todayFast : greeting ? season : "",
      saying: saying.text,
      who: `${saying.who} · ${SAYINGS_SOURCE}`,
    };
  });
}

/** Save the widget's days on Android; does nothing on the website. */
export async function saveWidgetSnapshot(from: Date, calendar: ChurchCalendar, todayFast?: string) {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { Preferences } = await import("@capacitor/preferences");
    await Preferences.set({ key: WIDGET_KEY, value: JSON.stringify(buildWidgetDays(from, calendar, todayFast)) });
  } catch {
    // The widget simply keeps its last days; nothing to tell the user.
  }
}

import { Link } from "react-router";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoredItem } from "@/lib/deviceStorage";
import { buildFlow, knownPrayerMode, recommendedTime, savedFlowExtras, type PrayerMode, type PrayerTime } from "@/content/dailyPrayerSteps";
import { useDailyRhythm } from "@/lib/dailyHabits";
import { useFavorites } from "@/lib/favorites";
import { useNow } from "@/lib/prayerHours";
import { DayTimeline } from "@/components/app/DayTimeline";
import { ShieldTriggers } from "@/components/app/ShieldTriggers";

const LABELS: Record<PrayerTime, { title: string; line: string }> = {
  morning: { title: "Morning prayers", line: "Offer the day to God before the noise begins." },
  evening: { title: "Evening prayers", line: "Give thanks, look back on the day, and ask forgiveness." },
  night: { title: "Night prayers", line: "Commit sleep, body and soul into God's hands." },
};

const NEXT: Record<PrayerTime, PrayerTime | null> = { morning: "evening", evening: "night", night: null };

const PREFS_KEY = "daily_prayer_flow:prefs";

const MODE_NAMES: Record<PrayerMode, string> = {
  short: "Short",
  standard: "Standard",
  long: "Longer",
  seraphim: "St. Seraphim's rule",
  watch: "The Watch rule",
};

function savedMode(): PrayerMode {
  const saved = getStoredItem<{ mode?: PrayerMode }>(PREFS_KEY);
  return knownPrayerMode(saved?.mode) ?? "short";
}

// About 110 words a minute, read slowly and aloud.
function lengthFor(time: PrayerTime, mode: PrayerMode) {
  if (mode === "watch") return "About a minute.";
  const words = buildFlow(time, mode, savedFlowExtras(getStoredItem<{ humility?: boolean }>(PREFS_KEY))).reduce((sum, step) => sum + step.body.join(" ").split(/\s+/).length, 0);
  return `About ${Math.max(2, Math.round(words / 110))} minutes.`;
}

// The first thing on Today: the prayers for this hour, one tap from the full-screen reader.
export function PrayNowCard() {
  const now = useNow();
  const rhythm = useDailyRhythm();
  const favorites = useFavorites();
  const time = recommendedTime(now);
  // The length is chosen in the prayer itself (its options); Today names it and links there to change it.
  const mode = savedMode();
  const done = !!rhythm.today.prayers[time];
  const next = NEXT[time];

  return (
    <section aria-labelledby="pray-now-title" className="px-1 text-center">
      <h2 id="pray-now-title" className="text-3xl text-cinnabar sm:text-4xl">
        {LABELS[time].title}
      </h2>
      <p className="scripture-text mx-auto mt-2 max-w-md text-lg text-foreground/85">
        {done ? (next ? `Glory to God. ${LABELS[next].title} come later today.` : "Glory to God. Rest in peace tonight.") : LABELS[time].line}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Button asChild className="h-12 rounded-full px-8 text-base font-semibold" variant={done ? "outline" : "default"}>
          <Link to={`/pray?tab=daily&begin=${time}`}>
            {done ? <Check className="mr-2 h-4 w-4" /> : null}
            {done ? "Pray again" : "Begin"}
          </Link>
        </Button>
      </div>
      <p className="mt-3 text-sm text-foreground/75">
        {MODE_NAMES[mode]}, {lengthFor(time, mode).replace(/^About/, "about").replace(/\.$/, "")}.{" "}
        <Link to="/pray?tab=daily" className="font-semibold text-accent underline-offset-2 hover:underline">
          Change length
        </Link>
      </p>
      <div className="mt-4 text-left">
        <ShieldTriggers />
      </div>
      <div className="mt-5 text-left">
        <DayTimeline />
      </div>
      {favorites.length ? (
        <nav aria-label="Favorites" className="mt-4 flex flex-wrap justify-center gap-2 border-t border-border/50 pt-4">
          {favorites.slice(0, 6).map((favorite) => (
            <Link
              key={favorite.to}
              to={favorite.to}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-sm font-semibold hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Star aria-hidden className="h-3.5 w-3.5 fill-current text-accent" /> {favorite.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </section>
  );
}

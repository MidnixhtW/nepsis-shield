import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildFlow, knownPrayerMode, recommendedTime, type PrayerMode, type PrayerTime } from "@/content/dailyPrayerSteps";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDailyRhythm } from "@/lib/dailyHabits";
import { useFavorites } from "@/lib/favorites";
import { useNow } from "@/lib/prayerHours";

const LABELS: Record<PrayerTime, { title: string; line: string }> = {
  morning: { title: "Morning prayers", line: "Offer the day to God before the noise begins." },
  evening: { title: "Evening prayers", line: "Give thanks, look back on the day, and ask forgiveness." },
  night: { title: "Night prayers", line: "Commit sleep, body and soul into God's hands." },
};

const NEXT: Record<PrayerTime, PrayerTime | null> = { morning: "evening", evening: "night", night: null };

const PREFS_KEY = "daily_prayer_flow:prefs";

// The three rules people switch between most, one tap from Today. The full list stays in the prayer's options.
const QUICK_MODES: Array<{ id: PrayerMode; label: string }> = [
  { id: "standard", label: "Standard" },
  { id: "short", label: "Short" },
  { id: "watch", label: "Watch · 1 min" },
];

function savedMode(): PrayerMode {
  const saved = getStoredItem<{ mode?: PrayerMode }>(PREFS_KEY);
  return knownPrayerMode(saved?.mode) ?? "short";
}

function saveMode(mode: PrayerMode) {
  const saved = getStoredItem<Record<string, unknown>>(PREFS_KEY) ?? {};
  setStoredItem(PREFS_KEY, { ...saved, mode });
}

// About 110 words a minute, read slowly and aloud.
function lengthFor(time: PrayerTime, mode: PrayerMode) {
  if (mode === "watch") return "About a minute.";
  const words = buildFlow(time, mode).reduce((sum, step) => sum + step.body.join(" ").split(/\s+/).length, 0);
  return `About ${Math.max(2, Math.round(words / 110))} minutes.`;
}

// The first thing on Today: the prayers for this hour, one tap from the full-screen reader.
export function PrayNowCard() {
  const now = useNow();
  const rhythm = useDailyRhythm();
  const favorites = useFavorites();
  const time = recommendedTime(now);
  const [mode, setMode] = useState<PrayerMode>(savedMode);
  const done = !!rhythm.today.prayers[time];
  const next = NEXT[time];

  return (
    <section aria-labelledby="pray-now-title" className="rounded-3xl border border-accent/30 bg-card p-5 sm:p-6">
      <div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{done ? "Prayed today" : "Pray now"}</p>
          <h2 id="pray-now-title" className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">{LABELS[time].title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {done ? (next ? `Glory to God. ${LABELS[next].title} come later today.` : "Glory to God. Rest in peace tonight.") : `${LABELS[time].line} ${lengthFor(time, mode)}`}
          </p>
        </div>
      </div>
      <ToggleGroup
        type="single"
        aria-label="Rule for today"
        value={QUICK_MODES.some((item) => item.id === mode) ? mode : ""}
        onValueChange={(value) => {
          if (!value) return;
          setMode(value as PrayerMode);
          saveMode(value as PrayerMode);
        }}
        className="mt-4 flex flex-wrap justify-start gap-1.5"
      >
        {QUICK_MODES.map((item) => (
          <ToggleGroupItem
            key={item.id}
            value={item.id}
            className="h-9 rounded-full border border-border/60 px-3.5 text-sm data-[state=on]:border-accent/50 data-[state=on]:bg-accent/10"
          >
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button asChild className="h-11 rounded-full px-6 font-semibold" variant={done ? "outline" : "default"}>
          <Link to={`/pray?tab=daily&begin=${time}`}>
            {done ? <Check className="mr-2 h-4 w-4" /> : null}
            {done ? "Pray again" : "Begin"}
            {done ? null : <ArrowRight className="ml-2 h-4 w-4" />}
          </Link>
        </Button>
        <Button asChild variant="ghost" className="h-11 rounded-full px-4">
          <Link to="/pray">All prayer</Link>
        </Button>
      </div>
      {favorites.length ? (
        <nav aria-label="Favorites" className="mt-4 flex flex-wrap gap-2 border-t border-border/50 pt-4">
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

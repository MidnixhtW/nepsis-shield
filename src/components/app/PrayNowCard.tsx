import { Link } from "react-router";
import { ArrowRight, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildFlow, recommendedTime, type PrayerMode, type PrayerTime } from "@/content/dailyPrayerSteps";
import { getStoredItem } from "@/lib/deviceStorage";
import { useDailyRhythm } from "@/lib/dailyHabits";
import { useFavorites } from "@/lib/favorites";
import { ORTHODOX_ICONOGRAPHY } from "@/lib/orthodoxIconography";
import { useNow } from "@/lib/prayerHours";

const LABELS: Record<PrayerTime, { title: string; line: string }> = {
  morning: { title: "Morning prayers", line: "Offer the day to God before the noise begins." },
  evening: { title: "Evening prayers", line: "Give thanks, look back on the day, and ask forgiveness." },
  night: { title: "Night prayers", line: "Commit sleep, body and soul into God's hands." },
};

const NEXT: Record<PrayerTime, PrayerTime | null> = { morning: "evening", evening: "night", night: null };

function savedMode(): PrayerMode {
  const saved = getStoredItem<{ mode?: PrayerMode }>("daily_prayer_flow:prefs");
  return saved?.mode && saved.mode !== "personal" && saved.mode !== "seraphim" ? saved.mode : "short";
}

// About 110 words a minute, read slowly and aloud.
function minutesFor(time: PrayerTime, mode: PrayerMode) {
  const words = buildFlow(time, mode).reduce((sum, step) => sum + step.body.join(" ").split(/\s+/).length, 0);
  return Math.max(2, Math.round(words / 110));
}

// The first thing on Today: the prayers for this hour, one tap from the full-screen reader.
export function PrayNowCard() {
  const now = useNow();
  const rhythm = useDailyRhythm();
  const favorites = useFavorites();
  const time = recommendedTime(now);
  const mode = savedMode();
  const done = !!rhythm.today.prayers[time];
  const next = NEXT[time];
  const icon = ORTHODOX_ICONOGRAPHY.deesis;

  return (
    <section aria-labelledby="pray-now-title" className="rounded-3xl border border-accent/30 bg-card p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{done ? "Prayed today" : "Pray now"}</p>
          <h1 id="pray-now-title" className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">{LABELS[time].title}</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {done ? (next ? `Glory to God. ${LABELS[next].title} come later today.` : "Glory to God. Rest in peace tonight.") : `${LABELS[time].line} About ${minutesFor(time, mode)} minutes.`}
          </p>
        </div>
        <img src={icon.imageUrl} alt={icon.alt} title={icon.credit} className="w-16 shrink-0 rounded-lg object-contain shadow-md sm:w-20" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
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
      <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
        Icon: <a href={icon.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">{icon.credit}</a>
      </p>
    </section>
  );
}

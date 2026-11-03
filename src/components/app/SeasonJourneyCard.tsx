import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Check, ChevronDown, ExternalLink, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import {
  addDays,
  currentSeason,
  journeyDay,
  nextSeason,
  type ChurchCalendar,
  type JourneyDay,
  type SeasonInstance,
} from "@/lib/fastingSeasons";
import { cn } from "@/lib/utils";

const STORE_KEY = "fasting-journeys:v1";
/** Show the next season on Today once it is this close. */
const UPCOMING_WINDOW_DAYS = 30;

type JourneyStore = Record<string, number[]>;

function readStore(): JourneyStore {
  return getStoredItem<JourneyStore>(STORE_KEY) ?? {};
}

function DayBody({ day }: { day: JourneyDay }) {
  return (
    <div className="grid gap-4">
      <p className="text-sm leading-relaxed text-muted-foreground">{day.theme}</p>
      {day.prayer ? (
        <figure className="rounded-2xl border border-border/60 bg-background/45 p-4">
          <blockquote className="scripture-text text-[1.05rem] text-foreground/95">{day.prayer.text}</blockquote>
          <figcaption className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{day.prayer.source}</figcaption>
        </figure>
      ) : null}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Today's practice</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground/90">{day.practice}</p>
      </div>
      {day.link ? (
        <a
          href={day.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent underline-offset-2 hover:underline"
        >
          {day.link.label} <ExternalLink aria-hidden className="h-3.5 w-3.5" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : null}
    </div>
  );
}

function JourneyList({
  season,
  calendar,
  todayIndex,
  kept,
}: {
  season: SeasonInstance;
  calendar: ChurchCalendar;
  todayIndex: number;
  kept: number[];
}) {
  return (
    <ol className="mt-3 grid max-h-80 gap-1 overflow-y-auto pr-1">
      {Array.from({ length: season.length }, (_, index) => {
        const day = journeyDay(season, index, calendar);
        const isToday = index === todayIndex;
        return (
          <li
            key={index}
            aria-current={isToday ? "date" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm",
              isToday ? "bg-accent/10 text-foreground" : "text-muted-foreground",
            )}
          >
            <span className="w-16 shrink-0 text-xs tabular-nums">{format(addDays(season.start, index), "EEE d MMM")}</span>
            <span className="min-w-0 flex-1 truncate">{day.title}</span>
            {kept.includes(index) ? <Check aria-label="Kept" className="h-4 w-4 shrink-0 text-accent" /> : null}
          </li>
        );
      })}
    </ol>
  );
}

// The current fasting season's day, with a gentle "kept today" mark; or the next season when it is close.
export function SeasonJourneyCard({ today, calendar }: { today: Date; calendar: ChurchCalendar }) {
  const [store, setStore] = useState<JourneyStore>(readStore);
  const [showAll, setShowAll] = useState(false);
  const active = useMemo(() => currentSeason(today, calendar), [today, calendar]);
  const upcoming = useMemo(() => (active ? null : nextSeason(today, calendar)), [active, today, calendar]);

  if (active) {
    const { season, index } = active;
    const day = journeyDay(season, index, calendar);
    const kept = store[season.key] ?? [];
    const keptToday = kept.includes(index);

    function toggleKept() {
      const next = keptToday ? kept.filter((value) => value !== index) : [...kept, index].sort((a, b) => a - b);
      const updated = { ...store, [season.key]: next };
      setStoredItem(STORE_KEY, updated);
      setStore(updated);
    }

    return (
      <Card className="candlelight-card rounded-[2rem] border p-5 sm:p-7" aria-labelledby="season-journey-title">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          <CalendarDays className="h-3.5 w-3.5" /> {season.name} · Day {index + 1} of {season.length}
        </p>
        <h2 id="season-journey-title" className="mt-3 text-3xl font-semibold tracking-tight">{day.title}</h2>
        <div className="mt-4">
          <DayBody day={day} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant={keptToday ? "outline" : "default"}
            aria-pressed={keptToday}
            className="rounded-full"
            onClick={toggleKept}
          >
            <Check className="mr-2 h-4 w-4" /> {keptToday ? "Kept today" : "Mark today as kept"}
          </Button>
          <span className="text-xs text-muted-foreground">
            {kept.length} of {season.length} days kept · no pressure, just a quiet record
          </span>
        </div>
        <Progress value={(kept.length / season.length) * 100} aria-label={`${kept.length} of ${season.length} days kept`} className="mt-3 h-1.5" />

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {season.fastingNote}
        </p>

        <button
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll((open) => !open)}
          className="mt-4 inline-flex items-center gap-1 rounded-md text-sm font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          See the whole journey <ChevronDown className={cn("h-4 w-4 transition-transform", showAll && "rotate-180")} />
        </button>
        {showAll ? <JourneyList season={season} calendar={calendar} todayIndex={index} kept={kept} /> : null}
      </Card>
    );
  }

  if (upcoming && upcoming.daysUntil <= UPCOMING_WINDOW_DAYS) {
    const { season, daysUntil } = upcoming;
    const firstDay = journeyDay(season, 0, calendar);
    return (
      <Card className="rounded-[2rem] border p-5 sm:p-6" aria-labelledby="season-journey-title">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          <CalendarDays className="h-3.5 w-3.5" /> Coming up · {daysUntil === 1 ? "tomorrow" : `in ${daysUntil} days`}
        </p>
        <h2 id="season-journey-title" className="mt-2 text-2xl font-semibold tracking-tight">
          {season.name} begins {format(season.start, "EEEE, MMMM d")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{season.summary}</p>
        <button
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll((open) => !open)}
          className="mt-3 inline-flex items-center gap-1 rounded-md text-sm font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Preview the journey <ChevronDown className={cn("h-4 w-4 transition-transform", showAll && "rotate-180")} />
        </button>
        {showAll ? (
          <div className="mt-4 grid gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Day 1</p>
              <h3 className="mt-1 text-xl font-semibold">{firstDay.title}</h3>
              <div className="mt-3">
                <DayBody day={firstDay} />
              </div>
            </div>
            <JourneyList season={season} calendar={calendar} todayIndex={-1} kept={[]} />
          </div>
        ) : null}
      </Card>
    );
  }

  return null;
}

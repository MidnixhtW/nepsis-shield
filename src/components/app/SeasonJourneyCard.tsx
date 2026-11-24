import { useEffect, useMemo, useState, type FormEvent } from "react";
import { format } from "date-fns";
import { Link } from "react-router";
import { BellRing, CalendarDays, Check, ChevronDown, ExternalLink, Leaf, Share2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import {
  addDays,
  currentSeason,
  journeyDay,
  nextSeason,
  FEAST_AFTER_FAST,
  recentlyEndedFast,
  upcomingFasts,
  type ChurchCalendar,
  type JourneyDay,
  type SeasonInstance,
} from "@/lib/fastingSeasons";
import { createAllDayEventsIcs, downloadTextFile } from "@/lib/ics";
import { PUBLIC_SITE_URL } from "@/lib/publicSite";
import { isNativeReminderUnavailable, scheduleSeasonReminders } from "@/lib/systemPrayerReminders";
import { cn } from "@/lib/utils";
import { startsOpenOnWideScreen } from "@/lib/wideScreen";
import { COUNTED_FASTS, getFastCount, keepFastTogether, keptOnThisDevice, type FastCounts } from "@/lib/fastCount";
import { PARISH_CHANGED_EVENT, getParish, newParishCode, parishLink, setParish, type Parish } from "@/lib/parish";
import { Input } from "@/components/ui/input";
import { showError, showSuccess } from "@/utils/toast";

const STORE_KEY = "fasting-journeys:v1";
/** True once native fast reminders are on, so they can be rolled forward each time the app opens. */
const FAST_REMINDERS_KEY = "fasting-journeys:native-reminders";

function fastReminders(today: Date, calendar: ChurchCalendar) {
  return upcomingFasts(today, calendar).map((season) => {
    const at = addDays(season.start, -1);
    at.setHours(19, 0, 0, 0);
    return { season, title: `${season.name} begins tomorrow`, body: season.summary, at };
  });
}

// Invite others into the season: the phone's share sheet where available, otherwise copy the text.
function ShareSeasonButton({ season }: { season: SeasonInstance }) {
  async function share() {
    const url = `${PUBLIC_SITE_URL}/today`;
    const text = `I'm keeping the ${season.name} with Nepsis Shield, a free Orthodox companion: a short prayer and practice for each day, the saints, and a quiet record. No account needed.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${season.name} with Nepsis Shield`, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      showSuccess("Invitation copied. Paste it anywhere to share.");
    } catch (error) {
      // Closing the share sheet is not an error worth reporting.
      if ((error as Error)?.name !== "AbortError") showError("Couldn't share right now.");
    }
  }

  return (
    <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={() => void share()}>
      <Share2 className="mr-2 h-4 w-4" /> Invite someone
    </Button>
  );
}

// Android app: notifications the evening before each fast. Website: a calendar file with the fasts.
function FastRemindersButton({ today, calendar }: { today: Date; calendar: ChurchCalendar }) {
  const [nativeOn, setNativeOn] = useState(() => getStoredItem<boolean>(FAST_REMINDERS_KEY) === true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (nativeOn) void scheduleSeasonReminders(fastReminders(today, calendar));
  }, [nativeOn, today, calendar]);

  async function enable() {
    setBusy(true);
    try {
      const reminders = fastReminders(today, calendar);
      const result = await scheduleSeasonReminders(reminders);
      if (result.ok) {
        setStoredItem(FAST_REMINDERS_KEY, true);
        setNativeOn(true);
        showSuccess(`You'll be reminded the evening before each fast (${reminders.length} in the next year).`);
        return;
      }
      if (isNativeReminderUnavailable(result)) {
        const ics = createAllDayEventsIcs(
          reminders.map(({ season }) => ({
            uid: season.key,
            title: season.name,
            description: `${season.summary} ${season.fastingNote}`,
            date: season.start,
          })),
        );
        downloadTextFile("orthodox-fasts.ics", ics, "text/calendar");
        showSuccess("Calendar file downloaded. Open it to add the fasts, with an alert the evening before each.");
        return;
      }
      showError(
        "reason" in result && result.reason === "permission-denied"
          ? "Notifications are turned off for Nepsis Shield. Allow them in your phone's settings."
          : "Couldn't set fast reminders.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (nativeOn) {
    return (
      <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <BellRing className="h-3.5 w-3.5 text-accent" /> Fast reminders are on
      </p>
    );
  }
  return (
    <Button type="button" variant="outline" size="sm" className="rounded-full" disabled={busy} onClick={() => void enable()}>
      <BellRing className="mr-2 h-4 w-4" /> Remind me when fasts begin
    </Button>
  );
}
// "Keeping the fast together": an anonymous count of people keeping this fast with the app.
// Hidden when the count service is off or unreachable.
function KeepingTogether({ season }: { season: SeasonInstance }) {
  const [counts, setCounts] = useState<FastCounts | null>(null);
  const [kept, setKept] = useState(() => keptOnThisDevice(season));
  const [busy, setBusy] = useState(false);
  const [parish, setParishState] = useState<Parish | null>(getParish);
  const [naming, setNaming] = useState(false);
  const [parishName, setParishName] = useState("");
  const counted = COUNTED_FASTS.includes(season.id);

  useEffect(() => {
    if (!counted) return;
    let alive = true;
    void getFastCount(season).then((value) => {
      if (alive) setCounts(value);
    });
    return () => {
      alive = false;
    };
    // The season instance is rebuilt each render; its key names the same fast. A new parish means new counts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season.key, counted, parish?.code]);

  useEffect(() => {
    const refresh = () => {
      setParishState(getParish());
      setKept(keptOnThisDevice(season));
    };
    window.addEventListener(PARISH_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PARISH_CHANGED_EVENT, refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season.key]);

  if (!counted || counts === null) return null;

  async function join() {
    setBusy(true);
    const next = await keepFastTogether(season);
    setBusy(false);
    if (next === null) {
      showError("Couldn't add you right now. Please try again.");
      return;
    }
    setCounts(next);
    setKept(true);
  }

  async function shareParish(target: Parish) {
    const url = parishLink(target);
    const text = `Keep the fasts with ${target.name} in Nepsis Shield. Open this link on your phone:`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${target.name}: keeping the fasts`, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      showSuccess("Parish link copied. Send it to your parish group.");
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") showError("Couldn't share right now.");
    }
  }

  function startParish(event: FormEvent) {
    event.preventDefault();
    const name = parishName.trim().slice(0, 60);
    if (!name) return;
    const created = { code: newParishCode(), name };
    setParish(created);
    setNaming(false);
    void shareParish(created);
  }

  const { count, parishCount } = counts;
  const others = Math.max(0, count - (kept ? 1 : 0));
  const parishOthers = Math.max(0, (parishCount ?? 0) - (kept ? 1 : 0));
  const line = parish
    ? kept
      ? parishOthers > 0
        ? `You and ${parishOthers.toLocaleString()} from ${parish.name} are keeping the ${season.name} together.`
        : `You're the first from ${parish.name} keeping the ${season.name}. Share the parish link.`
      : (parishCount ?? 0) > 0
        ? `${(parishCount ?? 0).toLocaleString()} from ${parish.name} ${(parishCount ?? 0) === 1 ? "is" : "are"} keeping the ${season.name}.`
        : `Be the first from ${parish.name} to keep the ${season.name}.`
    : kept
      ? others > 0
        ? `You and ${others.toLocaleString()} ${others === 1 ? "other" : "others"} are keeping the ${season.name} together.`
        : `You're the first keeping the ${season.name} here. Invite someone to join you.`
      : count > 0
        ? `${count.toLocaleString()} ${count === 1 ? "person is" : "people are"} keeping the ${season.name} with Nepsis Shield.`
        : `Be the first to keep the ${season.name} together.`;

  return (
    <div className="mt-3 rounded-2xl border border-accent/25 bg-accent/5 px-3.5 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <Users aria-hidden className="h-4 w-4 shrink-0 text-accent" />
        <p role="status" className="min-w-0 flex-1 text-sm">{line}</p>
        {kept ? null : (
          <Button type="button" size="sm" variant="outline" className="rounded-full" disabled={busy} onClick={() => void join()}>
            I'm keeping it
          </Button>
        )}
      </div>
      {parish ? (
        <Button type="button" variant="link" size="sm" className="h-auto min-h-11 px-0 text-accent" onClick={() => void shareParish(parish)}>
          Share the {parish.name} link
        </Button>
      ) : naming ? (
        <form onSubmit={startParish} className="mt-2 flex flex-wrap gap-2">
          <Input
            value={parishName}
            onChange={(event) => setParishName(event.target.value)}
            placeholder="Parish name, e.g. St Nicholas"
            aria-label="Parish name"
            maxLength={60}
            className="min-w-0 flex-1"
          />
          <Button type="submit" size="sm" className="rounded-full" disabled={!parishName.trim()}>
            Make the link
          </Button>
        </form>
      ) : (
        <Button type="button" variant="link" size="sm" className="h-auto min-h-11 px-0 text-accent" onClick={() => setNaming(true)}>
          Keep the fasts with your parish
        </Button>
      )}
    </div>
  );
}


// For the first days after a fast: the feast it led to, and the journey kept, without a score. The feast's own greeting
// ("Christ is born!") is on the feast-greeting card, so it is not repeated here.
function FastEnding({ season, kept }: { season: SeasonInstance; kept: number[] }) {
  return (
    <Card className="candlelight-card rounded-[2rem] border p-5 text-center sm:p-7" aria-labelledby="season-ending-title">
      <h2 id="season-ending-title" className="text-3xl">
        {FEAST_AFTER_FAST[season.id] ?? season.name}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">The {season.name} is complete.</p>
      <p className="mt-3 text-sm text-muted-foreground">
        The feast is for everyone, whatever the fast was.
      </p>
    </Card>
  );
}

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
          <figcaption className="mt-2 text-xs font-semibold text-accent">{day.prayer.source}</figcaption>
        </figure>
      ) : null}
      <div>
        <p className="text-xs font-semibold text-accent">Today's practice</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground/90">{day.practice}</p>
      </div>
      {day.link?.href.startsWith("/") ? (
        <Link to={day.link.href} className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent underline-offset-2 hover:underline">
          {day.link.label}
        </Link>
      ) : day.link ? (
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
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ol className="mt-3 grid max-h-[28rem] gap-1 overflow-y-auto pr-1">
      {Array.from({ length: season.length }, (_, index) => {
        const day = journeyDay(season, index, calendar);
        const isToday = index === todayIndex;
        const expanded = open === index;
        return (
          <li key={index} aria-current={isToday ? "date" : undefined}>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : index)}
              className={cn(
                "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isToday ? "bg-accent/10 text-foreground" : "text-muted-foreground",
              )}
            >
              <span className="w-16 shrink-0 text-xs tabular-nums">{format(addDays(season.start, index), "EEE d MMM")}</span>
              <span className="min-w-0 flex-1 truncate">{day.title}</span>
              {kept.includes(index) ? <Check aria-label="Kept" className="h-4 w-4 shrink-0 text-accent" /> : null}
              <ChevronDown aria-hidden className={cn("h-4 w-4 shrink-0 transition-transform", expanded && "rotate-180")} />
            </button>
            {expanded ? (
              <div className="px-3 pb-3 pt-2">
                <DayBody day={day} />
              </div>
            ) : null}
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
  const [bodyOpen, setBodyOpen] = useState(startsOpenOnWideScreen);
  const active = useMemo(() => currentSeason(today, calendar), [today, calendar]);
  const upcoming = useMemo(() => (active ? null : nextSeason(today, calendar)), [active, today, calendar]);
  const ended = useMemo(() => (active ? null : recentlyEndedFast(today, calendar)), [active, today, calendar]);

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
      <section className="border-t border-border/60 px-1 py-7" aria-labelledby="season-journey-title">
        <p className="text-sm font-semibold text-cinnabar">The fast</p>
        <h2 id="season-journey-title" className="mt-1 text-2xl sm:text-3xl">{day.title}</h2>
        {bodyOpen ? (
          <div id="season-day-body" className="mt-4">
            <DayBody day={day} />
          </div>
        ) : (
          // On a phone the day's verse and practice start folded, so the kept mark sits close to the title.
          <button
            type="button"
            aria-expanded={false}
            aria-controls="season-day-body"
            onClick={() => setBodyOpen(true)}
            className="mt-2 inline-flex min-h-11 items-center gap-1 rounded-md text-sm font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Today&rsquo;s verse and practice <ChevronDown aria-hidden className="h-4 w-4" />
          </button>
        )}

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
          {keptToday ? <span className="text-sm text-muted-foreground">Glory to God.</span> : null}
        </div>

        <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
          <Leaf className="mt-1 h-3.5 w-3.5 shrink-0" /> {season.fastingNote}
        </p>

        <KeepingTogether season={season} />
        {/* One main action stays in view; sharing and reminders live with the full journey. */}
        <button
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll((open) => !open)}
          className="mt-4 inline-flex min-h-11 items-center gap-1 rounded-md text-sm font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          See the whole journey <ChevronDown className={cn("h-4 w-4 transition-transform", showAll && "rotate-180")} />
        </button>
        {showAll ? (
          <>
            <Link to={`/fasts/${season.id}`} className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-accent underline-offset-2 hover:underline">
              About the {season.name}: dates and how it is kept
            </Link>
            <JourneyList season={season} calendar={calendar} todayIndex={index} kept={kept} />
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
              <ShareSeasonButton season={season} />
              <FastRemindersButton today={today} calendar={calendar} />
            </div>
          </>
        ) : null}
      </section>
    );
  }

  if (ended) {
    return <FastEnding season={ended.season} kept={store[ended.season.key] ?? []} />;
  }

  if (upcoming && upcoming.daysUntil <= UPCOMING_WINDOW_DAYS) {
    const { season, daysUntil } = upcoming;
    const firstDay = journeyDay(season, 0, calendar);
    return (
      <Card className="rounded-[2rem] border p-5 sm:p-6" aria-labelledby="season-journey-title">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
          <CalendarDays className="h-3.5 w-3.5" /> Coming up · {daysUntil === 1 ? "tomorrow" : `in ${daysUntil} days`}
        </p>
        <h2 id="season-journey-title" className="mt-2 text-2xl font-semibold tracking-tight">
          {season.name} begins {format(season.start, "EEEE, MMMM d")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{season.summary}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            aria-expanded={showAll}
            onClick={() => setShowAll((open) => !open)}
            className="inline-flex items-center gap-1 rounded-md text-sm font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Preview the journey <ChevronDown className={cn("h-4 w-4 transition-transform", showAll && "rotate-180")} />
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <ShareSeasonButton season={season} />
            <FastRemindersButton today={today} calendar={calendar} />
          </div>
        </div>
        <KeepingTogether season={season} />
        {showAll ? (
          <div className="mt-4 grid gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Day 1</p>
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

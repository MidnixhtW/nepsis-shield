import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { useDailyCalendar } from "@/hooks/useDailyCalendar";
import { useCurrentDay } from "@/hooks/useCurrentDay";
import { DailyContentStatus } from "@/components/app/DailyContentStatus";
import { format } from "date-fns";
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Leaf,
  Maximize2,
  Moon,
  MoonStar,
  RotateCcw,
  Sparkles,
  Sun,
  Sunset,
  Type,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { COMMEMORATIONS_CHANGED_EVENT, commemorationStep, getCommemorations } from "@/lib/commemorations";
import {
  clearPrayerResume,
  getPrayerResume,
  markPrayerComplete,
  savePrayerResume,
  useDailyRhythm,
} from "@/lib/dailyHabits";
import { showSuccess } from "@/utils/toast";
import { buildFlow, recommendedTime, type PrayerTime, type PrayerMode, type ReaderPrefs } from "@/content/dailyPrayerSteps";

const FLOW_PREFS_KEY = "daily_prayer_flow:prefs";

const DEFAULT_READER_PREFS: ReaderPrefs = {
  focus: false,
  largeText: false,
  night: false,
};

const prayerMeta: Record<PrayerTime, { label: string; icon: ReactNode; hint: string }> = {
  morning: {
    label: "Morning",
    icon: <Sun className="h-4 w-4" />,
    hint: "Offer the day to God before the noise begins.",
  },
  evening: {
    label: "Evening",
    icon: <Sunset className="h-4 w-4" />,
    hint: "Give thanks, examine the day, and ask forgiveness.",
  },
  night: {
    label: "Night",
    icon: <MoonStar className="h-4 w-4" />,
    hint: "Commit sleep, body, and soul into God’s hands.",
  },
};

function fastingLabel(description: string, exception?: string) {
  return exception ? `${description} · ${exception}` : description;
}

function BeginTodayCalendar() {
  const { today, query: q, retry } = useDailyCalendar();

  if (q.isLoading) {
    return (
      <div className="rounded-3xl border border-border/60 bg-card p-5 text-sm text-muted-foreground shadow-sm">
        Loading today’s fasting and saints…
      </div>
    );
  }

  if (!q.data) {
    return <DailyContentStatus date={today} failed={true} refreshing={q.isFetching} onRetry={retry} />;
  }

  const saints = q.data.saints.slice(0, 4);
  const firstSaint = saints[0];

  return (
    <Card className="overflow-hidden rounded-3xl border-primary/20 bg-card shadow-sm">
      <DailyContentStatus date={today} data={q.data} failed={q.isError} refreshing={q.isFetching} onRetry={retry} />
      <div className="border-b border-border/60 bg-primary/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Before you begin</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight">Today in the Church</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Let the calendar set the tone: fasting teaches watchfulness, and the saints remind us we never pray alone.
        </p>
      </div>

      <div className="grid gap-0 divide-y divide-border/60 md:grid-cols-2 md:divide-x md:divide-y-0">
        <section className="p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-500/12 text-amber-700 dark:text-amber-200">
              <Leaf className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Fasting today</p>
              <p className="mt-1 text-sm font-semibold leading-relaxed">
                {fastingLabel(q.data.fasting.description, q.data.fasting.exception)}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Follow your parish calendar, health needs, and priest’s blessing.
              </p>
            </div>
          </div>
        </section>

        <section className="p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Saints of the day</p>
              <div className="mt-1 grid gap-1.5">
                {saints.length ? (
                  saints.map((saint) => (
                    <p key={saint} className="text-sm leading-relaxed">
                      {saint}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">See today’s calendar commemorations.</p>
                )}
              </div>
              {firstSaint ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 h-auto min-h-9 rounded-2xl border-border/60 bg-background/60 text-xs"
                  asChild
                >
                  <a href={`https://www.oca.org/saints/lives?search=${encodeURIComponent(firstSaint)}`} target="_blank" rel="noopener noreferrer"><span className="sr-only"> (opens in a new tab) </span>
                    Read first life <ExternalLink aria-hidden="true" className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </Card>
  );
}

function PrayerFlowSteps({ current }: { current: number }) {
  const items = ["Prepare", "Pray", "Continue"];

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item, index) => {
        const active = index === current;
        const complete = index < current;
        return (
          <div
            key={item}
            aria-current={active ? "step" : undefined}
            className={
              "rounded-2xl border px-3 py-2 text-center text-xs font-semibold transition-colors " +
              (active
                ? "border-primary/40 bg-primary/10 text-primary"
                : complete
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                  : "border-border/60 bg-muted/20 text-muted-foreground")
            }
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}

export function DailyPrayerFlow() {
  const [time, setTime] = useState<PrayerTime>(() => recommendedTime());
  const [mode, setMode] = useState<PrayerMode>("short");
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [readerPrefs, setReaderPrefs] = useState<ReaderPrefs>(DEFAULT_READER_PREFS);
  const [hydrated, setHydrated] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const today = useCurrentDay();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusNextStep = useRef(false);
  const rhythm = useDailyRhythm();

  useEffect(() => {
    const saved = getStoredItem<{ time?: PrayerTime; mode?: PrayerMode; readerPrefs?: ReaderPrefs }>(FLOW_PREFS_KEY);
    if (saved?.time) setTime(saved.time);
    if (saved?.mode) setMode(saved.mode);
    if (saved?.readerPrefs) setReaderPrefs({ ...DEFAULT_READER_PREFS, ...saved.readerPrefs });

    const resume = getPrayerResume();
    if (resume) {
      setTime(resume.time);
      setMode(resume.mode);
      setStepIndex(resume.stepIndex);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setStoredItem(FLOW_PREFS_KEY, { time, mode, readerPrefs });
  }, [hydrated, mode, readerPrefs, time]);

  const [names, setNames] = useState(getCommemorations);
  useEffect(() => {
    const refresh = () => setNames(getCommemorations());
    window.addEventListener(COMMEMORATIONS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(COMMEMORATIONS_CHANGED_EVENT, refresh);
  }, []);
  // Names from the Names tab are prayed just before the closing prayer.
  const steps = useMemo(() => {
    const flow = buildFlow(time, mode);
    const remember = commemorationStep(names);
    return remember ? [...flow.slice(0, -1), remember, flow[flow.length - 1]] : flow;
  }, [time, mode, names]);
  const progressKey = `${format(today, "yyyy-MM-dd")}:${time}:${mode}`;
  const storedPrayerKey = mode === "personal" ? "personal" : time;
  const done = completed[progressKey] ?? !!rhythm.today.prayers[storedPrayerKey];
  const current = steps[Math.min(stepIndex, steps.length - 1)];
  const progress = done ? 100 : Math.round(((stepIndex + 1) / steps.length) * 100);
  const flowStage = done ? 2 : stepIndex === 0 ? 0 : 1;

  useEffect(() => {
    if (!focusNextStep.current) return;
    headingRef.current?.focus();
    focusNextStep.current = false;
  }, [stepIndex, done, progressKey]);

  // Read aloud: the device's own voice reads each step while the full-screen view is open.
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const [readingAloud, setReadingAloud] = useState(false);
  useEffect(() => {
    if (!canSpeak) return;
    window.speechSynthesis.cancel();
    if (!readingAloud || !immersive) return;
    // "(3x)" markers are for the eye; read the words, not the count.
    const text = [current.title, ...current.body].join(". ").replace(/\(\s*\d+x\s*\)/gi, "");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }, [canSpeak, readingAloud, immersive, current]);
  useEffect(() => {
    if (!immersive) setReadingAloud(false);
  }, [immersive]);

  useEffect(() => {
    if (!hydrated || done) return;
    savePrayerResume({
      time,
      mode,
      stepIndex: Math.min(stepIndex, steps.length - 1),
      totalSteps: steps.length,
      title: current.title,
    });
  }, [current.title, done, hydrated, mode, stepIndex, steps.length, time]);

  function start(nextTime: PrayerTime) {
    setTime(nextTime);
    setStepIndex(0);
  }

  function goBack() {
    focusNextStep.current = true;
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    focusNextStep.current = true;
    if (stepIndex >= steps.length - 1) {
      setCompleted((prev) => ({ ...prev, [progressKey]: true }));
      markPrayerComplete(mode === "personal" ? "personal" : time, mode);
      showSuccess("Prayer marked complete for today.");
      setImmersive(false);
      return;
    }
    // Beginning the prayer opens the distraction-free view.
    if (stepIndex === 0) setImmersive(true);
    setStepIndex((i) => i + 1);
  }

  const nextLabel = stepIndex >= steps.length - 1 ? "Mark complete" : stepIndex === 0 ? "Begin prayer" : "Next";
  const nextIcon = stepIndex >= steps.length - 1 ? <Check className="ml-2 h-4 w-4" /> : <ChevronRight className="ml-2 h-4 w-4" />;

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight">Daily Prayer Flow</h2>
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {mode === "personal" ? "Developer's Rule" : mode === "seraphim" ? "St. Seraphim's rule" : prayerMeta[time].label}
              </Badge>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Set the rule, receive today’s Church calendar, then pray one step at a time.
            </p>
          </div>
          <div className="grid gap-2">
            <PrayerFlowSteps current={flowStage} />
            <p className="text-xs leading-relaxed text-muted-foreground lg:text-right">
              Keep the movement simple: prepare the heart, pray the rule, then carry it into the day.
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3 md:grid-cols-3">
          {(Object.keys(prayerMeta) as PrayerTime[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={time === key}
              className={
                "tap rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                (time === key
                  ? "border-primary/40 bg-primary/10"
                  : "border-border/60 bg-background/50 hover:bg-background/80")
              }
              onClick={() => start(key)}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                  {prayerMeta[key].icon}
                </span>
                {prayerMeta[key].label}
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                {prayerMeta[key].hint}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 rounded-2xl border border-border/60 bg-background/45 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold">Prayer rule length</p>
              <p className="mt-1 text-xs text-muted-foreground">
                St. Seraphim's rule for shifts and deployments, short for busy days, standard for normal use, longer when you have room, or the developer's rule for a fuller Orthodox anchor.
              </p>
            </div>
            <ToggleGroup
              type="single"
              aria-label="Prayer rule length"
              value={mode}
              onValueChange={(value) => {
                if (!value) return;
                setMode(value as PrayerMode);
                setStepIndex(0);
              }}
              className="flex-wrap justify-start gap-2"
            >
              {[
                ["seraphim", "St. Seraphim"],
                ["short", "Short"],
                ["standard", "Standard"],
                ["long", "Longer"],
                ["personal", "Developer's Rule"],
              ].map(([value, label]) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  className="rounded-2xl border border-border/60 px-3 data-[state=on]:border-primary/40 data-[state=on]:bg-primary/10"
                >
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-3 py-2">

              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Eye className="h-4 w-4 text-primary" /> Focus
              </span>
              <Switch
                aria-label="Focus prayer reading"
                checked={readerPrefs.focus}
                onCheckedChange={(checked) => setReaderPrefs((p) => ({ ...p, focus: checked }))}
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Type className="h-4 w-4 text-primary" /> Large text
              </span>
              <Switch
                aria-label="Large prayer text"
                checked={readerPrefs.largeText}
                onCheckedChange={(checked) => setReaderPrefs((p) => ({ ...p, largeText: checked }))}
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Moon className="h-4 w-4 text-primary" /> Night
              </span>
              <Switch
                aria-label="Night prayer reading"
                checked={readerPrefs.night}
                onCheckedChange={(checked) => setReaderPrefs((p) => ({ ...p, night: checked }))}
              />
            </label>
          </div>
        </div>
      </Card>

      {stepIndex === 0 && !done ? <BeginTodayCalendar /> : null}

      <Card
        className={
          "rounded-3xl border-border/60 p-5 shadow-sm transition-colors " +
          (readerPrefs.night
            ? "bg-slate-950 text-slate-100"
            : readerPrefs.focus
              ? "bg-background"
              : "bg-card")
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Step {stepIndex + 1} of {steps.length}
            </p>
            <h3 ref={headingRef} tabIndex={-1} aria-label={`${done ? "Prayer complete. " : ""}Step ${stepIndex + 1} of ${steps.length}: ${current.title}`} className="mt-1 rounded text-2xl font-semibold tracking-tight focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">{current.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {done ? (
              <Badge className="w-fit rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                <Check className="mr-1 h-3.5 w-3.5" /> Complete
              </Badge>
            ) : null}
            <Button type="button" variant="outline" size="sm" className="rounded-2xl border-border/60" onClick={() => setImmersive(true)}>
              <Maximize2 className="mr-2 h-4 w-4" /> Full screen
            </Button>
          </div>
        </div>

        <div className="my-4">
          <Progress value={progress} aria-label="Prayer progress" aria-valuetext={done ? "Prayer complete" : `Step ${stepIndex + 1} of ${steps.length}`} className="h-2" />
        </div>

        <div
          className={
            "rounded-2xl border p-4 " +
            (readerPrefs.night
              ? "border-slate-700 bg-slate-900/80"
              : readerPrefs.focus
                ? "border-border/50 bg-background"
                : "border-border/60 bg-muted/20")
          }
        >
          <div className={"scripture-text " + (readerPrefs.largeText ? "space-y-4 text-xl" : "space-y-3 text-lg")}>
            {current.body.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>

        {!readerPrefs.focus ? (
          <p className="mt-3 text-xs text-muted-foreground">
            This app supports your prayer life; keep your parish, priest, and printed prayer book at the center.
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-border/60"
              onClick={goBack}
              disabled={stepIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button type="button" className="rounded-2xl" onClick={goNext}>
              {nextLabel}
              {nextIcon}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="rounded-2xl"
            onClick={() => {
              setStepIndex(0);
              setCompleted((prev) => ({ ...prev, [progressKey]: false }));
              clearPrayerResume();
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset flow
          </Button>

        </div>
      </Card>

      <Link
        to="/settings#prayer-reminders"
        className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground hover:border-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="h-4 w-4 shrink-0 text-accent" />
        <span className="min-w-0 flex-1">Prayer reminders are in Settings.</span>
        <ChevronRight className="h-4 w-4 shrink-0" />
      </Link>

      {/* Distraction-free prayer: one step at a time, large text, app menus hidden. */}
      <Dialog.Root open={immersive} onOpenChange={setImmersive}>
        <Dialog.Portal>
          <Dialog.Content
            aria-describedby={undefined}
            className={
              "fixed inset-0 z-[70] flex h-dvh flex-col text-foreground outline-none " +
              (readerPrefs.night ? "bg-slate-950 text-slate-100" : "bg-background")
            }
          >
            <header className="mx-auto flex w-full max-w-2xl shrink-0 items-center justify-between gap-3 px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {mode === "personal" ? "Developer's Rule" : mode === "seraphim" ? "St. Seraphim's rule" : `${prayerMeta[time].label} prayer`} · {stepIndex + 1} / {steps.length}
              </p>
              <div className="flex items-center gap-1">
                {canSpeak ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-pressed={readingAloud}
                    aria-label={readingAloud ? "Stop reading" : "Read aloud"}
                    className="rounded-full"
                    onClick={() => setReadingAloud((on) => !on)}
                  >
                    {readingAloud ? <VolumeX className="h-4 w-4 sm:mr-1.5" /> : <Volume2 className="h-4 w-4 sm:mr-1.5" />}
                    {/* Icon only on phones so the step counter stays on one line. */}
                    <span className="hidden sm:inline">{readingAloud ? "Stop reading" : "Read aloud"}</span>
                  </Button>
                ) : null}
                <Dialog.Close asChild>
                  <Button type="button" variant="ghost" size="icon" className="rounded-full">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close full-screen prayer</span>
                  </Button>
                </Dialog.Close>
              </div>
            </header>
            <Progress value={progress} aria-hidden className="mx-auto mt-3 h-1 w-[min(42rem,calc(100%-2.5rem))]" />

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 sm:py-12">
                <Dialog.Title className="text-3xl font-semibold tracking-tight sm:text-4xl">{current.title}</Dialog.Title>
                <div className={"scripture-text mt-6 " + (readerPrefs.largeText ? "space-y-6 text-2xl" : "space-y-5 text-xl")}>
                  {current.body.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            <footer className="shrink-0 border-t border-border/50 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-5 sm:px-8">
                <Button type="button" variant="outline" className="h-12 rounded-2xl border-border/60 px-5" onClick={goBack} disabled={stepIndex === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="button" className="h-12 flex-1 rounded-2xl sm:flex-none sm:px-8" onClick={goNext}>
                  {nextLabel}
                  {nextIcon}
                </Button>
              </div>
            </footer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

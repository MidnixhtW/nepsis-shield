import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { useCurrentDay } from "@/hooks/useCurrentDay";
import { format } from "date-fns";
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Maximize2,
  Moon,
  MoonStar,
  RotateCcw,
  Sun,
  Sunset,
  Type,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { stopReadAloud } from "@/lib/readAloud";
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

export function DailyPrayerFlow() {
  const [time, setTime] = useState<PrayerTime>(() => recommendedTime());
  const [mode, setMode] = useState<PrayerMode>("short");
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [readerPrefs, setReaderPrefs] = useState<ReaderPrefs>(DEFAULT_READER_PREFS);
  const [hydrated, setHydrated] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const today = useCurrentDay();
  const [searchParams, setSearchParams] = useSearchParams();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusNextStep = useRef(false);
  const rhythm = useDailyRhythm();

  useEffect(() => {
    const saved = getStoredItem<{ time?: PrayerTime; mode?: PrayerMode; readerPrefs?: ReaderPrefs }>(FLOW_PREFS_KEY);
    if (saved?.time) setTime(saved.time);
    if (saved?.mode) setMode(saved.mode);
    if (saved?.readerPrefs) setReaderPrefs({ ...DEFAULT_READER_PREFS, ...saved.readerPrefs });

    const resume = getPrayerResume();
    // "Begin" on Today and the Pray tiles link here with ?begin=morning|evening|night: open that prayer full screen.
    const begin = searchParams.get("begin");
    if (begin === "morning" || begin === "evening" || begin === "night") {
      setTime(begin);
      setStepIndex(0);
      setImmersive(true);
      const next = new URLSearchParams(searchParams);
      next.delete("begin");
      setSearchParams(next, { replace: true });
    } else if (resume) {
      setTime(resume.time);
      setMode(resume.mode);
      setStepIndex(resume.stepIndex);
    }
    setHydrated(true);
    // Runs once on opening; the begin link is read and then removed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!readingAloud || !immersive) {
      if (readingAloud) window.speechSynthesis.cancel();
      return;
    }
    // The prayer reads its own steps, so stop any other reading first.
    stopReadAloud();
    window.speechSynthesis.cancel();
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

        <Accordion type="single" collapsible className="mt-3">
          <AccordionItem value="options" className="border-0">
            <AccordionTrigger className="rounded-2xl px-1 py-2 text-left text-sm hover:no-underline">
              <span>
                Length and reading options
                <span className="ml-2 font-normal text-muted-foreground">
                  {mode === "personal" ? "Developer's Rule" : mode === "seraphim" ? "St. Seraphim" : mode === "long" ? "Longer" : mode === "standard" ? "Standard" : "Short"}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
        <div className="grid gap-4 rounded-2xl border border-border/60 bg-background/45 p-4">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

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

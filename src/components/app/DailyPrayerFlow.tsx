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
  X,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
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
import { canPlayItems, startNarration, stopReadAloud } from "@/lib/readAloud";
import { READERS, clipUrl, useReader } from "@/lib/narration";
import { AudioRing } from "@/components/app/AudioRing";
import { SilenceStep, isSilence, withSilence } from "@/components/app/SilenceStep";
import { addIntention } from "@/lib/dailyHabits";
import { lightLamp } from "@/lib/vigilLamps";
import { softHaptic } from "@/lib/haptics";
import { setIsonEnabled, useIsonEnabled } from "@/lib/ison";
import { PrayerFinished } from "@/components/app/PrayerFinished";
import { SKY_GRADIENT, skyPhase } from "@/lib/dayInTheChurch";
import { spokenText } from "@/lib/narrationText";
import { LEARN_ID_BY_STEP_TITLE } from "@/content/prayersToLearn";
import { buildFlow, knownPrayerMode, recommendedTime, savedFlowExtras, type PrayerTime, type PrayerMode, type ReaderPrefs } from "@/content/dailyPrayerSteps";
import { PrayerLines } from "@/components/app/PrayerLines";
import { SlidingToggle } from "@/components/app/SlidingToggle";
import { tileArt } from "@/components/app/SectionLauncher";
import { artAvoidingToday } from "@/lib/hourArt";
import { useSettings } from "@/hooks/useSettings";
import type { Commemorations } from "@/lib/commemorations";

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

// The icon for each hour, the same one its tile shows on Pray, so the session opens on the picture that was tapped.
const HOUR_ART: Record<PrayerTime, string> = { morning: "pantocrator", evening: "theotokos", night: "lamentation" };
const SLEEP_TIMER_MINUTES = [10, 20, 30] as const;

type Intention = { id?: string; label: string } | null;

/** "Offer this prayer for": a name from the prayer list or a few words. compact: the one-line version in the session. */
function IntentionPicker({
  names,
  intention,
  setIntention,
  text,
  setText,
  compact = false,
}: {
  names: Commemorations;
  intention: Intention;
  setIntention: (next: Intention) => void;
  text: string;
  setText: (next: string) => void;
  compact?: boolean;
}) {
  const people = [...names.living, ...names.departed].slice(0, compact ? 4 : 8);
  return (
    <div className={compact ? "mt-5" : ""}>
      {compact ? <p className="text-sm text-muted-foreground">Offer this prayer for someone, if you like.</p> : null}
      {people.length ? (
        <div className={"flex flex-wrap gap-2 " + (compact ? "mt-2" : "mt-3")}>
          {people.map((entry) => (
            <Button
              key={entry.id}
              type="button"
              size="sm"
              variant={intention?.id === entry.id ? "default" : "outline"}
              aria-pressed={intention?.id === entry.id}
              className="h-10 rounded-full"
              onClick={() => setIntention(intention?.id === entry.id ? null : { id: entry.id, label: entry.name })}
            >
              {entry.name}
            </Button>
          ))}
        </div>
      ) : null}
      <form
        className={"flex gap-2 " + (compact ? "mt-2" : "mt-3")}
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = text.trim().slice(0, 80);
          if (trimmed) setIntention({ label: trimmed });
        }}
      >
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="A few words: my exam, a friend who is ill"
          aria-label="Intention for this prayer"
          maxLength={80}
          className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background/70 px-3 text-sm"
        />
        <Button type="submit" variant="outline" className="h-11 rounded-xl" disabled={!text.trim()}>
          Offer
        </Button>
      </form>
    </div>
  );
}

export function DailyPrayerFlow() {
  const [time, setTime] = useState<PrayerTime>(() => recommendedTime());
  const [mode, setMode] = useState<PrayerMode>("short");
  const [humility, setHumility] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [readerPrefs, setReaderPrefs] = useState<ReaderPrefs>(DEFAULT_READER_PREFS);
  const [hydrated, setHydrated] = useState(false);
  const [immersive, setImmersive] = useState(false);
  // After the last step of full-screen prayer, a closing screen shows before the reader closes.
  const [finished, setFinished] = useState(false);
  const today = useCurrentDay();
  const [searchParams, setSearchParams] = useSearchParams();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sessionTitleRef = useRef<HTMLHeadingElement>(null);
  const focusNextStep = useRef(false);
  const rhythm = useDailyRhythm();
  const { settings } = useSettings();
  // The hour's picture, never the same as the icon Today already shows.
  const artFor = (key: PrayerTime) => artAvoidingToday(HOUR_ART[key], today, settings.calendarMode);

  useEffect(() => {
    const saved = getStoredItem<{ time?: PrayerTime; mode?: PrayerMode; readerPrefs?: ReaderPrefs; humility?: boolean }>(FLOW_PREFS_KEY);
    setHumility(savedFlowExtras(saved).humility === true);
    if (saved?.time) setTime(saved.time);
    const savedMode = knownPrayerMode(saved?.mode);
    if (savedMode) setMode(savedMode);
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
      setMode(knownPrayerMode(resume.mode) ?? "short");
      setStepIndex(resume.stepIndex);
    }
    setHydrated(true);
    // Runs once on opening; the begin link is read and then removed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setStoredItem(FLOW_PREFS_KEY, { time, mode, readerPrefs, humility });
  }, [hydrated, mode, readerPrefs, time, humility]);

  const [names, setNames] = useState(getCommemorations);
  useEffect(() => {
    const refresh = () => setNames(getCommemorations());
    window.addEventListener(COMMEMORATIONS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(COMMEMORATIONS_CHANGED_EVENT, refresh);
  }, []);
  // Names from the Names tab are prayed just before the closing prayer.
  const steps = useMemo(() => {
    const built = buildFlow(time, mode, { humility });
    const flow = mode === "standard" || mode === "long" ? withSilence(built) : built;
    const remember = commemorationStep(names);
    return remember ? [...flow.slice(0, -1), remember, flow[flow.length - 1]] : flow;
  }, [time, mode, names, humility]);
  const progressKey = `${format(today, "yyyy-MM-dd")}:${time}:${mode}${humility && time === "morning" ? ":humility" : ""}`;
  // An intention for this prayer: a name from the prayer list (whose lamp is lit at the end) or a few words.
  const [intention, setIntention] = useState<Intention>(null);
  const [intentionText, setIntentionText] = useState("");
  const [silenceLeft, setSilenceLeft] = useState(0);
  const ison = useIsonEnabled();
  // The one-line explanation of the chant drone shows until it has been tried once.
  const [soundOpen, setSoundOpen] = useState(false);
  const [droneHintSeen, setDroneHintSeenState] = useState(() => getStoredItem<boolean>("reader:drone-hint-seen") === true);
  const setDroneHintSeen = (seen: boolean) => {
    setDroneHintSeenState(seen);
    if (seen) setStoredItem("reader:drone-hint-seen", true);
  };
  const done = completed[progressKey] ?? !!rhythm.today.prayers[time];
  const current = steps[Math.min(stepIndex, steps.length - 1)];
  const silent = isSilence(current);
  const progress = done ? 100 : Math.round(((stepIndex + 1) / steps.length) * 100);

  useEffect(() => {
    if (!focusNextStep.current) return;
    headingRef.current?.focus();
    focusNextStep.current = false;
  }, [stepIndex, done, progressKey]);

  // Read aloud while the full-screen view is open: the chosen reader's recording of the step, or the device voice.
  const [reader, setReader] = useReader();
  const stepAudio = clipUrl(reader, current.body);
  const canListen = canPlayItems([{ audio: stepAudio }]);
  const [readingAloud, setReadingAloud] = useState(false);
  // Listening carries the prayer along: when a step's reading ends, a short pause, then the next step reads.
  const goNextRef = useRef<() => void>(() => {});
  useEffect(() => {
    if (!readingAloud || !immersive || silent || finished) return;
    let pause = 0;
    startNarration(
      current.title,
      [{ text: stepAudio ? spokenText(current.body) : [current.title, ...current.body].join(". "), audio: stepAudio }],
      { onEnd: () => { pause = window.setTimeout(() => goNextRef.current(), 1200); } },
    );
    return () => {
      window.clearTimeout(pause);
      stopReadAloud();
    };
  }, [readingAloud, immersive, current, stepAudio, silent, finished]);
  useEffect(() => {
    if (!immersive) setReadingAloud(false);
  }, [immersive]);
  // A silence step, while listening, moves on by itself once its quiet has passed.
  const silenceCounted = useRef(false);
  useEffect(() => {
    silenceCounted.current = false;
  }, [stepIndex]);
  useEffect(() => {
    if (!silent) return;
    if (silenceLeft > 0) silenceCounted.current = true;
    else if (readingAloud && silenceCounted.current) {
      silenceCounted.current = false;
      goNextRef.current();
    }
  }, [silent, silenceLeft, readingAloud]);
  // Night prayers can stop reading after a while, for someone praying themselves to sleep.
  const [sleepMinutes, setSleepMinutes] = useState(0);
  useEffect(() => {
    if (!sleepMinutes) return;
    const timer = window.setTimeout(() => {
      stopReadAloud();
      setReadingAloud(false);
      setSleepMinutes(0);
    }, sleepMinutes * 60_000);
    return () => window.clearTimeout(timer);
  }, [sleepMinutes]);

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
    softHaptic();
    if (stepIndex >= steps.length - 1) {
      setCompleted((prev) => ({ ...prev, [progressKey]: true }));
      markPrayerComplete(time, mode);
      // The prayer was offered for someone: light their lamp, or keep the words among the intentions.
      if (intention?.id) lightLamp(intention.id);
      else if (intention) addIntention(intention.label);
      setIntention(null);
      setReadingAloud(false);
      if (immersive) setFinished(true);
      else showSuccess("Prayer marked complete for today.");
      return;
    }
    // Beginning the prayer opens the distraction-free view.
    if (stepIndex === 0) setImmersive(true);
    setStepIndex((i) => i + 1);
  }

  goNextRef.current = goNext;

  const nextDisabled = silent && silenceLeft > 0;
  // Shorter words in the session footer, where the play button sits between Back and Next.
  const sessionNextLabel = stepIndex >= steps.length - 1 ? "Amen" : stepIndex === 0 ? "Begin" : "Next";
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
                "tap rounded-2xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                (time === key
                  ? "border-primary/40 bg-primary/10"
                  : "border-border/60 bg-background/50 hover:bg-background/80")
              }
              onClick={() => start(key)}
            >
              {/* Each hour shows its icon, the same picture as its tile on Pray and at the head of the prayer. */}
              <span className="flex items-center gap-3">
                <img
                  src={tileArt(artFor(key))}
                  alt=""
                  loading="lazy"
                  className="h-[72px] w-[54px] shrink-0 rounded-sm border border-[hsl(var(--icon-gold)/0.4)] object-cover object-top"
                />
                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-display text-lg">
                    <span className="text-primary">{prayerMeta[key].icon}</span>
                    {prayerMeta[key].label}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                    {prayerMeta[key].hint}
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>

        <h2 className="sr-only">Prayer options</h2>
        <Accordion type="single" collapsible className="mt-3">
          <AccordionItem value="options" className="border-0">
            <AccordionTrigger className="rounded-2xl px-1 py-2 text-left text-sm hover:no-underline">
              <span>
                Length and reading options
                <span className="ml-2 font-normal text-muted-foreground">
                  {mode === "watch" ? "Watch rule" : mode === "seraphim" ? "St. Seraphim" : mode === "long" ? "Longer" : mode === "standard" ? "Standard" : "Short"}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
        <div className="grid gap-4 rounded-2xl border border-border/60 bg-background/45 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold">Prayer rule length</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The Watch rule takes about a minute, St. Seraphim's rule suits shifts and deployments, short for busy days, standard for normal use, or longer when you have room.
              </p>
            </div>
            <SlidingToggle
              label="Prayer rule length"
              options={[
                { id: "watch" as PrayerMode, label: "Watch (1 min)" },
                { id: "seraphim" as PrayerMode, label: "St. Seraphim" },
                { id: "short" as PrayerMode, label: "Short" },
                { id: "standard" as PrayerMode, label: "Standard" },
                { id: "long" as PrayerMode, label: "Longer" },
              ]}
              value={mode}
              onChange={(value) => {
                setMode(value);
                setStepIndex(0);
              }}
            />
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
          <label className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-3 py-2">
            <span className="min-w-0">
              <span className="block text-sm font-medium">Litany of Humility</span>
              <span className="block text-xs text-muted-foreground">Add it to morning prayers, before the close.</span>
            </span>
            <Switch aria-label="Add the Litany of Humility to morning prayers" checked={humility} onCheckedChange={setHumility} />
          </label>
        </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {stepIndex === 0 && !done ? (
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <h3 className="text-lg">Offer this prayer for</h3>
          <IntentionPicker names={names} intention={intention} setIntention={setIntention} text={intentionText} setText={setIntentionText} />
          {intention ? (
            <p className="rubric mt-3">
              For {intention.label}
              {intention.id ? ". Their lamp is lit when you finish." : "."}
            </p>
          ) : null}
        </Card>
      ) : null}

      <Card
        className={
          "rounded-3xl border-border/60 p-5 shadow-sm transition-colors " +
          (readerPrefs.night
            ? "bg-card text-foreground"
            : readerPrefs.focus
              ? "bg-background"
              : "bg-card")
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              Step {stepIndex + 1} of {steps.length}
            </p>
            <h3 ref={headingRef} tabIndex={-1} aria-label={`${done ? "Prayer complete. " : ""}Step ${stepIndex + 1} of ${steps.length}: ${current.title}`} className="mt-1 rounded text-2xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">{current.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {done ? (
              <Badge className="w-fit rounded-full bg-success/[0.14] px-3 py-1 text-xs font-semibold text-success dark:text-success">
                <Check className="mr-1 h-3.5 w-3.5" /> Complete
              </Badge>
            ) : null}
            <Button type="button" variant="outline" size="sm" className="rounded-2xl border-border/60" onClick={() => setImmersive(true)}>
              <Maximize2 className="mr-2 h-4 w-4" /> Full screen
            </Button>
            {LEARN_ID_BY_STEP_TITLE[current.title] ? (
              <Button asChild variant="ghost" size="sm" className="rounded-2xl">
                <Link to={`/learn?tab=byheart&prayer=${LEARN_ID_BY_STEP_TITLE[current.title]}`}>Learn by heart</Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="my-4">
          <Progress value={progress} aria-label="Prayer progress" aria-valuetext={done ? "Prayer complete" : `Step ${stepIndex + 1} of ${steps.length}`} className="h-2" />
        </div>

        <div
          className={
            "rounded-2xl border p-4 " +
            (readerPrefs.night
              ? "border-border/[0.72] bg-card"
              : readerPrefs.focus
                ? "border-border/50 bg-background"
                : "border-border/60 bg-muted/20")
          }
        >
          {silent ? (
            <SilenceStep key={`${progressKey}:${stepIndex}`} onRemaining={setSilenceLeft} />
          ) : (
            <div className={"scripture-text " + (readerPrefs.largeText ? "space-y-4 text-xl" : "space-y-3 text-lg")}>
              <PrayerLines lines={current.body} />
            </div>
          )}
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
            <Button type="button" className="rounded-2xl" onClick={goNext} disabled={nextDisabled}>
              {nextLabel}
              {nextIcon}
            </Button>
            {nextDisabled ? (
              <Button type="button" variant="ghost" className="rounded-2xl" onClick={() => setSilenceLeft(0)}>
                Skip the silence
              </Button>
            ) : null}
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
      <Dialog.Root
        open={immersive}
        onOpenChange={(open) => {
          setImmersive(open);
          if (!open) setFinished(false);
        }}
      >
        <Dialog.Portal>
          <Dialog.Content
            aria-describedby={undefined}
            // Focus the prayer's heading on opening, so no focus ring sits on the close button.
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              sessionTitleRef.current?.focus();
            }}
            className={
              "fixed inset-0 z-[70] flex h-dvh flex-col text-foreground outline-none " +
              (readerPrefs.night ? "bg-card text-foreground" : "bg-background")
            }
          >
            {/* The light of this hour, behind the prayer. */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ backgroundImage: SKY_GRADIENT[skyPhase(new Date())] }} />
            {finished ? (
              <PrayerFinished
                time={time}
                prayerName={mode === "watch" ? "Watch rule" : mode === "seraphim" ? "rule of St. Seraphim" : `${prayerMeta[time].label.toLowerCase()} prayers`}
                onDone={() => {
                  setImmersive(false);
                  setFinished(false);
                }}
              />
            ) : (
            <>
            {/* Only what the prayer needs: a way out, how far along, and the sound choices folded behind one button. */}
            <header className="mx-auto flex w-full max-w-2xl shrink-0 items-center justify-between gap-3 px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8">
              <Dialog.Close asChild>
                <Button type="button" variant="ghost" size="icon" className="-ml-2 rounded-full">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close full-screen prayer</span>
                </Button>
              </Dialog.Close>
              <p className="text-sm tabular-nums text-muted-foreground">
                <span className="sr-only">{mode === "watch" ? "Watch rule" : mode === "seraphim" ? "St. Seraphim's rule" : `${prayerMeta[time].label} prayer`}, part </span>
                {stepIndex + 1} of {steps.length}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-expanded={soundOpen}
                aria-controls="reader-sound"
                className="-mr-2 h-11 rounded-full px-3 text-sm font-medium text-muted-foreground"
                onClick={() => setSoundOpen((open) => !open)}
              >
                Sound
              </Button>
            </header>
            <Progress value={progress} aria-hidden className="mx-auto mt-3 h-0.5 w-[min(42rem,calc(100%-2.5rem))]" />
            {soundOpen ? (
              <div id="reader-sound" className="mx-auto flex w-[min(42rem,calc(100%-2.5rem))] flex-wrap items-center justify-between gap-3 border-b border-border/60 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={ison}
                  className={"h-11 rounded-full px-2 text-sm font-medium " + (ison ? "text-accent" : "text-muted-foreground")}
                  onClick={() => {
                    setIsonEnabled(!ison);
                    setDroneHintSeen(true);
                  }}
                >
                  {ison ? "Chant drone on" : "Chant drone off"}
                </Button>
                  <select
                  aria-label="Voice reading aloud"
                  value={reader}
                  onChange={(event) => setReader(event.target.value as typeof reader)}
                  className="h-11 max-w-[6.5rem] cursor-pointer appearance-none border-0 bg-transparent px-2 text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {READERS.map((item) => (
                    <option key={item.id} value={item.id} className="bg-background text-foreground">{item.id === "device" ? "Device" : item.name}</option>
                  ))}
                </select>
                {time === "night" ? (
                  <div role="group" aria-label="Sleep timer" className="flex basis-full items-center gap-1">
                    <span className="mr-1 text-sm text-muted-foreground">Stop reading after</span>
                    {SLEEP_TIMER_MINUTES.map((minutes) => (
                      <Button
                        key={minutes}
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-pressed={sleepMinutes === minutes}
                        className={"h-11 rounded-full px-3 text-sm " + (sleepMinutes === minutes ? "text-accent" : "text-muted-foreground")}
                        onClick={() => setSleepMinutes(sleepMinutes === minutes ? 0 : minutes)}
                      >
                        {minutes} min
                      </Button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {/* The hour's icon at the head of the prayer, fading into the page, the way a listening app leads with art. */}
              <div aria-hidden className="relative mx-auto mt-4 h-[min(22vh,170px)] w-[min(42rem,calc(100%-2.5rem))] overflow-hidden rounded-sm border border-[hsl(var(--icon-gold)/0.35)]">
                <img src={tileArt(artFor(time))} alt="" className="h-full w-full object-cover object-[50%_28%]" />
                <div className={"absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent " + (readerPrefs.night ? "to-card/80" : "to-background/80")} />
              </div>
              <div className="mx-auto w-full max-w-2xl px-5 py-6 sm:px-8 sm:py-10">
                {intention ? <p className="rubric mb-2">For {intention.label}</p> : null}
                <Dialog.Title ref={sessionTitleRef} tabIndex={-1} className="text-3xl text-cinnabar focus:outline-none sm:text-4xl">{current.title}</Dialog.Title>
                {stepIndex === 0 && !intention ? (
                  <IntentionPicker compact names={names} intention={intention} setIntention={setIntention} text={intentionText} setText={setIntentionText} />
                ) : null}
                {silent ? (
                  <SilenceStep key={`${progressKey}:${stepIndex}`} onRemaining={setSilenceLeft} />
                ) : (
                  <div className={"scripture-text mt-6 " + (readerPrefs.largeText ? "space-y-6 text-2xl" : "space-y-5 text-xl")}>
                    <PrayerLines lines={current.body} />
                  </div>
                )}
              </div>
            </div>

            <footer className="shrink-0 border-t border-border/50 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              {/* Listening leads: the play button sits in the middle, large, with Back and Next on either side. */}
              <div className="mx-auto grid w-full max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 sm:px-8">
                <Button type="button" variant="ghost" size="icon" className="h-12 w-12 justify-self-start rounded-full" onClick={goBack} disabled={stepIndex === 0}>
                  <ChevronLeft className="h-6 w-6" />
                  <span className="sr-only">Back</span>
                </Button>
                {canListen ? (
                  <AudioRing large on={readingAloud} onToggle={() => { softHaptic(); setReadingAloud((on) => !on); }} />
                ) : (
                  <span aria-hidden />
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 justify-self-end rounded-full border-border/70 px-5"
                  onClick={() => (nextDisabled ? setSilenceLeft(0) : goNext())}
                >
                  {nextDisabled ? `Skip (${silenceLeft})` : sessionNextLabel}
                  {nextDisabled ? null : nextIcon}
                </Button>
              </div>
            </footer>
            </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

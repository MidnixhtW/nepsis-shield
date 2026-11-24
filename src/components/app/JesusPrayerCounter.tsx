import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { Minus, Moon, Plus, RotateCcw, ShieldAlert, Target, Trash2 } from "lucide-react";
import { DarkPrayerRope } from "@/components/app/DarkPrayerRope";
import { PrayerRopeLoop } from "@/components/app/PrayerRopeLoop";
import { HoldToContinue, RopeTrack } from "@/components/app/RopeTrack";
import { SlidingToggle } from "@/components/app/SlidingToggle";
import { knotHaptic, markerHaptic, ruleDoneHaptic } from "@/lib/haptics";
import { ropeClickOn, setRopeClick } from "@/lib/ropeSound";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  cleanupStoredByPrefix,
  clearStoredByPrefix,
  getStoredItem,
  removeStoredItem,
  setStoredItem,
} from "@/lib/deviceStorage";

function storageKeyForDay(dayKey: string) {
  return `jesus_prayer_count:${dayKey}`;
}

function goalKey() {
  return `jesus_prayer_goal`;
}

const PULSE_KEY = "jesus_prayer_pulse";
// How the rope is counted here (the tap ring, or the rope pulled with the thumb), and whether a marker bead asks for
// a held pause before the count goes on.
const VIEW_KEY = "jesus_prayer_view";
const MARKER_PAUSE_KEY = "jesus_prayer_marker_pause";
const PULSE_OPTIONS = [10, 33, 50, 100];

function saveEnabledKey() {
  return "privacy:counter_save";
}

const COUNT_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target.isContentEditable
  );
}


export function JesusPrayerCounter() {

  const dayKey = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(100);
  const [ruleOpen, setRuleOpen] = useState(false);
  const [clickOn, setClickOn] = useState(ropeClickOn);
  const [goalDraft, setGoalDraft] = useState("100");
  const [saveEnabled, setSaveEnabled] = useState(true);

  const [dark, setDark] = useState(false);
  const [pulseEvery, setPulseEvery] = useState(() => {
    const saved = Number(getStoredItem<string>(PULSE_KEY));
    return PULSE_OPTIONS.includes(saved) ? saved : 33;
  });
  const addKnot = useCallback(() => setCount((c) => c + 1), []);
  const [view, setView] = useState<"ring" | "rope">(() => (getStoredItem<string>(VIEW_KEY) === "rope" ? "rope" : "ring"));
  const [markerPause, setMarkerPause] = useState(() => getStoredItem<boolean>(MARKER_PAUSE_KEY) === true);
  // The marker most recently held through; the count waits at any other marker while the pause is on.
  const [heldMarker, setHeldMarker] = useState(0);
  const waiting = markerPause && count > 0 && count % pulseEvery === 0 && heldMarker !== count;

  // The haptics go off inside the tap itself (phones only allow a buzz during a tap): a bump per knot, the firm
  // double pulse on a marker, and three pulses when today's rule is prayed. Watchfulness mode plays its own.
  const countRef = useRef(count);
  countRef.current = count;
  const buzzFor = useCallback(
    (next: number, added: number) => {
      if (dark) return;
      if (goal > 0 && countRef.current < goal && next >= goal) ruleDoneHaptic();
      else if (added === 1 && next % pulseEvery === 0) markerHaptic();
      else knotHaptic();
    },
    [dark, goal, pulseEvery],
  );
  // One knot from the rope drawing, the pulled rope or the +1 button.
  const knot = useCallback(() => {
    if (waiting) return;
    buzzFor(countRef.current + 1, 1);
    countRef.current += 1;
    setCount((c) => c + 1);
  }, [waiting, buzzFor]);
  const closeDark = useCallback(() => setDark(false), []);

  useEffect(() => {
    cleanupStoredByPrefix("jesus_prayer_count:", COUNT_TTL_MS);

    const saved = getStoredItem<boolean>(saveEnabledKey());
    setSaveEnabled(saved ?? true);
  }, []);

  useEffect(() => {
    if (!saveEnabled) {
      setCount(0);
      setGoal(100);
      setGoalDraft("100");
      return;
    }

    const rawCount = getStoredItem<string>(storageKeyForDay(dayKey));
    const rawGoal = getStoredItem<string>(goalKey());

    setCount(rawCount ? Number(rawCount) || 0 : 0);
    const g = rawGoal ? Number(rawGoal) || 100 : 100;
    setGoal(g);
    setGoalDraft(String(g));
  }, [dayKey, saveEnabled]);

  useEffect(() => {
    setStoredItem(saveEnabledKey(), saveEnabled);
    if (!saveEnabled) {
      clearStoredByPrefix("jesus_prayer_count:");
      removeStoredItem(goalKey());
    }
  }, [saveEnabled]);

  useEffect(() => {
    if (!saveEnabled) return;
    setStoredItem(storageKeyForDay(dayKey), String(count), { ttlMs: COUNT_TTL_MS });
  }, [count, dayKey, saveEnabled]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isInteractiveTarget(e.target)) return;
      if (e.key === "+" || e.key === "=") setCount((c) => c + 1);
      if (e.key === "-") setCount((c) => Math.max(0, c - 1));
      if (e.key.toLowerCase() === "r") setCount(0);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);


  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        {/* The page's own title is above (Jesus Prayer); here only the rule, then the rope, then the prayer itself. */}
        <div className="flex items-start justify-end gap-3">

          <Dialog open={ruleOpen} onOpenChange={setRuleOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl border-border/60"
              >
                <Target className="mr-2 h-4 w-4" /> Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl">
              <DialogHeader>
                <DialogTitle>Your daily rule</DialogTitle>
                <DialogDescription>
                  Ask your spiritual father or priest how many to pray, and keep a number you can hold every day. The count helps attention. Missing a day carries no penalty here.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <Input
                  value={goalDraft}
                  onChange={(e) => setGoalDraft(e.target.value)}
                  inputMode="numeric"
                  className="h-11 rounded-2xl"
                />
                <Button
                  className="rounded-2xl"
                  onClick={() => {
                    const g = Math.max(1, Math.min(10000, Number(goalDraft) || 100));
                    setGoal(g);
                    if (saveEnabled) setStoredItem(goalKey(), String(g));
                    setGoalDraft(String(g));
                    setRuleOpen(false);
                  }}
                >
                  Save rule
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          <div className="grid justify-items-center gap-4 pt-2">
            <SlidingToggle
              label="How to count"
              options={[
                { id: "ring", label: "Whole rope" },
                { id: "rope", label: "Pull the rope" },
              ]}
              value={view}
              onChange={(next) => {
                setView(next);
                setStoredItem(VIEW_KEY, next);
              }}
            />
            {view === "ring" ? (
              <PrayerRopeLoop count={count} goal={goal} markerEvery={pulseEvery} onTap={knot} />
            ) : (
              <>
                <p className="text-3xl tabular-nums">{count}</p>
                <RopeTrack count={count} every={pulseEvery} onKnot={knot} locked={waiting} stopAtMarker={markerPause} />
              </>
            )}
            {waiting ? <HoldToContinue onDone={() => setHeldMarker(count)} /> : null}
            <p className="scripture-text max-w-xs text-balance text-center text-xl leading-snug">
              Lord Jesus Christ, Son of God, have mercy on me, a sinner.
            </p>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {count >= goal ? "Today's rule is prayed. Glory to God." : `${goal - count} left in today's rule`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setCount((c) => Math.max(0, c - 1))}
              variant="outline"
              className="h-12 rounded-2xl border-border/60"
            >
              <Minus className="mr-2 h-4 w-4" /> -1
            </Button>
            <Button
              onClick={knot}
              disabled={waiting}
              className="h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" /> +1
            </Button>

          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setCount((c) => Math.max(0, c - 10))}
              variant="outline"
              className="h-12 rounded-2xl border-border/60"
            >
              -10
            </Button>
            <Button
              onClick={() => {
                buzzFor(countRef.current + 10, 10);
                countRef.current += 10;
                setCount((c) => c + 10);
              }}
              variant="outline"
              className="h-12 rounded-2xl border-border/60"
            >
              +10
            </Button>

          </div>

          <label className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/45 p-4">
            <span className="min-w-0">
              <span className="block text-sm font-semibold">Pause at each marker</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                At every marker bead, hold the cross for one breath before the count goes on.
              </span>
            </span>
            <Switch
              aria-label="Pause at each marker"
              checked={markerPause}
              onCheckedChange={(on) => {
                setMarkerPause(on);
                setStoredItem(MARKER_PAUSE_KEY, on);
              }}
            />
          </label>

          <label className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/45 p-4">
            <span className="min-w-0">
              <span className="block text-sm font-semibold">Click for each knot</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                A soft wooden click with each knot and a deeper one at each marker. For phones that cannot vibrate here,
                like iPhone. Keep the sound low.
              </span>
            </span>
            <Switch
              aria-label="Click for each knot"
              checked={clickOn}
              onCheckedChange={(on) => {
                setClickOn(on);
                setRopeClick(on);
                if (on) knotHaptic();
              }}
            />
          </label>

          <div className="rounded-2xl border border-border/60 bg-background/45 p-4">
            <div className="flex items-start gap-3">
              <Moon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">Watchfulness mode</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The screen goes fully black to keep your night vision and save battery. Tap anywhere for each knot, and
                  feel a firm pulse at every marker. Hold for a second to leave.
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span id="pulse-label" className="text-xs text-muted-foreground">Pulse every</span>
              <ToggleGroup
                type="single"
                value={String(pulseEvery)}
                onValueChange={(value) => {
                  if (!value) return;
                  setPulseEvery(Number(value));
                  setStoredItem(PULSE_KEY, value);
                }}
                aria-labelledby="pulse-label"
                className="flex flex-wrap gap-1.5"
              >
                {PULSE_OPTIONS.map((option) => (
                  <ToggleGroupItem
                    key={option}
                    value={String(option)}
                    className="h-8 rounded-full border border-border/60 px-3 text-xs data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10"
                  >
                    {option}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            <Button type="button" className="mt-3 h-11 w-full rounded-2xl" onClick={() => setDark(true)}>
              <Moon className="mr-2 h-4 w-4" /> Begin in the dark
            </Button>
          </div>

          <Button
            onClick={() => setCount(0)}
            variant="ghost"
            className="h-11 rounded-2xl text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset for today
          </Button>

          <p className="text-sm text-muted-foreground">
            Tip: + / - to adjust, R to reset. On supported phones, each prayer tap gives a soft vibration like a prayer rope bead.
          </p>
        </div>

      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Privacy</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Counts and your rule are behavioral data.
            </p>
          </div>
          <ShieldAlert className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Remember on this device</p>
              <p className="text-sm text-muted-foreground">
                Stored locally. Daily counts auto-expire after 14 days.
              </p>
            </div>
            <Switch aria-label="Remember on this device" checked={saveEnabled} onCheckedChange={setSaveEnabled} />
          </div>
          {saveEnabled ? (
            <div className="mt-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl border-border/60"
                onClick={() => {
                  clearStoredByPrefix("jesus_prayer_count:");
                  removeStoredItem(goalKey());
                  setCount(0);
                  setGoal(100);
                  setGoalDraft("100");
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear saved data
              </Button>
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <h2 className="text-base font-semibold tracking-tight">OCA reference</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Read: "Lord Jesus Christ, Son of God, have mercy on me, a sinner" (OCA)
        </p>
        <div className="mt-4">
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <a
              href="https://www.oca.org/orthodoxy/the-orthodox-faith/spirituality/prayer-fasting-and-almsgiving/the-jesus-prayer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open article
            </a>
          </Button>
        </div>
      </Card>
      {dark ? <DarkPrayerRope count={count} every={pulseEvery} onKnot={addKnot} onClose={closeDark} /> : null}
    </div>
  );
}
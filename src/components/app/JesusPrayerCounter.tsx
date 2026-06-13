import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Minus, Plus, RotateCcw, ShieldAlert, Target, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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

function prayerRopeHaptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(12);
  }
}

export function JesusPrayerCounter() {

  const dayKey = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(100);
  const [goalDraft, setGoalDraft] = useState("100");
  const [saveEnabled, setSaveEnabled] = useState(true);

  const [streakDays, setStreakDays] = useState(0);

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
    // compute a gentle streak from stored daily keys (up to TTL window)
    if (!saveEnabled) {
      setStreakDays(0);
      return;
    }

    try {
      const keys = Object.keys(window.localStorage).filter((k) =>
        k.startsWith("jesus_prayer_count:"),
      );

      const days = keys
        .map((k) => k.replace("jesus_prayer_count:", ""))
        .filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x))
        .sort()
        .reverse();

      // Count consecutive days ending today where count > 0
      const todayStr = dayKey;
      let streak = 0;
      let expected = todayStr;

      function prevDayStr(s: string) {
        const [y, m, d] = s.split("-").map(Number);
        const dt = new Date(Date.UTC(y, m - 1, d));
        dt.setUTCDate(dt.getUTCDate() - 1);
        const yy = dt.getUTCFullYear();
        const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(dt.getUTCDate()).padStart(2, "0");
        return `${yy}-${mm}-${dd}`;
      }

      for (const d of days) {
        if (d !== expected) continue;
        const val = getStoredItem<string>(storageKeyForDay(d));
        if (!val || Number(val) <= 0) break;
        streak += 1;
        expected = prevDayStr(expected);
      }

      setStreakDays(streak);
    } catch {
      setStreakDays(0);
    }
  }, [dayKey, count, saveEnabled]);

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

  const pct = goal > 0 ? Math.min(100, Math.round((count / goal) * 100)) : 0;

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Jesus Prayer</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              "Lord Jesus Christ, Son of God, have mercy on me, a sinner."
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl border-border/60"
              >
                <Target className="mr-2 h-4 w-4" /> Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl">
              <DialogHeader>
                <DialogTitle>Set today's goal</DialogTitle>
                <DialogDescription>
                  Choose a number that supports attention, not pressure.
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
                  }}
                >
                  Save goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Separator className="my-4" />

        <div className="grid gap-4">
          <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                  Today
                </p>
                <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">
                  {count}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                  Goal
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{goal}</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={pct} className="h-2.5 rounded-full" />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{pct}%</p>
                {saveEnabled ? (
                  <p className="text-xs text-muted-foreground">
                    Streak: <span className="font-semibold text-foreground">{streakDays}</span>
                  </p>
                ) : null}
              </div>
            </div>
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
              onClick={() => {
                prayerRopeHaptic();
                setCount((c) => c + 1);
              }}
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
                prayerRopeHaptic();
                setCount((c) => c + 10);
              }}
              variant="outline"
              className="h-12 rounded-2xl border-border/60"
            >
              +10
            </Button>

          </div>

          <Button
            onClick={() => setCount(0)}
            variant="ghost"
            className="h-11 rounded-2xl text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset for today
          </Button>

          <p className="text-xs text-muted-foreground">
            Tip: + / - to adjust, R to reset. On supported phones, each prayer tap gives a soft vibration like a prayer rope bead.
          </p>
        </div>

      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Privacy</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Counts and goals are behavioral data.
            </p>
          </div>
          <ShieldAlert className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Remember on this device</p>
              <p className="text-xs text-muted-foreground">
                Stored locally. Daily counts auto-expire after 14 days.
              </p>
            </div>
            <Switch checked={saveEnabled} onCheckedChange={setSaveEnabled} />
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
        <h3 className="text-base font-semibold tracking-tight">OCA reference</h3>
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
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, MoonStar, Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { markHabitComplete } from "@/lib/dailyHabits";
import { showSuccess } from "@/utils/toast";

const STORE_KEY = "sleep-mode:v1";
const durations = [3, 5, 10, 20] as const;

const steps = [
  {
    title: "Settle",
    body: "Put the phone down if you can. Breathe slowly and make the sign of the Cross.",
  },
  {
    title: "Evening prayer",
    body: "O Lord our God, forgive me all the sins I have committed this day in word, deed, and thought; for Thou art good and lovest mankind.",
  },
  {
    title: "Entrust the night",
    body: "Into Thy hands, O Lord Jesus Christ, I commend my soul and body. Bless me, have mercy on me, and grant me peaceful sleep.",
  },
  {
    title: "Jesus Prayer",
    body: "Lord Jesus Christ, Son of God, have mercy on me, a sinner. Repeat gently until the timer ends or you fall asleep.",
  },
];

type SleepStore = {
  completedDates: string[];
  preferredMinutes: typeof durations[number];
};

function todayKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function readStore(): SleepStore {
  return getStoredItem<SleepStore>(STORE_KEY) ?? { completedDates: [], preferredMinutes: 5 };
}

function saveStore(store: SleepStore) {
  setStoredItem(STORE_KEY, store);
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}

export function SleepMode() {
  const [store, setStore] = useState(readStore);
  const [minutes, setMinutes] = useState<typeof durations[number]>(store.preferredMinutes);
  const [remaining, setRemaining] = useState(store.preferredMinutes * 60);
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [dimmed, setDimmed] = useState(false);

  const today = todayKey();
  const completedToday = store.completedDates.includes(today);
  const totalSeconds = minutes * 60;
  const progress = Math.round(((totalSeconds - remaining) / totalSeconds) * 100);
  const step = steps[stepIndex];

  useEffect(() => {
    if (running) return;
    setRemaining(minutes * 60);
  }, [minutes, running]);

  useEffect(() => {
    if (!running) return;

    const id = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(id);
          setRunning(false);
          completeNight();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [running]);

  function updateStore(next: SleepStore) {
    setStore(next);
    saveStore(next);
  }

  function updateMinutes(value: typeof durations[number]) {
    setMinutes(value);
    updateStore({ ...store, preferredMinutes: value });
  }

  function completeNight() {
    const nextDates = store.completedDates.includes(today)
      ? store.completedDates
      : [today, ...store.completedDates].slice(0, 60);
    updateStore({ ...store, completedDates: nextDates, preferredMinutes: minutes });
    markHabitComplete("prayer", true);
    showSuccess("Sleep mode completed. Rest in peace.");
  }

  function resetTimer() {
    setRunning(false);
    setRemaining(minutes * 60);
  }

  const recentCount = useMemo(() => store.completedDates.slice(0, 7).length, [store.completedDates]);

  return (
    <Card className={dimmed ? "rounded-3xl border-primary/20 bg-black p-5 text-zinc-100 shadow-sm sm:p-6" : "rounded-3xl border-border/60 bg-card p-5 shadow-sm sm:p-6"}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Sleep mode</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">End the day in prayer.</h2>
          <p className={dimmed ? "mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300" : "mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground"}>
            A quiet night flow with short prayers, a dim screen, and a gentle Jesus Prayer timer.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant={dimmed ? "secondary" : "outline"} className="rounded-2xl" onClick={() => setDimmed((v) => !v)}>
            <MoonStar className="mr-2 h-4 w-4" /> {dimmed ? "Brighten" : "Dim"}
          </Button>
          <Button type="button" variant={completedToday ? "secondary" : "default"} className="rounded-2xl" onClick={completeNight}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> {completedToday ? "Done tonight" : "Mark done"}
          </Button>
        </div>
      </div>

      <Separator className={dimmed ? "my-5 bg-zinc-800" : "my-5"} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className={dimmed ? "rounded-3xl border border-zinc-800 bg-zinc-950 p-5" : "rounded-3xl border border-border/60 bg-muted/20 p-5"}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Step {stepIndex + 1} of {steps.length}</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">{step.title}</h3>
            </div>
            <Volume2 className={dimmed ? "h-5 w-5 text-zinc-400" : "h-5 w-5 text-muted-foreground"} />
          </div>
          <p className={dimmed ? "mt-4 text-lg leading-relaxed text-zinc-200" : "mt-4 text-lg leading-relaxed"}>{step.body}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="rounded-2xl" disabled={stepIndex === 0} onClick={() => setStepIndex((i) => i - 1)}>
              Back
            </Button>
            <Button type="button" className="rounded-2xl" onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>
              {stepIndex === steps.length - 1 ? "Stay here" : "Next"}
            </Button>
          </div>
        </div>

        <div className="grid content-start gap-4">
          <div>
            <p className={dimmed ? "text-xs font-semibold text-zinc-400" : "text-xs font-semibold text-muted-foreground"}>Timer length</p>
            <ToggleGroup type="single" value={String(minutes)} onValueChange={(v) => v && updateMinutes(Number(v) as typeof durations[number])} className="mt-2 grid grid-cols-2 gap-2">
              {durations.map((duration) => (
                <ToggleGroupItem key={duration} value={String(duration)} className="rounded-2xl border border-border/60 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  {duration} min
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className={dimmed ? "rounded-3xl border border-zinc-800 bg-zinc-950 p-4" : "rounded-3xl border border-border/60 bg-background/50 p-4"}>
            <p className="text-4xl font-semibold tabular-nums">{formatTime(remaining)}</p>
            <Progress value={progress} className="mt-3 h-2" />
            <div className="mt-4 flex gap-2">
              <Button type="button" className="flex-1 rounded-2xl" onClick={() => setRunning((v) => !v)}>
                {running ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {running ? "Pause" : "Start"}
              </Button>
              <Button type="button" variant="outline" className="rounded-2xl" onClick={resetTimer}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className={dimmed ? "rounded-3xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300" : "rounded-3xl border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground"}>
            Completed {recentCount} night{recentCount === 1 ? "" : "s"} recently. If you fall asleep, that is okay.
          </div>
        </div>
      </div>
    </Card>
  );
}

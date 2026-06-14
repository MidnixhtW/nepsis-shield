import { useMemo, useState } from "react";
import { CheckCircle2, Circle, MoonStar, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { markHabitComplete, markPrayerComplete } from "@/lib/dailyHabits";
import { showSuccess } from "@/utils/toast";

const steps = [
  {
    title: "Settle",
    body: "Put the phone down when this is finished. Loosen your shoulders. Breathe slowly three times.",
  },
  {
    title: "Thanksgiving",
    body: "Lord, glory to Thee for this day, for every mercy seen and unseen, and for bringing me to this hour.",
  },
  {
    title: "Review",
    body: "Where did I receive grace today? Where did I wound another person, neglect prayer, or follow fear? Bring it simply to Christ.",
  },
  {
    title: "Repentance",
    body: "Lord Jesus Christ, Son of God, have mercy on me, a sinner. Cleanse me, forgive me, and teach me to begin again tomorrow.",
  },
  {
    title: "Entrustment",
    body: "Into Thy hands, O Lord Jesus Christ my God, I commend my soul and body. Bless me, have mercy on me, and grant me peaceful sleep.",
  },
];

const examenPrompts = [
  "One mercy I noticed today",
  "One sin or pattern to confess",
  "One person to forgive or pray for",
  "One simple act of obedience for tomorrow",
];

export function SleepMode() {
  const [stepIndex, setStepIndex] = useState(0);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [dimmed, setDimmed] = useState(false);
  const step = steps[stepIndex];
  const checklistCount = Object.values(checked).filter(Boolean).length;
  const progress = useMemo(
    () => Math.round(((stepIndex + checklistCount / examenPrompts.length) / steps.length) * 100),
    [checklistCount, stepIndex],
  );

  function finish() {
    markPrayerComplete("night", "short");
    markHabitComplete("reflection", true);
    showSuccess("Sleep mode complete. Rest in peace.");
  }

  function next() {
    if (stepIndex === steps.length - 1) {
      finish();
      return;
    }
    setStepIndex((current) => current + 1);
  }

  return (
    <Card className={dimmed ? "rounded-3xl border-border/60 bg-black p-5 text-white shadow-sm sm:p-6" : "rounded-3xl border-border/60 bg-card p-5 shadow-sm sm:p-6"}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={dimmed ? "text-xs font-semibold uppercase tracking-[0.18em] text-white/60" : "text-xs font-semibold uppercase tracking-[0.18em] text-primary"}>
            Sleep Mode
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">End the day in peace</h2>
          <p className={dimmed ? "mt-2 max-w-2xl text-sm leading-relaxed text-white/70" : "mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground"}>
            A quiet Orthodox night routine: thanksgiving, review, repentance, and entrusting yourself to Christ.
          </p>
        </div>
        <Button
          type="button"
          variant={dimmed ? "secondary" : "outline"}
          className="rounded-2xl"
          onClick={() => setDimmed((value) => !value)}
        >
          <MoonStar className="mr-2 h-4 w-4" /> {dimmed ? "Light mode" : "Dim screen"}
        </Button>
      </div>

      <div className="mt-5 grid gap-2">
        <div className={dimmed ? "flex justify-between text-xs font-medium text-white/60" : "flex justify-between text-xs font-medium text-muted-foreground"}>
          <span>Step {stepIndex + 1} of {steps.length}</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className={dimmed ? "mt-5 rounded-3xl border border-white/15 bg-white/5 p-5" : "mt-5 rounded-3xl border border-primary/15 bg-primary/5 p-5"}>
        <p className={dimmed ? "text-sm font-semibold text-white/70" : "text-sm font-semibold text-primary"}>
          {step.title}
        </p>
        <p className="mt-3 text-lg leading-relaxed sm:text-xl">{step.body}</p>
      </div>

      <Separator className={dimmed ? "my-5 bg-white/15" : "my-5"} />

      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Short evening review</p>
            <p className={dimmed ? "mt-1 text-xs text-white/60" : "mt-1 text-xs text-muted-foreground"}>
              Tap each prompt after you quietly answer it.
            </p>
          </div>
          <TimerReset className={dimmed ? "h-5 w-5 text-white/60" : "h-5 w-5 text-primary"} />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {examenPrompts.map((prompt) => {
            const done = checked[prompt];
            return (
              <button
                key={prompt}
                type="button"
                className={dimmed ? "flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-3 text-left text-sm text-white/80" : "flex items-center gap-2 rounded-2xl border border-border/60 bg-background/60 p-3 text-left text-sm"}
                onClick={() => setChecked((current) => ({ ...current, [prompt]: !done }))}
              >
                {done ? <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> : <Circle className="h-4 w-4 shrink-0 opacity-60" />}
                {prompt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant={dimmed ? "secondary" : "outline"}
          className="rounded-2xl"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((current) => current - 1)}
        >
          Back
        </Button>
        <Button type="button" className="rounded-2xl" onClick={next}>
          {stepIndex === steps.length - 1 ? "Finish for tonight" : "Next"}
        </Button>
      </div>
    </Card>
  );
}

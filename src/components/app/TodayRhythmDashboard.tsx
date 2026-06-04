import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Circle,
  HeartHandshake,
  MoonStar,
  Plus,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { AppSection } from "@/components/app/AppShell";
import {
  addIntention,
  markHabitComplete,
  removeIntention,
  setQuickState,
  toggleIntention,
  useDailyRhythm,
  type QuickStateKey,
} from "@/lib/dailyHabits";
import { showSuccess } from "@/utils/toast";

type NavigateTarget = { section: AppSection; tab?: string; read?: string };

const stateActions: Array<{
  key: QuickStateKey;
  label: string;
  helper: string;
  target: NavigateTarget;
  icon: typeof ShieldAlert;
}> = [
  {
    key: "anxious",
    label: "Anxious",
    helper: "2 minutes of stillness",
    target: { section: "pray", tab: "counter" },
    icon: ShieldAlert,
  },
  {
    key: "tired",
    label: "Tired",
    helper: "Short prayer flow",
    target: { section: "pray", tab: "daily" },
    icon: MoonStar,
  },
  {
    key: "tempted",
    label: "Tempted",
    helper: "Guard the mind",
    target: { section: "pray", tab: "prep" },
    icon: RotateCcw,
  },
  {
    key: "grateful",
    label: "Grateful",
    helper: "Capture thanks",
    target: { section: "pray", tab: "journal" },
    icon: Sparkles,
  },
];

function promptForHour(hour: number) {
  if (hour < 11) return "Morning prayer is a calm way to anchor the day.";
  if (hour < 17) return "Take one small faithful step before the day gets crowded.";
  if (hour < 21) return "Evening is a good time to give thanks and return to peace.";
  return "Before sleep, place the day in God’s hands.";
}

export function TodayRhythmDashboard({
  onNavigate,
}: {
  onNavigate?: (to: NavigateTarget) => void;
}) {
  const rhythm = useDailyRhythm();
  const [intentionText, setIntentionText] = useState("");
  const hour = useMemo(() => new Date().getHours(), []);

  const nextAction = rhythm.prayerResume
    ? {
        label: "Resume prayer",
        helper: `Continue ${rhythm.prayerResume.title} — step ${rhythm.prayerResume.stepIndex + 1} of ${rhythm.prayerResume.totalSteps}`,
        target: { section: "pray", tab: "daily" } as NavigateTarget,
      }
    : !rhythm.today.habits.prayer
      ? {
          label: hour >= 20 ? "Pray before sleep" : hour >= 12 ? "Pray this evening" : "Begin morning prayer",
          helper: promptForHour(hour),
          target: { section: "pray", tab: "daily" } as NavigateTarget,
        }
      : !rhythm.today.habits.reading
        ? {
            label: "Read today’s Scripture",
            helper: "Keep the daily readings close at hand.",
            target: { section: "read", read: "daily" } as NavigateTarget,
          }
        : !rhythm.today.habits.reflection
          ? {
              label: "Reflect briefly",
              helper: "One honest sentence is enough.",
              target: { section: "pray", tab: "journal" } as NavigateTarget,
            }
          : {
              label: "Keep watch",
              helper: "You have a steady rhythm today. Return tonight if needed.",
              target: { section: "pray", tab: "counter" } as NavigateTarget,
            };

  function addCurrentIntention() {
    if (!addIntention(intentionText)) return;
    setIntentionText("");
    showSuccess("Intention saved locally.");
  }

  function toggleHabit(label: string, habit: "reading" | "reflection" | "mercy") {
    const nextValue = !rhythm.today.habits[habit];
    markHabitComplete(habit, nextValue);
    showSuccess(nextValue ? `${label} marked for today.` : `${label} reopened for today.`);
  }

  return (
    <Card className="rounded-3xl border-primary/20 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Daily return rhythm</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Come back without pressure</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Your progress stays on this device. Missed days are not punished; the app simply helps you return.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[330px]">
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
            <p className="text-2xl font-semibold">{rhythm.streak}</p>
            <p className="text-xs text-muted-foreground">day rhythm</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
            <p className="text-2xl font-semibold">{rhythm.weekActiveDays}/7</p>
            <p className="text-xs text-muted-foreground">this week</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
            <p className="text-2xl font-semibold">{rhythm.completedToday}/4</p>
            <p className="text-xs text-muted-foreground">today</p>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="grid gap-3">
          <button
            type="button"
            className="tap rounded-2xl border border-primary/30 bg-primary/10 p-4 text-left transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onNavigate?.(nextAction.target)}
          >
            <span className="flex items-center justify-between gap-3">
              <span>
                <span className="block text-sm font-semibold text-primary">Next faithful step</span>
                <span className="mt-1 block text-lg font-semibold">{nextAction.label}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{nextAction.helper}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
            </span>
          </button>

          <div className="grid gap-2 sm:grid-cols-3">
            <Button
              type="button"
              variant={rhythm.today.habits.reading ? "default" : "outline"}
              className="h-auto min-h-11 justify-start rounded-2xl border-border/60"
              onClick={() => toggleHabit("Reading", "reading")}
            >
              <BookOpen className="mr-2 h-4 w-4" /> Reading
            </Button>
            <Button
              type="button"
              variant={rhythm.today.habits.reflection ? "default" : "outline"}
              className="h-auto min-h-11 justify-start rounded-2xl border-border/60"
              onClick={() => toggleHabit("Reflection", "reflection")}
            >
              <Check className="mr-2 h-4 w-4" /> Reflection
            </Button>
            <Button
              type="button"
              variant={rhythm.today.habits.mercy ? "default" : "outline"}
              className="h-auto min-h-11 justify-start rounded-2xl border-border/60"
              onClick={() => toggleHabit("Mercy", "mercy")}
            >
              <HeartHandshake className="mr-2 h-4 w-4" /> Mercy
            </Button>
          </div>

          <div className="grid gap-2 sm:grid-cols-4">
            {stateActions.map((item) => {
              const Icon = item.icon;
              const selected = rhythm.today.quickState === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  className={
                    "tap rounded-2xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                    (selected ? "border-primary/40 bg-primary/10" : "border-border/60 bg-muted/20 hover:bg-muted/40")
                  }
                  onClick={() => {
                    setQuickState(item.key);
                    onNavigate?.(item.target);
                  }}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Icon className="h-4 w-4 text-primary" /> {item.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.helper}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div>
            <p className="text-sm font-semibold">Prayer intentions</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Keep a short local list so every return has names and needs ready.
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              value={intentionText}
              onChange={(event) => setIntentionText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addCurrentIntention();
              }}
              placeholder="Name or intention"
              className="rounded-2xl"
            />
            <Button type="button" size="icon" className="shrink-0 rounded-2xl" onClick={addCurrentIntention}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add intention</span>
            </Button>
          </div>

          <div className="grid gap-2">
            {rhythm.intentions.length ? (
              rhythm.intentions.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-2">
                  <button
                    type="button"
                    className="text-primary"
                    onClick={() => toggleIntention(item.id)}
                    aria-label={item.answered ? "Mark intention open" : "Mark intention answered"}
                  >
                    {item.answered ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </button>
                  <span className={"min-w-0 flex-1 text-sm " + (item.answered ? "text-muted-foreground line-through" : "")}>{item.text}</span>
                  {item.answered ? <Badge className="rounded-full bg-primary/10 text-primary">answered</Badge> : null}
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeIntention(item.id)}
                    aria-label="Remove intention"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-border/70 bg-background/40 p-3 text-sm text-muted-foreground">
                Add one person, struggle, thanksgiving, or need to carry in prayer.
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

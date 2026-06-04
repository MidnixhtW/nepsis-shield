import { useMemo, useState } from "react";
import { ArrowRight, Check, Circle, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AppSection } from "@/components/app/AppShell";
import { NeedHelpNow } from "@/components/app/NeedHelpNow";
import {
  addIntention,
  markHabitComplete,
  removeIntention,
  saveGlobalResume,
  toggleIntention,
  useDailyRhythm,
} from "@/lib/dailyHabits";
import { showSuccess } from "@/utils/toast";

type NavigateTarget = { section: AppSection; tab?: string; read?: string; path?: string };

function promptForHour(hour: number) {
  if (hour < 11) return "Pray first.";
  if (hour < 17) return "Take one faithful step.";
  if (hour < 21) return "Return in peace.";
  return "Place the day in God’s hands.";
}

function navigateToTarget(onNavigate: ((to: NavigateTarget) => void) | undefined, target: NavigateTarget) {
  if (target.section) onNavigate?.(target);
}

export function TodayRhythmDashboard({
  onNavigate,
}: {
  onNavigate?: (to: NavigateTarget) => void;
}) {
  const rhythm = useDailyRhythm();
  const [intentionText, setIntentionText] = useState("");
  const [showIntentions, setShowIntentions] = useState(false);
  const hour = useMemo(() => new Date().getHours(), []);

  const nextAction = rhythm.prayerResume
    ? {
        label: "Resume prayer",
        helper: `${rhythm.prayerResume.title} · ${rhythm.prayerResume.stepIndex + 1}/${rhythm.prayerResume.totalSteps}`,
        target: { section: "pray", tab: "daily" } as NavigateTarget,
      }
    : rhythm.globalResume
      ? {
          label: rhythm.globalResume.label,
          helper: rhythm.globalResume.helper,
          target: rhythm.globalResume.target as NavigateTarget,
        }
      : !rhythm.today.habits.prayer
        ? {
            label: hour >= 20 ? "Pray before sleep" : hour >= 12 ? "Evening prayer" : "Morning prayer",
            helper: promptForHour(hour),
            target: { section: "pray", tab: "daily" } as NavigateTarget,
          }
        : !rhythm.today.habits.reading
          ? {
              label: "Read today",
              helper: "One passage is enough.",
              target: { section: "read", read: "daily" } as NavigateTarget,
            }
          : {
              label: "Keep watch",
              helper: "You returned today.",
              target: { section: "pray", tab: "counter" } as NavigateTarget,
            };

  function addCurrentIntention() {
    if (!addIntention(intentionText)) return;
    setIntentionText("");
    showSuccess("Intention saved locally.");
  }

  return (
    <div className="grid gap-3">
      <Card className="rounded-3xl border-primary/20 bg-card p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <button
            type="button"
            className="tap rounded-2xl border border-primary/25 bg-primary/10 p-4 text-left transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => {
              saveGlobalResume({
                label: nextAction.label,
                helper: nextAction.helper,
                target: nextAction.target,
              });
              navigateToTarget(onNavigate, nextAction.target);
            }}
          >
            <span className="flex items-center justify-between gap-4">
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-primary">Return</span>
                <span className="mt-1 block text-xl font-semibold tracking-tight">{nextAction.label}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{nextAction.helper}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
            </span>
          </button>

          <div className="grid grid-cols-3 gap-2 text-center sm:w-[290px]">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
              <p className="text-xl font-semibold">{rhythm.streak}</p>
              <p className="text-[11px] text-muted-foreground">days</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
              <p className="text-xl font-semibold">{rhythm.weekActiveDays}/7</p>
              <p className="text-[11px] text-muted-foreground">week</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
              <p className="text-xl font-semibold">{rhythm.completedToday}/4</p>
              <p className="text-[11px] text-muted-foreground">today</p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={rhythm.today.habits.reading ? "default" : "outline"}
            className="rounded-2xl border-border/60"
            onClick={() => markHabitComplete("reading", !rhythm.today.habits.reading)}
          >
            Reading
          </Button>
          <Button
            type="button"
            size="sm"
            variant={rhythm.today.habits.reflection ? "default" : "outline"}
            className="rounded-2xl border-border/60"
            onClick={() => markHabitComplete("reflection", !rhythm.today.habits.reflection)}
          >
            Reflection
          </Button>
          <Button
            type="button"
            size="sm"
            variant={rhythm.today.habits.mercy ? "default" : "outline"}
            className="rounded-2xl border-border/60"
            onClick={() => markHabitComplete("mercy", !rhythm.today.habits.mercy)}
          >
            Mercy
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="rounded-2xl"
            onClick={() => setShowIntentions((value) => !value)}
          >
            Intentions
            {rhythm.intentions.length ? (
              <Badge className="ml-2 rounded-full bg-primary/10 text-primary">{rhythm.intentions.length}</Badge>
            ) : null}
          </Button>
        </div>

        {showIntentions ? (
          <div className="mt-3 grid gap-2 rounded-2xl border border-border/60 bg-muted/20 p-3">
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

            {rhythm.intentions.slice(0, 4).map((item) => (
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
                <button
                  type="button"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeIntention(item.id)}
                  aria-label="Remove intention"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </Card>

      <NeedHelpNow onNavigate={onNavigate} />
    </div>
  );
}

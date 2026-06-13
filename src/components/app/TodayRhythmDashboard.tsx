import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Circle,
  Flame,
  Hand,
  HeartHandshake,
  PenLine,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AppSection } from "@/components/app/AppShell";
import { NeedHelpNow } from "@/components/app/NeedHelpNow";
import {
  markHabitComplete,
  saveGlobalResume,
  useDailyRhythm,
  type DailyHabitKey,
} from "@/lib/dailyHabits";

type NavigateTarget = { section: AppSection; tab?: string; read?: string; path?: string };

type Mission = {
  key: DailyHabitKey;
  label: string;
  line: string;
  target: NavigateTarget;
  icon: typeof Hand;
};

const missions: Mission[] = [
  {
    key: "prayer",
    label: "Pray",
    line: "Start with a short, focused rule.",
    target: { section: "pray", tab: "daily" },
    icon: Hand,
  },
  {
    key: "reading",
    label: "Read",
    line: "Open today’s Scripture readings.",
    target: { section: "read", read: "daily" },
    icon: BookOpen,
  },
  {
    key: "reflection",
    label: "Reflect",
    line: "Write one sentence from the day.",
    target: { section: "pray", tab: "journal" },
    icon: PenLine,
  },
  {
    key: "mercy",
    label: "Mercy",
    line: "Choose one quiet act of love.",
    target: { section: "learn", tab: "guide" },
    icon: HeartHandshake,
  },
];

export function TodayRhythmDashboard({
  onNavigate,
}: {
  onNavigate?: (to: NavigateTarget) => void;
}) {
  const rhythm = useDailyRhythm();
  const progress = Math.round((rhythm.completedToday / missions.length) * 100);
  const nextMission = missions.find((mission) => !rhythm.today.habits[mission.key]) ?? missions[0];
  const strongestHabit = missions.reduce((best, mission) =>
    rhythm.weekHabitTotals[mission.key] > rhythm.weekHabitTotals[best.key] ? mission : best,
  );
  const growthHabit = missions.reduce((lowest, mission) =>
    rhythm.weekHabitTotals[mission.key] < rhythm.weekHabitTotals[lowest.key] ? mission : lowest,
  );
  const weeklyInsight = rhythm.weekActiveDays === 0
    ? "Start with one tiny action today. Consistency begins small."
    : rhythm.weekActiveDays >= 5
      ? "Strong rhythm this week. Keep it peaceful, not pressured."
      : `Your next growth area is ${growthHabit.label.toLowerCase()}. Keep it simple.`;

  function openMission(mission: Mission) {
    saveGlobalResume({
      label: `${mission.label} mission`,
      helper: mission.line,
      target: mission.target,
    });
    onNavigate?.(mission.target);
  }

  function completeMission(mission: Mission) {
    markHabitComplete(mission.key, !rhythm.today.habits[mission.key]);
  }

  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden rounded-3xl border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Daily mission
              </span>
              <span className="inline-flex items-center rounded-full bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Flame className="mr-1.5 h-3.5 w-3.5 text-primary" />
                {rhythm.streak} day streak
              </span>
              <span className="inline-flex items-center rounded-full bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Trophy className="mr-1.5 h-3.5 w-3.5 text-primary" />
                {rhythm.weekActiveDays}/7 active this week
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {progress === 100 ? "Today’s rhythm is complete." : `Next: ${nextMission.label}`}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {progress === 100
                ? "Keep it simple: protect the peace you’ve received and return tomorrow."
                : nextMission.line}
            </p>

            <div className="mt-5 grid gap-2 sm:max-w-xl">
              <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
                <span>{rhythm.completedToday} of {missions.length} completed</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:w-[26rem]">
            {missions.map((mission) => {
              const Icon = mission.icon;
              const completed = rhythm.today.habits[mission.key];

              return (
                <div
                  key={mission.key}
                  className="rounded-2xl border border-border/60 bg-background/70 p-3 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="tap mt-0.5 text-primary transition hover:scale-105"
                      onClick={() => completeMission(mission)}
                      aria-label={`${completed ? "Mark incomplete" : "Mark complete"}: ${mission.label}`}
                    >
                      {completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-sm font-semibold">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                        {mission.label}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {mission.line}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant={completed ? "ghost" : "outline"}
                    size="sm"
                    className="tap mt-3 h-9 w-full rounded-xl border-border/70 bg-background/60"
                    onClick={() => openMission(mission)}
                  >
                    {completed ? "Open again" : "Start"}
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <BarChart3 className="mr-2 h-4 w-4 text-primary" /> Weekly insight
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">{weeklyInsight}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Strongest this week: {strongestHabit.label} · Growth focus: {growthHabit.label}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-4 lg:min-w-[28rem]">
            {missions.map((mission) => {
              const Icon = mission.icon;
              const total = rhythm.weekHabitTotals[mission.key];
              return (
                <div key={mission.key} className="rounded-2xl border border-border/60 bg-muted/20 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">{total}/7</span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-muted-foreground">{mission.label}</p>
                  <Progress value={Math.round((total / 7) * 100)} className="mt-2 h-1.5" />
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <NeedHelpNow onNavigate={onNavigate} />
    </div>
  );
}

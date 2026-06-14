import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Flame, Hand, HeartHandshake, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { markHabitComplete } from "@/lib/dailyHabits";
import { showSuccess } from "@/utils/toast";

const STORE_KEY = "prayer-challenges:v1";

type Challenge = {
  id: string;
  title: string;
  subtitle: string;
  days: string[];
  icon: typeof Sparkles;
  habit?: "prayer" | "reading" | "reflection" | "mercy";
};

type ChallengeStore = Record<string, { startedAt?: number; completedDays: number[] }>;

const challenges: Challenge[] = [
  {
    id: "jesus-prayer-7",
    title: "7 Days of the Jesus Prayer",
    subtitle: "Short, repeatable practice for attention and mercy.",
    icon: Hand,
    habit: "prayer",
    days: [
      "Say the Jesus Prayer slowly 12 times.",
      "Say it 25 times, returning gently when distracted.",
      "Pray it for someone who frustrates you.",
      "Use it during one stressful moment today.",
      "Say it before checking your phone tonight.",
      "Pray it with three slow breaths.",
      "Close the week with gratitude and 33 repetitions.",
    ],
  },
  {
    id: "psalms-7",
    title: "7 Days with the Psalms",
    subtitle: "A simple way back into Scripture and prayer.",
    icon: BookOpen,
    habit: "reading",
    days: [
      "Read Psalm 1 and choose one phrase to carry.",
      "Read Psalm 22/23 and pray for trust.",
      "Read Psalm 50/51 and ask for a clean heart.",
      "Read Psalm 62/63 and sit quietly for one minute.",
      "Read Psalm 90/91 and pray for protection.",
      "Read Psalm 102/103 and name three mercies.",
      "Read Psalm 142/143 and ask God to teach you His will.",
    ],
  },
  {
    id: "watchfulness-14",
    title: "14 Days of Watchfulness",
    subtitle: "Small prompts for discipline without panic or shame.",
    icon: ShieldCheck,
    habit: "reflection",
    days: Array.from({ length: 14 }, (_, index) => {
      const prompts = [
        "Notice one thought before acting on it.",
        "Pause before one reply; answer with peace.",
        "Keep one meal simple and give thanks.",
        "Put the phone away for ten quiet minutes.",
        "Make a short examination before sleep.",
        "Ask forgiveness quickly if you wound someone.",
        "Do one hidden act of mercy.",
      ];
      return prompts[index % prompts.length];
    }),
  },
  {
    id: "mercy-7",
    title: "7 Days of Mercy",
    subtitle: "Practice love in concrete, quiet ways.",
    icon: HeartHandshake,
    habit: "mercy",
    days: [
      "Pray by name for someone who needs help.",
      "Send one encouraging message.",
      "Do one chore or task without announcing it.",
      "Give something small: time, attention, money, or patience.",
      "Let someone else speak first.",
      "Forgive one irritation before it grows.",
      "Thank God for one person and bless them silently.",
    ],
  },
];

function readStore(): ChallengeStore {
  return getStoredItem<ChallengeStore>(STORE_KEY) ?? {};
}

function saveStore(store: ChallengeStore) {
  setStoredItem(STORE_KEY, store);
}

export function PrayerChallenges() {
  const [store, setStore] = useState(readStore);
  const [selectedId, setSelectedId] = useState(challenges[0].id);
  const selected = challenges.find((challenge) => challenge.id === selectedId) ?? challenges[0];
  const selectedState = store[selected.id] ?? { completedDays: [] };
  const completedCount = selectedState.completedDays.length;
  const nextDay = Math.min(completedCount + 1, selected.days.length);
  const progress = Math.round((completedCount / selected.days.length) * 100);
  const Icon = selected.icon;

  const activeChallenges = useMemo(
    () => challenges.filter((challenge) => (store[challenge.id]?.completedDays.length ?? 0) > 0).length,
    [store],
  );

  function update(next: ChallengeStore) {
    setStore(next);
    saveStore(next);
  }

  function startChallenge(challenge: Challenge) {
    update({
      ...store,
      [challenge.id]: store[challenge.id] ?? { startedAt: Date.now(), completedDays: [] },
    });
    setSelectedId(challenge.id);
  }

  function toggleDay(dayIndex: number) {
    const current = store[selected.id] ?? { startedAt: Date.now(), completedDays: [] };
    const exists = current.completedDays.includes(dayIndex);
    const completedDays = exists
      ? current.completedDays.filter((day) => day !== dayIndex)
      : [...current.completedDays, dayIndex].sort((a, b) => a - b);

    update({ ...store, [selected.id]: { ...current, completedDays } });

    if (!exists) {
      if (selected.habit) markHabitComplete(selected.habit, true);
      showSuccess("Challenge day marked complete.");
    }
  }

  function resetSelected() {
    const next = { ...store };
    delete next[selected.id];
    update(next);
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Challenges</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Choose a guided path.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Short Orthodox practice plans for prayer, Scripture, watchfulness, and mercy.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-xs font-semibold">
            {activeChallenges} active
          </Badge>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="grid content-start gap-2">
          {challenges.map((challenge) => {
            const ChallengeIcon = challenge.icon;
            const count = store[challenge.id]?.completedDays.length ?? 0;
            const active = challenge.id === selected.id;
            return (
              <Button
                key={challenge.id}
                type="button"
                variant={active ? "secondary" : "outline"}
                className="h-auto justify-start rounded-3xl border-border/60 p-4 text-left"
                onClick={() => startChallenge(challenge)}
              >
                <ChallengeIcon className="mr-3 h-5 w-5 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight">{challenge.title}</span>
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    {count}/{challenge.days.length} complete
                  </span>
                </span>
              </Button>
            );
          })}
        </div>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{selected.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{selected.subtitle}</p>
              </div>
            </div>
            <Button type="button" variant="outline" className="rounded-2xl" onClick={resetSelected}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>

          <div className="mt-5 grid gap-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>{completedCount} of {selected.days.length} days</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Separator className="my-5" />

          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Flame className="h-4 w-4 text-primary" /> Today’s focus: Day {nextDay}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {selected.days[nextDay - 1]}
            </p>
          </div>

          <div className="mt-4 grid gap-2">
            {selected.days.map((day, index) => {
              const dayNumber = index + 1;
              const done = selectedState.completedDays.includes(dayNumber);
              return (
                <button
                  key={dayNumber}
                  type="button"
                  className="tap flex gap-3 rounded-2xl border border-border/60 bg-background/50 p-3 text-left hover:border-primary/40"
                  onClick={() => toggleDay(dayNumber)}
                >
                  <CheckCircle2 className={done ? "mt-0.5 h-5 w-5 shrink-0 text-primary" : "mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/40"} />
                  <span>
                    <span className="block text-sm font-semibold">Day {dayNumber}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">{day}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

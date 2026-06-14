import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Circle, Flame, Hand, MoonStar, ShieldCheck, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { markHabitComplete } from "@/lib/dailyHabits";
import { showSuccess } from "@/utils/toast";

const STORE_KEY = "prayer_challenges:v1";

type ChallengeId = "jesus-prayer" | "psalms" | "watchfulness" | "peace" | "sleep";

type Challenge = {
  id: ChallengeId;
  title: string;
  days: number;
  subtitle: string;
  dailyAction: string;
  icon: typeof Flame;
};

type ChallengeStore = Partial<Record<ChallengeId, string[]>>;

const challenges: Challenge[] = [
  {
    id: "jesus-prayer",
    title: "7 Days of the Jesus Prayer",
    days: 7,
    subtitle: "Build a quiet, repeatable prayer habit.",
    dailyAction: "Pray the Jesus Prayer slowly for two minutes.",
    icon: Target,
  },
  {
    id: "psalms",
    title: "7 Days with the Psalms",
    days: 7,
    subtitle: "Let Scripture give words to your prayer.",
    dailyAction: "Read one Psalm and write one phrase to carry.",
    icon: BookOpen,
  },
  {
    id: "watchfulness",
    title: "14 Days of Watchfulness",
    days: 14,
    subtitle: "Practice attention, repentance, and quick return.",
    dailyAction: "Notice one temptation early and answer it with prayer.",
    icon: ShieldCheck,
  },
  {
    id: "peace",
    title: "7 Days for Anxiety & Peace",
    days: 7,
    subtitle: "A simple path for anxious moments.",
    dailyAction: "Pause, breathe, and pray: Lord Jesus Christ, have mercy.",
    icon: Hand,
  },
  {
    id: "sleep",
    title: "7 Nights of Peaceful Sleep",
    days: 7,
    subtitle: "End each day with review and entrustment.",
    dailyAction: "Complete Sleep Mode before bed.",
    icon: MoonStar,
  },
];

function todayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadStore(): ChallengeStore {
  return getStoredItem<ChallengeStore>(STORE_KEY) ?? {};
}

function saveStore(store: ChallengeStore) {
  setStoredItem(STORE_KEY, store);
}

export function PrayerChallenges() {
  const [store, setStore] = useState<ChallengeStore>(() => loadStore());
  const [activeId, setActiveId] = useState<ChallengeId>("jesus-prayer");
  const active = challenges.find((challenge) => challenge.id === activeId) ?? challenges[0];
  const completedDates = useMemo(() => store[active.id] ?? [], [active.id, store]);
  const todayDone = completedDates.includes(todayKey());
  const progress = Math.min(100, Math.round((completedDates.length / active.days) * 100));

  function updateChallenge(id: ChallengeId, dates: string[]) {
    const nextStore = { ...store, [id]: dates.slice(0, 60) };
    setStore(nextStore);
    saveStore(nextStore);
  }

  function startChallenge(challenge: Challenge) {
    if (!store[challenge.id]) updateChallenge(challenge.id, []);
    setActiveId(challenge.id);
  }

  function toggleToday() {
    const key = todayKey();
    const nextDates = todayDone
      ? completedDates.filter((date) => date !== key)
      : [key, ...completedDates];

    updateChallenge(active.id, nextDates);
    if (!todayDone) {
      if (active.id === "psalms") markHabitComplete("reading", true);
      else markHabitComplete("prayer", true);
      showSuccess("Challenge day marked complete.");
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Challenges</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Choose a guided path</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Short Orthodox practice challenges for consistency without pressure. Miss a day, then simply begin again.
        </p>

        <div className="mt-5 grid gap-2">
          {challenges.map((challenge) => {
            const Icon = challenge.icon;
            const count = store[challenge.id]?.length ?? 0;
            const selected = active.id === challenge.id;

            return (
              <button
                key={challenge.id}
                type="button"
                className={selected ? "rounded-2xl border border-primary/35 bg-primary/10 p-3 text-left" : "rounded-2xl border border-border/60 bg-background/60 p-3 text-left hover:bg-muted/60"}
                onClick={() => startChallenge(challenge)}
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{challenge.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{challenge.subtitle}</span>
                  </span>
                  <Badge variant="secondary" className="rounded-full">{count}/{challenge.days}</Badge>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Active challenge</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{active.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{active.subtitle}</p>
          </div>
          <Badge className="rounded-full px-3 py-1">{active.days} days</Badge>
        </div>

        <div className="mt-5 grid gap-2">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>{completedDates.length} of {active.days} days complete</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mt-5 rounded-3xl border border-primary/15 bg-primary/5 p-4">
          <p className="text-sm font-semibold">Today’s action</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{active.dailyAction}</p>
        </div>

        <Button type="button" className="mt-5 h-11 w-full rounded-2xl" onClick={toggleToday}>
          {todayDone ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Circle className="mr-2 h-4 w-4" />}
          {todayDone ? "Completed today" : "Mark today complete"}
        </Button>

        <div className="mt-5 grid grid-cols-7 gap-1.5" aria-label="Challenge progress days">
          {Array.from({ length: active.days }).map((_, index) => {
            const done = index < completedDates.length;
            return (
              <div
                key={index}
                className={done ? "grid h-9 place-items-center rounded-xl bg-primary text-xs font-semibold text-primary-foreground" : "grid h-9 place-items-center rounded-xl bg-muted text-xs font-semibold text-muted-foreground"}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

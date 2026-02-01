import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Minus, Plus, RotateCcw, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function storageKeyForDay(dayKey: string) {
  return `jesus_prayer_count:${dayKey}`;
}

function goalKey() {
  return `jesus_prayer_goal`;
}

export function JesusPrayerCounter() {
  const dayKey = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(100);
  const [goalDraft, setGoalDraft] = useState("100");

  useEffect(() => {
    const rawCount = localStorage.getItem(storageKeyForDay(dayKey));
    const rawGoal = localStorage.getItem(goalKey());

    setCount(rawCount ? Number(rawCount) || 0 : 0);
    const g = rawGoal ? Number(rawGoal) || 100 : 100;
    setGoal(g);
    setGoalDraft(String(g));
  }, [dayKey]);

  useEffect(() => {
    localStorage.setItem(storageKeyForDay(dayKey), String(count));
  }, [count, dayKey]);

  const pct = goal > 0 ? Math.min(100, Math.round((count / goal) * 100)) : 0;

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Jesus Prayer rope</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              “Lord Jesus Christ, Son of God, have mercy on me, a sinner.”
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
                <DialogTitle>Set today’s goal</DialogTitle>
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
                    localStorage.setItem(goalKey(), String(g));
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
              <p className="mt-2 text-xs text-muted-foreground">{pct}%</p>
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
              onClick={() => setCount((c) => c + 1)}
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
              onClick={() => setCount((c) => c + 10)}
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
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold tracking-tight">OCA reference</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Read: “The Jesus Prayer” (OCA)
        </p>
        <div className="mt-4">
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <a
              href="https://www.oca.org/orthodoxy/the-orthodox-faith/spirituality/prayer-fasting-and-almsgiving/the-jesus-prayer"
              target="_blank"
              rel="noreferrer"
            >
              Open article
            </a>
          </Button>
        </div>
      </Card>
    </div>
  );
}

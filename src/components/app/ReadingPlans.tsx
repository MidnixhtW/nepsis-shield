import { useEffect, useMemo, useState } from "react";
import { useCurrentDay } from "@/hooks/useCurrentDay";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import { BookOpen, CalendarDays, CheckCircle2, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getStoredItem, removeStoredItem, setStoredItem } from "@/lib/deviceStorage";

function dayKey(d = new Date()) {
  return format(d, "yyyy-MM-dd");
}

function doneKey(planId: string, day: string) {
  return `plans:done:${planId}:${day}`;
}

function gospelStartKey() {
  return "plans:gospels_start";
}

type PlanCard = {
  id: string;
  title: string;
  description: string;
  todayLabel: string;
  refToOpen: string;
};

function weeklyPsalterPortion(date: Date) {
  // Simple 7-day schedule (20 kathismata). Commonly used pattern.

  // 1..20 spread across the week.
  const dow = Number(format(date, "i")); // 1=Mon..7=Sun
  const schedule: Record<number, number[]> = {
    1: [1, 2, 3],
    2: [4, 5, 6],
    3: [7, 8, 9],
    4: [10, 11, 12],
    5: [13, 14, 15],
    6: [16, 17, 18],
    7: [19, 20],
  };
  const ks = schedule[dow] ?? [1];
  // Equivalent whole-Psalm boundaries in Hebrew/KJV numbering, not LXX numbering.
  const boundaries = [1, 9, 18, 25, 33, 38, 47, 56, 65, 71, 78, 86, 92, 102, 106, 110, 119, 120, 135, 144, 151];
  const first = boundaries[ks[0] - 1];
  const last = boundaries[ks[ks.length - 1]] - 1;
  return { label: `Kathismata ${ks.join(", ")} · Psalms ${first}–${last} (KJV numbering)`, ref: `Psalms ${first}-${last}` };
}

const GOSPEL_CHAPTERS: Array<{ ref: string }> = [
  ...Array.from({ length: 28 }, (_, i) => ({ ref: `Matthew ${i + 1}` })),
  ...Array.from({ length: 16 }, (_, i) => ({ ref: `Mark ${i + 1}` })),
  ...Array.from({ length: 24 }, (_, i) => ({ ref: `Luke ${i + 1}` })),
  ...Array.from({ length: 21 }, (_, i) => ({ ref: `John ${i + 1}` })),
];

function daysBetween(startIso: string, now: Date) {
  const t0 = Date.parse(`${startIso}T00:00:00.000Z`);
  const t1 = Date.parse(`${dayKey(now)}T00:00:00.000Z`);
  if (!Number.isFinite(t0) || !Number.isFinite(t1)) return 0;
  return Math.max(0, Math.floor((t1 - t0) / (1000 * 60 * 60 * 24)));
}

export function ReadingPlans() {
  const navigate = useNavigate();
  const today = useCurrentDay();
  const todayIso = useMemo(() => dayKey(today), [today]);
  const [completion, setCompletion] = useState<Record<string, boolean>>({});

  useEffect(() => {
    function load() {
      setCompletion({
        psalter: Boolean(getStoredItem<boolean>(doneKey("psalter", todayIso))),
        gospels: Boolean(getStoredItem<boolean>(doneKey("gospels", todayIso))),
      });
    }
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, [todayIso]);

  const [gospelStart, setGospelStart] = useState<string | null>(
    getStoredItem<string>(gospelStartKey()),
  );

  const gospelDayIndex = useMemo(() => {
    if (!gospelStart) return 0;
    return daysBetween(gospelStart, today);
  }, [gospelStart, today]);

  const gospelRef = GOSPEL_CHAPTERS[gospelDayIndex]?.ref ?? "Matthew 1";

  const psalterToday = weeklyPsalterPortion(today);

  const plans: PlanCard[] = [
    {
      id: "psalter",
      title: "Psalter (weekly kathismata)",
      description:
        "A simple weekly rhythm. Opens the equivalent Psalms in KJV numbering; your liturgical Psalter may use LXX numbering. If you miss a day, just continue with peace.",
      todayLabel: psalterToday.label,
      refToOpen: psalterToday.ref,
    },
    {
      id: "gospels",
      title: "Gospels (1 chapter/day)",
      description:
        "A starter plan that walks straight through the four Gospels.",
      todayLabel: gospelRef,
      refToOpen: gospelRef,
    },
  ];

  function setDone(planId: string, done: boolean) {
    setStoredItem(doneKey(planId, todayIso), done, { ttlMs: 1000 * 60 * 60 * 24 * 60 });
    setCompletion((previous) => ({ ...previous, [planId]: done }));
  }

  function openRef(ref: string, planId: string) {
    navigate(`/read?read=bible&ref=${encodeURIComponent(ref)}${planId === "psalter" ? "&base=kjv" : ""}`);
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Reading plans</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Small, consistent Scripture, built for real life.
            </p>

          </div>
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3">
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {format(today, "MMMM d")}
                </Badge>
                <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Tap "Open" to read
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                Today
              </div>
            </div>
          </div>

          {plans.map((p) => {
            const done = completion[p.id] ?? false;
            return (
              <div
                key={p.id}
                className="rounded-3xl border border-border/60 bg-background/50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold tracking-tight">{p.title}</p>
                      {done ? (
                        <Badge className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                          Done
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    <p className="mt-2 text-sm font-semibold">Today: {p.todayLabel}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button
                      type="button"
                      className="h-10 rounded-2xl"
                      aria-label={`Open ${p.todayLabel}`}
                      onClick={() => openRef(p.refToOpen, p.id)}
                    >
                      <Play className="mr-2 h-4 w-4" /> Open
                    </Button>

                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Checkbox
                        aria-label={`Mark ${p.title} done for today`}
                        checked={done}
                        onCheckedChange={(v) => setDone(p.id, v === true)}
                      />
                      Mark done
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Gospel plan start date</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Start today (recommended), or reset anytime.
            </p>
          </div>
          <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">
            {gospelStart ? (
              <>
                Started: <span className="font-semibold">{gospelStart}</span> • Day {gospelDayIndex + 1}
              </>
            ) : (
              <span className="text-muted-foreground">Not started yet.</span>
            )}
          </p>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="rounded-2xl"
              onClick={() => {
                setStoredItem(gospelStartKey(), todayIso, { ttlMs: 1000 * 60 * 60 * 24 * 365 });
                setGospelStart(todayIso);
              }}
            >
              Start today
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-border/60"
              onClick={() => {
                removeStoredItem(gospelStartKey());
                setGospelStart(null);
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Note: reading plans are devotional helpers; adapt with your priest/spiritual father.
        </p>
      </Card>
    </div>
  );
}
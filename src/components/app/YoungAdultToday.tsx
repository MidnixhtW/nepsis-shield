import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  CheckCircle2,
  Copy,
  Flame,
  Heart,
  Leaf,
  MessageCircleHeart,
  Sparkles,
  Timer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Progress } from "@/components/ui/progress";
import type { DailyData } from "@/lib/orthocal";
import {
  cleanupStoredByPrefix,
  getStoredItem,
  removeStoredItem,
  setStoredItem,
} from "@/lib/deviceStorage";
import { showError, showSuccess } from "@/utils/toast";

const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

type Micro = {
  id: string;
  label: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
};

const MICROS: Micro[] = [
  {
    id: "stillness",
    label: "2 minutes of stillness",
    detail: "Sit quietly, breathe slowly, and say the Jesus Prayer a few times.",
    icon: Timer,
  },
  {
    id: "rope",
    label: "10 Jesus Prayers",
    detail: "Slow, attentive, without rushing.",
    icon: Sparkles,
  },
  {
    id: "mercy",
    label: "One act of mercy",
    detail: "A text, a call, a small gift, or a hidden kindness.",
    icon: Heart,
  },
  {
    id: "reconcile",
    label: "Make peace",
    detail: "Send a simple “forgive me” or “I’m praying for you.”",
    icon: MessageCircleHeart,
  },
];

function doneKey(dayKey: string) {
  return `young:micro:done:${dayKey}`;
}

function choiceKey(dayKey: string) {
  return `young:micro:choice:${dayKey}`;
}

function prevDayStr(dayKey: string) {
  const [y, m, d] = dayKey.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return format(dt, "yyyy-MM-dd");
}

function computeStreak(todayKey: string) {
  let streak = 0;
  let expected = todayKey;

  for (let i = 0; i < 30; i++) {
    const done = getStoredItem<boolean>(doneKey(expected));
    if (!done) break;
    streak += 1;
    expected = prevDayStr(expected);
  }

  return streak;
}

function buildFocus(data: DailyData) {
  const isFast = !data.fasting.description.toLowerCase().includes("no fast");
  const saint = data.saints[0];

  if (isFast) {
    return {
      title: "Today’s focus",
      line: `Practice mercy with your meals and your words.${saint ? ` (Remembering: ${saint})` : ""}`,
      badge: { label: "Fast day", icon: Leaf },
    };
  }

  return {
    title: "Today’s focus",
    line: `Slow down and pray simply.${saint ? ` (Remembering: ${saint})` : ""}`,
    badge: { label: "Fast-free", icon: Flame },
  };
}

export function YoungAdultToday({
  dayKey,
  data,
}: {
  dayKey: string;
  data: DailyData;
}) {
  const focus = useMemo(() => buildFocus(data), [data]);

  const [choice, setChoice] = useState<string>(MICROS[0].id);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    cleanupStoredByPrefix("young:micro:", TTL_MS);

    const savedChoice = getStoredItem<string>(choiceKey(dayKey));
    if (savedChoice && MICROS.some((m) => m.id === savedChoice)) setChoice(savedChoice);

    const savedDone = getStoredItem<boolean>(doneKey(dayKey));
    setDone(Boolean(savedDone));

    setStreak(computeStreak(dayKey));
  }, [dayKey]);

  useEffect(() => {
    setStoredItem(choiceKey(dayKey), choice, { ttlMs: TTL_MS });
  }, [choice, dayKey]);

  useEffect(() => {
    setStoredItem(doneKey(dayKey), done, { ttlMs: TTL_MS });
    setStreak(computeStreak(dayKey));
  }, [done, dayKey]);

  const selected = MICROS.find((m) => m.id === choice) ?? MICROS[0];
  const SelectedIcon = selected.icon;

  const pct = done ? 100 : 0;

  async function copyShare() {
    try {
      const lines = [
        `${focus.title}: ${focus.line}`,
        `Micro-commitment: ${selected.label}${done ? " (done)" : ""}`,
        `Verify readings/calendar: ${data.sources.ocaDailyUrl}`,
      ];
      await navigator.clipboard.writeText(lines.join("\n"));
      showSuccess("Copied.");
    } catch {
      showError("Couldn't copy.");
    }
  }

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight">{focus.title}</h3>
            <Badge
              className={
                "rounded-full px-3 py-1 text-xs font-semibold " +
                (focus.badge.label === "Fast day"
                  ? "bg-amber-500/15 text-amber-800 dark:text-amber-200"
                  : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200")
              }
            >
              <span className="inline-flex items-center gap-1">
                <focus.badge.icon className="h-3.5 w-3.5" /> {focus.badge.label}
              </span>
            </Badge>
            {streak > 0 ? (
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Streak: {streak}
              </Badge>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{focus.line}</p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-2xl border-border/60"
            onClick={copyShare}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy</span>
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Micro-commitment</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick one small thing you can actually do today.
          </p>

          <ToggleGroup
            type="single"
            value={choice}
            onValueChange={(v) => v && setChoice(v)}
            className="mt-3 flex flex-wrap justify-start gap-2"
          >
            {MICROS.map((m) => {
              const Icon = m.icon;
              return (
                <ToggleGroupItem
                  key={m.id}
                  value={m.id}
                  className="h-9 rounded-2xl border border-border/60 px-3 text-xs font-semibold data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10"
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" /> {m.label}
                  </span>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>

          <div className="mt-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{selected.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{selected.detail}</p>
              </div>
              <SelectedIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <label className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/50 px-4 py-3">
                <Checkbox checked={done} onCheckedChange={(v) => setDone(Boolean(v))} />
                <span className="text-sm font-semibold">
                  {done ? "Done" : "Mark as done"}
                </span>
              </label>

              <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                <CheckCircle2 className={done ? "h-4 w-4 text-primary" : "h-4 w-4"} />
                Saved locally
              </div>
            </div>

            <Progress value={pct} className="mt-3 h-2.5 rounded-full" />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">Stored on this device (auto-expires).</p>
              <Button
                type="button"
                variant="ghost"
                className="h-9 rounded-2xl text-muted-foreground hover:text-foreground"
                onClick={() => {
                  removeStoredItem(doneKey(dayKey));
                  removeStoredItem(choiceKey(dayKey));
                  setDone(false);
                  setChoice(MICROS[0].id);
                  showSuccess("Cleared for today.");
                }}
              >
                Clear today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

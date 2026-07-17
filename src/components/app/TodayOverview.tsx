import { ReactNode, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowRight,
  BookOpen,
  CalendarPlus,
  CheckCircle2,
  Church,
  Compass,
  ExternalLink,
  Flame,
  Leaf,
  MoonStar,
  PenLine,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { fetchDailyData } from "@/lib/orthocal";
import type { AppSection } from "@/components/app/AppShell";
import { DutyModeCard } from "@/components/app/DutyModeCard";
import { GroundMeNow } from "@/components/app/GroundMeNow";
import { TodayRhythmDashboard } from "@/components/app/TodayRhythmDashboard";
import { createSimpleIcs, downloadTextFile } from "@/lib/ics";
import { showError, showSuccess } from "@/utils/toast";
import { getSettings } from "@/lib/settings";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { hallowCardClass, hallowGlowClass } from "@/components/app/hallowCard";

import {
  responderModeAccentClasses,
  responderModeLabels,
  responderModeShortLabels,
  useResponderMode,
} from "@/lib/responderMode";

function fastingGuidanceLines(description: string, exception?: string) {

  const raw = `${description} ${exception ?? ""}`.toLowerCase();

  const fastFree = raw.includes("no fast") || raw.includes("fast free");
  if (fastFree) {
    return {
      from: "",
      allowed: "All foods",
    };
  }

  const from: string[] = ["meat", "dairy"];
  const allowed: string[] = ["plant-based foods"];

  if (raw.includes("fish")) allowed.push("fish");
  if (raw.includes("wine")) allowed.push("wine");
  if (raw.includes("oil")) allowed.push("oil");

  return {
    from: `From: ${from.join(", ")}`,
    allowed: `Allowed: ${allowed.join(", ")}`,
  };
}

function FastingBadge({
  description,
  exception,
}: {
  description: string;
  exception?: string;
}) {
  const isFast = !description.toLowerCase().includes("no fast");
  const guidance = fastingGuidanceLines(description, exception);

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-start gap-2">
        <Badge
          variant="secondary"
          className={
            "max-w-full whitespace-normal rounded-full px-3 py-1 text-left text-xs font-medium leading-tight " +
            (isFast
              ? "bg-amber-500/12 text-amber-800 dark:text-amber-200"
              : "bg-emerald-500/12 text-emerald-800 dark:text-emerald-200")
          }
        >
          <span className="inline-flex min-w-0 max-w-full flex-wrap items-center gap-1.5">
            {isFast ? <Leaf className="h-3.5 w-3.5 shrink-0" /> : <Flame className="h-3.5 w-3.5 shrink-0" />}
            <span className="min-w-0 break-words">{description}</span>
          </span>
        </Badge>
        {exception ? (
          <Badge variant="secondary" className="max-w-full whitespace-normal rounded-full bg-muted px-3 py-1 text-left text-xs font-medium leading-tight">
            {exception}
          </Badge>
        ) : null}
      </div>

      <div className="break-words text-xs leading-relaxed text-muted-foreground">
        {guidance.from ? <div>{guidance.from}</div> : null}
        <div>{guidance.allowed}</div>
      </div>

    </div>
  );
}

function EssentialButton({
  label,
  description,
  icon,
  onClick,
  variant = "outline",
}: {
  label: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
}) {
  return (
    <Button
      type="button"
      variant={variant}
      className="tap h-auto min-h-14 max-w-full justify-start whitespace-normal rounded-2xl border border-border/70 px-3 py-3 text-left shadow-sm hover:border-primary/40 hover:bg-muted/70 sm:px-4"
      onClick={onClick}
    >
      <span className="mr-2 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-background/60 text-primary sm:mr-3">
        {icon}
      </span>
      <span className="min-w-0 flex-1 break-words">
        <span className="block text-sm font-semibold leading-tight">{label}</span>
        <span className="mt-0.5 block whitespace-normal text-xs font-normal leading-relaxed opacity-80">
          {description}
        </span>
      </span>
      <ArrowRight className="ml-1 h-4 w-4 shrink-0 opacity-75 sm:ml-2" />
    </Button>

  );
}

function CurrentModeCard({ onOpenFieldManual }: { onOpenFieldManual?: () => void }) {
  const [mode] = useResponderMode();
  const theme = responderModeAccentClasses[mode];

  return (
    <Card className={cn("rounded-3xl p-5 shadow-sm sm:p-6", theme.card)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 break-words">
          <Badge className={cn("max-w-full whitespace-normal rounded-full border px-3 py-1 text-left text-xs font-bold uppercase leading-tight tracking-[0.12em]", theme.badge)}>
            <Target className="mr-1.5 h-3.5 w-3.5 shrink-0" /> {responderModeShortLabels[mode]} mode active
          </Badge>
          <h2 className="mt-3 text-xl font-semibold tracking-tight">Today is tuned for {responderModeLabels[mode]}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Your selected role now carries across Today, field mode, and the emergency reset.
          </p>
        </div>
        <Button type="button" variant="outline" className="h-auto whitespace-normal rounded-2xl border-border/60 bg-background/70 text-left leading-tight" onClick={onOpenFieldManual}>
          Open field manual <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </div>
    </Card>
  );
}

function TodayDetailsSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" aria-label="Loading today's details">
      <div className="grid gap-5">
        <div className="space-y-3">
          <Skeleton className="h-3 w-20 rounded-full" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-36 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <Skeleton className="h-3 w-48 rounded-full" />
          <Skeleton className="h-3 w-40 rounded-full" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-3 w-16 rounded-full" />
          <div className="grid gap-2">
            <Skeleton className="h-4 w-11/12 rounded-full" />
            <Skeleton className="h-4 w-10/12 rounded-full" />
            <Skeleton className="h-4 w-8/12 rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid content-start gap-3">
        <div className="rounded-3xl border border-primary/10 bg-primary/5 p-4">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="mt-3 h-3 w-56 rounded-full" />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-border/60 bg-background/60 p-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <Skeleton className="h-4 w-28 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatGoarchChapelUrl(date: Date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const y = date.getFullYear();
  return `https://www.goarch.org/chapel?date=${encodeURIComponent(`${m}/${d}/${y}`)}`;
}

function buildPrimaryDailySourceUrl(settings: ReturnType<typeof getSettings>, date: Date) {
  if (settings.jurisdiction === "goarch") return formatGoarchChapelUrl(date);
  return "";
}

export function TodayOverview({
  onNavigate,
  onOpenRoute,
}: {
  onNavigate?: (to: { section: AppSection; tab?: string; read?: string }) => void;
  onOpenRoute?: (path: string) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const { settings } = useSettings();
  const [sourceOverride, setSourceOverride] = useState<"preferred" | "oca" | "goarch">(
    "preferred",
  );

  const q = useQuery({
    queryKey: ["daily", settings.calendarMode, format(today, "yyyy-MM-dd")],
    queryFn: () => fetchDailyData(today, settings.calendarMode),
  });

  function currentPrimaryUrl() {
    if (!q.data?.sources?.ocaDailyUrl) return "https://www.oca.org";
    if (sourceOverride === "oca") return q.data.sources.ocaDailyUrl;
    if (sourceOverride === "goarch") return formatGoarchChapelUrl(today);
    const preferred = buildPrimaryDailySourceUrl(settings, today);
    return preferred || q.data.sources.ocaDailyUrl;
  }

  function addFastingReminder() {
    if (!q.data) return;
    try {
      const start = new Date();
      start.setHours(7, 30, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 10);

      const guidance = fastingGuidanceLines(q.data.fasting.description, q.data.fasting.exception);
      const desc = [
        `Fasting: ${q.data.fasting.description}${q.data.fasting.exception ? ` (${q.data.fasting.exception})` : ""}`,
        guidance.from,
        guidance.allowed,
        "",
        `Verify: ${q.data.sources.ocaDailyUrl}`,
      ].join("\n");

      const ics = createSimpleIcs({
        title: "Fasting guidance (Nepsis Shield)",
        description: desc,
        start,
        end,
      });

      downloadTextFile(`fasting-${format(today, "yyyy-MM-dd")}.ics`, ics, "text/calendar");
      showSuccess("Calendar file downloaded.");
    } catch {
      showError("Couldn't create calendar file.");
    }
  }

  return (
    <div className="grid gap-4">
      <CurrentModeCard onOpenFieldManual={() => onOpenRoute?.("/field-manual")} />
      {settings.personalization.showGroundingOnToday ? <GroundMeNow /> : null}

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Guided paths
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">When you do not know where to start</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Choose one focused path and keep the next step simple.
            </p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:w-[min(500px,100%)]">
            <EssentialButton
              label="Sleep"
              description="Night prayer + dim timer."
              icon={<MoonStar className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "pray", tab: "sleep" })}
            />

            <EssentialButton
              label="Challenges"
              description="7–14 day prayer paths."
              icon={<CheckCircle2 className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "learn", tab: "challenges" })}
            />
            <EssentialButton
              label="My Path"
              description="Personalized next steps."
              icon={<Compass className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "learn", tab: "path" })}
            />
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Next steps
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">Choose one small action</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              After prayer, continue with reading, reflection, or preparation.
            </p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:w-[min(500px,100%)]">
            <EssentialButton
              label="Read"
              description="Today’s Scripture."
              icon={<BookOpen className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "read", read: "daily" })}
            />

            <EssentialButton
              label="Reflect"
              description="Short journal note."
              icon={<PenLine className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "pray", tab: "journal" })}
            />
            <EssentialButton
              label="Prepare"
              description="Confession tools."
              icon={<ShieldCheck className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "pray", tab: "prep" })}
            />
          </div>
        </div>
      </Card>

      <DutyModeCard onOpenFieldManual={() => onOpenRoute?.("/field-manual")} />

      <Card className={hallowCardClass}>
        <div className={hallowGlowClass} />

        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <div className="min-w-0">

            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between lg:flex-col">
              <div className="min-w-0 break-words">
                <p className="text-xs font-semibold uppercase leading-snug tracking-[0.1em] text-muted-foreground sm:tracking-[0.18em]">
                  Daily command center · {format(today, "EEEE")}
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  {format(today, "MMMM d")}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Prayer, Scripture, saints, fasting, and one practical next step for today.
                </p>
                <div className="mt-2 flex flex-wrap items-start gap-2">
                  <Badge variant="secondary" className="max-w-full whitespace-normal rounded-full bg-muted px-3 py-1 text-left text-xs font-medium leading-tight">
                    {settings.calendarMode === "julian" ? "Old Calendar" : "New Calendar"}
                  </Badge>
                  {q.data?.tone?.value || q.data?.tone?.description ? (
                    <Badge variant="secondary" className="max-w-full whitespace-normal rounded-full bg-primary/10 px-3 py-1 text-left text-xs font-medium leading-tight text-primary">
                      {q.data.tone.value ? `Tone ${q.data.tone.value}` : q.data.tone.description}
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div className="grid min-w-0 gap-2 sm:min-w-[210px] lg:min-w-0">
                <Select

                  value={sourceOverride}
                  onValueChange={(v) => setSourceOverride(v as "preferred" | "oca" | "goarch")}
                >
                  <SelectTrigger className="h-10 rounded-2xl">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preferred">Preferred source</SelectItem>
                    <SelectItem value="oca">OCA</SelectItem>
                    <SelectItem value="goarch">GOARCH</SelectItem>
                  </SelectContent>
                </Select>
                <Button asChild size="sm" variant="outline" className="tap h-auto min-h-9 max-w-full justify-start whitespace-normal rounded-2xl border-border/70 bg-background/60 text-left leading-tight shadow-sm hover:border-primary/40">
                  <a href={currentPrimaryUrl()} target="_blank" rel="noopener noreferrer" className="min-w-0">
                    <span className="min-w-0 break-words">Open daily source</span>
                    <ExternalLink className="ml-2 h-4 w-4 shrink-0" />
                  </a>
                </Button>

              </div>
            </div>
          </div>

          <TodayRhythmDashboard onNavigate={onNavigate} />
        </div>

        <Separator className="my-4" />

        {q.isLoading ? (
          <TodayDetailsSkeleton />
        ) : q.isError ? (
          <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm leading-relaxed text-destructive">
            Couldn’t load today’s details. You can still open the daily source or try refreshing the preview.
          </div>
        ) : q.data ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="grid gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Fasting
                </p>
                <div className="mt-2">
                  <FastingBadge
                    description={q.data.fasting.description}
                    exception={q.data.fasting.exception}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Saints
                </p>
                <div className="mt-2 grid gap-1.5">
                  {q.data.saints.length ? (
                    q.data.saints.slice(0, 3).map((s) => (
                      <p key={s} className="break-words text-sm leading-relaxed">
                        {s}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      See today's calendar commemorations.
                    </p>
                  )}

                  {q.data.saints.length > 3 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="tap mt-1 w-fit rounded-2xl border-border/70 bg-background/60 px-3 shadow-sm hover:border-primary/40"
                      onClick={() => onOpenRoute?.("/saints")}
                    >
                      Open saints
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="grid content-start gap-3">
              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm font-semibold">Helpful today</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Use these only if they match your next step.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  className="tap h-auto min-h-11 justify-start whitespace-normal rounded-2xl border-border/70 bg-background/60 text-left shadow-sm hover:border-primary/40"
                  onClick={() => onNavigate?.({ section: "pray", tab: "counter" })}
                >
                  <Target className="mr-2 h-4 w-4 shrink-0" /> Jesus Prayer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="tap h-auto min-h-11 justify-start whitespace-normal rounded-2xl border-border/70 bg-background/60 text-left shadow-sm hover:border-primary/40"
                  onClick={() => onNavigate?.({ section: "read", read: "plans" })}
                >
                  <Sparkles className="mr-2 h-4 w-4 shrink-0" /> Reading Plans
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="tap h-auto min-h-11 justify-start whitespace-normal rounded-2xl border-border/70 bg-background/60 text-left shadow-sm hover:border-primary/40"
                  onClick={() => onNavigate?.({ section: "learn", tab: "liturgy" })}
                >
                  <Church className="mr-2 h-4 w-4 shrink-0" /> Liturgy Help
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="tap h-auto min-h-11 justify-start whitespace-normal rounded-2xl border-border/70 bg-background/60 text-left shadow-sm hover:border-primary/40"
                  onClick={() => onOpenRoute?.("/saints")}
                >
                  <Sparkles className="mr-2 h-4 w-4 shrink-0" /> Saints
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="tap w-fit rounded-2xl border-border/70 bg-background/60 shadow-sm hover:border-primary/40"
                onClick={addFastingReminder}
              >
                <CalendarPlus className="mr-2 h-4 w-4" /> Add fasting reminder
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

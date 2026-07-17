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

function Shelf({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="px-0.5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="-mx-6 overflow-x-auto px-6 pb-2">
        <div className="flex snap-x snap-mandatory gap-4">{children}</div>
      </div>
    </section>
  );
}

function ShelfCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card
      className={cn(
        "min-w-[82vw] max-w-md snap-start rounded-[1.5rem] border-0 bg-card/70 p-5 shadow-lg shadow-foreground/5 backdrop-blur-xl sm:min-w-[22rem]",
        className,
      )}
    >
      {children}
    </Card>
  );
}

function EssentialButton({
  label,
  description,
  icon,
  onClick,
}: {
  label: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="tap h-36 min-w-[14rem] snap-start flex-col items-start justify-between rounded-[1.25rem] bg-card/70 p-4 text-left shadow-lg shadow-foreground/5 backdrop-blur-xl hover:bg-card/85 sm:min-w-[15rem]"
      onClick={onClick}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="min-w-0 break-words">
        <span className="block text-base font-semibold leading-tight">{label}</span>
        <span className="mt-1 block whitespace-normal text-sm font-normal leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
    </Button>
  );
}

function CurrentModeCard({ onOpenFieldManual }: { onOpenFieldManual?: () => void }) {
  const [mode] = useResponderMode();
  const theme = responderModeAccentClasses[mode];

  return (
    <Card className={cn("rounded-[1.5rem] border-0 p-5 shadow-lg shadow-foreground/5 backdrop-blur-xl sm:p-6", theme.card)}>
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="min-w-0 break-words">
          <Badge className={cn("max-w-full whitespace-normal rounded-full border-0 px-3 py-1 text-left text-xs font-bold uppercase leading-tight tracking-[0.12em]", theme.badge)}>
            <Target className="mr-1.5 h-3.5 w-3.5 shrink-0" /> {responderModeShortLabels[mode]} mode active
          </Badge>
          <h2 className="mt-4 text-xl font-semibold tracking-tight">Today is tuned for {responderModeLabels[mode]}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Your selected role now carries across Today, field mode, and the emergency reset.
          </p>
        </div>
        <Button type="button" variant="outline" className="h-auto whitespace-normal rounded-[1.15rem] border-0 bg-background/65 text-left leading-tight shadow-sm" onClick={onOpenFieldManual}>
          Open field manual <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </div>
    </Card>
  );
}

function TodayDetailsSkeleton() {
  return (
    <div className="flex gap-4" aria-label="Loading today's details">
      {Array.from({ length: 3 }).map((_, index) => (
        <ShelfCard key={index}>
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="mt-4 h-6 w-40 rounded-full" />
          <Skeleton className="mt-4 h-3 w-11/12 rounded-full" />
          <Skeleton className="mt-2 h-3 w-9/12 rounded-full" />
        </ShelfCard>
      ))}
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
    <div className="flex flex-col gap-8">
      <Shelf eyebrow="Context" title="Your watchfulness environment">
        <div className="min-w-[82vw] max-w-md snap-start sm:min-w-[22rem]">
          <CurrentModeCard onOpenFieldManual={() => onOpenRoute?.("/field-manual")} />
        </div>
        {settings.personalization.showGroundingOnToday ? (
          <div className="min-w-[82vw] max-w-md snap-start sm:min-w-[22rem]">
            <GroundMeNow />
          </div>
        ) : null}
        <div className="min-w-[82vw] max-w-md snap-start sm:min-w-[22rem]">
          <DutyModeCard onOpenFieldManual={() => onOpenRoute?.("/field-manual")} />
        </div>
      </Shelf>

      <Shelf eyebrow="Guided paths" title="When you do not know where to start">
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
      </Shelf>

      <Shelf eyebrow={`Daily command center · ${format(today, "EEEE")}`} title={format(today, "MMMM d")}>
        <ShelfCard className={cn(hallowCardClass, "relative min-w-[88vw] max-w-xl")}> 
          <div className={hallowGlowClass} />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase leading-snug tracking-[0.14em] text-muted-foreground">
              Prayer, Scripture, saints, fasting, and one practical next step for today.
            </p>
            <div className="mt-4 flex flex-wrap items-start gap-2">
              <Badge variant="secondary" className="max-w-full whitespace-normal rounded-full bg-muted px-3 py-1 text-left text-xs font-medium leading-tight">
                {settings.calendarMode === "julian" ? "Old Calendar" : "New Calendar"}
              </Badge>
              {q.data?.tone?.value || q.data?.tone?.description ? (
                <Badge variant="secondary" className="max-w-full whitespace-normal rounded-full bg-primary/10 px-3 py-1 text-left text-xs font-medium leading-tight text-primary">
                  {q.data.tone.value ? `Tone ${q.data.tone.value}` : q.data.tone.description}
                </Badge>
              ) : null}
            </div>

            <div className="mt-6 grid gap-3">
              <Select
                value={sourceOverride}
                onValueChange={(v) => setSourceOverride(v as "preferred" | "oca" | "goarch")}
              >
                <SelectTrigger className="h-11 rounded-[1.15rem] border-0 bg-background/60">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preferred">Preferred source</SelectItem>
                  <SelectItem value="oca">OCA</SelectItem>
                  <SelectItem value="goarch">GOARCH</SelectItem>
                </SelectContent>
              </Select>
              <Button asChild size="sm" variant="outline" className="tap h-auto min-h-11 max-w-full justify-start whitespace-normal rounded-[1.15rem] border-0 bg-background/60 text-left leading-tight shadow-sm">
                <a href={currentPrimaryUrl()} target="_blank" rel="noopener noreferrer" className="min-w-0">
                  <span className="min-w-0 break-words">Open daily source</span>
                  <ExternalLink className="ml-2 h-4 w-4 shrink-0" />
                </a>
              </Button>
            </div>
          </div>
        </ShelfCard>

        <ShelfCard className="min-w-[88vw] max-w-xl">
          <TodayRhythmDashboard onNavigate={onNavigate} />
        </ShelfCard>

        {q.isLoading ? (
          <TodayDetailsSkeleton />
        ) : q.isError ? (
          <ShelfCard className="bg-destructive/5 text-destructive">
            Couldn’t load today’s details. You can still open the daily source or try refreshing the preview.
          </ShelfCard>
        ) : q.data ? (
          <>
            <ShelfCard>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Fasting
              </p>
              <div className="mt-3">
                <FastingBadge
                  description={q.data.fasting.description}
                  exception={q.data.fasting.exception}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="tap mt-5 rounded-[1.15rem] border-0 bg-background/60 shadow-sm"
                onClick={addFastingReminder}
              >
                <CalendarPlus className="mr-2 h-4 w-4" /> Add fasting reminder
              </Button>
            </ShelfCard>

            <ShelfCard>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Saints
              </p>
              <div className="mt-3 grid gap-2">
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
                    className="tap mt-2 w-fit rounded-[1.15rem] border-0 bg-background/60 px-3 shadow-sm"
                    onClick={() => onOpenRoute?.("/saints")}
                  >
                    Open saints
                  </Button>
                ) : null}
              </div>
            </ShelfCard>

            <ShelfCard>
              <p className="text-sm font-semibold">Helpful today</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Use these only if they match your next step.
              </p>
              <div className="mt-4 grid gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="tap h-auto min-h-11 justify-start whitespace-normal rounded-[1.15rem] border-0 bg-background/60 text-left shadow-sm"
                  onClick={() => onNavigate?.({ section: "pray", tab: "counter" })}
                >
                  <Target className="mr-2 h-4 w-4 shrink-0" /> Jesus Prayer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="tap h-auto min-h-11 justify-start whitespace-normal rounded-[1.15rem] border-0 bg-background/60 text-left shadow-sm"
                  onClick={() => onNavigate?.({ section: "read", read: "plans" })}
                >
                  <Sparkles className="mr-2 h-4 w-4 shrink-0" /> Reading Plans
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="tap h-auto min-h-11 justify-start whitespace-normal rounded-[1.15rem] border-0 bg-background/60 text-left shadow-sm"
                  onClick={() => onNavigate?.({ section: "learn", tab: "liturgy" })}
                >
                  <Church className="mr-2 h-4 w-4 shrink-0" /> Liturgy Help
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="tap h-auto min-h-11 justify-start whitespace-normal rounded-[1.15rem] border-0 bg-background/60 text-left shadow-sm"
                  onClick={() => onOpenRoute?.("/saints")}
                >
                  <Sparkles className="mr-2 h-4 w-4 shrink-0" /> Saints
                </Button>
              </div>
            </ShelfCard>
          </>
        ) : null}
      </Shelf>
    </div>
  );
}

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ExternalLink,
  Flame,
  Leaf,
  BookOpen,
  Hand,
  GraduationCap,
  Target,
  CalendarPlus,
  Sparkles,
  Music,
  MapPin,
  BookMarked,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchDailyData } from "@/lib/orthocal";
import type { AppSection } from "@/components/app/AppShell";
import { createSimpleIcs, downloadTextFile } from "@/lib/ics";
import { showError, showSuccess } from "@/utils/toast";
import { getSettings } from "@/lib/settings";
import { useSettings } from "@/hooks/useSettings";

function fastingGuidanceLines(description: string, exception?: string) {
  const raw = `${description} ${exception ?? ""}`.toLowerCase();

  const fastFree = raw.includes("no fast") || raw.includes("fast free");
  if (fastFree) {
    return {
      from: "",
      allowed: "All foods",
    };
  }

  // Baseline Orthodox guidance is generally abstaining from meat/dairy.
  // Then the day may explicitly allow fish, wine, and/or oil.
  const from: string[] = ["meat", "dairy"];

  const allowsFish = raw.includes("fish");
  const allowsWine = raw.includes("wine");
  const allowsOil = raw.includes("oil");

  const allowed: string[] = ["plant-based foods"];
  if (allowsFish) allowed.push("fish");
  if (allowsWine) allowed.push("wine");
  if (allowsOil) allowed.push("oil");

  // If nothing explicit is allowed beyond the baseline, keep it simple.
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
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          className={
            "rounded-full px-3 py-1 text-xs font-semibold " +
            (isFast
              ? "bg-amber-500/15 text-amber-800 dark:text-amber-200"
              : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200")
          }
        >
          <span className="inline-flex items-center gap-1">
            {isFast ? <Leaf className="h-3.5 w-3.5" /> : <Flame className="h-3.5 w-3.5" />}
            {description}
          </span>
        </Badge>
        {exception ? (
          <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {exception}
          </Badge>
        ) : null}
      </div>

      <div className="text-xs font-medium text-muted-foreground">
        <div>{guidance.from}</div>
        <div>{guidance.allowed}</div>
      </div>
    </div>
  );
}

function QuickAction({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 justify-start gap-2 rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
      onClick={onClick}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </Button>
  );
}

function formatGoarchChapelUrl(date: Date) {
  // GOARCH Online Chapel: /chapel?date=M/D/YYYY
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const y = date.getFullYear();
  return `https://www.goarch.org/chapel?date=${encodeURIComponent(`${m}/${d}/${y}`)}`;
}

function buildPrimaryDailySourceUrl(settings: ReturnType<typeof getSettings>, date: Date) {
  if (settings.jurisdiction === "goarch") return formatGoarchChapelUrl(date);
  // Default to OCA
  return ""; // caller can use q.data.sources.ocaDailyUrl
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

  const q = useQuery({
    queryKey: ["daily", settings.calendarMode, format(today, "yyyy-MM-dd")],
    queryFn: () => fetchDailyData(today, settings.calendarMode),
  });

  useEffect(() => {
    // Ensure query reactivity when settings change in other tabs
  }, [settings.calendarMode]);

  function addFastingReminder() {
    if (!q.data) return;
    try {
      const start = new Date();
      start.setHours(7, 30, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 10);

      const g = fastingGuidanceLines(q.data.fasting.description, q.data.fasting.exception);

      const desc = [
        `Fasting: ${q.data.fasting.description}${q.data.fasting.exception ? ` (${q.data.fasting.exception})` : ""}`,
        g.from,
        g.allowed,
        "",
        `Verify: ${q.data.sources.ocaDailyUrl}`,
      ].join("\n");

      const ics = createSimpleIcs({
        title: "Fasting guidance (Ortho Companion)",
        description: desc,
        start,
        end,
      });

      downloadTextFile(
        `fasting-${format(today, "yyyy-MM-dd")}.ics`,
        ics,
        "text/calendar",
      );
      showSuccess("Calendar file downloaded.");
    } catch {
      showError("Couldn't create calendar file.");
    }
  }

  const primarySourceUrl = buildPrimaryDailySourceUrl(settings, today);

  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden rounded-3xl border-border/60 bg-card shadow-sm">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                  {format(today, "EEEE")}
                </p>
                <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {settings.calendarMode === "julian" ? "Old Calendar" : "New Calendar"}
                </Badge>
                {q.data?.tone?.value || q.data?.tone?.description ? (
                  <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {q.data.tone.value ? `Tone ${q.data.tone.value}` : q.data.tone.description}
                  </Badge>
                ) : null}
              </div>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                {format(today, "MMMM d")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your daily essentials, kept quiet.
              </p>
            </div>

            {q.data?.sources?.ocaDailyUrl ? (
              <Button
                asChild
                size="sm"
                className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a
                  href={primarySourceUrl || q.data.sources.ocaDailyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open daily source <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : (
              <a
                href="https://www.oca.org"
                target="_blank"
                rel="noopener noreferrer"
                className="self-start text-xs font-semibold text-primary hover:underline"
              >
                Orthodox Church in America
              </a>
            )}
          </div>

          <Separator className="my-4" />

          {q.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading today…</div>
          ) : q.isError ? (
            <div className="text-sm text-destructive">
              Couldn't load today's details. You can still open the daily source.
            </div>
          ) : q.data ? (
            <div className="grid gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">
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
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                  Commemorations
                </p>
                <div className="mt-2 grid gap-1.5">
                  {q.data.saints.length ? (
                    q.data.saints.slice(0, 6).map((s) => (
                      <p key={s} className="text-sm leading-relaxed text-foreground">
                        {s}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      See the calendar for today's commemorations.
                    </p>
                  )}
                  {q.data.saints.length > 6 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-1 w-fit rounded-2xl border-border/60"
                      onClick={() => onOpenRoute?.("/saints")}
                    >
                      View all saints
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                      Hymns & propers
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Open troparia/kontakia and other propers from trusted sources.
                    </p>
                  </div>
                  <Music className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                    <a
                      href="https://www.oca.org/saints/troparia"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Troparia & Kontakia (OCA) <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                    <a
                      href="https://dcs.goarch.org/goa/dcs/dcs.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chant Stand (AGES) <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-muted-foreground">
                  Sources: orthocal.info + official jurisdictions.
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-2xl border-border/60"
                    onClick={addFastingReminder}
                  >
                    <CalendarPlus className="mr-2 h-4 w-4" /> Add reminder
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold tracking-tight">Next</h3>
        <p className="mt-1 text-sm text-muted-foreground">A few focused shortcuts.</p>
        <Separator className="my-4" />

        <div className="grid gap-2 sm:grid-cols-2">
          <QuickAction
            label="Prayer texts"
            icon={<Hand className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "pray", tab: "prayers" })}
          />
          <QuickAction
            label="Daily readings"
            icon={<BookOpen className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "read", read: "daily" })}
          />
          <QuickAction
            label="Hymns & propers"
            icon={<Music className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "learn" })}
          />
          <QuickAction
            label="Parish finder"
            icon={<MapPin className="h-4 w-4 text-primary" />}
            onClick={() => onOpenRoute?.("/settings")}
          />
          <QuickAction
            label="Reading plans"
            icon={<Sparkles className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "read", read: "plans" })}
          />
          <QuickAction
            label="Jesus Prayer"
            icon={<Target className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "pray", tab: "counter" })}
          />
          <QuickAction
            label="Canon & basics"
            icon={<BookMarked className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "learn" })}
          />
          <QuickAction
            label="Learn"
            icon={<GraduationCap className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "learn" })}
          />
        </div>
      </Card>
    </div>
  );
}
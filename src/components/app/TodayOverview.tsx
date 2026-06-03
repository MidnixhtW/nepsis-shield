import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ExternalLink,
  Flame,
  Leaf,
  BookOpen,
  Target,
  CalendarPlus,
  Sparkles,
  Music,
  MapPin,
  BookMarked,
  StretchHorizontal,
  Sun,
  MoonStar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  description,
  icon,
  onClick,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="tap group flex min-h-16 items-start gap-3 rounded-2xl border border-border/60 bg-background/50 p-3 text-left transition-colors hover:bg-background/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={onClick}
    >
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block break-words text-sm font-semibold leading-tight">{label}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{description}</span>
      </span>
    </button>
  );
}

function ActionGroup({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border/60 bg-muted/10 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p>
      <h4 className="mt-1 text-base font-semibold tracking-tight">{title}</h4>
      <div className="mt-3 grid gap-2">{children}</div>
    </div>
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

  // Local override: sometimes you want to open today's texts from a different jurisdiction
  // without changing Settings.
  const [sourceOverride, setSourceOverride] = useState<"preferred" | "oca" | "goarch">(
    "preferred",
  );

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

  return (
    <div className="grid gap-4">
      <Card className="card-interactive overflow-hidden rounded-3xl border-border/60 bg-card shadow-sm">
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

            <div className="grid gap-2">
              <div className="grid gap-1">
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                  Source
                </p>
                <Select
                  value={sourceOverride}
                  onValueChange={(v) =>
                    setSourceOverride(v as "preferred" | "oca" | "goarch")
                  }
                >
                  <SelectTrigger className="h-9 w-full rounded-2xl sm:w-[200px]">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preferred">Preferred (Settings)</SelectItem>
                    <SelectItem value="oca">OCA</SelectItem>
                    <SelectItem value="goarch">GOARCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                asChild
                size="sm"
                className="tap rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a href={currentPrimaryUrl()} target="_blank" rel="noopener noreferrer">
                  Open daily source <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <StretchHorizontal className="h-3.5 w-3.5" />
                Quick switch (doesn't change Settings)
              </div>
            </div>
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
                      className="tap mt-1 w-fit rounded-2xl border-border/60"
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="tap rounded-2xl border-border/60"
                    onClick={() => onNavigate?.({ section: "learn", tab: "hymns" })}
                  >
                    Open Hymns section
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="tap rounded-2xl border-border/60"
                  >
                    <a
                      href="https://www.oca.org/saints/troparia"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Troparia & Kontakia (OCA) <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="tap rounded-2xl border-border/60"
                  >
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
                    className="tap rounded-2xl border-border/60"
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

      <Card className="card-interactive rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Mission control
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">Choose your next step</h3>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Shortcuts are grouped by rhythm so the home screen feels less crowded.
          </p>
        </div>
        <Separator className="my-4" />

        <div className="grid gap-3 lg:grid-cols-3">
          <ActionGroup eyebrow="Start here" title="Daily rhythm">
            <QuickAction
              label="Daily readings"
              description="Open today’s lectionary and source links."
              icon={<BookOpen className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "read", read: "daily" })}
            />
            <QuickAction
              label="Reading plans"
              description="Follow a slower Scripture routine."
              icon={<Sparkles className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "read", read: "plans" })}
            />
          </ActionGroup>

          <ActionGroup eyebrow="Interior work" title="Prayer & reflection">
            <QuickAction
              label="Daily prayer flow"
              description="Choose morning, evening, or night with a focused reader."
              icon={<Sun className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "pray", tab: "daily" })}
            />
            <QuickAction
              label="Evening or night prayer"
              description="Close the day with repentance, peace, and reminders."
              icon={<MoonStar className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "pray", tab: "daily" })}
            />
            <QuickAction
              label="Lord Jesus Christ, Son of God, have mercy on me, a sinner"
              description="Open the counter and stillness timer."
              icon={<Target className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "pray", tab: "counter" })}
            />
          </ActionGroup>

          <ActionGroup eyebrow="Orientation" title="Learn & connect">
            <QuickAction
              label="Hymns & propers"
              description="Find troparia, kontakia, and chant links."
              icon={<Music className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "learn", tab: "hymns" })}
            />
            <QuickAction
              label="Parish finder"
              description="Locate official parish directories."
              icon={<MapPin className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "learn", tab: "parish" })}
            />
            <QuickAction
              label="Canon & basics"
              description="Review guidance, Q&A, and reference links."
              icon={<BookMarked className="h-4 w-4" />}
              onClick={() => onNavigate?.({ section: "learn" })}
            />
          </ActionGroup>
        </div>
      </Card>
    </div>
  );
}
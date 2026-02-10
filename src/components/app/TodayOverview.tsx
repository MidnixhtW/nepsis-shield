import { useMemo } from "react";
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
  Info,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchDailyData } from "@/lib/orthocal";
import type { AppSection } from "@/components/app/AppShell";
import { createSimpleIcs, downloadTextFile } from "@/lib/ics";
import { showError, showSuccess } from "@/utils/toast";

function FastingBadge({
  description,
  exception,
}: {
  description: string;
  exception?: string;
}) {
  const isFast = !description.toLowerCase().includes("no fast");

  return (
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

export function TodayOverview({
  onNavigate,
}: {
  onNavigate?: (to: { section: AppSection; tab?: string; read?: string }) => void;
}) {
  const today = useMemo(() => new Date(), []);

  const q = useQuery({
    queryKey: ["daily", format(today, "yyyy-MM-dd")],
    queryFn: () => fetchDailyData(today),
  });

  function addFastingReminder() {
    if (!q.data) return;
    try {
      const start = new Date();
      start.setHours(7, 30, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 10);

      const desc = [
        `Fasting: ${q.data.fasting.description}${q.data.fasting.exception ? ` (${q.data.fasting.exception})` : ""}`,
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
      <Card className="overflow-hidden rounded-3xl border-border/60 bg-card shadow-sm">
        <div className="relative">
          <div className="absolute inset-0 opacity-80 [mask-image:radial-gradient(60%_70%_at_50%_0%,black,transparent)]">
            <div className="absolute inset-0 bg-primary/8" />
            <div className="absolute -left-16 -top-24 h-56 w-56 rounded-full bg-accent/10 blur-2xl" />
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/12 blur-2xl" />
          </div>

          <div className="relative p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                  {format(today, "EEEE")}
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  {format(today, "MMMM d")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your daily essentials — quick, calm, and focused.
                </p>
              </div>
              <div className="hidden sm:block">
                <a
                  href="https://www.oca.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Orthodox Church in America
                </a>
              </div>
            </div>

            <Separator className="my-4" />

            {q.isLoading ? (
              <div className="text-sm text-muted-foreground">Loading today…</div>
            ) : q.isError ? (
              <div className="text-sm text-destructive">
                Couldn't load today's details. You can still open the OCA page.
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
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {q.data.saints.length
                      ? q.data.saints.slice(0, 3).join(" • ") +
                        (q.data.saints.length > 3 ? " • …" : "")
                      : "See the calendar for today's commemorations."}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-muted-foreground">Source: OCA daily page.</div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <a href={q.data.sources.ocaDailyUrl} target="_blank" rel="noopener noreferrer">
                        Open on OCA <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
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
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold tracking-tight">Next</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          One tap to get where you want.
        </p>
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
            label="Bible"
            icon={<BookOpen className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "read", read: "bible" })}
          />
          <QuickAction
            label="Jesus Prayer"
            icon={<Target className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "pray", tab: "counter" })}
          />
          <QuickAction
            label="Preparation"
            icon={<Hand className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "pray", tab: "prep" })}
          />
          <QuickAction
            label="Learn"
            icon={<GraduationCap className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "learn" })}
          />
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold tracking-tight">What's new</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Recent improvements in this build.
            </p>
          </div>
          <Info className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <ul className="grid gap-2 text-sm text-muted-foreground">
          <li className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
            Read is split into <span className="font-semibold text-foreground">Lectionary</span> and <span className="font-semibold text-foreground">Bible</span>.
          </li>
          <li className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
            Saints & intercessions added to Prayer Texts.
          </li>
          <li className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
            Privacy: third-party requests use <span className="font-semibold text-foreground">no-referrer</span> and per-session caching.
          </li>
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <Link to="/about">
              <Info className="mr-2 h-4 w-4" /> About
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <Link to="/privacy">
              <Shield className="mr-2 h-4 w-4" /> Privacy
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
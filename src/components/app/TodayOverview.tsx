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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchDailyData } from "@/lib/orthocal";
import type { AppSection } from "@/components/app/AppShell";

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
      className="h-11 justify-start gap-2 rounded-2xl border-border/60 bg-background"
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
  onNavigate?: (to: { section: AppSection; tab?: string }) => void;
}) {
  const today = useMemo(() => new Date(), []);

  const q = useQuery({
    queryKey: ["daily", format(today, "yyyy-MM-dd")],
    queryFn: () => fetchDailyData(today),
  });

  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden rounded-3xl border-border/60 bg-card shadow-sm">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                {format(today, "EEEE")}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                {format(today, "MMMM d")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The essentials for today — nothing extra.
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
                <div className="flex gap-2">
                  <Button
                    asChild
                    size="sm"
                    className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <a href={q.data.sources.ocaDailyUrl} target="_blank" rel="noopener noreferrer">
                      Open on OCA <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
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
            label="Prayers"
            icon={<Hand className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "pray", tab: "prayers" })}
          />
          <QuickAction
            label="Readings"
            icon={<BookOpen className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "read" })}
          />
          <QuickAction
            label="Jesus Prayer"
            icon={<Target className="h-4 w-4 text-primary" />}
            onClick={() => onNavigate?.({ section: "pray", tab: "counter" })}
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
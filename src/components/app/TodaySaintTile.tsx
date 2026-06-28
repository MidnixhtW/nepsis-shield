import { useMemo } from "react";
import { format } from "date-fns";
import { Sparkles, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fetchDailyData } from "@/lib/orthocal";
import { useSettings } from "@/hooks/useSettings";

function pickSaint(saints: string[]) {
  const cleaned = saints.map((s) => s.trim()).filter(Boolean);
  return cleaned[0] ?? "Today's saint";
}

export function TodaySaintTile({ onOpenSaints }: { onOpenSaints?: () => void }) {
  const today = useMemo(() => new Date(), []);
  const dayKey = useMemo(() => format(today, "yyyy-MM-dd"), [today]);
  const { settings } = useSettings();

  const q = useQuery({
    queryKey: ["daily", settings.calendarMode, dayKey],
    queryFn: () => fetchDailyData(today, settings.calendarMode),
  });

  const saint = pickSaint(q.data?.saints ?? []);

  return (
    <Card className="card-interactive overflow-hidden rounded-3xl border-border/60 bg-card shadow-sm">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">Saints</p>
              <h3 className="mt-1 truncate text-base font-semibold tracking-tight">{saint}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Ask their prayers, or find a patron by need.</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background/60 glow">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
              {settings.calendarMode === "julian" ? "Old Calendar" : "New Calendar"}
            </Badge>
            <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
              Open OCA Lives
            </Badge>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              className="tap btn-wrap h-11 justify-between rounded-2xl"
              onClick={() =>
                window.open(
                  `https://www.oca.org/saints/lives?search=${encodeURIComponent(saint)}`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              disabled={q.isLoading || q.isError}
            >
              Open life <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="tap h-11 justify-between rounded-2xl border-border/60 bg-background/60"
              onClick={onOpenSaints}
            >
              Patron prayers <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          {q.isError ? (
            <p className="mt-3 text-xs text-destructive">Couldn't load saints.</p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
import { useMemo } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { ExternalLink, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { fetchDailyData } from "@/lib/orthocal";
import { getSettings } from "@/lib/settings";

export default function Saints() {
  const today = useMemo(() => new Date(), []);
  const dayKey = useMemo(() => format(today, "yyyy-MM-dd"), [today]);
  const settings = useMemo(() => getSettings(), []);

  const q = useQuery({
    queryKey: ["daily", settings.calendarMode, dayKey],
    queryFn: () => fetchDailyData(today),
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Saints</p>
          <h1 className="text-2xl font-semibold tracking-tight">Commemorations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Today's saints from the Orthodox calendar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <Link to="/today">Back to app</Link>
          </Button>
          <Button asChild className="rounded-2xl">
            <a href="https://www.oca.org/saints/lives" target="_blank" rel="noopener noreferrer">
              OCA Lives <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {format(today, "MMMM d")}
                </Badge>
                <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {settings.calendarMode === "julian" ? "Old Calendar" : "New Calendar"}
                </Badge>
                <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Tap to open OCA lives
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                A good young-adult practice: pick one saint and ask their prayers all day.
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          {q.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : q.isError ? (
            <p className="text-sm text-destructive">Couldn't load saints today.</p>
          ) : (
            <div className="grid gap-2">
              {(q.data?.saints ?? []).length ? (
                (q.data?.saints ?? []).map((s) => (
                  <Button
                    key={s}
                    asChild
                    variant="outline"
                    className="btn-wrap justify-between rounded-2xl border-border/60"
                  >
                    <a
                      href={`https://www.oca.org/saints/lives?search=${encodeURIComponent(s)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s} <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No saints listed.</p>
              )}
            </div>
          )}
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold tracking-tight">Tip</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add one line to your day: "Holy [Name], pray to God for me."
          </p>
        </Card>
      </div>
    </div>
  );
}
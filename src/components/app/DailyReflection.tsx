import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ExternalLink, PenLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { fetchDailyData } from "@/lib/orthocal";

function keyForDay(dayKey: string) {
  return `reflection:${dayKey}`;
}

export function DailyReflection() {
  const today = useMemo(() => new Date(), []);
  const dayKey = useMemo(() => format(today, "yyyy-MM-dd"), [today]);

  const q = useQuery({
    queryKey: ["daily", dayKey],
    queryFn: () => fetchDailyData(today),
  });

  const [note, setNote] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(keyForDay(dayKey));
    setNote(raw ?? "");
  }, [dayKey]);

  useEffect(() => {
    localStorage.setItem(keyForDay(dayKey), note);
  }, [note, dayKey]);

  const prompt = useMemo(() => {
    if (!q.data) return "";

    const isFast = !q.data.fasting.description.toLowerCase().includes("no fast");
    const saint = q.data.saints[0];
    if (isFast) {
      return `How can I practice mercy today — in my words, my attention, and my meals?${saint ? ` (Remembering: ${saint})` : ""}`;
    }
    return `Where do I need to slow down and pray today?${saint ? ` (Remembering: ${saint})` : ""}`;
  }, [q.data]);

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Reflection of the day</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A simple prompt + a place to write.
            </p>
          </div>
          <Sparkles className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        {q.isLoading ? (
          <div className="text-sm text-muted-foreground">Loading today…</div>
        ) : q.isError ? (
          <div className="text-sm text-destructive">
            Couldn’t load today’s prompt.
          </div>
        ) : q.data ? (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                Prompt
              </p>
              <p className="mt-2 text-sm leading-relaxed">{prompt}</p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                Journal
              </p>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Two or three honest sentences is enough."
                className="mt-2 min-h-32 rounded-2xl"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Saved on this device.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                Source: OCA daily readings page.
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="rounded-2xl border-border/60">
                  <a href={q.data.sources.ocaDailyUrl} target="_blank" rel="noreferrer">
                    Open on OCA <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  className="rounded-2xl"
                  onClick={() => {
                    setNote((n) =>
                      n ? n : `${prompt}\n\n` + "• "
                    );
                  }}
                >
                  <PenLine className="mr-2 h-4 w-4" /> Start writing
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

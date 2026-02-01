import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ExternalLink, PenLine, ShieldAlert, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { fetchDailyData } from "@/lib/orthocal";
import {
  cleanupStoredByPrefix,
  clearStoredByPrefix,
  getStoredItem,
  setStoredItem,
} from "@/lib/deviceStorage";

function keyForDay(dayKey: string) {
  return `reflection:${dayKey}`;
}

function saveEnabledKey() {
  return "privacy:reflection_save";
}

const NOTE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export function DailyReflection() {
  const today = useMemo(() => new Date(), []);
  const dayKey = useMemo(() => format(today, "yyyy-MM-dd"), [today]);

  const q = useQuery({
    queryKey: ["daily", dayKey],
    queryFn: () => fetchDailyData(today),
  });

  const [note, setNote] = useState("");
  const [saveEnabled, setSaveEnabled] = useState(false);

  useEffect(() => {
    cleanupStoredByPrefix("reflection:", NOTE_TTL_MS);
    const saved = getStoredItem<boolean>(saveEnabledKey());
    setSaveEnabled(saved ?? false);
  }, []);

  useEffect(() => {
    if (!saveEnabled) return;
    const raw = getStoredItem<string>(keyForDay(dayKey));
    setNote(raw ?? "");
  }, [dayKey, saveEnabled]);

  useEffect(() => {
    // Persist preference (not sensitive).
    setStoredItem(saveEnabledKey(), saveEnabled);

    // If enabling saving mid-session, capture the current note for today.
    if (saveEnabled) {
      setStoredItem(keyForDay(dayKey), note, { ttlMs: NOTE_TTL_MS });
    }
  }, [saveEnabled, dayKey, note]);

  useEffect(() => {
    if (!saveEnabled) return;
    setStoredItem(keyForDay(dayKey), note, { ttlMs: NOTE_TTL_MS });
  }, [note, dayKey, saveEnabled]);

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
            Couldn't load today's prompt.
          </div>
        ) : q.data ? (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                Prompt
              </p>
              <p className="mt-2 text-sm leading-relaxed">{prompt}</p>
            </div>

            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-amber-900">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-700" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Privacy</p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-900/80">
                    Journal notes can be sensitive. If you enable "Save on this device", they're stored in your browser's local storage and may be readable by scripts/extensions on this site.
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-amber-200/70 bg-white/60 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">Save on this device</p>
                      <p className="text-xs text-amber-900/70">Off by default</p>
                    </div>
                    <Switch checked={saveEnabled} onCheckedChange={setSaveEnabled} />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-2xl border-amber-200 bg-white/70 text-amber-900 hover:bg-white"
                      onClick={() => {
                        clearStoredByPrefix("reflection:");
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete saved notes
                    </Button>
                    <p className="text-xs text-amber-900/70">
                      Notes auto-expire after 30 days.
                    </p>
                  </div>
                </div>
              </div>
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
                {saveEnabled
                  ? "Saved on this device (local storage)."
                  : "Not saved locally — this text will be lost if you refresh."}
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
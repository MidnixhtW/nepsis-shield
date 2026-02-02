import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ExternalLink, Heart, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { getStoredItem, setStoredItem, removeStoredItem } from "@/lib/deviceStorage";

type PrepProgress = Record<string, boolean>;

function storageKey(weekKey: string) {
  return `prep_checklist:${weekKey}`;
}

const TTL_MS = 1000 * 60 * 60 * 24 * 14; // keep 2 weeks

const ITEMS: Array<{ id: string; label: string }> = [
  { id: "prayer", label: "Daily prayer (short, honest, attentive)" },
  { id: "fasting", label: "Fasting as able (with humility, without comparison)" },
  { id: "mercy", label: "Concrete act of mercy (time, attention, or giving)" },
  { id: "forgiveness", label: "Reconcile/forgive where possible (no grudges)" },
  { id: "confession", label: "Confession (as needed, with pastoral guidance)" },
];

export function PreparationChecklist() {
  // Track by week (Mon–Sun or Sun–Sat); here we use ISO week for simplicity.
  const weekKey = useMemo(() => {
    const d = new Date();
    // ISO week year-week number (yyyy-Www)
    const year = format(d, "yyyy");
    const week = format(d, "II");
    return `${year}-W${week}`;
  }, []);

  const [progress, setProgress] = useState<PrepProgress>({});

  useEffect(() => {
    const saved = getStoredItem<PrepProgress>(storageKey(weekKey));
    if (saved) setProgress(saved);
  }, [weekKey]);

  useEffect(() => {
    setStoredItem(storageKey(weekKey), progress, { ttlMs: TTL_MS });
  }, [progress, weekKey]);

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Preparation for Communion</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            A simple weekly checkup (kept on this device).
          </p>
        </div>
        <Heart className="h-5 w-5 text-muted-foreground" />
      </div>

      <Separator className="my-4" />

      <div className="grid gap-2">
        {ITEMS.map((i) => (
          <label
            key={i.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3"
          >
            <span className="text-sm font-medium">{i.label}</span>
            <Checkbox
              checked={!!progress[i.id]}
              onCheckedChange={(v) =>
                setProgress((p) => ({ ...p, [i.id]: Boolean(v) }))
              }
            />
          </label>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-2xl border-border/60"
          onClick={() => setProgress({})}
        >
          Reset this week
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="rounded-2xl text-muted-foreground hover:text-foreground"
          onClick={() => removeStoredItem(storageKey(weekKey))}
        >
          Clear saved data
        </Button>
      </div>

      <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Helpful texts</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Use the Church’s words to prepare with attention and humility.
            </p>
          </div>
          <ShieldAlert className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <a
              href="https://www.oca.org/orthodoxy/prayers/prayers-before-holy-communion"
              target="_blank"
              rel="noreferrer"
            >
              Prayers before Communion <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <a
              href="https://www.oca.org/orthodoxy/prayers/prayers-after-holy-communion"
              target="_blank"
              rel="noreferrer"
            >
              Prayers after Communion <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default PreparationChecklist;
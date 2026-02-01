import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ExternalLink, ListChecks, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

type RulePrefs = {
  includeMeals: boolean;
  includeCreed: boolean;
  includePsalm50: boolean;
};

type RuleProgress = Record<string, boolean>;

const DEFAULT_PREFS: RulePrefs = {
  includeMeals: true,
  includeCreed: false,
  includePsalm50: false,
};

function prefsKey() {
  return "prayer_rule:prefs";
}

function progressKey(dayKey: string) {
  return `prayer_rule:progress:${dayKey}`;
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function PrayerRule() {
  const dayKey = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const [prefs, setPrefs] = useState<RulePrefs>(DEFAULT_PREFS);
  const [progress, setProgress] = useState<RuleProgress>({});

  useEffect(() => {
    const savedPrefs = safeJsonParse<RulePrefs>(localStorage.getItem(prefsKey()));
    if (savedPrefs) setPrefs({ ...DEFAULT_PREFS, ...savedPrefs });

    const savedProgress = safeJsonParse<RuleProgress>(
      localStorage.getItem(progressKey(dayKey)),
    );
    setProgress(savedProgress ?? {});
  }, [dayKey]);

  useEffect(() => {
    localStorage.setItem(prefsKey(), JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    localStorage.setItem(progressKey(dayKey), JSON.stringify(progress));
  }, [progress, dayKey]);

  const steps = useMemo(() => {
    const base = [
      { id: "morning", label: "Morning prayer" },
      { id: "readings", label: "Read Epistle & Gospel" },
      { id: "rope", label: "Jesus Prayer (a few minutes)" },
      { id: "evening", label: "Evening prayer" },
    ];

    const extras = [] as Array<{ id: string; label: string }>;

    if (prefs.includePsalm50) extras.push({ id: "psalm50", label: "Psalm 50" });
    if (prefs.includeCreed) extras.push({ id: "creed", label: "The Creed" });
    if (prefs.includeMeals) {
      extras.push({ id: "before_meals", label: "Before meals" });
      extras.push({ id: "after_meals", label: "After meals" });
    }

    return [...base.slice(0, 1), ...extras, ...base.slice(1)];
  }, [prefs]);

  const doneCount = steps.filter((s) => progress[s.id]).length;

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight">Prayer rule</h3>
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {doneCount}/{steps.length}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            A simple “most common” daily rhythm. Use the sections below for the texts.
          </p>
        </div>
        <ListChecks className="h-5 w-5 text-muted-foreground" />
      </div>

      <Separator className="my-4" />

      <div className="grid gap-4">
        <div className="grid gap-2">
          {steps.map((s) => (
            <label
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3"
            >
              <span className="text-sm font-medium">{s.label}</span>
              <Checkbox
                checked={!!progress[s.id]}
                onCheckedChange={(v) =>
                  setProgress((p) => ({ ...p, [s.id]: Boolean(v) }))
                }
              />
            </label>
          ))}
        </div>

        <div className="grid gap-3 rounded-2xl border border-border/60 bg-background p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            Customize
          </p>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Include Before/After Meals</p>
              <p className="text-xs text-muted-foreground">OCA Common Prayers</p>
            </div>
            <Switch
              checked={prefs.includeMeals}
              onCheckedChange={(checked) =>
                setPrefs((p) => ({ ...p, includeMeals: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Include Psalm 50</p>
              <p className="text-xs text-muted-foreground">Optional</p>
            </div>
            <Switch
              checked={prefs.includePsalm50}
              onCheckedChange={(checked) =>
                setPrefs((p) => ({ ...p, includePsalm50: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Include the Creed</p>
              <p className="text-xs text-muted-foreground">Optional</p>
            </div>
            <Switch
              checked={prefs.includeCreed}
              onCheckedChange={(checked) =>
                setPrefs((p) => ({ ...p, includeCreed: checked }))
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              variant="outline"
              className="rounded-2xl border-border/60"
              onClick={() => setProgress({})}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset today
            </Button>

            <Button asChild variant="outline" className="rounded-2xl border-border/60">
              <a href="https://www.oca.org/orthodoxy/prayers" target="_blank" rel="noreferrer">
                Browse OCA prayer texts <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Tip: keep it small and consistent. For a larger rule, consult your priest/spiritual father.
        </p>
      </div>
    </Card>
  );
}

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  CalendarPlus,
  ExternalLink,
  ListChecks,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  cleanupStoredByPrefix,
  getStoredItem,
  removeStoredItem,
  setStoredItem,
} from "@/lib/deviceStorage";
import { createSimpleIcs, downloadTextFile } from "@/lib/ics";

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

function saveEnabledKey() {
  return "privacy:prayer_rule_save";
}

const PROGRESS_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days
const CLEANUP_OLDER_THAN_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export function PrayerRule() {
  const dayKey = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const [prefs, setPrefs] = useState<RulePrefs>(DEFAULT_PREFS);
  const [progress, setProgress] = useState<RuleProgress>({});
  const [saveEnabled, setSaveEnabled] = useState(true);

  useEffect(() => {
    cleanupStoredByPrefix("prayer_rule:progress:", CLEANUP_OLDER_THAN_MS);

    const saved = getStoredItem<boolean>(saveEnabledKey());
    setSaveEnabled(saved ?? true);

    const savedPrefs = getStoredItem<RulePrefs>(prefsKey());
    if (savedPrefs) setPrefs({ ...DEFAULT_PREFS, ...savedPrefs });

    const savedProgress = getStoredItem<RuleProgress>(progressKey(dayKey));
    if (savedProgress) setProgress(savedProgress);
  }, [dayKey]);

  useEffect(() => {
    setStoredItem(saveEnabledKey(), saveEnabled);
    if (!saveEnabled) {
      removeStoredItem(prefsKey());
      cleanupStoredByPrefix("prayer_rule:progress:", 0);
    }
  }, [saveEnabled]);

  useEffect(() => {
    if (!saveEnabled) return;
    setStoredItem(prefsKey(), prefs);
  }, [prefs, saveEnabled]);

  useEffect(() => {
    if (!saveEnabled) return;
    setStoredItem(progressKey(dayKey), progress, { ttlMs: PROGRESS_TTL_MS });
  }, [progress, dayKey, saveEnabled]);

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
            Keep it small. Keep it daily.
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
          {!saveEnabled ? (
            <p className="text-xs text-muted-foreground">
              Saving is off — checkmarks won't persist.
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-2xl border-border/60"
            onClick={() => setProgress({})}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset today
          </Button>
        </div>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="customize" className="border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" /> Customize
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3 rounded-2xl border border-border/60 bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Include Before/After Meals</p>
                    <p className="text-xs text-muted-foreground">Common prayers</p>
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

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    className="btn-wrap rounded-2xl border-border/60"
                    onClick={() => {
                      const now = new Date();
                      const start = new Date(
                        Date.UTC(
                          now.getUTCFullYear(),
                          now.getUTCMonth(),
                          now.getUTCDate(),
                          7,
                          0,
                          0,
                        ),
                      );
                      const end = new Date(
                        Date.UTC(
                          now.getUTCFullYear(),
                          now.getUTCMonth(),
                          now.getUTCDate(),
                          7,
                          15,
                          0,
                        ),
                      );
                      const ics = createSimpleIcs({
                        title: "Morning Prayer (Ortho Companion)",
                        description: "A small daily anchor: morning prayer + Scripture.",
                        start,
                        end,
                      });
                      downloadTextFile("morning-prayer.ics", ics, "text/calendar");
                    }}
                  >
                    <CalendarPlus className="mr-2 h-4 w-4" /> Add morning anchor
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="btn-wrap rounded-2xl border-border/60"
                  >
                    <a
                      href="https://www.oca.org/orthodoxy/prayers"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Browse OCA prayer texts <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="privacy" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-primary" /> Privacy & saving
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">
                  If enabled, checkmarks/preferences are stored locally. Progress auto-expires after 14 days.
                </p>

                <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Remember on this device</p>
                    <p className="text-xs text-muted-foreground">On by default</p>
                  </div>
                  <Switch checked={saveEnabled} onCheckedChange={setSaveEnabled} />
                </div>

                {saveEnabled ? (
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-2xl border-border/60"
                      onClick={() => {
                        removeStoredItem(prefsKey());
                        cleanupStoredByPrefix("prayer_rule:progress:", 0);
                        setPrefs(DEFAULT_PREFS);
                        setProgress({});
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Clear saved data
                    </Button>
                  </div>
                ) : null}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <p className="text-xs text-muted-foreground">
          Tip: consult your priest/spiritual father for a larger rule.
        </p>
      </div>
    </Card>
  );
}
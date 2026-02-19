import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Globe, CalendarDays, Church, Sparkles, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type AppLanguage,
  type AppSettings,
  type CalendarMode,
  type Jurisdiction,
  getSettings,
  setSettings,
} from "@/lib/settings";

function labelForLanguage(l: AppLanguage) {
  if (l === "en") return "English";
  if (l === "el") return "Greek (links)";
  if (l === "ru") return "Russian (links)";
  return "Arabic (links)";
}

function labelForJurisdiction(j: Jurisdiction) {
  if (j === "oca") return "OCA";
  if (j === "goarch") return "GOARCH";
  if (j === "antiochian") return "Antiochian";
  return "ROCOR";
}

export default function Settings() {
  const initial = useMemo(() => getSettings(), []);
  const [s, setS] = useState<AppSettings>(initial);

  useEffect(() => {
    setSettings(s);
  }, [s]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Settings</p>
          <h1 className="text-2xl font-semibold tracking-tight">Preferences</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stored locally on this device.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-2xl border-border/60">
          <Link to="/today">Back to app</Link>
        </Button>
      </div>

      <div className="mt-5 grid gap-4">
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Calendar</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose how you want to view days.
              </p>
            </div>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">Mode</p>
              <Select
                value={s.calendarMode}
                onValueChange={(v) => setS((p) => ({ ...p, calendarMode: v as CalendarMode }))}
              >
                <SelectTrigger className="h-11 rounded-2xl">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gregorian">New Calendar (Gregorian)</SelectItem>
                  <SelectItem value="julian">Old Calendar (Julian)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Note: availability depends on the upstream calendar source.
              </p>
            </div>

            <div className="grid gap-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">Seasonal hints</p>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Show seasonal callouts</p>
                  <p className="text-xs text-muted-foreground">Small prompts (fasts, Lent, etc.)</p>
                </div>
                <Switch
                  checked={s.seasonalHints}
                  onCheckedChange={(checked) => setS((p) => ({ ...p, seasonalHints: checked }))}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Sources</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Prefer a jurisdiction for external links.
              </p>
            </div>
            <Church className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Jurisdiction</p>
            <Select
              value={s.jurisdiction}
              onValueChange={(v) => setS((p) => ({ ...p, jurisdiction: v as Jurisdiction }))}
            >
              <SelectTrigger className="h-11 rounded-2xl">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oca">{labelForJurisdiction("oca")}</SelectItem>
                <SelectItem value="goarch">{labelForJurisdiction("goarch")}</SelectItem>
                <SelectItem value="antiochian">{labelForJurisdiction("antiochian")}</SelectItem>
                <SelectItem value="rocor">{labelForJurisdiction("rocor")}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This doesn’t change doctrine; it just changes which official links you see first.
            </p>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Language</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Controls link suggestions (when available).
              </p>
            </div>
            <Globe className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Preferred language</p>
            <Select
              value={s.language}
              onValueChange={(v) => setS((p) => ({ ...p, language: v as AppLanguage }))}
            >
              <SelectTrigger className="h-11 rounded-2xl">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{labelForLanguage("en")}</SelectItem>
                <SelectItem value="el">{labelForLanguage("el")}</SelectItem>
                <SelectItem value="ru">{labelForLanguage("ru")}</SelectItem>
                <SelectItem value="ar">{labelForLanguage("ar")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Privacy note</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Some features store data locally (journals, counters, plans).
              </p>
            </div>
            <ShieldAlert className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            This app is designed to work without accounts. If you enable saving in different areas,
            it is stored on this device only.
          </p>
          <div className="mt-3 flex gap-2">
            <Button asChild variant="outline" className="rounded-2xl border-border/60">
              <Link to="/privacy">Open privacy</Link>
            </Button>
            <Button asChild className="rounded-2xl">
              <a href="https://www.oca.org" target="_blank" rel="noopener noreferrer">
                Primary source (OCA)
              </a>
            </Button>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Tip</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep settings simple. Ask your priest if you’re unsure.
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { ArrowLeft, Download, ExternalLink, ShieldAlert, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  clearStoredByPrefix,
  getStoredItem,
  listStoredKeys,
  removeStoredItem,
  setRawStoredItem,
  setStoredItem,
} from "@/lib/deviceStorage";
import { showError, showSuccess } from "@/utils/toast";
import { Link } from "react-router-dom";

type ToggleItem = {
  key: string;
  title: string;
  description: string;
  defaultValue: boolean;
  alsoClears?: () => void;
};

const TOGGLES: ToggleItem[] = [
  {
    key: "privacy:reflection_save",
    title: "Journal: Save on this device",
    description:
      "Off by default. If enabled, Journal notes are stored in browser local storage on this device.",
    defaultValue: false,
    alsoClears: () => clearStoredByPrefix("reflection:"),
  },
  {
    key: "privacy:counter_save",
    title: "Jesus Prayer: Remember on this device",
    description:
      "If enabled, daily counts and your goal are stored in local storage (auto-expire).",
    defaultValue: true,
    alsoClears: () => {
      clearStoredByPrefix("jesus_prayer_count:");
      removeStoredItem("jesus_prayer_goal");
    },
  },
  {
    key: "privacy:prayer_rule_save",
    title: "Prayer rule: Remember on this device",
    description:
      "If enabled, your checkmarks and preferences are stored in local storage (auto-expire).",
    defaultValue: true,
    alsoClears: () => {
      removeStoredItem("prayer_rule:prefs");
      clearStoredByPrefix("prayer_rule:progress:");
    },
  },
  {
    key: "privacy:bible_save",
    title: "Bible: Remember on this device",
    description:
      "If enabled, bookmarks and last-read position are stored in local storage.",
    defaultValue: true,
    alsoClears: () => {
      removeStoredItem("bible:last_read");
      removeStoredItem("bible:bookmarks");
    },
  },
];

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function Privacy() {
  const [hydrated, setHydrated] = useState(false);
  const [values, setValues] = useState<Record<string, boolean>>({});
  const [includeJournalInExport, setIncludeJournalInExport] = useState(false);

  useMemo(() => {
    // hydrate once
    if (hydrated) return;
    const next: Record<string, boolean> = {};
    for (const t of TOGGLES) {
      next[t.key] = getStoredItem<boolean>(t.key) ?? t.defaultValue;
    }
    setValues(next);
    setHydrated(true);
  }, [hydrated]);

  function setToggle(key: string, v: boolean) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setStoredItem(key, v);

    const meta = TOGGLES.find((t) => t.key === key);
    if (!v && meta?.alsoClears) meta.alsoClears();
  }

  function exportData() {
    const keys = listStoredKeys();

    const allowedPrefixes = [
      "privacy:",
      "jesus_prayer_count:",
      "prayer_rule:",
      "bible:",
    ];

    const allowReflection = includeJournalInExport;

    const payload: {
      version: 1;
      exportedAt: string;
      items: Record<string, string>;
    } = {
      version: 1,
      exportedAt: new Date().toISOString(),
      items: {},
    };

    for (const k of keys) {
      const ok =
        allowedPrefixes.some((p) => k.startsWith(p)) ||
        (allowReflection && k.startsWith("reflection:"));
      if (!ok) continue;

      try {
        const raw = window.localStorage.getItem(k);
        if (raw != null) payload.items[k] = raw;
      } catch {
        // ignore
      }
    }

    downloadText(
      `ortho-companion-export-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(payload, null, 2),
    );
    showSuccess("Export downloaded.");
  }

  async function importData(file: File) {
    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as {
        version?: number;
        items?: Record<string, string>;
      };

      if (!parsed?.items || typeof parsed.items !== "object") {
        showError("Invalid import file.");
        return;
      }

      for (const [k, v] of Object.entries(parsed.items)) {
        if (typeof v !== "string") continue;
        setRawStoredItem(k, v);
      }

      showSuccess("Import complete. Refreshing…");
      window.location.assign("/");
    } catch {
      showError("Couldn’t import that file.");
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-5xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-2xl border-border/60"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-10 rounded-2xl border-border/60"
            >
              <a href="https://www.oca.org/questions" target="_blank" rel="noreferrer">
                OCA Q&A <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-5xl px-4 pb-10 pt-4">
        <div className="grid gap-4">
          <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Privacy Center</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Control what gets stored on this device. Local storage can be readable by scripts/extensions on this site.
                </p>
              </div>
              <ShieldAlert className="h-5 w-5 text-muted-foreground" />
            </div>

            <Separator className="my-4" />

            <div className="grid gap-3">
              {TOGGLES.map((t) => (
                <div
                  key={t.key}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{t.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.description}
                    </p>
                  </div>
                  <Switch
                    checked={!!values[t.key]}
                    onCheckedChange={(v) => setToggle(t.key, v)}
                  />
                </div>
              ))}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl border-border/60"
                  onClick={() => {
                    for (const t of TOGGLES) {
                      if (t.alsoClears) t.alsoClears();
                    }
                    showSuccess("Local data cleared.");
                  }}
                >
                  Clear all local data
                </Button>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight">Export / Import</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Move your on-device data between browsers/devices. Export includes local preferences and (optionally) saved Journal notes.
            </p>

            <Separator className="my-4" />

            <div className="grid gap-3">
              <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Include Journal notes in export</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Journal notes can be sensitive. If enabled, they’ll be written into the export file.
                  </p>
                </div>
                <Switch
                  checked={includeJournalInExport}
                  onCheckedChange={setIncludeJournalInExport}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button className="rounded-2xl" onClick={exportData}>
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>

                <label className="inline-flex cursor-pointer items-center gap-2">
                  <Input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      void importData(f);
                      e.currentTarget.value = "";
                    }}
                  />
                  <Button type="button" variant="outline" className="rounded-2xl border-border/60">
                    <Upload className="mr-2 h-4 w-4" /> Import
                  </Button>
                </label>
              </div>

              <p className="text-xs text-muted-foreground">
                Tip: importing overwrites existing keys in local storage.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

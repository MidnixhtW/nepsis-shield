import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  ExternalLink,
  Lock,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  clearStoredByPrefix,
  getStoredItem,
  removeStoredItem,
  setStoredItem,
} from "@/lib/deviceStorage";
import { decryptJson, encryptJson, type EncryptedBlob } from "@/lib/cryptoVault";
import { downloadTextFile } from "@/lib/ics";
import { showError, showSuccess } from "@/utils/toast";

function safeKeys(): string[] {
  try {
    return Object.keys(window.localStorage);
  } catch {
    return [];
  }
}

function safeGetRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetRaw(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

type ExportPayload = {
  v: 1;
  exportedAt: number;
  items: Record<string, string>;
};

const PREFIXES = [
  "reflection:",
  "jesus_prayer_count:",
  "prayer_rule:",
  "bible:",
  "privacy:",
] as const;

export default function Privacy() {
  const [reflectionSave, setReflectionSave] = useState(false);
  const [reflectionEncrypt, setReflectionEncrypt] = useState(true);
  const [counterSave, setCounterSave] = useState(true);
  const [prayerRuleSave, setPrayerRuleSave] = useState(true);
  const [bibleSave, setBibleSave] = useState(true);

  const [exportPass, setExportPass] = useState("");
  const [importPass, setImportPass] = useState("");

  useEffect(() => {
    setReflectionSave(getStoredItem<boolean>("privacy:reflection_save") ?? false);
    setReflectionEncrypt(getStoredItem<boolean>("privacy:reflection_encrypt") ?? true);
    setCounterSave(getStoredItem<boolean>("privacy:counter_save") ?? true);
    setPrayerRuleSave(getStoredItem<boolean>("privacy:prayer_rule_save") ?? true);
    setBibleSave(getStoredItem<boolean>("privacy:bible_save") ?? true);
  }, []);

  useEffect(() => {
    setStoredItem("privacy:reflection_save", reflectionSave);
  }, [reflectionSave]);
  useEffect(() => {
    setStoredItem("privacy:reflection_encrypt", reflectionEncrypt);
  }, [reflectionEncrypt]);
  useEffect(() => {
    setStoredItem("privacy:counter_save", counterSave);
  }, [counterSave]);
  useEffect(() => {
    setStoredItem("privacy:prayer_rule_save", prayerRuleSave);
  }, [prayerRuleSave]);
  useEffect(() => {
    setStoredItem("privacy:bible_save", bibleSave);
  }, [bibleSave]);

  const approxKeyCount = useMemo(() => {
    const keys = safeKeys();
    return keys.filter((k) => PREFIXES.some((p) => k.startsWith(p))).length;
  }, [reflectionSave, reflectionEncrypt, counterSave, prayerRuleSave, bibleSave]);

  async function exportEncrypted() {
    if (!exportPass) {
      showError("Enter an export passphrase.");
      return;
    }

    const items: Record<string, string> = {};
    for (const k of safeKeys()) {
      if (!PREFIXES.some((p) => k.startsWith(p))) continue;
      const v = safeGetRaw(k);
      if (v != null) items[k] = v;
    }

    const payload: ExportPayload = { v: 1, exportedAt: Date.now(), items };

    try {
      const blob = await encryptJson(payload, exportPass);
      downloadTextFile(
        `orthocompanion-export-${new Date().toISOString().slice(0, 10)}.json`,
        JSON.stringify({ enc: 1, blob } satisfies { enc: 1; blob: EncryptedBlob }, null, 2),
        "application/json",
      );
      showSuccess("Encrypted export downloaded.");
    } catch {
      showError("Couldn’t export.");
    }
  }

  async function onImportFile(file: File | null) {
    if (!file) return;
    if (!importPass) {
      showError("Enter the import passphrase.");
      return;
    }

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as { enc?: number; blob?: EncryptedBlob };
      if (parsed?.enc !== 1 || !parsed.blob) throw new Error("bad format");

      const payload = await decryptJson<ExportPayload>(parsed.blob, importPass);
      if (payload.v !== 1) throw new Error("bad version");

      // Restore keys
      for (const [k, v] of Object.entries(payload.items)) {
        safeSetRaw(k, v);
      }

      showSuccess("Import complete. Refresh to see updates.");
    } catch {
      showError("Couldn’t import (wrong passphrase or file). ");
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            Settings
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Privacy Center</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Control what the app stores on this device and export/import your local data.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-2xl border-border/60">
          <Link to="/today">Back to app</Link>
        </Button>
      </div>

      <div className="mt-5 grid gap-4">
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">What’s stored</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Estimated local keys used by the app: <span className="font-semibold text-foreground">{approxKeyCount}</span>
              </p>
            </div>
            <Shield className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-semibold">Journal</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Notes are sensitive. Saving is off by default; encryption is recommended.
              </p>
              <div className="mt-3 grid gap-2">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Save journal on this device</p>
                    <p className="text-xs text-muted-foreground">Off by default</p>
                  </div>
                  <Switch checked={reflectionSave} onCheckedChange={setReflectionSave} />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Encrypt saved journal</p>
                    <p className="text-xs text-muted-foreground">Passphrase required</p>
                  </div>
                  <Switch
                    checked={reflectionEncrypt}
                    onCheckedChange={setReflectionEncrypt}
                    disabled={!reflectionSave}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-fit rounded-2xl border-border/60"
                  onClick={() => {
                    clearStoredByPrefix("reflection:");
                    showSuccess("Saved reflections cleared.");
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete saved reflections
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-semibold">Behavioral data</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Prayer counts, checkmarks, and Bible bookmarks.
              </p>

              <div className="mt-3 grid gap-2">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Remember Jesus Prayer counter</p>
                    <p className="text-xs text-muted-foreground">14-day retention</p>
                  </div>
                  <Switch checked={counterSave} onCheckedChange={setCounterSave} />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Remember Prayer Rule checkmarks</p>
                    <p className="text-xs text-muted-foreground">14-day retention</p>
                  </div>
                  <Switch checked={prayerRuleSave} onCheckedChange={setPrayerRuleSave} />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Remember Bible bookmarks</p>
                    <p className="text-xs text-muted-foreground">Bookmarks retained for 1 year</p>
                  </div>
                  <Switch checked={bibleSave} onCheckedChange={setBibleSave} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-border/60"
                    onClick={() => {
                      clearStoredByPrefix("jesus_prayer_count:");
                      removeStoredItem("jesus_prayer_goal");
                      showSuccess("Counter data cleared.");
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Clear counter
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-border/60"
                    onClick={() => {
                      clearStoredByPrefix("prayer_rule:progress:");
                      removeStoredItem("prayer_rule:prefs");
                      showSuccess("Prayer rule data cleared.");
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Clear prayer rule
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-border/60"
                    onClick={() => {
                      removeStoredItem("bible:last_read");
                      removeStoredItem("bible:bookmarks");
                      showSuccess("Bible data cleared.");
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Clear Bible
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-semibold">References</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild variant="outline" className="rounded-2xl border-border/60">
                  <a href="https://www.oca.org/questions" target="_blank" rel="noreferrer">
                    OCA Q&A <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-2xl border-border/60">
                  <a href="https://www.oca.org/orthodoxy/prayers" target="_blank" rel="noreferrer">
                    OCA prayers <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Encrypted export / import</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Creates an encrypted JSON backup of the app’s local data.
              </p>
            </div>
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-semibold">Export</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Choose a passphrase. You’ll need it to import later.
              </p>
              <div className="mt-3 grid gap-2">
                <Input
                  type="password"
                  value={exportPass}
                  onChange={(e) => setExportPass(e.target.value)}
                  placeholder="Export passphrase"
                  className="h-11 rounded-2xl"
                />
                <Button className="h-11 rounded-2xl" onClick={exportEncrypted}>
                  <Download className="mr-2 h-4 w-4" /> Download encrypted backup
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-semibold">Import</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Import will merge/overwrite matching keys in local storage.
              </p>
              <div className="mt-3 grid gap-2">
                <Input
                  type="password"
                  value={importPass}
                  onChange={(e) => setImportPass(e.target.value)}
                  placeholder="Import passphrase"
                  className="h-11 rounded-2xl"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild variant="outline" className="h-11 rounded-2xl border-border/60">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={(e) => onImportFile(e.target.files?.[0] ?? null)}
                      />
                      <span className="inline-flex items-center">
                        <Upload className="mr-2 h-4 w-4" /> Choose file
                      </span>
                    </label>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Note: encryption is passphrase-based (PBKDF2 + AES-GCM). If you forget the passphrase, the backup can’t be recovered.
          </p>
        </Card>
      </div>
    </div>
  );
}

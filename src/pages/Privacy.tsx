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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

// ADD: extra helpers for validation
function parseWrapped(raw: string | null): { __wrapped: 1; v: unknown; ts?: number; exp?: number } | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && (parsed as any).__wrapped === 1 && "v" in (parsed as any)) {
      return parsed as { __wrapped: 1; v: unknown; ts?: number; exp?: number };
    }
  } catch {
    // ignore
  }
  return null;
}

function getWrappedBoolean(raw: string | null): boolean | null {
  const w = parseWrapped(raw);
  return w && typeof w.v === "boolean" ? (w.v as boolean) : null;
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

// ADD: strict allow-list for privacy keys
const ALLOWED_PRIVACY_KEYS = new Set<string>([
  "privacy:reflection_save",
  "privacy:reflection_encrypt",
  "privacy:counter_save",
  "privacy:prayer_rule_save",
  "privacy:bible_save",
]);

function isAllowedKey(key: string): boolean {
  return (PREFIXES as readonly string[]).some((p) => key.startsWith(p));
}

// Validate value schema per key; require wrapped shape for all allowed keys
function validateKeyValue(key: string, raw: string): boolean {
  if (!isAllowedKey(key)) return false;

  // Only approved privacy keys allowed; must be wrapped boolean
  if (key.startsWith("privacy:")) {
    if (!ALLOWED_PRIVACY_KEYS.has(key)) return false;
    const w = parseWrapped(raw);
    return !!(w && typeof w.v === "boolean");
  }

  // For sensitive notes, ensure wrapped structure to prevent plaintext injection
  if (key.startsWith("reflection:")) {
    return !!parseWrapped(raw);
  }

  // For other app keys, still require wrapped to avoid malformed shapes
  return !!parseWrapped(raw);
}

export default function Privacy() {
  const [reflectionSave, setReflectionSave] = useState(false);
  const [reflectionEncrypt, setReflectionEncrypt] = useState(true);
  const [counterSave, setCounterSave] = useState(true);
  const [prayerRuleSave, setPrayerRuleSave] = useState(true);
  const [bibleSave, setBibleSave] = useState(true);

  const [exportPass, setExportPass] = useState("");
  const [importPass, setImportPass] = useState("");

  // ADD: import confirmation + snapshot state
  type ImportPreview = {
    items: Record<string, string>;
    stats: {
      total: number;
      allowed: number;
      ignored: number;
      added: number;
      updated: number;
      unchanged: number;
    };
    privacyDiffs: Array<{ key: string; from: boolean | null; to: boolean }>;
    sourceName?: string;
  };
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [lastImportInfo, setLastImportInfo] = useState<{ at: number; sourceName?: string; count: number } | null>(null);

  useEffect(() => {
    // Load toggles
    setReflectionSave(getStoredItem<boolean>("privacy:reflection_save") ?? false);
    setReflectionEncrypt(getStoredItem<boolean>("privacy:reflection_encrypt") ?? true);
    setCounterSave(getStoredItem<boolean>("privacy:counter_save") ?? true);
    setPrayerRuleSave(getStoredItem<boolean>("privacy:prayer_rule_save") ?? true);
    setBibleSave(getStoredItem<boolean>("privacy:bible_save") ?? true);

    // Load last import snapshot info
    const snap = getStoredItem<{ at: number; sourceName?: string; keys: Record<string, string | null> }>("meta:last_import_snapshot");
    if (snap && snap.keys) {
      setLastImportInfo({ at: snap.at, sourceName: snap.sourceName, count: Object.keys(snap.keys).length });
    }
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
      showError("Couldn't export.");
    }
  }

  // APPLY CONFIRMED IMPORT
  function applyImport(preview: ImportPreview) {
    // Snapshot currently stored values for keys that will change
    const toChange = Object.entries(preview.items).filter(([k, v]) => safeGetRaw(k) !== v);
    const snapshot: Record<string, string | null> = {};
    for (const [k] of toChange) {
      snapshot[k] = safeGetRaw(k);
    }
    setStoredItem("meta:last_import_snapshot", {
      at: Date.now(),
      sourceName: preview.sourceName ?? undefined,
      keys: snapshot,
    });

    // Apply allowed items
    for (const [k, v] of Object.entries(preview.items)) {
      safeSetRaw(k, v);
    }

    // Reflect privacy toggles immediately in UI (best effort)
    for (const diff of preview.privacyDiffs) {
      const next = diff.to;
      switch (diff.key) {
        case "privacy:reflection_save":
          setReflectionSave(next);
          break;
        case "privacy:reflection_encrypt":
          setReflectionEncrypt(next);
          break;
        case "privacy:counter_save":
          setCounterSave(next);
          break;
        case "privacy:prayer_rule_save":
          setPrayerRuleSave(next);
          break;
        case "privacy:bible_save":
          setBibleSave(next);
          break;
      }
    }

    // Update snapshot info shown
    setLastImportInfo({
      at: Date.now(),
      sourceName: preview.sourceName,
      count: toChange.length,
    });

    showSuccess("Import complete. Review changes below. Refresh to ensure all views update.");
  }

  // UNDO LAST IMPORT
  function undoLastImport() {
    const snap = getStoredItem<{ at: number; sourceName?: string; keys: Record<string, string | null> }>("meta:last_import_snapshot");
    if (!snap || !snap.keys) {
      showError("No previous import snapshot found.");
      return;
    }

    const entries = Object.entries(snap.keys);
    for (const [k, raw] of entries) {
      if (raw === null) {
        removeStoredItem(k);
      } else {
        safeSetRaw(k, raw);
      }
    }
    removeStoredItem("meta:last_import_snapshot");
    setLastImportInfo(null);
    showSuccess("Reverted last import. Refresh to ensure all views update.");
  }

  // PREPARE IMPORT: decrypt, filter, validate, and prompt
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

      const incoming = payload.items ?? {};
      const total = Object.keys(incoming).length;

      // Filter + validate
      const allowedEntries: Array<[string, string]> = [];
      let ignored = 0;
      for (const [k, v] of Object.entries(incoming)) {
        if (typeof v !== "string") {
          ignored++;
          continue;
        }
        if (!validateKeyValue(k, v)) {
          ignored++;
          continue;
        }
        allowedEntries.push([k, v]);
      }

      // Build stats
      let added = 0;
      let updated = 0;
      let unchanged = 0;
      for (const [k, v] of allowedEntries) {
        const cur = safeGetRaw(k);
        if (cur == null) added++;
        else if (cur !== v) updated++;
        else unchanged++;
      }

      // Privacy diffs
      const privacyDiffs: Array<{ key: string; from: boolean | null; to: boolean }> = [];
      for (const [k, v] of allowedEntries) {
        if (!k.startsWith("privacy:")) continue;
        const toVal = getWrappedBoolean(v);
        if (toVal === null) continue;
        const curVal = getWrappedBoolean(safeGetRaw(k));
        if (curVal !== toVal) {
          privacyDiffs.push({ key: k, from: curVal, to: toVal });
        }
      }

      const items: Record<string, string> = Object.fromEntries(allowedEntries);
      const preview: ImportPreview = {
        items,
        stats: {
          total,
          allowed: allowedEntries.length,
          ignored,
          added,
          updated,
          unchanged,
        },
        privacyDiffs,
        sourceName: file.name,
      };

      setImportPreview(preview);
      setConfirmOpen(true);
    } catch {
      showError("Couldn't import (wrong passphrase or file). ");
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
              <h2 className="text-base font-semibold tracking-tight">What's stored</h2>
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
                Creates an encrypted JSON backup of the app's local data.
              </p>
            </div>
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-semibold">Export</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Choose a passphrase. You'll need it to import later.
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

                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-2xl border-border/60"
                    disabled={!lastImportInfo}
                    onClick={undoLastImport}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Undo last import
                  </Button>
                </div>

                {lastImportInfo && (
                  <p className="text-xs text-muted-foreground">
                    Last import snapshot: {new Date(lastImportInfo.at).toLocaleString()} {lastImportInfo.sourceName ? `• ${lastImportInfo.sourceName}` : ""} • {lastImportInfo.count} key(s)
                  </p>
                )}
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Note: encryption is passphrase-based (PBKDF2 + AES-GCM). If you forget the passphrase, the backup can't be recovered.
          </p>
        </Card>
      </div>

      {/* Confirm import dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Review import changes</AlertDialogTitle>
            <AlertDialogDescription>
              {importPreview ? (
                <div className="space-y-3">
                  <p className="text-sm">
                    File: <span className="font-medium">{importPreview.sourceName ?? "unknown.json"}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="text-xs text-muted-foreground">Total keys in file</div>
                      <div className="font-semibold">{importPreview.stats.total}</div>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="text-xs text-muted-foreground">Allowed / Ignored</div>
                      <div className="font-semibold">
                        {importPreview.stats.allowed} / {importPreview.stats.ignored}
                      </div>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="text-xs text-muted-foreground">Will add</div>
                      <div className="font-semibold">{importPreview.stats.added}</div>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="text-xs text-muted-foreground">Will update</div>
                      <div className="font-semibold">{importPreview.stats.updated}</div>
                    </div>
                  </div>

                  {importPreview.privacyDiffs.length > 0 && (
                    <div className="rounded-2xl border border-border/60 bg-amber-50/70 p-3 text-amber-900">
                      <p className="text-sm font-semibold">Privacy settings will change:</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {importPreview.privacyDiffs.map((d) => (
                          <li key={d.key} className="flex items-center justify-between">
                            <span className="truncate">{d.key.replace("privacy:", "").replaceAll("_", " ")}</span>
                            <span className="ml-3 rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium">
                              {String(d.from)} → {String(d.to)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (importPreview) {
                  applyImport(importPreview);
                }
                setConfirmOpen(false);
                setImportPreview(null);
              }}
            >
              Apply import
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
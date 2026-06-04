import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Download,
  Info,
  Lock,
  Shield,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  hasAnyLegacyPlaintextSensitiveNotes,
  hasLegacyPlaintextSensitiveData,
} from "@/lib/deviceStorage";

import { decryptJson, encryptJson, type EncryptedBlob } from "@/lib/cryptoVault";
import { downloadTextFile } from "@/lib/ics";
import { showError, showSuccess } from "@/utils/toast";
import { PassphraseMeter } from "@/components/app/PassphraseMeter";
import { isStrongPassphrase, strongPassphraseMessage } from "@/lib/passphraseStrength";

// Safe localStorage helpers
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

// Allow-listed prefixes and exact privacy keys
const ALLOWED_PREFIXES = [
  "reflection:",
  "jesus_prayer_count:",
  "prayer_rule:",
  "bible:",
  "confess:",
  "plans:",
] as const;

const ALLOWED_PRIVACY_KEYS = new Set([
  "privacy:reflection_save",
  "privacy:counter_save",
  "privacy:prayer_rule_save",
  "privacy:bible_save",
  "privacy:confess_save",
]);

// Value schema validation

function parseJsonSafe(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

type WrappedValue<T = unknown> = {
  __wrapped: 1;
  v: T;
  ts: number;
  exp?: number;
};

function isWrappedValue(x: unknown): x is WrappedValue {
  return (
    typeof x === "object" &&
    x !== null &&
    (x as { __wrapped?: unknown }).__wrapped === 1 &&
    "v" in (x as Record<string, unknown>) &&
    typeof (x as Record<string, unknown>).ts === "number"
  );
}

function isAllowedKey(key: string): boolean {
  if (ALLOWED_PRIVACY_KEYS.has(key)) return true;
  return ALLOWED_PREFIXES.some((p) => key.startsWith(p));
}

function isSensitiveNoteKey(key: string) {
  return key.startsWith("reflection:") || key.startsWith("confess:note:");
}

function isSensitiveConfessionSelectsKey(key: string) {
  return key.startsWith("confess:selects:");
}

function isSensitiveStoredKey(key: string) {
  return isSensitiveNoteKey(key) || isSensitiveConfessionSelectsKey(key);
}

function isEncryptedNoteValue(value: unknown) {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { enc?: unknown }).enc === 1 &&
    typeof (value as { blob?: unknown }).blob === "object" &&
    (value as { blob?: unknown }).blob !== null
  );
}

function isValidValueForKey(key: string, raw: string): boolean {
  // All imported values must be wrapped objects produced by setStoredItem
  const parsed = parseJsonSafe(raw);
  if (!isWrappedValue(parsed)) return false;

  // Privacy keys must be boolean values
  if (ALLOWED_PRIVACY_KEYS.has(key)) {
    return typeof parsed.v === "boolean";
  }

  // Sensitive imports must already be encrypted. Legacy confess:selects plaintext is rejected.
  if (isSensitiveStoredKey(key)) return isEncryptedNoteValue(parsed.v);

  // Other allow-listed prefixes can be any wrapped value
  return true;
}

export default function Privacy() {
  const [legacyPlaintextDetected, setLegacyPlaintextDetected] = useState(false);
  const [exportPass, setExportPass] = useState("");
  const [importPass, setImportPass] = useState("");

  // Temporary snapshot for rollback within this session.
  // For every imported key, store its *previous* raw value (or null if it didn't exist).
  const [rollbackSnapshot, setRollbackSnapshot] = useState<Record<string, string | null> | null>(null);
  const [lastImportMeta, setLastImportMeta] = useState<{ at: number; sourceName?: string } | null>(null);

  useEffect(() => {
    setLegacyPlaintextDetected(hasAnyLegacyPlaintextSensitiveNotes());
  }, []);

  async function exportEncrypted() {
    if (!exportPass) {
      showError("Enter an export passphrase.");
      return;
    }

    if (!isStrongPassphrase(exportPass)) {
      showError(strongPassphraseMessage);
      return;
    }

    const items: Record<string, string> = {};
    for (const k of safeKeys()) {
      if (!(ALLOWED_PREFIXES.some((p) => k.startsWith(p)) || ALLOWED_PRIVACY_KEYS.has(k))) continue;
      if (hasLegacyPlaintextSensitiveData(k)) continue;
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

  function diffPreview(importItems: Record<string, string>) {
    // Prepare filtered + validated items, and compute a summary for confirmation
    const accepted: Record<string, string> = {};
    const rejectedKeys: string[] = [];
    const privacyChanges: Array<{ key: string; from: string; to: string }> = [];
    let otherCount = 0;

    for (const [k, v] of Object.entries(importItems)) {
      if (!isAllowedKey(k) || !isValidValueForKey(k, v)) {
        rejectedKeys.push(k);
        continue;
      }
      accepted[k] = v;

      if (ALLOWED_PRIVACY_KEYS.has(k)) {
        const currentRaw = safeGetRaw(k);
        const currentParsed = parseJsonSafe(currentRaw);
        const newParsed = parseJsonSafe(v) as WrappedValue | null;
        const fromVal =
          currentParsed && isWrappedValue(currentParsed) ? String(currentParsed.v) : "unset";
        const toVal = newParsed && isWrappedValue(newParsed) ? String(newParsed.v) : "?";
        if (fromVal !== toVal) {
          privacyChanges.push({ key: k, from: fromVal, to: toVal });
        }
      } else {
        otherCount++;
      }
    }

    return { accepted, rejectedKeys, privacyChanges, otherCount };
  }

  async function onImportFile(file: File | null) {
    if (!file) return;
    if (!importPass) {
      showError("Enter the import passphrase.");
      return;
    }

    // Read+decrypt
    let payload: ExportPayload | null = null;
    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as { enc?: number; blob?: EncryptedBlob };
      if (parsed?.enc !== 1 || !parsed.blob) throw new Error("bad format");
      payload = await decryptJson<ExportPayload>(parsed.blob, importPass);
      if (payload.v !== 1) throw new Error("bad version");
    } catch {
      showError("Couldn't import (wrong passphrase or file).");
      return;
    }

    // Compute preview with allow-list + schema validation
    const { accepted, privacyChanges, otherCount } = diffPreview(payload.items);
    if (Object.keys(accepted).length === 0) {
      showError("Nothing to import: no valid keys found.");
      return;
    }

    // Build confirmation text, emphasizing privacy changes
    const privacySummary =
      privacyChanges.length > 0
        ? privacyChanges
            .map((c) => `• ${c.key.replace("privacy:", "")}: ${c.from} → ${c.to}`)
            .join("\n")
        : "No privacy setting changes.";

    const summaryLines = [
      `This will import ${otherCount} data entr${otherCount === 1 ? "y" : "ies"}.`,
      privacyChanges.length > 0 ? "Privacy changes:" : "Privacy changes: none",
      privacySummary,
      "",
      "Proceed with import?",
    ];
    // Native confirm for simplicity and reliability
    const ok = window.confirm(summaryLines.join("\n"));
    if (!ok) {
      return;
    }

    // Snapshot current values for rollback (only for keys that will be imported)
    const snapshot: Record<string, string | null> = {};
    for (const k of Object.keys(accepted)) {
      snapshot[k] = safeGetRaw(k);
    }

    // Apply
    for (const [k, v] of Object.entries(accepted)) {
      safeSetRaw(k, v);
    }
    setRollbackSnapshot(snapshot);
    setLastImportMeta({ at: Date.now(), sourceName: file.name });

    showSuccess("Import complete. Refresh to see updates.");
  }

  function rollbackLastImport() {
    if (!rollbackSnapshot) {
      showError("No recent import to roll back.");
      return;
    }

    // Restore only the keys that were modified/created during the last import.
    for (const [k, prev] of Object.entries(rollbackSnapshot)) {
      if (prev == null) {
        try {
          window.localStorage.removeItem(k);
        } catch {
          // ignore
        }
      } else {
        safeSetRaw(k, prev);
      }
    }

    setRollbackSnapshot(null);
    setLastImportMeta(null);
    showSuccess("Rolled back last import.");
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
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Not official:</span> This is an independent project and not an official app of the Orthodox Church in America (OCA).
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
              <h2 className="text-base font-semibold tracking-tight">Third-party sources & privacy</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Some content is fetched from public endpoints.
              </p>
            </div>
            <Info className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-semibold">What those services can observe</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Requests are made from your browser. These providers may see your IP address and what you request (dates/passages). The app does not send your journal/confession notes to these services.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-background p-4">
                <p className="text-sm font-semibold">orthocal.info</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Daily calendar data (fasting/saints/readings).
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background p-4">
                <p className="text-sm font-semibold">bible-api.com</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Bible text for many references.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background p-4 sm:col-span-2">
                <p className="text-sm font-semibold">bolls.life</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Alternative Bible datasets (used for some OSB-aligned lookups).
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Privacy hardening: requests are sent with <span className="font-semibold text-foreground">no-referrer</span> and are cached per-session to reduce repeated calls.
            </p>
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

          {legacyPlaintextDetected ? (
            <Alert className="mb-4 rounded-2xl border-destructive/30 bg-destructive/10">
              <Shield className="h-4 w-4" />
              <AlertTitle className="text-sm font-semibold">Legacy plaintext sensitive data detected</AlertTitle>
              <AlertDescription className="mt-1 text-xs text-muted-foreground">
                Old journal notes, confession notes, or confession checklist selections are still stored as plaintext on this device. They are excluded from exports and hidden in the app until you open the relevant section and encrypt them with a strong passphrase, or delete saved data.
              </AlertDescription>
            </Alert>
          ) : null}

          <Alert className="rounded-2xl border-primary/30 bg-primary/5">
            <AlertTitle className="text-sm font-semibold">What's included in the encrypted backup</AlertTitle>
            <AlertDescription className="mt-1 text-xs text-muted-foreground">
              • Journal notes • Confession prep (checks + notes) • "Lord Jesus Christ, Son of God, have mercy on me, a sinner" counter • Prayer Rule progress • Bible bookmarks • Reading plans • Save settings.
              <br />
              Anything outside these sections is excluded. Avoid plaintext/manual backups (like copy/paste or screenshots) for sensitive notes.
            </AlertDescription>
          </Alert>

          <Alert className="mt-3 rounded-2xl border-amber-300/50 bg-amber-50/70 dark:bg-amber-950/20">
            <Shield className="h-4 w-4" />
            <AlertTitle className="text-sm font-semibold">Backup reminder</AlertTitle>
            <AlertDescription className="mt-1 text-xs text-muted-foreground">
              If you save encrypted journal or confession prep, download a fresh encrypted backup after meaningful updates and keep the passphrase somewhere safe. The app cannot recover forgotten passphrases.
            </AlertDescription>
          </Alert>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-semibold">Export</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Choose a strong 12+ character passphrase. You'll need it to import later.
              </p>
              <div className="mt-3 grid gap-2">
                <Input
                  type="password"

                  value={exportPass}
                  onChange={(e) => setExportPass(e.target.value)}
                  placeholder="Export passphrase"
                  className="h-11 rounded-2xl"
                />
                <PassphraseMeter passphrase={exportPass} />
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
                <PassphraseMeter passphrase={importPass} compact />
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

                  {lastImportMeta && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-2xl border-border/60"
                        onClick={rollbackLastImport}
                      >
                        Undo last import
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        Imported {lastImportMeta.sourceName ? `"${lastImportMeta.sourceName}"` : "backup"} at{" "}
                        {new Date(lastImportMeta.at).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Note: encryption is passphrase-based (PBKDF2 + AES-GCM). Short or common passphrases can be guessed offline if someone obtains browser storage or a backup file, so strong passphrases are required. If you forget the passphrase, the backup can't be recovered.
          </p>

        </Card>
      </div>
    </div>
  );
}
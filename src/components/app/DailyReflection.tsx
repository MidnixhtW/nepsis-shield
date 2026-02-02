import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ExternalLink,
  KeyRound,
  PenLine,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import type { EncryptedBlob } from "@/lib/cryptoVault";
import { decryptString, encryptString } from "@/lib/cryptoVault";
import { showError, showSuccess } from "@/utils/toast";

function keyForDay(dayKey: string) {
  return `reflection:${dayKey}`;
}

function saveEnabledKey() {
  return "privacy:reflection_save";
}

function encryptEnabledKey() {
  return "privacy:reflection_encrypt";
}

const NOTE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

type StoredNote = string | { enc: 1; blob: EncryptedBlob };

export function DailyReflection() {
  const today = useMemo(() => new Date(), []);
  const dayKey = useMemo(() => format(today, "yyyy-MM-dd"), [today]);

  const q = useQuery({
    queryKey: ["daily", dayKey],
    queryFn: () => fetchDailyData(today),
  });

  const [note, setNote] = useState("");
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [encryptEnabled, setEncryptEnabled] = useState(true);

  // passphrase is never persisted; it's session-only.
  const [passphrase, setPassphrase] = useState("");
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    cleanupStoredByPrefix("reflection:", NOTE_TTL_MS);

    const saved = getStoredItem<boolean>(saveEnabledKey());
    setSaveEnabled(saved ?? false);

    const encEnabled = getStoredItem<boolean>(encryptEnabledKey());
    setEncryptEnabled(encEnabled ?? true);
  }, []);

  useEffect(() => {
    setStoredItem(saveEnabledKey(), saveEnabled);
  }, [saveEnabled]);

  useEffect(() => {
    setStoredItem(encryptEnabledKey(), encryptEnabled);
    // If turning encryption on, lock until the user provides a passphrase.
    if (encryptEnabled) setLocked(true);
  }, [encryptEnabled]);

  useEffect(() => {
    // Load saved note when enabled.
    if (!saveEnabled) return;

    const stored = getStoredItem<StoredNote>(keyForDay(dayKey));
    if (!stored) return;

    if (typeof stored === "string") {
      setNote(stored);
      setLocked(false);
      return;
    }

    // Encrypted note
    setLocked(true);
  }, [dayKey, saveEnabled]);

  async function unlockAndLoad() {
    if (!saveEnabled) return;

    if (passphrase.length < 8) {
      showError("Use a longer passphrase (8+ characters).");
      return;
    }

    const stored = getStoredItem<StoredNote>(keyForDay(dayKey));
    if (!stored || typeof stored === "string") {
      setLocked(false);
      return;
    }

    try {
      const raw = await decryptString(stored.blob, passphrase);
      setNote(raw);
      setLocked(false);
      showSuccess("Journal unlocked for this session.");
    } catch {
      showError("Couldn't unlock. Check your passphrase.");
    }
  }

  useEffect(() => {
    // Persist note (if enabled). When encrypted, persist only ciphertext.
    if (!saveEnabled) return;

    (async () => {
      try {
        if (!encryptEnabled) {
          setStoredItem(keyForDay(dayKey), note, { ttlMs: NOTE_TTL_MS });
          return;
        }

        if (locked) return; // don't overwrite ciphertext while locked
        if (!passphrase) return; // need passphrase to encrypt

        const blob = await encryptString(note, passphrase);
        setStoredItem(
          keyForDay(dayKey),
          { enc: 1, blob } satisfies StoredNote,
          { ttlMs: NOTE_TTL_MS },
        );
      } catch {
        showError("Couldn't save securely.");
      }
    })();
  }, [note, dayKey, saveEnabled, encryptEnabled, passphrase, locked]);

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
            <h2 className="text-xl font-semibold tracking-tight">Reflection</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              One prompt + a few honest sentences.
            </p>
          </div>
          <Sparkles className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        {q.isLoading ? (
          <div className="text-sm text-muted-foreground">Loading today…</div>
        ) : q.isError ? (
          <div className="text-sm text-destructive">Couldn't load today's prompt.</div>
        ) : q.data ? (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                Prompt
              </p>
              <p className="mt-2 text-sm leading-relaxed">{prompt}</p>
            </div>

            {/* Collapsible privacy/settings to reduce visual clutter */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="privacy" className="border-none">
                <AccordionTrigger className="rounded-2xl border border-amber-200/70 bg-amber-50/70 px-4 text-left text-amber-900 hover:no-underline">
                  <span className="inline-flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-800" /> Privacy & saving
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-amber-900">
                    <p className="text-xs leading-relaxed text-amber-900/80">
                      Journal notes can be sensitive. If you enable saving, notes are stored on this device. Encryption helps protect notes at rest, but your passphrase is required to read them.
                    </p>

                    <div className="mt-3 grid gap-2">
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200/70 bg-white/60 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">Save on this device</p>
                          <p className="text-xs text-amber-900/70">Off by default</p>
                        </div>
                        <Switch checked={saveEnabled} onCheckedChange={setSaveEnabled} />
                      </div>

                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200/70 bg-white/60 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">Encrypt saved notes</p>
                          <p className="text-xs text-amber-900/70">Recommended</p>
                        </div>
                        <Switch
                          checked={encryptEnabled}
                          onCheckedChange={(checked) => {
                            if (!checked && saveEnabled) {
                              const ok = window.confirm(
                                "Disabling encryption will store journal notes in plaintext on this device. This makes them readable by any script with access to this page (e.g., a malicious extension). Are you sure you want to turn off encryption?"
                              );
                              if (!ok) return;
                            }
                            setEncryptEnabled(checked);
                          }}
                          disabled={!saveEnabled}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-2xl border-amber-200 bg-white/70 text-amber-900 hover:bg-white"
                          onClick={() => {
                            clearStoredByPrefix("reflection:");
                            showSuccess("Saved reflections deleted.");
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete saved notes
                        </Button>
                        <p className="text-xs text-amber-900/70">Notes auto-expire after 30 days.</p>
                      </div>
                    </div>

                    {saveEnabled && encryptEnabled ? (
                      <div className="mt-3 rounded-2xl border border-amber-200/70 bg-white/60 p-4">
                        <p className="text-xs font-semibold tracking-wide text-amber-900/80">
                          Passphrase (session-only)
                        </p>
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                          <div className="relative flex-1">
                            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-900/60" />
                            <Input
                              type="password"
                              value={passphrase}
                              onChange={(e) => setPassphrase(e.target.value)}
                              placeholder="Enter a passphrase"
                              className="h-11 rounded-2xl border-amber-200 bg-white/70 pl-10"
                            />
                          </div>
                          <Button
                            type="button"
                            className="h-11 rounded-2xl"
                            onClick={unlockAndLoad}
                            disabled={!passphrase}
                          >
                            Unlock
                          </Button>
                        </div>
                        <p className="mt-2 text-xs text-amber-900/70">
                          Your passphrase is never stored. If you forget it, encrypted notes can't be recovered.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                Journal
              </p>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Two or three honest sentences is enough."
                className="mt-2 min-h-32 rounded-2xl"
                disabled={saveEnabled && encryptEnabled && locked}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {!saveEnabled
                  ? "Not saved locally — this text will be lost if you refresh."
                  : encryptEnabled
                    ? locked
                      ? "Locked — enter your passphrase to view/edit saved notes."
                      : "Saved (encrypted) on this device."
                    : "Saved (not encrypted) on this device."}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">Source: OCA daily page.</div>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="rounded-2xl border-border/60">
                  <a href={q.data.sources.ocaDailyUrl} target="_blank" rel="noopener noreferrer">
                    Open on OCA <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  className="rounded-2xl"
                  onClick={() => {
                    setNote((n) => (n ? n : `${prompt}\n\n` + "• "));
                    if (encryptEnabled && saveEnabled) setLocked(false);
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
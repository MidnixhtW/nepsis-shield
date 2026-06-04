import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ExternalLink, KeyRound, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  cleanupStoredByPrefix,
  getLegacyPlaintextSensitiveNote,
  getLegacyPlaintextSensitiveValue,
  getStoredItem,
  removeStoredItem,
  setStoredItem,
} from "@/lib/deviceStorage";
import type { EncryptedBlob } from "@/lib/cryptoVault";
import { decryptJson, decryptString, encryptJson } from "@/lib/cryptoVault";
import { isStrongPassphrase, strongPassphraseMessage } from "@/lib/passphraseStrength";
import { showError, showSuccess } from "@/utils/toast";
import { PassphraseMeter } from "@/components/app/PassphraseMeter";

type MapBool = Record<string, boolean>;
type StoredPrep = { enc: 1; blob: EncryptedBlob };
type ConfessionPrepPayload = { v: 1; checks: MapBool; note: string };

const PROMPTS: Array<{ id: string; label: string }> = [
  { id: "pride", label: "Pride / vanity / self-justification" },
  { id: "anger", label: "Anger / harsh words / impatience" },
  { id: "resent", label: "Resentment / keeping a record of wrongs" },
  { id: "envy", label: "Envy / comparison" },
  { id: "impurity", label: "Impurity in thought or action" },
  { id: "dishonesty", label: "Dishonesty / deceit / cutting corners" },
  { id: "gossip", label: "Gossip / slander" },
  { id: "negligence", label: "Negligence in prayer / inattentiveness" },
  { id: "greed", label: "Greed / withholding mercy" },
  { id: "gluttony", label: "Gluttony / intemperance" },
  { id: "sloth", label: "Sloth / laziness in good" },
];

function weekKey() {
  const d = new Date();
  return `${format(d, "yyyy")}-W${format(d, "II")}`;
}

function selectsKey(wk: string) {
  return `confess:selects:${wk}`;
}
function noteKey(wk: string) {
  return `confess:note:${wk}`;
}
function saveEnabledKey() {
  return "privacy:confess_save";
}

const NOTE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function isMapBool(value: unknown): value is MapBool {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((v) => typeof v === "boolean")
  );
}

function isPrepPayload(value: unknown): value is ConfessionPrepPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { v?: unknown }).v === 1 &&
    isMapBool((value as { checks?: unknown }).checks) &&
    typeof (value as { note?: unknown }).note === "string"
  );
}

function legacyChecksForWeek(wk: string): MapBool {
  const legacy = getLegacyPlaintextSensitiveValue(selectsKey(wk));
  return isMapBool(legacy) ? legacy : {};
}

export function ConfessionPrep() {
  const wk = useMemo(() => weekKey(), []);

  const [checks, setChecks] = useState<MapBool>({});
  const [note, setNote] = useState("");
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [locked, setLocked] = useState(false);
  const [pass, setPass] = useState("");
  const [legacyPlaintextNote, setLegacyPlaintextNote] = useState<string | null>(null);
  const [legacyPlaintextChecks, setLegacyPlaintextChecks] = useState<MapBool | null>(null);

  useEffect(() => {
    cleanupStoredByPrefix("confess:", NOTE_TTL_MS);

    const s = getStoredItem<boolean>(saveEnabledKey());
    setSaveEnabled(s ?? false);
  }, []);

  useEffect(() => {
    if (!saveEnabled) return;

    const legacyNote = getLegacyPlaintextSensitiveNote(noteKey(wk));
    const legacyChecks = legacyChecksForWeek(wk);
    const hasLegacyChecks = Object.keys(legacyChecks).length > 0;

    if (legacyNote !== null || hasLegacyChecks) {
      setLegacyPlaintextNote(legacyNote ?? "");
      setLegacyPlaintextChecks(hasLegacyChecks ? legacyChecks : {});
      setChecks({});
      setNote("");
      setLocked(true);
      return;
    }

    setLegacyPlaintextNote(null);
    setLegacyPlaintextChecks(null);
    const savedPrep = getStoredItem<StoredPrep>(noteKey(wk));
    if (savedPrep?.enc === 1) setLocked(true);
  }, [wk, saveEnabled]);

  useEffect(() => {
    setStoredItem(saveEnabledKey(), saveEnabled);
    if (!saveEnabled) {
      cleanupStoredByPrefix("confess:", 0);
      setChecks({});
      setNote("");
      setLegacyPlaintextNote(null);
      setLegacyPlaintextChecks(null);
      setLocked(false);
    } else {
      setLocked(true);
    }
  }, [saveEnabled]);

  useEffect(() => {
    if (!saveEnabled) return;
    (async () => {
      if (locked) return;
      if (!pass) return;
      if (!isStrongPassphrase(pass)) return;

      const blob = await encryptJson(
        { v: 1, checks, note } satisfies ConfessionPrepPayload,
        pass,
      );
      setStoredItem(noteKey(wk), { enc: 1, blob } satisfies StoredPrep, {
        ttlMs: NOTE_TTL_MS,
      });
      removeStoredItem(selectsKey(wk));
    })().catch(() => showError("Couldn't save securely."));
  }, [checks, note, wk, saveEnabled, pass, locked]);

  async function migrateLegacyPlaintextPrep() {
    if (!saveEnabled || legacyPlaintextNote === null || legacyPlaintextChecks === null) return;

    if (!isStrongPassphrase(pass)) {
      showError(strongPassphraseMessage);
      return;
    }

    try {
      const payload = {
        v: 1,
        checks: legacyPlaintextChecks,
        note: legacyPlaintextNote,
      } satisfies ConfessionPrepPayload;
      const blob = await encryptJson(payload, pass);
      setStoredItem(noteKey(wk), { enc: 1, blob } satisfies StoredPrep, {
        ttlMs: NOTE_TTL_MS,
      });
      removeStoredItem(selectsKey(wk));
      setChecks(payload.checks);
      setNote(payload.note);
      setLegacyPlaintextNote(null);
      setLegacyPlaintextChecks(null);
      setLocked(false);
      showSuccess("Legacy plaintext confession prep encrypted.");
    } catch {
      showError("Couldn't migrate legacy confession prep.");
    }
  }

  async function unlock() {
    if (!saveEnabled) return;

    if (!isStrongPassphrase(pass)) {
      showError(strongPassphraseMessage);
      return;
    }

    if (legacyPlaintextNote !== null && legacyPlaintextChecks !== null) {
      await migrateLegacyPlaintextPrep();
      return;
    }

    const savedPrep = getStoredItem<StoredPrep>(noteKey(wk));
    if (!savedPrep?.enc) {
      setLocked(false);
      return;
    }

    try {
      try {
        const payload = await decryptJson<ConfessionPrepPayload>(savedPrep.blob, pass);
        if (!isPrepPayload(payload)) throw new Error("bad payload");
        setChecks(payload.checks);
        setNote(payload.note);
      } catch {
        const legacyNote = await decryptString(savedPrep.blob, pass);
        const migratedPayload = {
          v: 1,
          checks: legacyChecksForWeek(wk),
          note: legacyNote,
        } satisfies ConfessionPrepPayload;
        const blob = await encryptJson(migratedPayload, pass);
        setStoredItem(noteKey(wk), { enc: 1, blob } satisfies StoredPrep, {
          ttlMs: NOTE_TTL_MS,
        });
        removeStoredItem(selectsKey(wk));
        setChecks(migratedPayload.checks);
        setNote(migratedPayload.note);
      }
      setLocked(false);
      showSuccess("Confession prep unlocked for this session.");
    } catch {
      showError("Couldn't unlock. Check your passphrase.");
    }
  }

  const doneCount = PROMPTS.filter((p) => checks[p.id]).length;
  const isSavedLocked = saveEnabled && locked;
  const saveStatus = !saveEnabled ? "Not saved" : locked ? "Locked" : "Encrypted";
  const saveStatusClass = !saveEnabled
    ? "bg-muted text-muted-foreground"
    : locked
      ? "bg-amber-500/12 text-amber-800 dark:text-amber-200"
      : "bg-emerald-500/12 text-emerald-800 dark:text-emerald-200";

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Confession preparation</h3>
          <p className="mt-1 text-sm text-muted-foreground">A quiet weekly check + private notes.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="secondary" className={`rounded-full px-3 py-1 text-xs font-medium ${saveStatusClass}`}>
            {saveStatus}
          </Badge>
          <KeyRound className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-2">
        {PROMPTS.map((p) => (
          <label
            key={p.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3"
          >
            <span className="text-sm">{p.label}</span>
            <Checkbox
              checked={!!checks[p.id]}
              disabled={isSavedLocked}
              onCheckedChange={(v) => setChecks((c) => ({ ...c, [p.id]: Boolean(v) }))}
            />
          </label>
        ))}
        <p className="text-xs text-muted-foreground">
          {doneCount}/{PROMPTS.length} marked. This is only for your preparation.
        </p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground">Notes (private)</p>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Keep notes short and concrete (names/details aren't required)."
          className="mt-2 min-h-28 rounded-2xl"
          disabled={isSavedLocked}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {!saveEnabled
            ? "Not saved (clears on refresh)."
            : locked
              ? "Locked. Enter a strong passphrase below to view or edit saved prep."
              : "Checklist and notes are saved together in one encrypted record on this device."}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-2xl border-border/60"
          onClick={() => {
            setChecks({});
            setNote("");
          }}
          disabled={isSavedLocked}
        >
          Reset
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="rounded-2xl text-muted-foreground hover:text-foreground"
          onClick={() => {
            cleanupStoredByPrefix("confess:", 0);
            setChecks({});
            setNote("");
            setLegacyPlaintextNote(null);
            setLegacyPlaintextChecks(null);
            setLocked(false);
            showSuccess("Cleared saved confession prep.");
          }}
        >
          Delete saved
        </Button>
      </div>

      <Accordion type="single" collapsible className="mt-4 w-full">
        <AccordionItem value="privacy" className="border-none">
          <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
            <span className="inline-flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" /> Privacy & saving
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-3">
            <div className="grid gap-3 rounded-2xl border border-border/60 bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Save on this device (encrypted)</p>
                  <p className="text-xs text-muted-foreground">
                    Off by default. Checklist selections and notes are encrypted together when enabled.
                  </p>
                </div>
                <Switch checked={saveEnabled} onCheckedChange={setSaveEnabled} />
              </div>
              {saveEnabled ? (
                <div className="grid gap-2">
                  {legacyPlaintextNote !== null && legacyPlaintextChecks !== null ? (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs leading-relaxed text-destructive">
                      Legacy plaintext confession prep was found. It will stay hidden until you enter a strong passphrase and encrypt it.
                    </div>
                  ) : null}
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">Passphrase (session-only)</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
                      type="password"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      placeholder="Enter a strong passphrase"
                      className="h-11 rounded-2xl"
                    />
                    <Button
                      type="button"
                      className="h-11 rounded-2xl"
                      onClick={unlock}
                      disabled={!pass}
                    >
                      {legacyPlaintextNote !== null ? "Encrypt legacy prep" : "Unlock"}
                    </Button>
                  </div>
                  <PassphraseMeter passphrase={pass} />
                  <p className="text-xs text-muted-foreground">
                    Use a strong 12+ character passphrase. Short or common passphrases are vulnerable if someone gets your device storage or an export.
                  </p>
                </div>
              ) : null}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="links" className="mt-3 border-none">
          <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
            Helpful OCA resources
          </AccordionTrigger>
          <AccordionContent className="pt-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <Button asChild variant="outline" className="btn-wrap rounded-2xl border-border/60">
                <a
                  href="https://www.oca.org/questions/sacramentconfession/confessing-in-the-presence-of-a-priest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Confessing in the Presence of a Priest (Q&A) <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="btn-wrap rounded-2xl border-border/60">
                <a
                  href="https://www.oca.org/questions/sevensacraments/questions-on-the-sacraments"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Questions on the Sacraments (Q&A) <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

export default ConfessionPrep;

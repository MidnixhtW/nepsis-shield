import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ExternalLink, KeyRound, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  cleanupStoredByPrefix,
  getStoredItem,
  removeStoredItem,
  setStoredItem,
} from "@/lib/deviceStorage";
import type { EncryptedBlob } from "@/lib/cryptoVault";
import { decryptString, encryptString } from "@/lib/cryptoVault";
import { showError, showSuccess } from "@/utils/toast";
import { PassphraseMeter } from "@/components/app/PassphraseMeter";

type MapBool = Record<string, boolean>;
type StoredNote = string | { enc: 1; blob: EncryptedBlob };

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
function encryptEnabledKey() {
  return "privacy:confess_encrypt";
}

const NOTE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export function ConfessionPrep() {
  const wk = useMemo(() => weekKey(), []);

  const [checks, setChecks] = useState<MapBool>({});
  const [note, setNote] = useState("");
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [encryptEnabled, setEncryptEnabled] = useState(true);
  const [locked, setLocked] = useState(false);
  const [pass, setPass] = useState("");

  useEffect(() => {
    cleanupStoredByPrefix("confess:", NOTE_TTL_MS);

    const s = getStoredItem<boolean>(saveEnabledKey());
    setSaveEnabled(s ?? false);

    const e = getStoredItem<boolean>(encryptEnabledKey());
    setEncryptEnabled(e ?? true);
  }, []);

  useEffect(() => {
    if (!saveEnabled) return;

    const savedChecks = getStoredItem<MapBool>(selectsKey(wk));
    if (savedChecks) setChecks(savedChecks);

    const savedNote = getStoredItem<StoredNote>(noteKey(wk));
    if (typeof savedNote === "string") {
      setNote(savedNote);
      setLocked(false);
    } else if (savedNote && savedNote.enc === 1) {
      setLocked(true);
    }
  }, [wk, saveEnabled]);

  useEffect(() => {
    setStoredItem(saveEnabledKey(), saveEnabled);
    if (!saveEnabled) {
      cleanupStoredByPrefix("confess:", 0);
      setChecks({});
      setNote("");
      setLocked(false);
    }
  }, [saveEnabled]);

  useEffect(() => {
    setStoredItem(encryptEnabledKey(), encryptEnabled);
    if (encryptEnabled) setLocked(true);
  }, [encryptEnabled]);

  useEffect(() => {
    if (!saveEnabled) return;
    setStoredItem(selectsKey(wk), checks, { ttlMs: NOTE_TTL_MS });
  }, [checks, wk, saveEnabled]);

  useEffect(() => {
    if (!saveEnabled) return;
    (async () => {
      if (!encryptEnabled) {
        setStoredItem(noteKey(wk), note, { ttlMs: NOTE_TTL_MS });
        return;
      }
      if (locked) return;
      if (!pass) return;
      const blob = await encryptString(note, pass);
      setStoredItem(noteKey(wk), { enc: 1, blob } satisfies StoredNote, {
        ttlMs: NOTE_TTL_MS,
      });
    })();
  }, [note, wk, saveEnabled, encryptEnabled, pass, locked]);

  async function unlock() {
    if (!saveEnabled) return;

    if (pass.length < 8) {
      showError("Use a longer passphrase (8+ characters).");
      return;
    }

    const savedNote = getStoredItem<StoredNote>(noteKey(wk));
    if (!savedNote || typeof savedNote === "string") {
      setLocked(false);
      return;
    }
    try {
      const raw = await decryptString(savedNote.blob, pass);
      setNote(raw);
      setLocked(false);
      showSuccess("Confession prep unlocked for this session.");
    } catch {
      showError("Couldn't unlock. Check your passphrase.");
    }
  }

  const doneCount = PROMPTS.filter((p) => checks[p.id]).length;

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Confession preparation</h3>
          <p className="mt-1 text-sm text-muted-foreground">A quiet weekly check + private notes.</p>
        </div>
        <KeyRound className="h-5 w-5 text-muted-foreground" />
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
          disabled={saveEnabled && encryptEnabled && locked}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {!saveEnabled
            ? "Not saved (clears on refresh)."
            : encryptEnabled
            ? locked
              ? "Locked. Enter passphrase below to view or edit."
              : "Saved (encrypted) on this device."
            : "Saved (not encrypted) on this device."}

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
                  <p className="text-sm font-medium">Save on this device</p>
                  <p className="text-xs text-muted-foreground">Off by default</p>
                </div>
                <Switch checked={saveEnabled} onCheckedChange={setSaveEnabled} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Encrypt saved notes</p>
                  <p className="text-xs text-muted-foreground">Recommended</p>
                </div>
                <Switch
                  checked={encryptEnabled}
                  onCheckedChange={(checked) => {
                    if (!checked && saveEnabled) {
                      const ok = window.confirm(
                        "Disabling encryption will store confession notes in plaintext on this device. This makes them readable by any script with access to this page (e.g., a malicious extension). Are you sure you want to turn off encryption?"
                      );
                      if (!ok) return;
                    }
                    setEncryptEnabled(checked);
                  }}
                  disabled={!saveEnabled}
                />
              </div>
              {saveEnabled && encryptEnabled ? (
                <div className="grid gap-2">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">Passphrase (session-only)</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
                      type="password"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      placeholder="Enter a passphrase"
                      className="h-11 rounded-2xl"
                    />
                    <Button
                      type="button"
                      className="h-11 rounded-2xl"
                      onClick={unlock}
                      disabled={!pass}
                    >
                      Unlock
                    </Button>
                  </div>
                  <PassphraseMeter passphrase={pass} />
                  <p className="text-xs text-muted-foreground">
                    Your passphrase is never stored. If forgotten, encrypted notes can't be recovered.
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
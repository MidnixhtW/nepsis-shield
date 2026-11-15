import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Check, HandHeart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GROUPS_CHANGED_EVENT,
  GroupServiceError,
  createGroup,
  fetchGroup,
  getSavedGroups,
  inviteLink,
  markPrayed,
  type GroupView,
  type SavedGroup,
} from "@/lib/prayerGroups";
import { showError, showSuccess } from "@/utils/toast";

// A prayer partner is a prayer group of two, named so both phones recognise it. It uses the same private link,
// first names only, and the same three-day "prayed today" marks as any group.
export const PARTNER_PREFIX = "Prayer partners · ";

function isPartner(group: SavedGroup) {
  return group.name.startsWith(PARTNER_PREFIX);
}

async function sendInvite(group: SavedGroup) {
  const url = inviteLink(group.id);
  const text = `Be my prayer partner? We'll each tap "I prayed for you" when we pray. First names only, no account.`;
  try {
    if (navigator.share) await navigator.share({ title: "Pray with me", text, url });
    else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      showSuccess("Invite copied. Send it to your friend.");
    }
  } catch (error) {
    if ((error as Error)?.name !== "AbortError") showError("Couldn't share the invite.");
  }
}

function PartnerRow({ group }: { group: SavedGroup }) {
  const [view, setView] = useState<GroupView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setView(await fetchGroup(group.id, group.memberId));
      setError(null);
    } catch (problem) {
      setError(problem instanceof GroupServiceError ? problem.message : "Couldn't load your prayer partner.");
    }
  }, [group.id, group.memberId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function prayed() {
    setBusy(true);
    try {
      await markPrayed(group);
      await load();
      showSuccess("They'll see that you prayed for them today.");
    } catch (problem) {
      showError(problem instanceof GroupServiceError ? problem.message : "Couldn't mark it. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const friends = view?.prayedToday.filter((name) => name !== group.memberName) ?? [];
  return (
    <div className="grid gap-3 rounded-2xl border border-border/60 p-4">
      <p className="text-sm font-semibold">{group.name.slice(PARTNER_PREFIX.length)}</p>
      {error ? <p className="text-xs text-muted-foreground">{error}</p> : null}
      {view ? (
        <p role="status" className="text-sm text-muted-foreground">
          {friends.length ? `${friends.join(" and ")} prayed for you today.` : "Your partner hasn't marked prayer yet today."}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {view?.youPrayedToday ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
            <Check className="h-4 w-4" /> You prayed for them today
          </span>
        ) : (
          <Button type="button" className="rounded-full" disabled={busy || !view} onClick={() => void prayed()}>
            <HandHeart className="mr-2 h-4 w-4" /> I prayed for you
          </Button>
        )}
        <Button type="button" variant="ghost" className="rounded-full" onClick={() => void sendInvite(group)}>
          <Send className="mr-2 h-4 w-4" /> Send invite again
        </Button>
      </div>
    </div>
  );
}

// Me > Prayer partner: pray for one friend each day and see when they've prayed for you.
export function PrayerPartner() {
  const [partners, setPartners] = useState<SavedGroup[]>(() => getSavedGroups().filter(isPartner));
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const refresh = () => setPartners(getSavedGroups().filter(isPartner));
    window.addEventListener(GROUPS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(GROUPS_CHANGED_EVENT, refresh);
  }, []);

  async function start(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const group = await createGroup(`${PARTNER_PREFIX}${name.trim()} & a friend`, name);
      await sendInvite(group);
    } catch (problem) {
      showError(problem instanceof GroupServiceError ? problem.message : "Couldn't start it. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="rounded-3xl border p-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Prayer partner</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Pray for one friend every day. Each of you taps "I prayed for you", and the other sees it. First names only, no account.
      </p>
      {partners.length ? (
        <div className="mt-4 grid gap-3">
          {partners.map((group) => (
            <PartnerRow key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <form className="mt-4 grid gap-3" onSubmit={(event) => void start(event)}>
          <div className="grid gap-1.5">
            <Label htmlFor="partner-name">Your first name</Label>
            <Input id="partner-name" value={name} maxLength={30} required autoComplete="given-name" onChange={(event) => setName(event.target.value)} />
          </div>
          <Button type="submit" className="w-fit rounded-full" disabled={busy || !name.trim()}>
            <Send className="mr-2 h-4 w-4" /> Invite a friend
          </Button>
        </form>
      )}
    </Card>
  );
}

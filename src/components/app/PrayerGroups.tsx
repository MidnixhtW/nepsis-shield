import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, Check, HandHeart, Lock, Plus, Share2, Trash2, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  GROUPS_CHANGED_EVENT,
  GroupServiceError,
  addRequest,
  closeGroup,
  createGroup,
  fetchGroup,
  forgetGroup,
  getSavedGroups,
  inviteLink,
  joinGroup,
  markPrayed,
  removeRequest,
  type GroupView,
  type SavedGroup,
} from "@/lib/prayerGroups";
import { showError, showSuccess } from "@/utils/toast";

const MAX_REQUEST = 280;

function useSavedGroups() {
  const [groups, setGroups] = useState<SavedGroup[]>(getSavedGroups);
  useEffect(() => {
    const refresh = () => setGroups(getSavedGroups());
    window.addEventListener(GROUPS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(GROUPS_CHANGED_EVENT, refresh);
  }, []);
  return groups;
}

function errorText(error: unknown) {
  return error instanceof GroupServiceError ? error.message : "Something went wrong. Please try again.";
}

async function shareInvite(group: { id: string; name: string }) {
  const url = inviteLink(group.id);
  const text = `Pray with me in "${group.name}" on Nepsis Shield.`;
  try {
    if (navigator.share) {
      await navigator.share({ title: group.name, text, url });
      return;
    }
    await navigator.clipboard.writeText(`${text} ${url}`);
    showSuccess("Invite link copied. Send it to the people you want to pray with.");
  } catch (error) {
    if ((error as Error)?.name !== "AbortError") showError("Couldn't share the invite right now.");
  }
}

function PrivacyNote() {
  return (
    <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
      <Lock aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>
        Anyone with a group's link can join it and read it. Our server keeps the group's name, the requests you add, and the days you mark prayer, each with the first name you choose. Requests are deleted after 30 days, and a group left unused for 90 days is deleted.{" "}
        <Link to="/privacy-policy" className="font-semibold underline underline-offset-2">Privacy Policy</Link>
      </span>
    </p>
  );
}

// Prayer requests can show a person's faith and health, so nothing is sent until the person agrees.
function ConsentCheck({ id, checked, onChange }: { id: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-start gap-3 sm:col-span-2">
      <Checkbox id={id} checked={checked} onCheckedChange={(value) => onChange(value === true)} className="mt-0.5 h-5 w-5" required />
      <Label htmlFor={id} className="text-sm font-normal leading-relaxed text-muted-foreground">
        I agree that the group's name, my first name, and the requests and prayer marks I add are kept on the Nepsis Shield server and shown to
        anyone with the group's link, as the{" "}
        <Link to="/privacy-policy" className="font-semibold text-foreground underline underline-offset-2">Privacy Policy</Link> explains. I am 13 or
        older and will follow the{" "}
        <Link to="/terms" className="font-semibold text-foreground underline underline-offset-2">Terms of Use</Link>.
      </Label>
    </div>
  );
}

// Pray together: small private groups that share prayer requests and see who has prayed today.
export function PrayerGroups() {
  const groups = useSavedGroups();
  const [params, setParams] = useSearchParams();
  const joinId = params.get("join");
  const openId = params.get("group");
  const open = groups.find((group) => group.id === openId) ?? null;

  function setParam(name: string, value: string | null) {
    const next = new URLSearchParams(params);
    next.delete("join");
    next.delete("group");
    if (value) next.set(name, value);
    setParams(next);
  }

  if (joinId && !groups.some((group) => group.id === joinId)) {
    return <JoinGroup id={joinId} onJoined={(id) => setParam("group", id)} onCancel={() => setParam("join", null)} />;
  }
  if (open) return <GroupDetail group={open} onBack={() => setParam("group", null)} />;

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Prayer groups</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Carry one another's burdens.</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Make a small group for your family, parish, unit or friends. Share prayer requests, and see who has prayed today. There are no accounts and no feed.
        </p>
      </Card>

      {groups.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {groups.map((group) => (
            <Card key={group.id} className="flex flex-col rounded-3xl border p-5">
              <h3 className="text-lg font-semibold tracking-tight">{group.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">You pray here as {group.memberName}{group.adminKey ? " · you started this group" : ""}</p>
              <Button type="button" variant="outline" className="mt-4 w-fit rounded-full" onClick={() => setParam("group", group.id)}>
                <Users className="mr-2 h-4 w-4" /> Open {group.name}
              </Button>
            </Card>
          ))}
        </div>
      ) : null}

      <CreateGroup onCreated={(group) => setParam("group", group.id)} />
      <PrivacyNote />
    </div>
  );
}

function CreateGroup({ onCreated }: { onCreated: (group: SavedGroup) => void }) {
  const [name, setName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!agreed) return;
    setBusy(true);
    try {
      const group = await createGroup(name, memberName);
      showSuccess("Group created. Share the invite link to bring others in.");
      onCreated(group);
    } catch (error) {
      showError(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="rounded-3xl border p-5 sm:p-6">
      <h3 className="text-lg font-semibold tracking-tight">Start a group</h3>
      <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={(event) => void submit(event)}>
        <div className="grid gap-1.5">
          <Label htmlFor="group-name">Group name</Label>
          <Input id="group-name" value={name} maxLength={60} required placeholder="Our family" onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="group-member-name">Your first name</Label>
          <Input id="group-member-name" value={memberName} maxLength={40} required autoComplete="given-name" onChange={(event) => setMemberName(event.target.value)} />
        </div>
        <ConsentCheck id="group-create-consent" checked={agreed} onChange={setAgreed} />
        <Button type="submit" className="w-fit rounded-full" disabled={busy || !name.trim() || !memberName.trim() || !agreed}>
          <Plus className="mr-2 h-4 w-4" /> Create group
        </Button>
      </form>
    </Card>
  );
}

function JoinGroup({ id, onJoined, onCancel }: { id: string; onJoined: (id: string) => void; onCancel: () => void }) {
  const [memberName, setMemberName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!agreed) return;
    setBusy(true);
    try {
      const group = await joinGroup(id, memberName);
      showSuccess(`You joined ${group.name}.`);
      onJoined(group.id);
    } catch (error) {
      showError(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="grid gap-4 rounded-3xl border p-5 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Invitation</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Join a prayer group</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Someone invited you to pray with them. Choose the first name the group will see.</p>
      </div>
      <form className="grid gap-3" onSubmit={(event) => void submit(event)}>
        <div className="grid gap-1.5">
          <Label htmlFor="join-member-name">Your first name</Label>
          <Input id="join-member-name" value={memberName} maxLength={40} required autoComplete="given-name" onChange={(event) => setMemberName(event.target.value)} />
        </div>
        <ConsentCheck id="group-join-consent" checked={agreed} onChange={setAgreed} />
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="rounded-full" disabled={busy || !memberName.trim() || !agreed}>Join group</Button>
          <Button type="button" variant="ghost" className="rounded-full" onClick={onCancel}>Not now</Button>
        </div>
      </form>
      <PrivacyNote />
    </Card>
  );
}

function GroupDetail({ group, onBack }: { group: SavedGroup; onBack: () => void }) {
  const [view, setView] = useState<GroupView | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setView(await fetchGroup(group.id, group.memberId));
      setProblem(null);
    } catch (error) {
      setProblem(errorText(error));
    }
  }, [group.id, group.memberId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function run(action: () => Promise<unknown>, success?: string) {
    setBusy(true);
    try {
      await action();
      if (success) showSuccess(success);
      await load();
    } catch (error) {
      showError(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    await run(() => addRequest(group, text), "Prayer request shared.");
    setText("");
  }

  // Closing deletes the group, so go back to the list instead of reloading it.
  async function closeForEveryone() {
    setBusy(true);
    try {
      await closeGroup(group);
      showSuccess("Group closed.");
      onBack();
    } catch (error) {
      showError(errorText(error));
      setBusy(false);
    }
  }

  return (
    <article className="grid gap-4" aria-labelledby="group-title">
      <div>
        <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> All groups
        </Button>
      </div>
      <Card className="rounded-3xl border p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Prayer group</p>
        <h2 id="group-title" className="mt-1 text-2xl font-semibold tracking-tight">{view?.name ?? group.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">You pray here as {group.memberName}.</p>
        {problem ? <p className="mt-3 text-sm text-destructive" role="alert">{problem}</p> : null}
        {view ? (
          <div className="mt-4 grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                className="rounded-full"
                disabled={busy || view.youPrayedToday}
                aria-pressed={view.youPrayedToday}
                onClick={() => void run(() => markPrayed(group), "Thank you. The group can see you prayed today.")}
              >
                {view.youPrayedToday ? <Check className="mr-2 h-4 w-4" /> : <HandHeart className="mr-2 h-4 w-4" />}
                {view.youPrayedToday ? "You prayed today" : "I prayed for the group today"}
              </Button>
              <Button type="button" variant="outline" className="rounded-full" onClick={() => void shareInvite(view)}>
                <Share2 className="mr-2 h-4 w-4" /> Invite
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {view.prayedToday.length ? `Prayed today: ${view.prayedToday.join(", ")}` : "No one has marked prayer yet today."}
            </p>
          </div>
        ) : !problem ? (
          <p className="mt-3 text-sm text-muted-foreground" role="status">Opening the group...</p>
        ) : null}
      </Card>

      {view ? (
        <Card className="rounded-3xl border p-5 sm:p-6">
          <h3 className="text-lg font-semibold tracking-tight">Prayer requests</h3>
          <form className="mt-3 grid gap-2" onSubmit={(event) => void submit(event)}>
            <Label htmlFor="group-request">Ask the group to pray</Label>
            <Textarea id="group-request" value={text} maxLength={MAX_REQUEST} rows={3} placeholder="For my father, who is in the hospital" onChange={(event) => setText(event.target.value)} />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">{text.length}/{MAX_REQUEST}</span>
              <Button type="submit" size="sm" className="rounded-full" disabled={busy || !text.trim()}>Share request</Button>
            </div>
          </form>
          {view.intentions.length ? (
            <ul className="mt-4 grid gap-3">
              {view.intentions.map((item) => (
                <li key={item.id} className="rounded-2xl border border-border/60 bg-background/45 p-4">
                  <p className="scripture-text leading-relaxed">{item.text}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {item.by} · {new Date(item.created).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                    {item.mine || group.adminKey ? (
                      <Button type="button" variant="ghost" size="sm" className="rounded-full" aria-label={`Remove the request from ${item.by}`} onClick={() => void run(() => removeRequest(group, item.id), "Request removed.")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No requests yet. Share the first one.</p>
          )}
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={() => { forgetGroup(group.id); onBack(); }}>
          Leave this group on this device
        </Button>
        {group.adminKey ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="rounded-full text-destructive">Close the group for everyone</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Close {group.name}?</AlertDialogTitle>
                <AlertDialogDescription>Every request in it is deleted, and the invite link stops working for everyone. This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep the group</AlertDialogCancel>
                <AlertDialogAction onClick={() => void closeForEveryone()}>Close the group</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
      <PrivacyNote />
    </article>
  );
}

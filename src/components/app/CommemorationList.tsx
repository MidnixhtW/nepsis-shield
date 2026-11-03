import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import { Plus, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { nextMemorial, parseDay } from "@/lib/memorials";
import { cn } from "@/lib/utils";
import {
  getCommemorations,
  setCommemorations,
  type CommemorationEntry,
  type Commemorations,
} from "@/lib/commemorations";

type ListKey = keyof Commemorations;

const lists: Array<{ key: ListKey; title: string; printTitle: string; hint: string; placeholder: string }> = [
  {
    key: "living",
    title: "For the health of",
    printTitle: "For health and salvation",
    hint: "The living: family, friends, your priest, anyone who asked for prayer.",
    placeholder: "Name, e.g. John",
  },
  {
    key: "departed",
    title: "For the repose of",
    printTitle: "For the repose of the departed",
    hint: "The departed, whom the Church remembers with “Memory eternal.”",
    placeholder: "Name, e.g. Anna",
  },
];

// "Reposed Nov 2, 2026 · next: 40th day, Fri Dec 11"
function MemorialLine({ name, reposed, today }: { name: string; reposed: string; today: Date }) {
  const date = parseDay(reposed);
  if (!date) return null;
  const next = nextMemorial(name, reposed, today);
  return (
    <span className="block text-xs text-accent">
      Reposed {format(date, "MMM d, yyyy")}
      {next ? ` · next: ${next.label}, ${format(next.date, "EEE MMM d")}` : ""}
    </span>
  );
}

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function NameList({
  config,
  entries,
  onAdd,
  onRemove,
}: {
  config: (typeof lists)[number];
  entries: CommemorationEntry[];
  onAdd: (name: string, note: string, reposed: string) => void;
  onRemove: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [reposed, setReposed] = useState("");
  const departed = config.key === "departed";
  const today = new Date();

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed.slice(0, 60), note.trim().slice(0, 80), departed ? reposed : "");
    setName("");
    setNote("");
    setReposed("");
  }

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight">{config.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{config.hint}</p>

      <form onSubmit={submit} className={cn("mt-4 grid gap-2", departed ? "sm:grid-cols-[1fr_1fr_auto_auto]" : "sm:grid-cols-[1fr_1fr_auto]")}>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={config.placeholder} aria-label={`Add a name: ${config.title}`} maxLength={60} />
        <Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Note (optional), e.g. illness" aria-label="Optional note" maxLength={80} />
        {departed ? (
          <Input
            type="date"
            value={reposed}
            max={format(today, "yyyy-MM-dd")}
            onChange={(event) => setReposed(event.target.value)}
            aria-label="Date of repose (optional)"
            title="Date of repose (optional): adds the 3rd, 9th, and 40th days and anniversaries"
          />
        ) : null}
        <Button type="submit" className="rounded-xl" disabled={!name.trim()}>
          <Plus className="mr-1.5 h-4 w-4" /> Add
        </Button>
      </form>

      {entries.length ? (
        <ul className="mt-4 grid gap-2">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 px-4 py-2.5">
              <span className="min-w-0 flex-1">
                <span className="scripture-text block text-base">{entry.name}</span>
                {entry.note ? <span className="block text-xs text-muted-foreground">{entry.note}</span> : null}
                {departed && entry.reposed ? <MemorialLine name={entry.name} reposed={entry.reposed} today={today} /> : null}
              </span>
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-full" aria-label={`Remove ${entry.name}`} onClick={() => onRemove(entry.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">No names yet.</p>
      )}
    </Card>
  );
}

// Names of the living and departed, prayed in the daily flow and printable for church.
export function CommemorationList() {
  const [list, setList] = useState<Commemorations>(getCommemorations);

  function update(next: Commemorations) {
    setCommemorations(next);
    setList(next);
  }

  const hasNames = list.living.length > 0 || list.departed.length > 0;

  return (
    <div className="grid gap-4 sm:gap-5">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight">Names to remember</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Orthodox Christians pray by name for the living and the departed, and bring these names to the priest to be remembered at the Liturgy. Names you add here are prayed in the daily prayer flow and stay only on this device.
        </p>
        <div className="mt-4">
          <Button type="button" variant="outline" className="rounded-xl" disabled={!hasNames} onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print for church
          </Button>
        </div>
      </Card>

      {lists.map((config) => (
        <NameList
          key={config.key}
          config={config}
          entries={list[config.key]}
          onAdd={(name, note, reposed) =>
            update({
              ...list,
              [config.key]: [...list[config.key], { id: newId(), name, ...(note ? { note } : {}), ...(reposed ? { reposed } : {}) }],
            })
          }
          onRemove={(id) => update({ ...list, [config.key]: list[config.key].filter((entry) => entry.id !== id) })}
        />
      ))}

      {/* Only this sheet prints: the traditional two lists under a cross, without notes. */}
      <section className="commemoration-print" aria-hidden>
        <p className="commemoration-print-cross">☦</p>
        {lists.map((config) =>
          list[config.key].length ? (
            <div key={config.key} className="commemoration-print-list">
              <h2>{config.printTitle}</h2>
              <ul>
                {list[config.key].map((entry) => (
                  <li key={entry.id}>{entry.name}</li>
                ))}
              </ul>
            </div>
          ) : null,
        )}
      </section>
    </div>
  );
}

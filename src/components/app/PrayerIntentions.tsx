import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { HeartHandshake, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { getStoredItem, setStoredItem, removeStoredItem, cleanupStoredByPrefix } from "@/lib/deviceStorage";

type Category = "Family" | "Friends" | "Clergy" | "Sick" | "Departed" | "Other";
type Intention = {
  id: string;
  name: string;
  category: Category;
  note?: string;
  createdAt: number;
};

function listKey() {
  return "intentions:list";
}
function todayKey(dayKey: string) {
  return `intentions:today:${dayKey}`;
}
function saveEnabledKey() {
  return "privacy:intentions_save";
}

const TODAY_TTL_MS = 1000 * 60 * 60 * 24 * 14; // keep 14 days of "today" checkmarks

const CATEGORIES: Category[] = ["Family", "Friends", "Clergy", "Sick", "Departed", "Other"];

export function PrayerIntentions() {
  const dayKey = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const [saveEnabled, setSaveEnabled] = useState(true);

  const [items, setItems] = useState<Intention[]>([]);
  const [prayedToday, setPrayedToday] = useState<Record<string, boolean>>({});

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Family");
  const [note, setNote] = useState("");

  useEffect(() => {
    cleanupStoredByPrefix("intentions:today:", TODAY_TTL_MS);

    const saved = getStoredItem<boolean>(saveEnabledKey());
    setSaveEnabled(saved ?? true);

    const list = getStoredItem<Intention[]>(listKey());
    setItems(list ?? []);

    const today = getStoredItem<Record<string, boolean>>(todayKey(dayKey));
    setPrayedToday(today ?? {});
  }, [dayKey]);

  useEffect(() => {
    setStoredItem(saveEnabledKey(), saveEnabled);
    if (!saveEnabled) {
      removeStoredItem(listKey());
    }
  }, [saveEnabled]);

  useEffect(() => {
    if (!saveEnabled) return;
    setStoredItem(listKey(), items);
  }, [items, saveEnabled]);

  useEffect(() => {
    setStoredItem(todayKey(dayKey), prayedToday, { ttlMs: TODAY_TTL_MS });
  }, [prayedToday, dayKey]);

  function addIntention() {
    const n = name.trim();
    if (!n) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const next: Intention = { id, name: n, category, note: note.trim() || undefined, createdAt: Date.now() };
    setItems((prev) => [next, ...prev].slice(0, 200));
    setName("");
    setNote("");
  }

  function removeIntention(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setPrayedToday((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  const grouped = CATEGORIES.map((c) => ({
    category: c,
    items: items.filter((x) => x.category === c),
  })).filter((g) => g.items.length > 0);

  const prayedCount = Object.values(prayedToday).filter(Boolean).length;

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Prayer intentions</h3>
          <p className="mt-1 text-sm text-muted-foreground">Keep a short list of first names; check as you pray today.</p>
        </div>
        <HeartHandshake className="h-5 w-5 text-muted-foreground" />
      </div>

      <Separator className="my-4" />

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">Name</p>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="First name" className="h-11 rounded-2xl" />
            </div>
            <div className="grid gap-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">Category</p>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="h-11 rounded-2xl">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent className="max-h-[60vh]">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note (keep it short)" className="h-11 rounded-2xl" />
        </div>
        <Button type="button" className="h-11 rounded-2xl" onClick={addIntention}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Save on this device</p>
            <p className="text-xs text-muted-foreground">On by default</p>
          </div>
          <Switch checked={saveEnabled} onCheckedChange={setSaveEnabled} />
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {grouped.length === 0 ? (
          <p className="text-sm text-muted-foreground">No intentions yet.</p>
        ) : (
          grouped.map((g) => (
            <div key={g.category} className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">{g.category}</p>
              <div className="mt-2 grid gap-2">
                {g.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{it.name}</p>
                      {it.note ? <p className="mt-0.5 truncate text-xs text-muted-foreground">{it.note}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={!!prayedToday[it.id]}
                          onCheckedChange={(v) => setPrayedToday((prev) => ({ ...prev, [it.id]: Boolean(v) }))}
                        />
                        <span className="text-xs text-muted-foreground">Today</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-2xl text-muted-foreground hover:text-foreground"
                        onClick={() => removeIntention(it.id)}
                        aria-label="Remove"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Today: {prayedCount}/{items.length} marked.
      </p>
    </Card>
  );
}

export default PrayerIntentions;
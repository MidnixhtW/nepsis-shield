import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Check, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { softHaptic, markerHaptic } from "@/lib/haptics";

// Nine days of prayer for one intention. Kept only on this device. A missed day does not reset anything: the novena
// simply waits for the next day you pray, because the point is perseverance, not a perfect streak.
type Novena = { id: string; intention: string; prayer: string; days: string[]; startedAt: string };

const KEY = "novenas:list";
const DAYS = 9;
const MAX = 5;

function todayKey() {
  return format(new Date(), "yyyy-MM-dd");
}

export function NovenaTracker() {
  const [novenas, setNovenas] = useState<Novena[]>(() => getStoredItem<Novena[]>(KEY) ?? []);
  const [intention, setIntention] = useState("");
  const [prayer, setPrayer] = useState("");

  useEffect(() => {
    setStoredItem(KEY, novenas);
  }, [novenas]);

  function start() {
    const text = intention.trim();
    if (!text || novenas.length >= MAX) return;
    softHaptic();
    setNovenas((list) => [
      ...list,
      { id: crypto.randomUUID(), intention: text.slice(0, 140), prayer: prayer.trim().slice(0, 80), days: [], startedAt: todayKey() },
    ]);
    setIntention("");
    setPrayer("");
  }

  function pray(id: string) {
    const today = todayKey();
    setNovenas((list) =>
      list.map((novena) => {
        if (novena.id !== id || novena.days.includes(today) || novena.days.length >= DAYS) return novena;
        const days = [...novena.days, today];
        if (days.length === DAYS) markerHaptic();
        else softHaptic();
        return { ...novena, days };
      }),
    );
  }

  function remove(id: string) {
    setNovenas((list) => list.filter((novena) => novena.id !== id));
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">A novena</span> is nine days of prayer for one intention, a
            Western custom after the nine days the apostles prayed before Pentecost. Pray any prayer you choose: a saint&rsquo;s
            troparion, an akathist, the Rosary. Missed a day? It just waits for you. Kept only on this device.
          </p>
        </div>
      </Card>

      {novenas.map((novena) => {
        const count = novena.days.length;
        const complete = count >= DAYS;
        const prayedToday = novena.days.includes(todayKey());
        return (
          <Card key={novena.id} className="rounded-3xl p-5">
            <p className="text-sm font-semibold text-muted-foreground">
              {complete ? "Completed" : `Day ${Math.min(count + (prayedToday ? 0 : 1), DAYS)} of ${DAYS}`} · begun {format(new Date(`${novena.startedAt}T12:00:00`), "MMM d")}
            </p>
            <h2 className="mt-1 text-xl">{novena.intention}</h2>
            {novena.prayer ? <p className="mt-1 text-sm text-muted-foreground">Praying: {novena.prayer}</p> : null}
            <ol className="mt-4 flex gap-1.5" aria-label={`${count} of ${DAYS} days prayed`}>
              {Array.from({ length: DAYS }, (_, index) => (
                <li key={index} aria-hidden className={"h-3 flex-1 rounded-full " + (index < count ? "bg-primary" : "bg-muted")} />
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {!complete ? (
                <Button type="button" className="rounded-2xl" disabled={prayedToday} onClick={() => pray(novena.id)}>
                  <Check aria-hidden className="mr-2 h-4 w-4" /> {prayedToday ? "Prayed today" : "I prayed today"}
                </Button>
              ) : (
                <p className="scripture-text text-base">Nine days kept. Thanks be to God.</p>
              )}
              <Button type="button" variant="ghost" className="rounded-2xl" aria-label={`Remove novena: ${novena.intention}`} onClick={() => remove(novena.id)}>
                <Trash2 aria-hidden className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        );
      })}

      {novenas.length < MAX ? (
        <Card className="rounded-3xl p-5">
          <h2 className="text-xl">Begin a novena</h2>
          <form
            className="mt-3 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              start();
            }}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="novena-intention">Intention</Label>
              <Input id="novena-intention" value={intention} maxLength={140} placeholder="For my unit's safe return" onChange={(event) => setIntention(event.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="novena-prayer">Prayer (optional)</Label>
              <Input id="novena-prayer" value={prayer} maxLength={80} placeholder="Troparion to St. George" onChange={(event) => setPrayer(event.target.value)} />
            </div>
            <Button type="submit" className="h-12 rounded-2xl" disabled={!intention.trim()}>
              Begin nine days
            </Button>
          </form>
        </Card>
      ) : null}
    </div>
  );
}

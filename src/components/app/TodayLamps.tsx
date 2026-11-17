import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { LampButton } from "@/components/app/LampButton";
import { COMMEMORATIONS_CHANGED_EVENT, getCommemorations, type Commemorations } from "@/lib/commemorations";
import { useLitLamps } from "@/lib/vigilLamps";

const SHOWN = 6;

// On Today, the names from the prayer list, each with its lamp. Shown only once the list has names.
export function TodayLamps() {
  const [list, setList] = useState<Commemorations>(getCommemorations);
  const lit = useLitLamps();

  useEffect(() => {
    const refresh = () => setList(getCommemorations());
    window.addEventListener(COMMEMORATIONS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(COMMEMORATIONS_CHANGED_EVENT, refresh);
  }, []);

  const names = [...list.living, ...list.departed];
  if (!names.length) return null;
  const litCount = names.filter((entry) => lit.has(entry.id)).length;

  return (
    <Card className="rounded-[1.5rem] border p-4 sm:p-5" aria-labelledby="today-lamps-title">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="today-lamps-title" className="text-xl">
          Names to remember
        </h2>
        <p className="text-sm text-muted-foreground">
          {litCount ? `${litCount} ${litCount === 1 ? "lamp" : "lamps"} lit` : "Light a lamp as you pray"}
        </p>
      </div>
      <ul className="mt-2 grid gap-x-4 sm:grid-cols-2">
        {names.slice(0, SHOWN).map((entry) => (
          <li key={entry.id} className="flex min-w-0 items-center gap-1">
            <LampButton id={entry.id} name={entry.name} lit={lit.has(entry.id)} />
            <span className="scripture-text truncate text-base">{entry.name}</span>
          </li>
        ))}
      </ul>
      <Link to="/pray?tab=names" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-accent hover:underline">
        {names.length > SHOWN ? `All ${names.length} names` : "Edit the list"}
      </Link>
    </Card>
  );
}

import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { ADVENT_WEEKS, adventStart, adventWeek } from "@/content/westernAdvent";

// The Advent wreath, for Western Rite users: shown on Today from the first Sunday of Advent until Christmas Eve, with
// that week's candles lit and the Sunday's collect. A Western custom, labeled as one, alongside the Nativity Fast.
const CANDLE_COLOR = { violet: "#6b3fa0", rose: "#d9779b" } as const;

function Wreath({ lit }: { lit: number }) {
  return (
    <svg viewBox="0 0 200 90" className="h-20 w-auto" role="img" aria-label={`${lit} of 4 Advent candles lit`}>
      <ellipse cx="100" cy="74" rx="92" ry="13" fill="#2f5a34" />
      <ellipse cx="100" cy="72" rx="78" ry="8" fill="#3f7343" />
      {ADVENT_WEEKS.map((week, index) => {
        const x = 34 + index * 44;
        const on = index < lit;
        return (
          <g key={index}>
            <rect x={x - 7} y={30} width={14} height={40} rx={2} fill={CANDLE_COLOR[week.candle]} />
            {on ? (
              <path d={`M${x} 10 C ${x + 7} 20, ${x + 5} 27, ${x} 28 C ${x - 5} 27, ${x - 7} 20, ${x} 10 Z`} fill="#ffc861" />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export function WesternAdventCard({ today }: { today: Date }) {
  const week = adventWeek(today);
  if (!week) return null;
  const current = ADVENT_WEEKS[week - 1];
  const sunday = new Date(adventStart(today.getFullYear()).getTime() + (week - 1) * 7 * 86_400_000);

  return (
    <Card className="rounded-3xl p-5">
      <p className="text-sm font-semibold text-muted-foreground">Western Advent, week {week} of 4</p>
      <div className="mt-3 flex items-center gap-4">
        <Wreath lit={week} />
        <div className="min-w-0">
          <h2 className="text-xl">{current.theme}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Light {week === 1 ? "the first candle" : `${week} candles`}{current.candle === "rose" ? ", now with the rose candle for Gaudete" : ""} at evening prayer.
          </p>
        </div>
      </div>
      <figure className="mt-4 border-t border-border/50 pt-4">
        <figcaption className="text-sm font-semibold">Collect for {format(sunday, "MMMM d")}</figcaption>
        <p className="scripture-text mt-2 text-base leading-relaxed">{current.collect}</p>
      </figure>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        A Western custom, kept in Western Rite parishes and by Catholics. The Nativity Fast continues as usual.
      </p>
    </Card>
  );
}

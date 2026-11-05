import { Card } from "@/components/ui/card";
import { useDailyRhythm } from "@/lib/dailyHabits";
import { cn } from "@/lib/utils";

// A quiet record of the last seven days. No streak number to protect: a missed day is simply an empty dot.
export function WeekDots() {
  const { week, weekActiveDays } = useDailyRhythm();

  return (
    <Card className="rounded-3xl border p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">This week</h3>
        <p className="text-xs text-muted-foreground">{weekActiveDays} of 7 days</p>
      </div>
      <ol className="mt-4 grid grid-cols-7 gap-1 text-center" aria-label={`Prayed on ${weekActiveDays} of the last 7 days`}>
        {week.map((day) => (
          <li key={day.key} className="grid justify-items-center gap-1.5">
            <span
              aria-label={`${day.weekday}: ${day.active ? "prayed" : "no record"}`}
              className={cn(
                "h-4 w-4 rounded-full border",
                day.active ? "border-accent bg-accent" : "border-border bg-transparent",
                day.isToday && "ring-2 ring-accent/35 ring-offset-2 ring-offset-card",
              )}
            />
            <span className={cn("text-[11px]", day.isToday ? "font-semibold text-foreground" : "text-muted-foreground")}>{day.weekday.slice(0, 2)}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {weekActiveDays === 0
          ? "Each day you pray here, a dot fills in. There is nothing to keep up; begin again whenever you return."
          : "Glory to God for every day you prayed. If you missed one, simply begin again."}
      </p>
    </Card>
  );
}

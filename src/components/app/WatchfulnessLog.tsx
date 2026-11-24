import { useDailyRhythm } from "@/lib/dailyHabits";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// A private, quiet record of keeping the rule: twelve weeks of squares, filled where any rule was prayed (the
// one-minute Watch rule counts the same as the longest). Nothing is shared, ranked or rewarded.
export function WatchfulnessLog() {
  // No count of days in a row: a missed day is simply an empty square.
  const { log } = useDailyRhythm();
  const kept = log.flat().filter((day) => day.kept).length;

  return (
    <section aria-labelledby="watchfulness-log-title" className="border-t border-border/80 pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="watchfulness-log-title" className="text-xs font-semibold text-muted-foreground">
          Prayer log <span className="font-normal normal-case tracking-normal">(watchfulness)</span>
        </h2>
      </div>
      <div className="mt-4 flex gap-2">
        <ol aria-hidden className="grid grid-rows-7 gap-[3px] text-xs leading-[11px] text-muted-foreground">
          {WEEKDAYS.map((day, index) => (
            <li key={day} className={cn(index % 2 === 1 && "invisible")}>{day.slice(0, 1)}</li>
          ))}
        </ol>
        <ol
          className="grid flex-1 grid-flow-col grid-rows-7 gap-[3px]"
          aria-label={`Rule kept on ${kept} of the last 12 weeks' days`}
        >
          {log.flat().map((day) => (
            <li
              key={day.key}
              title={day.future ? undefined : `${day.key}: ${day.kept ? "rule kept" : "no record"}`}
              className={cn(
                "aspect-square w-full max-w-[14px] rounded-[3px]",
                day.future ? "bg-transparent" : day.kept ? "bg-foreground/80" : "bg-foreground/10",
              )}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

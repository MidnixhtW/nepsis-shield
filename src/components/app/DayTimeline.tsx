import { Link } from "react-router";
import { recommendedTime } from "@/content/dailyPrayerSteps";
import { useDailyRhythm } from "@/lib/dailyHabits";
import { useNow } from "@/lib/prayerHours";
import { cn } from "@/lib/utils";

// The day's practice as four oil lamps: morning prayers, the readings, evening and night prayers. A lamp is lit when
// its prayer is done, and the one for this hour has its glass drawn in the season's color, waiting. At midnight all
// four go dark again: nothing carries over to the next day, so there is no streak to keep or lose.
export function DayTimeline() {
  const now = useNow();
  const { today } = useDailyRhythm();
  const hour = recommendedTime(now);
  const steps = [
    { key: "morning", label: "Morning", to: "/pray?tab=daily&begin=morning", done: !!today.prayers.morning, current: hour === "morning" },
    { key: "readings", label: "Readings", to: "/read?read=daily", done: !!today.habits.reading, current: false },
    { key: "evening", label: "Evening", to: "/pray?tab=daily&begin=evening", done: !!today.prayers.evening, current: hour === "evening" },
    { key: "night", label: "Night", to: "/pray?tab=daily&begin=night", done: !!today.prayers.night, current: hour === "night" },
  ];
  const doneCount = steps.filter((step) => step.done).length;

  return (
    <nav aria-label={`Today's prayer: ${doneCount} of ${steps.length} lamps lit`} className="mt-4 border-t border-border/50 pt-4">
      <ol className="grid grid-cols-4">
        {steps.map((step) => (
          <li key={step.key} className="grid justify-items-center">
            <Link
              to={step.to}
              aria-label={`${step.label}: ${step.done ? "done" : "not yet"}`}
              className="grid min-h-11 min-w-11 justify-items-center gap-1 rounded-sm px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Lamp lit={step.done} waiting={step.current && !step.done} />
              <span className={cn("text-xs", step.current ? "font-semibold text-foreground" : "text-muted-foreground")}>{step.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** A hanging lampada: chains, a glass cup, and a flame when lit. The flame is always warm; the glass takes the season. */
function Lamp({ lit, waiting }: { lit: boolean; waiting: boolean }) {
  const glass = lit || waiting ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))";
  return (
    <svg aria-hidden viewBox="0 0 24 32" className="h-8 w-6" fill="none" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1v5M12 6L6 13M12 6l6 7" stroke={glass} strokeOpacity={lit ? 0.7 : 0.45} />
      <path d="M4.5 13h15l-1.8 7.6A6 6 0 0 1 12 25a6 6 0 0 1-5.7-4.4z" stroke={glass} fill={lit ? "hsl(var(--accent) / 0.55)" : waiting ? "hsl(var(--accent) / 0.12)" : "none"} />
      <path d="M12 25v3" stroke={glass} strokeOpacity={0.6} />
      {lit ? <path d="M12 7.6c1.9 1.9 2.2 3.6 0 5.4-2.2-1.8-1.9-3.5 0-5.4z" fill="hsl(42 92% 66%)" stroke="none" /> : null}
    </svg>
  );
}

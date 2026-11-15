import { Link } from "react-router";
import { Check } from "lucide-react";
import { recommendedTime } from "@/content/dailyPrayerSteps";
import { useDailyRhythm } from "@/lib/dailyHabits";
import { useNow } from "@/lib/prayerHours";
import { cn } from "@/lib/utils";

// The day's practice as one short line: morning prayers, the readings, evening and night prayers. Each step fills
// in when it is done, and the one for this hour is ringed. A quiet, finite shape for the day, not a score.
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
    <nav aria-label={`Today's prayer: ${doneCount} of ${steps.length} done`} className="relative mt-4 border-t border-border/50 pt-4">
      <ol className="relative grid grid-cols-4">
        {/* The line the steps sit on. */}
        <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-3 h-px bg-border" />
        {steps.map((step) => (
          <li key={step.key} className="relative grid justify-items-center">
            <Link
              to={step.to}
              aria-label={`${step.label}: ${step.done ? "done" : "not yet"}`}
              className="grid justify-items-center gap-1.5 rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full border-2 bg-card",
                  step.done ? "border-accent bg-accent text-accent-foreground" : "border-border",
                  step.current && !step.done && "border-accent ring-4 ring-accent/20",
                )}
              >
                {step.done ? <Check aria-hidden className="h-3.5 w-3.5" /> : null}
              </span>
              <span className={cn("text-[11px]", step.current ? "font-semibold text-foreground" : "text-muted-foreground")}>{step.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

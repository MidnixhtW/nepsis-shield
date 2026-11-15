import { cn } from "@/lib/utils";

const SIZE = 196;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * The Jesus Prayer count as a ring that closes toward the goal, like a prayer rope coming round. The whole ring is
 * a button: tapping it counts a prayer.
 */
export function CountRing({ count, goal, onTap, className }: { count: number; goal: number; onTap: () => void; className?: string }) {
  const fraction = goal > 0 ? Math.min(1, count / goal) : 0;
  const reached = goal > 0 && count >= goal;
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={`Count a prayer. ${count} of ${goal} today.`}
      className={cn(
        "relative mx-auto grid place-items-center rounded-full transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      style={{ width: SIZE, height: SIZE }}
    >
      <svg aria-hidden width={SIZE} height={SIZE} className="absolute inset-0 -rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-muted" />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
          className={cn("transition-[stroke-dashoffset] duration-300", reached ? "stroke-accent" : "stroke-primary")}
        />
      </svg>
      <span className="relative grid justify-items-center">
        <span className="text-5xl font-semibold tabular-nums tracking-tight">{count}</span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">of {goal}</span>
        <span className="mt-2 text-[11px] text-muted-foreground">{reached ? "Glory to God" : "Tap to count"}</span>
      </span>
    </button>
  );
}

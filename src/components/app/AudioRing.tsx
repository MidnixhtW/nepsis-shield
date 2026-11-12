import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { playbackProgress, useReadAloud } from "@/lib/readAloud";
import { cn } from "@/lib/utils";

const SIZE = 52;
const STROKE = 3;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * A round play button whose ring fills as the recording plays. With the device voice (no recording to measure),
 * a short arc turns slowly instead, so it still shows that the prayer is being read.
 */
export function AudioRing({ on, onToggle, className }: { on: boolean; onToggle: () => void; className?: string }) {
  const reading = useReadAloud();
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!on || !reading.playing) return;
    let frame = 0;
    const tick = () => {
      setProgress(playbackProgress());
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [on, reading.playing]);

  const measured = on && progress !== null;
  const dash = measured ? CIRCUMFERENCE * (1 - progress) : CIRCUMFERENCE * 0.78;

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Stop reading" : "Read aloud"}
      onClick={onToggle}
      className={cn(
        "relative grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <svg aria-hidden width={SIZE} height={SIZE} className={cn("absolute inset-0 -rotate-90", on && !measured && "animate-[spin_3s_linear_infinite]")}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-border" />
        {on ? (
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dash}
            className="stroke-accent transition-[stroke-dashoffset] duration-150"
          />
        ) : null}
      </svg>
      {on ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
    </button>
  );
}

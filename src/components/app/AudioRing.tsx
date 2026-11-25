import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { playbackProgress, useReadAloud } from "@/lib/readAloud";
import { cn } from "@/lib/utils";

const STROKE = 3;

/**
 * A round play button whose ring fills as the recording plays. With the device voice (no recording to measure),
 * a short arc turns slowly instead, so it still shows that the prayer is being read.
 */
export function AudioRing({ on, onToggle, className, large = false }: { on: boolean; onToggle: () => void; className?: string; large?: boolean }) {
  // large: the main control of a listening session, 68 px, filled with the season's color.
  const SIZE = large ? 68 : 52;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
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
        "relative grid shrink-0 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 transition-transform",
        large ? "h-[68px] w-[68px] bg-primary text-primary-foreground" : "h-[52px] w-[52px] text-foreground",
        className,
      )}
    >
      <svg aria-hidden width={SIZE} height={SIZE} className={cn("absolute inset-0 -rotate-90", on && !measured && "animate-[spin_3s_linear_infinite]")}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className={large ? "stroke-transparent" : "stroke-border"} />
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
            className={cn(large ? "stroke-current opacity-70" : "stroke-accent", "transition-[stroke-dashoffset] duration-150")}
          />
        ) : null}
      </svg>
      {on ? <Pause className={large ? "h-7 w-7" : "h-5 w-5"} /> : <Play className={large ? "ml-1 h-7 w-7" : "ml-0.5 h-5 w-5"} />}
    </button>
  );
}

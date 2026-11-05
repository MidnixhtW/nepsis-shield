import { Pause, Play, SkipBack, SkipForward, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pauseReadAloud, resumeReadAloud, skipReadAloud, stopReadAloud, useReadAloud } from "@/lib/readAloud";
import { cn } from "@/lib/utils";

// The small player above the tabs while something is being read aloud, so listening goes on as you move around.
export function ReadAloudBar({ className }: { className?: string }) {
  const { title, parts, index, playing } = useReadAloud();
  if (!title) return null;

  return (
    <div
      role="region"
      aria-label="Reading aloud"
      className={cn("flex items-center gap-1 rounded-2xl border border-accent/35 bg-card/95 py-1.5 pl-3 pr-1 shadow-xl backdrop-blur-xl", className)}
    >
      <Volume2 aria-hidden className="h-4 w-4 shrink-0 text-accent" />
      <div className="min-w-0 flex-1 px-1.5">
        <p className="truncate text-sm font-semibold leading-tight">{title}</p>
        <p className="text-[11px] tabular-nums text-muted-foreground" aria-live="polite">
          {playing ? "Reading" : "Paused"} · {index + 1} of {parts.length}
        </p>
      </div>
      <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-full" aria-label="Back one part" disabled={index === 0} onClick={() => skipReadAloud(-1)}>
        <SkipBack className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-full" aria-label={playing ? "Pause reading" : "Resume reading"} onClick={playing ? pauseReadAloud : resumeReadAloud}>
        {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-full" aria-label="Forward one part" disabled={index >= parts.length - 1} onClick={() => skipReadAloud(1)}>
        <SkipForward className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-full" aria-label="Stop reading" onClick={stopReadAloud}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

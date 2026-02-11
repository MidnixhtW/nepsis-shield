import { useEffect, useRef, useState } from "react";
import { AlarmClock, Pause, Play, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Progress } from "@/components/ui/progress";
import { showSuccess } from "@/utils/toast";

const PRESETS = [1, 3, 5, 8] as const;

export function StillnessTimer() {
  const [minutes, setMinutes] = useState<typeof PRESETS[number]>(3);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(3 * 60); // seconds
  const startedAt = useRef<number | null>(null);
  const duration = minutes * 60;

  useEffect(() => {
    if (running) return;
    setRemaining(minutes * 60);
  }, [minutes, running]);

  useEffect(() => {
    if (!running) return;
    startedAt.current = performance.now();
    const startRemaining = remaining;

    const id = window.setInterval(() => {
      const elapsed = Math.floor((performance.now() - (startedAt.current ?? 0)) / 1000);
      const next = Math.max(0, startRemaining - elapsed);
      setRemaining(next);
      if (next === 0) {
        window.clearInterval(id);
        setRunning(false);
        if (navigator.vibrate) navigator.vibrate(200);
        showSuccess("Time is up. Glory to God for all things.");
      }
    }, 250);

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const pct = Math.round(((duration - remaining) / duration) * 100);

  function fmt(s: number) {
    const m = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, "0");
    return `${m}:${ss}`;
  }

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Stillness timer</h3>
          <p className="mt-1 text-sm text-muted-foreground">A few quiet minutes for prayer or Scripture.</p>
        </div>
        <AlarmClock className="h-5 w-5 text-muted-foreground" />
      </div>

      <Separator className="my-4" />

      <div className="grid gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Duration</p>
          <ToggleGroup
            type="single"
            value={String(minutes)}
            onValueChange={(v) => {
              if (!v) return;
              setMinutes(Number(v) as typeof PRESETS[number]);
            }}
            className="mt-2 gap-2"
          >
            {PRESETS.map((m) => (
              <ToggleGroupItem
                key={m}
                value={String(m)}
                className="h-9 rounded-2xl border border-border/60 px-3 data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10"
              >
                {m} min
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-semibold tabular-nums">{fmt(remaining)}</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={running ? "secondary" : "default"}
                className="rounded-2xl"
                onClick={() => setRunning((r) => !r)}
              >
                {running ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {running ? "Pause" : "Start"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl border-border/60"
                onClick={() => {
                  setRunning(false);
                  setRemaining(minutes * 60);
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
          <Progress value={pct} className="mt-3 h-2.5 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

export default StillnessTimer;
import { useEffect, useState } from "react";
import { VigilLampIcon } from "@/components/app/OrthodoxMotifs";

export const SILENCE_TITLE = "Be still";
export const SILENCE_SECONDS = 30;

/** Silence after the psalms, the Jesus Prayer and the examination of conscience, in the standard and longer rules. */
export function withSilence<T extends { title: string; body: string[] }>(steps: T[]): Array<T | { title: string; body: string[] }> {
  const out: Array<T | { title: string; body: string[] }> = [];
  for (const step of steps) {
    out.push(step);
    if (/^(Psalm|The Gospel|Gospel|Epistle|Scripture|Jesus Prayer|Examination of conscience)/i.test(step.title)) out.push({ title: SILENCE_TITLE, body: [] });
  }
  return out;
}

export function isSilence(step: { title: string; body: string[] }) {
  return step.title === SILENCE_TITLE && step.body.length === 0;
}

// The lamp, and a count no louder than the clock: "Be still, and know that I am God" (Psalm 45:11).
export function SilenceStep({ onRemaining }: { onRemaining: (seconds: number) => void }) {
  const [left, setLeft] = useState(SILENCE_SECONDS);

  useEffect(() => {
    onRemaining(SILENCE_SECONDS);
    const timer = window.setInterval(() => {
      setLeft((value) => {
        const next = Math.max(0, value - 1);
        onRemaining(next);
        if (next === 0) window.clearInterval(timer);
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
    // Starts once per silence.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid place-items-center gap-5 py-10 text-center">
      <VigilLampIcon aria-hidden className="lamp-lit h-16 w-16" />
      <p className="scripture-text text-xl">Be still, and know that I am God.</p>
      <p className="rubric">Psalm 45:11. Sit in silence and let the words settle.</p>
      <p aria-live="polite" className="text-sm tabular-nums text-muted-foreground">
        {left > 0 ? `${left} seconds` : "Continue when you are ready."}
      </p>
    </div>
  );
}

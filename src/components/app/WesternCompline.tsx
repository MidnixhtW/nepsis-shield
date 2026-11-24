import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WESTERN_COMPLINE } from "@/content/westernCompline";
import { softHaptic } from "@/lib/haptics";

// A short Western Compline, one part per screen, for Western Rite users. About eight minutes. The Byzantine Small
// Compline stays in Daily prayers; this is its Western counterpart, labeled as such.
export function WesternCompline() {
  const [step, setStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [step]);

  function go(next: number) {
    moved.current = true;
    softHaptic();
    setStep(next);
  }

  const done = step >= WESTERN_COMPLINE.length;
  const part = WESTERN_COMPLINE[Math.min(step, WESTERN_COMPLINE.length - 1)];

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Western Compline</span>, the Church&rsquo;s prayer before
            sleep in the West, after the Roman and Benedictine office kept in Western Rite parishes. About eight minutes.
          </p>
        </div>
      </Card>

      <Card className="rounded-3xl p-5 sm:p-6">
        <Progress value={((done ? WESTERN_COMPLINE.length : step + 1) / WESTERN_COMPLINE.length) * 100} aria-label={done ? "Compline complete" : `Part ${step + 1} of ${WESTERN_COMPLINE.length}`} className="h-1.5" />
        {done ? (
          <div className="py-8 text-center">
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl focus:outline-none">Rest in peace</h2>
            <p className="scripture-text mx-auto mt-4 max-w-md text-lg leading-relaxed">
              I will both lay me down in peace, and sleep: for thou, Lord, only makest me dwell in safety.
            </p>
            <Button type="button" variant="outline" className="mt-6 rounded-2xl" onClick={() => go(0)}>
              <RotateCcw aria-hidden className="mr-2 h-4 w-4" /> Begin again
            </Button>
          </div>
        ) : (
          <div className="mt-5">
            <p className="text-sm font-semibold text-muted-foreground tabular-nums">Part {step + 1} of {WESTERN_COMPLINE.length}</p>
            <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-2xl focus:outline-none sm:text-3xl">{part.title}</h2>
            <div className="scripture-text mt-4 space-y-3 text-lg leading-relaxed">
              {part.lines.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}
        {!done ? (
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button type="button" variant="outline" className="h-12 rounded-2xl px-5" disabled={step === 0} onClick={() => go(step - 1)}>
              <ChevronLeft aria-hidden className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button type="button" className="h-12 flex-1 rounded-2xl sm:flex-none sm:px-10" onClick={() => go(step + 1)}>
              {step === WESTERN_COMPLINE.length - 1 ? "Finish" : "Next"} <ChevronRight aria-hidden className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

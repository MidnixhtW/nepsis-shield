import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WESTERN_COMPLINE, type ComplineStep } from "@/content/westernCompline";
import { WESTERN_EVENING, WESTERN_MORNING } from "@/content/westernOffice";
import { softHaptic } from "@/lib/haptics";
import { westernOfficeNarration } from "@/content/westernOffice";
import { clipUrl, useReader } from "@/lib/narration";
import { spokenText } from "@/lib/narrationText";
import { canPlayItems, startNarration, stopReadAloud, useReadAloud } from "@/lib/readAloud";

// The Western offices for Western Rite users, one part per screen: morning prayer, evening prayer and Compline. The
// Byzantine prayers stay in Daily prayers; these are their Western counterparts.
type OfficeProps = { steps: ComplineStep[]; intro: string; endTitle: string; endLine: string; label: string };

export function WesternCompline() {
  return (
    <WesternOffice
      steps={WESTERN_COMPLINE}
      label="Compline"
      intro="The prayer before sleep, after the Benedictine office kept in Western Rite parishes. About eight minutes."
      endTitle="Rest in peace"
      endLine="I will both lay me down in peace, and sleep: for thou, Lord, only makest me dwell in safety."
    />
  );
}

export function WesternMorningPrayer() {
  return (
    <WesternOffice
      steps={WESTERN_MORNING}
      label="Morning prayer"
      intro="Morning prayer after the Western office kept in Western Rite parishes. About six minutes."
      endTitle="Go in peace"
      endLine="This is the day which the Lord hath made; we will rejoice and be glad in it."
    />
  );
}

export function WesternEveningPrayer() {
  return (
    <WesternOffice
      steps={WESTERN_EVENING}
      label="Evening prayer"
      intro="Evening prayer after the Western office kept in Western Rite parishes. About seven minutes."
      endTitle="Go in peace"
      endLine="Let my prayer be set forth before thee as incense; and the lifting up of my hands as the evening sacrifice."
    />
  );
}

function WesternOffice({ steps, intro, endTitle, endLine, label }: OfficeProps) {
  // Read aloud part by part in the chosen voice, from the recordings when they exist and the phone's voice otherwise.
  const [reader] = useReader();
  const reading = useReadAloud();
  const narration = useMemo(
    () => westernOfficeNarration(steps).map((lines) => ({ text: spokenText(lines), audio: clipUrl(reader, lines) })),
    [reader, steps],
  );
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

  const done = step >= steps.length;
  const part = steps[Math.min(step, steps.length - 1)];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">{intro}</p>
        {canPlayItems(narration) ? (
          reading.title === label ? (
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={stopReadAloud}>
              <Square aria-hidden className="mr-1.5 h-4 w-4" /> Stop
            </Button>
          ) : (
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => startNarration(label, narration)}>
              <Volume2 aria-hidden className="mr-1.5 h-4 w-4" /> Read it to me
            </Button>
          )
        ) : null}
      </div>


      <Card className="rounded-3xl p-5 sm:p-6">
        <Progress value={((done ? steps.length : step + 1) / steps.length) * 100} aria-label={done ? `${label} complete` : `Part ${step + 1} of ${steps.length}`} className="h-1.5" />
        {done ? (
          <div className="py-8 text-center">
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl focus:outline-none">{endTitle}</h2>
            <p className="scripture-text mx-auto mt-4 max-w-md text-lg leading-relaxed">
              {endLine}
            </p>
            <Button type="button" variant="outline" className="mt-6 rounded-2xl" onClick={() => go(0)}>
              <RotateCcw aria-hidden className="mr-2 h-4 w-4" /> Begin again
            </Button>
          </div>
        ) : (
          <div className="mt-5">
            <p className="text-sm font-semibold text-muted-foreground tabular-nums">Part {step + 1} of {steps.length}</p>
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
              {step === steps.length - 1 ? "Finish" : "Next"} <ChevronRight aria-hidden className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

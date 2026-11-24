import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDailyCalendar } from "@/hooks/useDailyCalendar";
import { readingText } from "@/lib/orthocal";
import { softHaptic } from "@/lib/haptics";

// When no Gospel is saved for today (first use with no signal), pray with Christ's invitation instead.
const FALLBACK = {
  reference: "Matthew 11:28-30",
  text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls. For my yoke is easy, and my burden is light.",
};

const STEPS = [
  { name: "Read", latin: "Lectio", line: "Read the passage slowly, twice. Aloud if you can. Listen for the word or phrase that stops you." },
  { name: "Reflect", latin: "Meditatio", line: "Stay with that word. Say it over quietly. Why this word, today? What is God showing you through it?" },
  { name: "Pray", latin: "Oratio", line: "Answer Him. Thank, confess, or ask, in your own words, about what the word showed you." },
  { name: "Rest", latin: "Contemplatio", line: "Stop speaking. Rest in God's presence for a minute or two. When thoughts come, return gently to the word." },
];

const REST_SECONDS = 120;

// Lectio Divina, the slow, prayerful reading of Scripture kept by St. Benedict and the monks of the undivided Church,
// on today's Gospel. Four steps, one screen each; the passage stays in view the whole way.
export function LectioDivina() {
  const { query } = useDailyCalendar();
  const gospel = query.data?.readings.gospel;
  const text = readingText(gospel, Infinity) || FALLBACK.text;
  const reference = (gospel && readingText(gospel, Infinity) ? gospel.display : null) ?? FALLBACK.reference;

  const [step, setStep] = useState(0);
  const [left, setLeft] = useState(REST_SECONDS);
  const [resting, setResting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (!resting) return;
    if (left <= 0) {
      setResting(false);
      softHaptic();
      return;
    }
    const id = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [resting, left]);

  function go(next: number) {
    moved.current = true;
    softHaptic();
    setResting(false);
    setLeft(REST_SECONDS);
    setStep(next);
  }

  const done = step >= STEPS.length;
  const current = STEPS[Math.min(step, STEPS.length - 1)];
  const clock = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Lectio Divina</span> is the slow, prayerful reading of
            Scripture kept by St. Benedict and the monks of the West since before East and West divided. Here it uses
            today&rsquo;s Gospel. About ten minutes.
          </p>
        </div>
      </Card>

      <Card className="rounded-3xl p-5 sm:p-6">
        <Progress value={((done ? STEPS.length : step + 1) / STEPS.length) * 100} aria-label={done ? "Lectio Divina complete" : `Step ${step + 1} of ${STEPS.length}`} className="h-1.5" />

        {done ? (
          <div className="py-8 text-center">
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl text-cinnabar focus:outline-none">Carry the word with you</h2>
            <p className="scripture-text mx-auto mt-4 max-w-md text-lg leading-relaxed">
              Take the word or phrase into the day. Return to it when you wait, drive, or stand watch.
            </p>
            <Button type="button" variant="outline" className="mt-6 rounded-2xl" onClick={() => go(0)}>
              <RotateCcw aria-hidden className="mr-2 h-4 w-4" /> Begin again
            </Button>
          </div>
        ) : (
          <div className="mt-5">
            <p className="text-sm font-semibold text-muted-foreground">
              Step {step + 1} of {STEPS.length} · <span lang="la">{current.latin}</span>
            </p>
            <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-3xl text-cinnabar focus:outline-none">{current.name}</h2>
            <p className="mt-2 text-base leading-relaxed text-foreground/90">{current.line}</p>

            <figure className="mt-5 rounded-2xl border border-border/60 bg-muted/20 p-4">
              <figcaption className="text-sm font-semibold text-muted-foreground">{reference}</figcaption>
              <blockquote className="scripture-text mt-2 max-h-[45vh] overflow-y-auto text-lg leading-relaxed">{text}</blockquote>
            </figure>

            {step === 3 ? (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button type="button" variant="outline" className="rounded-2xl" onClick={() => setResting((value) => !value)}>
                  {resting ? "Pause" : left === REST_SECONDS ? "Start two minutes of rest" : "Continue resting"}
                </Button>
                <span role="timer" aria-live="off" className="text-lg font-semibold tabular-nums">{clock}</span>
              </div>
            ) : null}
          </div>
        )}

        {!done ? (
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button type="button" variant="outline" className="h-12 rounded-2xl px-5" disabled={step === 0} onClick={() => go(step - 1)}>
              <ChevronLeft aria-hidden className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button type="button" className="h-12 flex-1 rounded-2xl sm:flex-none sm:px-10" onClick={() => go(step + 1)}>
              {step === STEPS.length - 1 ? "Finish" : "Next"} <ChevronRight aria-hidden className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

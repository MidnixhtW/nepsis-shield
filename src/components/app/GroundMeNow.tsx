import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, HeartPulse, ShieldCheck, TimerReset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  responderModeAccentClasses,
  responderModeLabels,
  useResponderMode,
  type ResponderMode,
} from "@/lib/responderMode";

const groundingLines: Record<ResponderMode, string> = {
  military: "Mission pause: regain breath, check your buddy, return to lawful next action.",
  law: "Contact pause: lower your voice, widen your scan, choose restraint before speed.",
  fire: "Crew pause: breathe once, check your crew, then take the next safe action.",
  ems: "Clinical pause: scene, gloves, breath, first impression, then the next protocol step.",
  dispatch: "Comms pause: shoulders down, voice slower, location and danger first.",
  custody: "Unit pause: settled face, fewer words, lawful order, least force needed.",
  chaplain: "Presence pause: listen first, speak softly, do not carry the whole sorrow alone.",
  civilian: "Daily pause: breathe, soften your shoulders, pray simply, and take one faithful next step.",
};

const steps = [
  {
    title: "Breathe",
    body: "Inhale for 4, hold for 2, exhale for 6. Repeat three times before deciding anything else.",
  },

  {
    title: "Orient",
    body: "Name five things you see, four sounds you hear, and one safe next action within reach.",
  },
  {
    title: "Pray",
    body: "Lord Jesus Christ, Son of God, have mercy on me. Give me one clear breath and one faithful next step. Amen.",
  },
  {
    title: "Act",
    body: "Do only the next right thing: call for help, check your partner, document, hydrate, or step away if safe.",
  },
];

export function GroundMeNow() {
  const [mode] = useResponderMode();
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const theme = responderModeAccentClasses[mode];
  const current = steps[stepIndex];

  const progress = useMemo(() => `${stepIndex + 1}/${steps.length}`, [stepIndex]);

  function next() {
    setStepIndex((currentStep) => Math.min(currentStep + 1, steps.length - 1));
  }

  function restart() {
    setStepIndex(0);
  }

  return (
    <>
      <Card id="ground" className={cn("scroll-mt-24 rounded-3xl p-5 shadow-sm sm:p-6", theme.card)}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 break-words">
            <Badge className={cn("max-w-full whitespace-normal rounded-full border px-3 py-1 text-left text-xs font-bold uppercase leading-tight tracking-[0.12em]", theme.badge)}>
              <HeartPulse className="mr-1.5 h-3.5 w-3.5 shrink-0" /> Ground Me Now
            </Badge>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">Emergency reset for {responderModeLabels[mode]}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {groundingLines[mode]}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
            <Button type="button" className={cn("h-auto whitespace-normal rounded-2xl text-left leading-tight", theme.button)} onClick={() => setOpen(true)}>
              <TimerReset className="mr-2 h-4 w-4 shrink-0" /> Start 60-second reset
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl p-0 sm:max-w-[32rem]">
          <div className={cn("rounded-3xl p-6", theme.card)}>
            <DialogHeader className="text-left">
              <div className="flex items-start gap-3">
                <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", theme.icon)}>
                  <HeartPulse className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Ground Me Now · {progress}
                  </p>
                  <DialogTitle className="mt-1 text-2xl leading-tight">{current.title}</DialogTitle>
                </div>
              </div>
              <DialogDescription className="pt-3 text-sm leading-relaxed">
                If you are in immediate danger, follow emergency procedures first. This reset is for regaining calm when you are safe enough to pause.
              </DialogDescription>
            </DialogHeader>

            <div className={cn("mt-5 rounded-3xl border p-5 text-lg leading-relaxed", theme.soft)}>
              {current.body}
            </div>

            <div className="mt-4 grid gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border px-3 py-2 text-left text-sm transition-colors",
                    index === stepIndex ? theme.badge : "border-border/60 bg-background/50 text-muted-foreground hover:bg-muted/40",
                  )}
                  onClick={() => setStepIndex(index)}
                >
                  <CheckCircle2 className="h-4 w-4" /> {step.title}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" className="rounded-2xl" onClick={() => setOpen(false)}>
                Close
              </Button>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="button" variant="outline" className="rounded-2xl" onClick={restart}>
                  <AlertTriangle className="mr-2 h-4 w-4" /> Restart
                </Button>
                <Button type="button" className={cn("rounded-2xl", theme.button)} onClick={next} disabled={stepIndex === steps.length - 1}>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Next
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

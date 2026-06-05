import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle2, Compass, Hand, Menu, Settings, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

const ONBOARDING_KEY = "onboarding:quickstart_done";
export const START_TUTORIAL_EVENT = "nepsis:start-tutorial";

type TutorialStep = {
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  details: string[];
  actionLabel?: string;
  action?: () => void;
};

export function QuickStartDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const done = getStoredItem<boolean>(ONBOARDING_KEY);
    setOpen(!done);
  }, []);

  useEffect(() => {
    function startTutorial() {
      setStepIndex(0);
      setOpen(true);
    }

    window.addEventListener(START_TUTORIAL_EVENT, startTutorial);
    return () => window.removeEventListener(START_TUTORIAL_EVENT, startTutorial);
  }, []);

  const steps = useMemo<TutorialStep[]>(
    () => [
      {
        key: "welcome",
        eyebrow: "Start here",
        title: "Nepsis Shield is built around one steady daily rhythm.",
        description:
          "Use the app like a small field guide: begin with Today, then move into prayer, reading, and tools when you need them.",
        icon: <Compass className="h-5 w-5 text-primary" />,
        details: [
          "Today is your home base for the day.",
          "The bottom navigation moves between the four main areas.",
          "The menu in the top-right holds settings, privacy, saints, install, and other pages.",
        ],
        actionLabel: "Open Today",
        action: () => navigate("/today"),
      },
      {
        key: "today",
        eyebrow: "Home base",
        title: "Today shows what to do next without overwhelming you.",
        description:
          "Use it when you only have a minute. It gathers your daily rhythm, recommended next step, and quick paths into the rest of the app.",
        icon: <Sparkles className="h-5 w-5 text-primary" />,
        details: [
          "Start with the highlighted action if you are unsure.",
          "Resume cards bring you back to your last prayer, reading, or tool.",
          "Emergency and support resources are kept easy to reach.",
        ],
        actionLabel: "View Today",
        action: () => navigate("/today"),
      },
      {
        key: "prayer",
        eyebrow: "Prayer",
        title: "Prayer contains the daily flow, prayer rule, counter, prep, and journal.",
        description:
          "Use this section for short, repeatable practices rather than trying to do everything at once.",
        icon: <Hand className="h-5 w-5 text-primary" />,
        details: [
          "Daily prayer gives a guided sequence.",
          "The prayer rule helps you keep small habits consistently.",
          "The Jesus Prayer counter, stillness timer, confession prep, and journal support deeper practice.",
        ],
        actionLabel: "Open Prayer",
        action: () => navigate("/pray"),
      },
      {
        key: "read",
        eyebrow: "Read",
        title: "Read keeps Scripture and plans in one place.",
        description:
          "Begin with daily readings, browse the Bible, or follow a reading plan when you want more structure.",
        icon: <BookOpen className="h-5 w-5 text-primary" />,
        details: [
          "Daily readings are the fastest entry point.",
          "Bible search and book navigation are available from the reading room.",
          "Plans are devotional helpers you can adapt with pastoral guidance.",
        ],
        actionLabel: "Open Read",
        action: () => navigate("/read"),
      },
      {
        key: "tools",
        eyebrow: "Tools & formation",
        title: "Tools helps you learn, prepare, and find practical resources.",
        description:
          "This area gathers Orthodox teaching, liturgy help, audio, hymns, parish finding, and other formation tools.",
        icon: <Menu className="h-5 w-5 text-primary" />,
        details: [
          "Use the welcome guide if you are new or returning after a break.",
          "Catechesis Q&A answers common questions in plain language.",
          "Liturgy, audio, hymns, and parish tools help connect app practice with Church life.",
        ],
        actionLabel: "Open Tools",
        action: () => navigate("/learn"),
      },
      {
        key: "settings",
        eyebrow: "Personalize",
        title: "Settings and privacy controls are in the top-right menu.",
        description:
          "Use the menu whenever you want to adjust calendar preferences, theme, install the app, review privacy, or replay this tutorial.",
        icon: <Settings className="h-5 w-5 text-primary" />,
        details: [
          "Settings lets you choose calendar and app preferences.",
          "Privacy explains what stays on your device and includes local data controls.",
          "The Tutorial button in the menu reopens this walkthrough anytime.",
        ],
        actionLabel: "Open Settings",
        action: () => navigate("/settings"),
      },
      {
        key: "finish",
        eyebrow: "Ready",
        title: "Keep it small, steady, and prayerful.",
        description:
          "You do not need to use every feature every day. Start with one faithful next step, then return when you need guidance.",
        icon: <ShieldCheck className="h-5 w-5 text-primary" />,
        details: [
          "When in doubt, return to Today.",
          "Use Prayer for practice, Read for Scripture, and Tools for formation.",
          "You can replay this tutorial from the menu.",
        ],
      },
    ],
    [navigate],
  );

  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const progress = ((stepIndex + 1) / steps.length) * 100;

  function finish() {
    setStoredItem(ONBOARDING_KEY, true);
    setOpen(false);
  }

  function next() {
    if (isLast) finish();
    else setStepIndex((current) => current + 1);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-3xl p-0 sm:max-w-[38rem]">
        <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background p-5 sm:p-6">
          <DialogHeader>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/20 bg-primary/10">
                {step.icon}
              </div>
              <p className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
                {stepIndex + 1} of {steps.length}
              </p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {step.eyebrow}
            </p>
            <DialogTitle className="text-xl leading-tight">{step.title}</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              {step.description}
            </DialogDescription>
          </DialogHeader>

          <Progress value={progress} className="mt-4 h-2" />
          <Separator className="my-4" />

          <Card className="rounded-3xl border-border/60 bg-card/70 p-4 shadow-sm">
            <div className="grid gap-3">
              {step.details.map((detail) => (
                <div key={detail} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="rounded-2xl text-muted-foreground hover:text-foreground"
              onClick={finish}
            >
              Skip tutorial
            </Button>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl"
                disabled={isFirst}
                onClick={() => setStepIndex((current) => current - 1)}
              >
                Back
              </Button>
              {step.action ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-2xl"
                  onClick={step.action}
                >
                  {step.actionLabel}
                </Button>
              ) : null}
              <Button type="button" className="rounded-2xl" onClick={next}>
                {isLast ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

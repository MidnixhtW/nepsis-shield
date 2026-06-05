import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Hand,
  HelpCircle,
  Home,
  Menu,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

const ONBOARDING_KEY = "onboarding:quickstart_done";
export const START_TUTORIAL_EVENT = "nepsis:start-tutorial";

type TutorialStep = {
  key: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  tapTarget: string;
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
        navLabel: "Map",
        eyebrow: "Quick tour",
        title: "A simple path through the app",
        description:
          "Follow these steps once and you will know where every main feature lives.",
        icon: <Compass className="h-5 w-5 text-primary" />,
        tapTarget: "Start at Today, then use the bottom bar: Today → Prayer → Read → Tools.",
        details: [
          "Today tells you what to do next.",
          "Prayer holds daily prayer, the prayer rule, the Jesus Prayer counter, confession prep, and journal.",
          "Read holds daily readings, Bible, and reading plans.",
          "Tools holds learning, liturgy help, audio, hymns, parish finding, settings links, and support pages.",
        ],
        actionLabel: "Start at Today",
        action: () => navigate("/today"),
      },
      {
        key: "today",
        navLabel: "Today",
        eyebrow: "Feature 1",
        title: "Today is the home base",
        description:
          "Open this first when you want one clear next step instead of a long list of choices.",
        icon: <Home className="h-5 w-5 text-primary" />,
        tapTarget: "Tap Today in the bottom navigation.",
        details: [
          "Use the main highlighted card to begin the day.",
          "Use resume cards to return to the last prayer, reading, or tool you opened.",
          "Use quick help cards when you need support or direction fast.",
        ],
        actionLabel: "Go to Today",
        action: () => navigate("/today"),
      },
      {
        key: "prayer",
        navLabel: "Prayer",
        eyebrow: "Feature 2",
        title: "Prayer is for daily practice",
        description:
          "This is where the app becomes something you do, not just something you read.",
        icon: <Hand className="h-5 w-5 text-primary" />,
        tapTarget: "Tap Prayer in the bottom navigation, then choose a tab at the top of the Prayer screen.",
        details: [
          "Daily gives a guided prayer flow.",
          "Rule tracks small repeatable habits.",
          "Counter and stillness help with the Jesus Prayer.",
          "Prep and Journal help with confession, attention, gratitude, and repentance.",
        ],
        actionLabel: "Go to Prayer",
        action: () => navigate("/pray"),
      },
      {
        key: "read",
        navLabel: "Read",
        eyebrow: "Feature 3",
        title: "Read is for Scripture and plans",
        description:
          "Use this section when you want the daily readings, Bible navigation, or a structured plan.",
        icon: <BookOpen className="h-5 w-5 text-primary" />,
        tapTarget: "Tap Read in the bottom navigation, then choose Daily, Bible, or Plans.",
        details: [
          "Daily readings are the quickest place to start.",
          "Bible lets you browse books and passages.",
          "Plans give structure when you want a longer devotional path.",
        ],
        actionLabel: "Go to Read",
        action: () => navigate("/read"),
      },
      {
        key: "tools",
        navLabel: "Tools",
        eyebrow: "Feature 4",
        title: "Tools is for learning and practical help",
        description:
          "Come here when you want answers, liturgy guidance, audio, hymns, parish help, or formation resources.",
        icon: <Sparkles className="h-5 w-5 text-primary" />,
        tapTarget: "Tap Tools in the bottom navigation, then choose the tool you need.",
        details: [
          "Guide and Q&A explain Orthodox basics clearly.",
          "Liturgy, audio, hymns, and library resources support worship and learning.",
          "Parish finder helps connect the app to real Church life.",
        ],
        actionLabel: "Go to Tools",
        action: () => navigate("/learn"),
      },
      {
        key: "menu",
        navLabel: "Menu",
        eyebrow: "More options",
        title: "The top-right menu holds everything outside the daily flow",
        description:
          "Use it for settings, saints, field manual, install, privacy, about, theme, and replaying this tutorial.",
        icon: <Menu className="h-5 w-5 text-primary" />,
        tapTarget: "Tap the menu button in the top-right corner.",
        details: [
          "Settings changes calendar and preference choices.",
          "Privacy explains local device storage and data controls.",
          "Tutorial reopens this guide anytime.",
        ],
        actionLabel: "Open Settings",
        action: () => navigate("/settings"),
      },
      {
        key: "finish",
        navLabel: "Done",
        eyebrow: "Ready",
        title: "Your clean starting path",
        description:
          "If you ever feel lost, follow this order: Today, Prayer, Read, Tools, then Menu.",
        icon: <ShieldCheck className="h-5 w-5 text-primary" />,
        tapTarget: "Return to Today and choose one small next step.",
        details: [
          "Use Today for direction.",
          "Use Prayer for practice.",
          "Use Read for Scripture.",
          "Use Tools and Menu when you need learning, resources, or settings.",
        ],
        actionLabel: "Finish on Today",
        action: () => navigate("/today"),
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

  function openFeature() {
    step.action?.();
    if (isLast) finish();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-3xl p-0 sm:max-w-[39rem]">
        <div className="rounded-3xl bg-background p-5 sm:p-6">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                  {step.icon}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {step.eyebrow}
                  </p>
                  <DialogTitle className="mt-1 text-xl leading-tight">{step.title}</DialogTitle>
                </div>
              </div>
              <p className="shrink-0 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                {stepIndex + 1}/{steps.length}
              </p>
            </div>
            <DialogDescription className="pt-3 text-left text-sm leading-relaxed">
              {step.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid grid-cols-7 gap-1" aria-label="Tutorial progress">
            {steps.map((item, index) => (
              <button
                key={item.key}
                type="button"
                className={cn(
                  "h-2 rounded-full transition-colors",
                  index <= stepIndex ? "bg-primary" : "bg-muted",
                )}
                onClick={() => setStepIndex(index)}
                aria-label={`Go to ${item.navLabel} step`}
              />
            ))}
          </div>
          <Progress value={progress} className="sr-only" />

          <Separator className="my-4" />

          <div className="grid gap-3">
            <Card className="rounded-3xl border-primary/20 bg-primary/5 p-4 shadow-sm">
              <div className="flex gap-3">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Where to go</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.tapTarget}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-border/60 bg-card/70 p-4 shadow-sm">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <HelpCircle className="h-4 w-4 text-primary" /> What this feature is for
              </p>
              <div className="grid gap-2.5">
                {step.details.map((detail) => (
                  <div key={detail} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="rounded-2xl text-muted-foreground hover:text-foreground"
              onClick={finish}
            >
              Skip
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
                  onClick={openFeature}
                >
                  {step.actionLabel}
                </Button>
              ) : null}
              <Button type="button" className="rounded-2xl" onClick={next}>
                {isLast ? "Finish" : "Next feature"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

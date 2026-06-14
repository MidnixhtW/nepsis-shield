import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

const ONBOARDING_KEY = "onboarding:quickstart_done";
export const START_TUTORIAL_EVENT = "nepsis:start-tutorial";

type TutorialMode = "intro" | "tour";

type TutorialStep = {
  key: string;
  label: string;
  title: string;
  description: string;
  icon: ReactNode;
  route?: string;
  bullets: string[];
};

export function QuickStartDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<TutorialMode>("intro");
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const done = getStoredItem<boolean>(ONBOARDING_KEY);
    if (!done) {
      setMode("intro");
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    function startTutorial() {
      setMode("tour");
      setStepIndex(0);
      setOpen(true);
    }

    window.addEventListener(START_TUTORIAL_EVENT, startTutorial);
    return () => window.removeEventListener(START_TUTORIAL_EVENT, startTutorial);
  }, []);

  const steps = useMemo<TutorialStep[]>(
    () => [
      {
        key: "today",
        label: "Today",
        title: "Today",
        description: "Your home base. Start here when you want one clear next step.",
        icon: <Home className="h-5 w-5 text-primary" />,
        route: "/today",
        bullets: ["Daily overview", "Resume your last activity", "Quick help and direction"],
      },
      {
        key: "prayer",
        label: "Prayer",
        title: "Prayer",
        description: "Daily prayer, habits, stillness, confession prep, and journal.",
        icon: <Hand className="h-5 w-5 text-primary" />,
        route: "/pray",
        bullets: ["Guided daily prayer", "Prayer rule and Jesus Prayer counter", "Prep and journal tools"],
      },
      {
        key: "read",
        label: "Read",
        title: "Read",
        description: "Scripture, daily readings, and plans for steady reading.",
        icon: <BookOpen className="h-5 w-5 text-primary" />,
        route: "/read",
        bullets: ["Daily readings", "Bible browsing", "Reading plans"],
      },
      {
        key: "tools",
        label: "Tools",
        title: "Tools",
        description: "Learning, liturgy help, audio, hymns, and parish resources.",
        icon: <Sparkles className="h-5 w-5 text-primary" />,
        route: "/learn",
        bullets: ["Guide and Q&A", "Liturgy, audio, and hymns", "Parish finder"],
      },
      {
        key: "menu",
        label: "Menu",
        title: "Menu",
        description: "Everything outside the daily flow lives in the top-right menu.",
        icon: <Menu className="h-5 w-5 text-primary" />,
        bullets: ["Settings and theme", "Saints, Field Manual, install, privacy, about", "Replay this tutorial anytime"],
      },
      {
        key: "done",
        label: "Done",
        title: "You’re ready",
        description: "Use the app in this order when you feel lost: Today → Prayer → Read → Tools → Menu.",
        icon: <ShieldCheck className="h-5 w-5 text-primary" />,
        route: "/today",
        bullets: ["Start small", "Follow one next step", "Come back anytime"],
      },
    ],
    [],
  );

  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  function finish() {
    setStoredItem(ONBOARDING_KEY, true);
    setOpen(false);
  }

  function closeDialog(nextOpen: boolean) {
    if (!nextOpen) finish();
    else setOpen(true);
  }

  function startTour() {
    setMode("tour");
    setStepIndex(0);
  }

  function next() {
    if (isLast) {
      if (step.route) navigate(step.route);
      finish();
      return;
    }

    setStepIndex((current) => current + 1);
  }

  function openFeature() {
    if (step.route) navigate(step.route);
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="rounded-3xl p-0 sm:max-w-[34rem]">
        {mode === "intro" ? (
          <div className="rounded-3xl bg-background p-6">
            <DialogHeader className="text-left">
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                <Compass className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="text-2xl leading-tight">Want a quick tutorial first?</DialogTitle>
              <DialogDescription className="pt-2 text-sm leading-relaxed">
                A minimal tour will show where everything is: Today, Prayer, Read, Tools, and the Menu.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid gap-2 rounded-3xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Takes less than a minute.
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                You can skip it now and replay it later from the menu.
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" className="rounded-2xl" onClick={finish}>
                Skip for now
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl"
                onClick={() => {
                  navigate("/learn?tab=path");
                  finish();
                }}
              >
                Personalize path
              </Button>
              <Button type="button" className="rounded-2xl" onClick={startTour}>
                Start tutorial
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-background p-6">
            <DialogHeader className="text-left">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      {step.label}
                    </p>
                    <DialogTitle className="mt-1 text-2xl leading-tight">{step.title}</DialogTitle>
                  </div>
                </div>
                <p className="shrink-0 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {stepIndex + 1}/{steps.length}
                </p>
              </div>
              <DialogDescription className="pt-3 text-sm leading-relaxed">
                {step.description}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 grid grid-cols-6 gap-1" aria-label="Tutorial progress">
              {steps.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  className={cn(
                    "h-1.5 rounded-full transition-colors",
                    index <= stepIndex ? "bg-primary" : "bg-muted",
                  )}
                  onClick={() => setStepIndex(index)}
                  aria-label={`Go to ${item.label}`}
                />
              ))}
            </div>

            <div className="mt-5 rounded-3xl border border-border bg-muted/20 p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <HelpCircle className="h-4 w-4 text-primary" /> What it includes
              </p>
              <div className="grid gap-2.5">
                {step.bullets.map((bullet) => (
                  <div key={bullet} className="flex gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="ghost" className="rounded-2xl" onClick={finish}>
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
                {step.route ? (
                  <Button type="button" variant="secondary" className="rounded-2xl" onClick={openFeature}>
                    Open {step.label}
                  </Button>
                ) : null}
                <Button type="button" className="rounded-2xl" onClick={next}>
                  {isLast ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

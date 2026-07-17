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
import {
  getStoredResponderMode,
  responderModeAccentClasses,
  responderModeLabels,
  responderModeOrder,
  setStoredResponderMode,
  type ResponderMode,
} from "@/lib/responderMode";

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
  const [selectedRole, setSelectedRole] = useState<ResponderMode>(() => getStoredResponderMode());

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
        title: "Daily command center",
        description: "Your home base for prayer, Scripture, saints, fasting, and one practical next step.",
        icon: <Home className="h-5 w-5 text-primary" />,
        route: "/today",
        bullets: ["Pray now, read today, or reset under pressure", "Daily rhythm and liturgical details", "Resume your last activity"],
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
        label: "Guide",
        title: "Guide",
        description: "Personal path, challenges, learning, liturgy help, audio, hymns, and parish resources.",
        icon: <Sparkles className="h-5 w-5 text-primary" />,
        route: "/learn?tab=path",
        bullets: ["Build a daily rule", "Learn the faith in small steps", "Use guide, Q&A, liturgy, audio, and parish finder"],
      },
      {
        key: "menu",
        label: "More",
        title: "More",
        description: "Secondary tools live in the top-right menu and More tab.",
        icon: <Menu className="h-5 w-5 text-primary" />,
        bullets: ["Field Manual and Saints", "Settings, install/share, privacy, and sources", "Replay this tutorial anytime"],
      },
      {
        key: "done",
        label: "Done",
        title: "You’re ready",
        description: "When you feel lost, use this order: Today → Pray → Read → Guide → More.",
        icon: <ShieldCheck className="h-5 w-5 text-primary" />,
        route: "/today",
        bullets: ["Start small", "Follow one next step", "Return to Today anytime"],
      },
    ],
    [],
  );

  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  function chooseRole(role: ResponderMode) {
    setSelectedRole(role);
    setStoredResponderMode(role);
  }

  function finish() {
    setStoredResponderMode(selectedRole);
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

  function openPersonalPath() {
    setStoredResponderMode(selectedRole);
    setStoredItem(ONBOARDING_KEY, true);
    setOpen(false);
    navigate("/learn?tab=path");
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
    if (!step.route) return;
    setStoredResponderMode(selectedRole);
    setStoredItem(ONBOARDING_KEY, true);
    setOpen(false);
    navigate(step.route);
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="max-h-[calc(100dvh-1rem)] overflow-hidden rounded-3xl p-0 sm:max-w-[34rem]">
        {mode === "intro" ? (
          <div className="max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-3xl bg-background p-4 sm:max-h-[calc(100dvh-2rem)] sm:p-6">
            <DialogHeader className="pr-6 text-left sm:pr-8">
              <div className="mb-2 grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 sm:mb-3 sm:h-12 sm:w-12">
                <Compass className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="text-xl leading-tight sm:text-2xl">Set your first rhythm</DialogTitle>
              <DialogDescription className="pt-2 text-sm leading-relaxed">
                Nepsis Shield is a field-ready Orthodox companion for prayer, Scripture, watchfulness, and one faithful next step under pressure.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 rounded-3xl border border-primary/25 bg-primary/5 p-3 sm:mt-5 sm:p-4">
              <p className="text-sm font-semibold tracking-tight">Choose one simple goal</p>
              <div className="mt-2 grid gap-2 text-sm text-muted-foreground sm:mt-3 sm:grid-cols-2">
                <div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Pray daily</div>
                <div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Read daily</div>
                <div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Build discipline</div>
                <div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Find calm under stress</div>
              </div>
            </div>

            <div className="candlelight-card mt-4 rounded-3xl border p-3 sm:mt-5 sm:p-4">
              <p className="text-sm font-semibold tracking-tight">Choose your role or path</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                This personalizes colors, field prompts, and emergency reset language. If none apply, choose the civilian option.
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:mt-3 sm:grid-cols-3">

                {responderModeOrder.map((role) => {
                  const selected = selectedRole === role;
                  const theme = responderModeAccentClasses[role];
                  return (
                    <button
                      key={role}
                      type="button"
                      className={cn(
                        "min-h-10 rounded-2xl border px-3 py-2 text-left text-xs font-semibold leading-tight transition-colors whitespace-normal break-words",
                        selected ? theme.badge : "border-primary/15 bg-background/60 text-muted-foreground hover:border-primary/35 hover:bg-muted/50 hover:text-foreground",
                      )}
                      onClick={() => chooseRole(role)}
                    >
                      {responderModeLabels[role]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid gap-2 rounded-3xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground sm:mt-5 sm:p-4">
              <div className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Start on Today when you are not sure what to do next.
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                The personal path recommends prayer, reading, sleep mode, or challenges.
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                You can replay the tutorial later from Help in the menu.
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" className="min-h-10 rounded-2xl" onClick={finish}>
                Skip for now
              </Button>
              <Button type="button" variant="secondary" className="min-h-10 rounded-2xl" onClick={startTour}>
                Tour app
              </Button>
              <Button type="button" className="min-h-10 rounded-2xl" onClick={openPersonalPath}>
                Build my path
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-3xl bg-background p-4 sm:max-h-[calc(100dvh-2rem)] sm:p-6">
            <DialogHeader className="pr-6 text-left sm:pr-8">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 sm:h-11 sm:w-11">
                    {step.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary sm:tracking-[0.18em]">
                      {step.label}
                    </p>
                    <DialogTitle className="mt-1 text-xl leading-tight sm:text-2xl">{step.title}</DialogTitle>
                  </div>
                </div>
                <p className="shrink-0 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-semibold text-muted-foreground sm:px-3">
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

            <div className="mt-4 rounded-3xl border border-border bg-muted/20 p-3 sm:mt-5 sm:p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold sm:mb-3">
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

            <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="ghost" className="min-h-10 rounded-2xl" onClick={finish}>
                Skip
              </Button>

              <div className="grid min-w-0 gap-2 sm:flex sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-10 rounded-2xl"
                  disabled={isFirst}
                  onClick={() => setStepIndex((current) => current - 1)}
                >
                  Back
                </Button>
                {step.route ? (
                  <Button type="button" variant="secondary" className="min-h-10 rounded-2xl" onClick={openFeature}>
                    Open {step.label}
                  </Button>
                ) : null}
                <Button type="button" className="min-h-10 rounded-2xl" onClick={next}>
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

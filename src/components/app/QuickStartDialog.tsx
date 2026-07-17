import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  Flame,
  Heart,
  MoonStar,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import {
  getStoredResponderMode,
  responderModeLabels,
  responderModeOrder,
  setStoredResponderMode,
  type ResponderMode,
} from "@/lib/responderMode";

import {
  buildRuleOfVigilance,
  setStoredRuleOfVigilance,
  type RuleOfVigilance,
  type VigilanceNeed,
  type VigilanceRhythm,
} from "@/lib/ruleOfVigilance";

const ONBOARDING_KEY = "onboarding:quickstart_done";
export const START_TUTORIAL_EVENT = "nepsis:start-tutorial";

type OnboardingStep = "welcome" | "role" | "need" | "rhythm" | "rule";

type NeedOption = {
  id: VigilanceNeed;
  title: string;
  description: string;
  icon: React.ReactNode;
};

type RhythmOption = {
  id: VigilanceRhythm;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const steps: OnboardingStep[] = ["welcome", "role", "need", "rhythm", "rule"];

const needOptions: NeedOption[] = [
  {
    id: "peace",
    title: "Peace from anxiety",
    description: "A quiet rule for returning to prayer when the heart is restless.",
    icon: <Heart className="h-5 w-5" />,
  },
  {
    id: "discipline",
    title: "Discipline in prayer",
    description: "A steady rhythm that is small enough to keep and strong enough to shape the day.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    id: "anger",
    title: "Help with anger",
    description: "A rule for restraint, slower speech, and merciful strength under pressure.",
    icon: <Flame className="h-5 w-5" />,
  },
  {
    id: "sleep",
    title: "Sleep and evening stillness",
    description: "A soft descent into Compline, surrender, and rest without scrolling.",
    icon: <MoonStar className="h-5 w-5" />,
  },
  {
    id: "scripture",
    title: "Scripture habit",
    description: "A simple daily reading path with attention instead of hurry.",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: "confession",
    title: "Confession preparation",
    description: "A hopeful examen that leads to truth without despair.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    id: "fasting",
    title: "Fasting support",
    description: "Embodied watchfulness with humility, patience, and practical guidance.",
    icon: <Compass className="h-5 w-5" />,
  },
  {
    id: "exploring",
    title: "Just exploring",
    description: "A gentle first step into prayer, reading, and Orthodox watchfulness.",
    icon: <Sun className="h-5 w-5" />,
  },
];

const rhythmOptions: RhythmOption[] = [
  {
    id: "morning",
    title: "Morning anchor",
    description: "Begin before the noise gathers.",
    icon: <Sun className="h-5 w-5" />,
  },
  {
    id: "midday",
    title: "Midday return",
    description: "Use the chotki when the day is already moving.",
    icon: <Compass className="h-5 w-5" />,
  },
  {
    id: "evening",
    title: "Evening sanctuary",
    description: "Let the day settle into prayer before sleep.",
    icon: <MoonStar className="h-5 w-5" />,
  },
  {
    id: "small",
    title: "Smallest faithful step",
    description: "A rule for busy seasons: short, honest, and repeatable.",
    icon: <Heart className="h-5 w-5" />,
  },
];

function StepDots({ index }: { index: number }) {
  return (
    <div className="flex gap-1.5" aria-label="Onboarding progress">
      {steps.map((step, i) => (
        <span
          key={step}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i <= index ? "w-7 bg-primary" : "w-2.5 bg-primary/20",
          )}
        />
      ))}
    </div>
  );
}

function SelectionCard({
  selected,
  icon,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative min-h-32 rounded-[1.75rem] border p-4 text-left transition-all duration-200",
        "bg-card/60 shadow-[0_18px_55px_hsl(35_91%_48%/0.08)] hover:-translate-y-0.5 hover:border-primary/45 hover:bg-card/80",
        selected ? "border-primary/60 ring-1 ring-primary/45" : "border-primary/15",
      )}
    >
      <span className="pointer-events-none absolute inset-x-6 -top-10 h-20 rounded-full bg-amber-500/10 blur-3xl" />
      <span className="relative flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          {icon}
        </span>
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all",
            selected ? "gold-foil border-primary/50 text-primary-foreground" : "border-primary/20 bg-background/70 text-transparent",
          )}
        >
          <Check className="h-4 w-4" />
        </span>
      </span>
      <span className="relative mt-4 block text-base font-semibold tracking-tight">{title}</span>
      <span className="relative mt-1 block text-sm leading-relaxed text-muted-foreground">{description}</span>
    </button>
  );
}

function RulePreview({ rule }: { rule: RuleOfVigilance }) {
  const rows = [
    ["Morning", rule.morning],
    ["Midday", rule.midday],
    ["Evening", rule.evening],
    ["Under pressure", rule.underPressure],
  ];

  return (
    <div className="candlelight-card rounded-[2rem] border p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your Rule of Vigilance</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{rule.title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{rule.pastoralNote}</p>
      <div className="mt-6 grid gap-3">
        {rows.map(([label, body]) => (
          <div key={label} className="rounded-3xl bg-background/45 p-4 shadow-[inset_0_1px_0_hsl(42_92%_58%/0.10)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{label}</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/90">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuickStartDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState<ResponderMode>(() => getStoredResponderMode());
  const [selectedNeed, setSelectedNeed] = useState<VigilanceNeed>("peace");
  const [selectedRhythm, setSelectedRhythm] = useState<VigilanceRhythm>("morning");

  useEffect(() => {
    const done = getStoredItem<boolean>(ONBOARDING_KEY);
    if (!done) {
      setStepIndex(0);
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    function startTutorial() {
      setStepIndex(0);
      setSelectedRole(getStoredResponderMode());
      setOpen(true);
    }

    window.addEventListener(START_TUTORIAL_EVENT, startTutorial);
    return () => window.removeEventListener(START_TUTORIAL_EVENT, startTutorial);
  }, []);

  const step = steps[stepIndex];
  const rule = useMemo(
    () => buildRuleOfVigilance({ need: selectedNeed, rhythm: selectedRhythm, role: selectedRole }),
    [selectedNeed, selectedRhythm, selectedRole],
  );

  function chooseRole(role: ResponderMode) {
    setSelectedRole(role);
    setStoredResponderMode(role);
  }

  function finish() {
    setStoredResponderMode(selectedRole);
    setStoredRuleOfVigilance(rule);
    setStoredItem(ONBOARDING_KEY, true);
    setOpen(false);
    navigate("/today");
  }

  function skip() {
    const defaultRule = buildRuleOfVigilance({ need: selectedNeed, rhythm: selectedRhythm, role: selectedRole });
    setStoredResponderMode(selectedRole);
    setStoredRuleOfVigilance(defaultRule);
    setStoredItem(ONBOARDING_KEY, true);
    setOpen(false);
  }

  function next() {
    if (step === "rule") {
      finish();
      return;
    }
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-background text-foreground"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-8rem] h-80 w-80 -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute bottom-20 right-[-8rem] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-5 pb-32 pt-5 sm:px-8 sm:pb-36 sm:pt-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {stepIndex > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setStepIndex((current) => current - 1)}
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            ) : null}
            <StepDots index={stepIndex} />
          </div>
          <Button type="button" variant="ghost" className="rounded-full text-muted-foreground" onClick={skip}>
            Begin later
          </Button>
        </header>

        <main className="grid flex-1 content-center gap-8 py-8 sm:py-12">
          {step === "welcome" ? (
            <section className="mx-auto max-w-3xl text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-[1.75rem] border border-primary/25 bg-primary/10 text-primary shadow-[0_24px_80px_hsl(35_91%_48%/0.20)]">
                <Compass className="h-9 w-9" />
              </div>
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Nepsis Shield</p>
              <h1 id="onboarding-title" className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
                Quiet your heart. Begin with one faithful step.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                We’ll shape a simple Orthodox rhythm for your day: prayer, Scripture, watchfulness, and a gentle return when pressure rises.
              </p>
            </section>
          ) : null}

          {step === "role" ? (
            <section>
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Your path</p>
                <h1 id="onboarding-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                  What should the app be attentive to?
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Choose a role if it fits. If not, the civilian path keeps the language pastoral and ordinary-life focused.
                </p>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {responderModeOrder.map((role) => {
                  const selected = selectedRole === role;
                  return (
                    <SelectionCard
                      key={role}
                      selected={selected}
                      icon={<ShieldCheck className={cn("h-5 w-5", selected ? "text-primary" : "text-muted-foreground")} />}
                      title={responderModeLabels[role]}
                      description={role === "civilian" ? "For home, work, school, family, and everyday stress." : "Keeps service prompts and reset language aligned with your duties."}

                      onClick={() => chooseRole(role)}
                    />
                  );
                })}

              </div>
            </section>
          ) : null}

          {step === "need" ? (
            <section>
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">What are you seeking?</p>
                <h1 id="onboarding-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                  Choose the place where you most need watchfulness.
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  This shapes your Rule of Vigilance. You can change it later by replaying onboarding from Help.
                </p>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {needOptions.map((option) => (
                  <SelectionCard
                    key={option.id}
                    selected={selectedNeed === option.id}
                    icon={option.icon}
                    title={option.title}
                    description={option.description}
                    onClick={() => setSelectedNeed(option.id)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === "rhythm" ? (
            <section>
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Daily rhythm</p>
                <h1 id="onboarding-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                  When can prayer realistically take root?
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Choose the rhythm you can actually keep. A small rule kept peacefully is a beautiful beginning.
                </p>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {rhythmOptions.map((option) => (
                  <SelectionCard
                    key={option.id}
                    selected={selectedRhythm === option.id}
                    icon={option.icon}
                    title={option.title}
                    description={option.description}
                    onClick={() => setSelectedRhythm(option.id)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === "rule" ? (
            <section className="mx-auto w-full max-w-4xl">
              <RulePreview rule={rule} />
            </section>
          ) : null}
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[71] border-t border-primary/15 bg-background/80 p-4 backdrop-blur-xl sm:p-5">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="truncate text-sm font-medium text-foreground">
              {step === "rule" ? rule.title : "Your daily rule is being shaped gently."}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {step === "rule" ? rule.pastoralNote : "One clear choice per screen. No pressure, no clutter."}
            </p>
          </div>
          <Button type="button" className="gold-foil h-14 flex-1 rounded-full text-base font-bold text-primary-foreground sm:max-w-sm" onClick={next}>
            {step === "rule" ? "Seal this Daily Rule" : "Continue"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
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
  MAX_VIGILANCE_NEEDS,
  buildRuleOfVigilance,
  setStoredRuleOfVigilance,
  type RuleOfVigilance,
  type VigilanceNeed,
  type VigilanceRhythm,
} from "@/lib/ruleOfVigilance";
import { RuleVariantPicker } from "@/components/app/RuleVariantPicker";
import { useTheme } from "next-themes";
import { useSettings } from "@/hooks/useSettings";
import { themeOptions } from "@/components/app/ThemeToggle";
import { DEFAULT_THEME } from "@/components/app/ThemeProvider";
import type { CalendarMode } from "@/lib/settings";

const ONBOARDING_KEY = "onboarding:quickstart_done";
export const START_TUTORIAL_EVENT = "nepsis:start-tutorial";

type OnboardingStep = "welcome" | "theme" | "role" | "calendar" | "need" | "rhythm" | "rule";

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

const steps: OnboardingStep[] = ["welcome", "theme", "role", "calendar", "need", "rhythm", "rule"];

// A small mock screen in the theme's own colors, so the choice is visible before it is made.
function ThemePreview({ colors }: { colors: [string, string, string] }) {
  const [background, text, accent] = colors;
  return (
    <span aria-hidden className="grid h-full w-full place-items-center rounded-2xl" style={{ background }}>
      <span className="grid gap-1">
        <span className="block h-1 w-5 rounded-full" style={{ background: accent }} />
        <span className="block h-1 w-6 rounded-full" style={{ background: text }} />
        <span className="block h-1 w-4 rounded-full" style={{ background: text, opacity: 0.6 }} />
      </span>
    </span>
  );
}

// Fasts, feasts, readings, and journeys all follow this choice.
const calendarOptions: Array<{ id: CalendarMode; title: string; description: string }> = [
  {
    id: "gregorian",
    title: "New Calendar",
    description: "Nativity on December 25. Most parishes of the OCA, Greek, Antiochian, Romanian, and Bulgarian churches.",
  },
  {
    id: "julian",
    title: "Old Calendar",
    description: "Nativity on January 7. The Russian (including ROCOR), Serbian, Georgian, and Jerusalem churches, and Mount Athos.",
  },
];

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
  order,
  multiple = false,
}: {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  /** 1-based position among multiple selections, shown in place of the check mark. */
  order?: number;
  multiple?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={multiple ? selected : undefined}
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
          {order ? <span className="text-sm font-bold">{order}</span> : <Check className="h-4 w-4" />}
        </span>
      </span>
      <span className="relative mt-4 block text-base font-semibold tracking-tight">{title}</span>
      <span className="relative mt-1 block text-sm leading-relaxed text-muted-foreground">{description}</span>
    </button>
  );
}

function RulePreview({ rule, onVariantChange }: { rule: RuleOfVigilance; onVariantChange: (variant: string) => void }) {
  const rows = [
    ...(rule.practice ? [[rule.variantLabel ?? "Focus", rule.practice]] : []),
    ["Morning", rule.morning],
    ["Midday", rule.midday],
    ["Evening", rule.evening],
    ["Under pressure", rule.underPressure],
    ...(rule.also ?? []).map((item) => [`Also: ${item.label}`, item.body]),
  ];

  return (
    <div className="candlelight-card rounded-[2rem] border p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your daily prayer plan</p>
      <h2 id="onboarding-title" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{rule.title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{rule.pastoralNote}</p>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Choose a version</p>
      <RuleVariantPicker need={rule.need} value={rule.variant} onChange={onVariantChange} className="mt-2" />
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

const roleDescriptions: Record<ResponderMode, string> = {
  military: "Mission with restraint",
  law: "Firm without anger",
  fire: "Courage with crew discipline",
  ems: "Clinical calm",
  dispatch: "Voice in the storm",
  custody: "Order with restraint",
  chaplain: "Presence before answers",
  civilian: "Everyday faithfulness",
};

export function QuickStartDialog({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(() => !getStoredItem<boolean>(ONBOARDING_KEY));
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState<ResponderMode>(() => getStoredResponderMode());
  const { settings, updateSettings } = useSettings();
  const { theme, setTheme } = useTheme();
  // Every role keeps the Church Year look; the role only tints its accent color (see seasonal.css).
  const [themePicked, setThemePicked] = useState(false);
  // Starts empty so the first tap becomes the lead need; the rule falls back to peace if none is chosen.
  const [selectedNeeds, setSelectedNeeds] = useState<VigilanceNeed[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);
  const [selectedRhythm, setSelectedRhythm] = useState<VigilanceRhythm>("morning");
  const scrollArea = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  useEffect(() => {
    scrollArea.current?.scrollTo(0, 0);
    const heading = scrollArea.current?.querySelector<HTMLElement>("h1, h2");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
  }, [stepIndex]);

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
    () => buildRuleOfVigilance({ needs: selectedNeeds, rhythm: selectedRhythm, role: selectedRole, variant: selectedVariant }),
    [selectedNeeds, selectedRhythm, selectedRole, selectedVariant],
  );

  // Several needs may be chosen; the first stays the lead.
  function toggleNeed(need: VigilanceNeed) {
    let next = selectedNeeds;
    if (selectedNeeds.includes(need)) {
      next = selectedNeeds.filter((item) => item !== need);
    } else if (selectedNeeds.length < MAX_VIGILANCE_NEEDS) {
      next = [...selectedNeeds, need];
    }
    // A different lead need has different versions, so start again from its first one.
    if (next[0] !== selectedNeeds[0]) setSelectedVariant(undefined);
    setSelectedNeeds(next);
  }

  function chooseRole(role: ResponderMode) {
    setSelectedRole(role);
    setStoredResponderMode(role);
    if (!themePicked) setTheme(DEFAULT_THEME);
  }

  function finish() {
    setStoredResponderMode(selectedRole);
    setStoredRuleOfVigilance(rule);
    setStoredItem(ONBOARDING_KEY, true);
    setOpen(false);
    navigate("/today");
  }

  function skip() {
    setStoredResponderMode(selectedRole);
    setStoredRuleOfVigilance(rule);
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

  if (!open) return <>{children}</>;

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen) skip(); }}>
      <Dialog.Portal>
        <Dialog.Content
          className="fixed inset-0 z-[70] flex h-dvh flex-col overflow-hidden bg-background text-foreground outline-none"
          aria-describedby={undefined}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <Dialog.Title className="sr-only">Set up your daily rule · Step {stepIndex + 1} of {steps.length}</Dialog.Title>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-8rem] h-80 w-80 -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute bottom-20 right-[-8rem] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 sm:pt-8">
        <header className="flex shrink-0 items-center justify-between gap-4">
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

        <div ref={scrollArea} className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-6 sm:py-8">
          <div className={cn("grid min-h-full gap-6", step === "welcome" ? "content-center" : "content-start")}>
          {step === "welcome" ? (
            <section className="mx-auto max-w-3xl text-center">
              <img
                src="/military-orthodox-cross.svg"
                alt=""
                width={112}
                height={112}
                className="mx-auto h-28 w-28 drop-shadow-[0_24px_48px_hsl(42_52%_40%/0.28)]"
              />
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Nepsis Shield</p>
              <h1 id="onboarding-title" className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
                Quiet your heart. Begin with one faithful step.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                We’ll shape a simple Orthodox rhythm for your day: prayer, Scripture, watchfulness, and a gentle return when pressure rises.
              </p>
            </section>
          ) : null}

          {step === "theme" ? (
            <section>
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Appearance</p>
                <h1 id="onboarding-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                  How should Nepsis Shield look?
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Tap one to see it now. Dark themes are easier on the eyes at night; Parchment is easiest to read in daylight. You can change it anytime from the menu, under Appearance.
                </p>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {themeOptions.map((option) => (
                  <SelectionCard
                    key={option.value}
                    selected={(theme ?? DEFAULT_THEME) === option.value}
                    icon={<ThemePreview colors={option.preview} />}
                    title={option.label}
                    description={option.description}
                    onClick={() => {
                      setTheme(option.value);
                      setThemePicked(true);
                    }}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === "role" ? (
            <section>
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Your path</p>
                <h1 id="onboarding-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                  Is there a calling the app should keep in mind?
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Most people choose Everyday life. If you serve in the military, police, fire, EMS, dispatch, corrections, or as a chaplain, choose it here and the app adds support for your work.
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
                      description={roleDescriptions[role]}

                      onClick={() => chooseRole(role)}
                    />
                  );
                })}

              </div>
            </section>
          ) : null}

          {step === "calendar" ? (
            <section>
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Your calendar</p>
                <h1 id="onboarding-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                  Which calendar does your parish keep?
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Fasts, feasts, readings, and seasonal journeys follow it. Not sure? If your parish celebrates Nativity on December 25, choose New Calendar; on January 7, Old Calendar. You can change this later in Settings.
                </p>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {calendarOptions.map((option) => (
                  <SelectionCard
                    key={option.id}
                    selected={settings.calendarMode === option.id}
                    icon={<CalendarDays className="h-5 w-5" />}
                    title={option.title}
                    description={option.description}
                    onClick={() => updateSettings({ calendarMode: option.id })}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === "need" ? (
            <section>
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">What are you seeking?</p>
                <h1 id="onboarding-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                  Choose where you most need watchfulness.
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Pick up to {MAX_VIGILANCE_NEEDS}. Your first choice leads your Rule of Vigilance; the others add a practice each. You can change it later by replaying onboarding from the menu.
                </p>
                <p role="status" className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  {selectedNeeds.length ? `${selectedNeeds.length} of ${MAX_VIGILANCE_NEEDS} chosen` : "Choose at least one"}
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {needOptions.map((option) => {
                  const position = selectedNeeds.indexOf(option.id);
                  return (
                    <SelectionCard
                      key={option.id}
                      multiple
                      selected={position >= 0}
                      order={position >= 0 ? position + 1 : undefined}
                      icon={option.icon}
                      title={option.title}
                      description={option.description}
                      onClick={() => toggleNeed(option.id)}
                    />
                  );
                })}
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
                  Choose a rhythm you can keep. A small rule kept in peace is a good beginning.
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
              <RulePreview rule={rule} onVariantChange={setSelectedVariant} />
            </section>
          ) : null}
          </div>
        </div>
      </div>

      <div className="relative z-[71] shrink-0 border-t border-primary/15 bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="truncate text-sm font-medium text-foreground">
              {step === "rule" ? rule.title : "Your daily rule is being shaped gently."}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {step === "rule" ? rule.pastoralNote : "One choice per screen. You can change any of it later."}
            </p>
          </div>
          <Button
            type="button"
            className="gold-foil h-14 flex-1 rounded-full text-base font-bold text-primary-foreground disabled:opacity-50 sm:max-w-sm"
            onClick={next}
            disabled={step === "need" && selectedNeeds.length === 0}
          >
            {step === "rule" ? "Seal this Daily Rule" : "Continue"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

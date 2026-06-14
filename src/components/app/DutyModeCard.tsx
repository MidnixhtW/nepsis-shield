import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Ambulance,
  CheckCircle2,
  Crosshair,
  Flame,
  HeartHandshake,
  HeartPulse,
  Radio,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { showError, showSuccess } from "@/utils/toast";

type ResponderMode = "law" | "fire" | "ems" | "dispatch" | "custody" | "chaplain";

type ResponderTheme = {
  card: string;
  orbOne: string;
  orbTwo: string;
  badge: string;
  icon: string;
  focus: string;
  quote: string;
  step: string;
  reset: string;
  tag: string;
  checklist: string;
  primaryButton: string;
  modeButton: string;
  modeButtonActive: string;
};

type ResponderBrief = {
  label: string;
  badge: string;
  icon: LucideIcon;
  focus: string;
  prayer: string;
  steps: string[];
  reset: string;
  suitedFor: string[];
  theme: ResponderTheme;
};

const responderModes: Record<ResponderMode, ResponderBrief> = {
  law: {
    label: "Law enforcement",
    badge: "Firm without anger",
    icon: ShieldCheck,
    focus: "Protect life, preserve truth, and keep command presence without contempt.",
    prayer:
      "Lord Jesus Christ, guard my mind, my words, and my hands. Make me watchful without fear, firm without anger, and merciful without weakness. Amen.",
    steps: [
      "Check your tone before contact: slower voice, fewer words, clear commands.",
      "Scan hands, exits, partners, and bystanders; do not let anger narrow your vision.",
      "Preserve dignity where possible: lawful, truthful, restrained, and accountable.",
    ],
    reset: "After the call: unclench your jaw, thank God for any life preserved, and name one truthful thing before replaying the scene.",
    suitedFor: ["Police", "Deputies", "Security", "Public safety"],
    theme: {
      card: "border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-card to-blue-950/5",
      orbOne: "border-sky-400/25 bg-sky-400/10",
      orbTwo: "border-blue-500/20 bg-blue-500/10",
      badge: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
      icon: "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/25 dark:text-sky-300",
      focus: "border-sky-500/20 bg-sky-500/10",
      quote: "border-sky-500/20 bg-sky-950/5 dark:bg-sky-500/10",
      step: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
      reset: "border-sky-500/20 bg-sky-500/10 text-sky-900 dark:text-sky-100",
      tag: "bg-sky-500/10 text-sky-800 dark:text-sky-200",
      checklist: "border-sky-500/25 text-sky-800 dark:text-sky-200",
      primaryButton: "bg-sky-700 text-white hover:bg-sky-800 dark:bg-sky-500 dark:text-sky-950 dark:hover:bg-sky-400",
      modeButton: "border-sky-500/20 hover:bg-sky-500/10 hover:text-sky-800 dark:hover:text-sky-200",
      modeButtonActive: "border-sky-700 bg-sky-700 text-white hover:bg-sky-800 dark:border-sky-400 dark:bg-sky-500 dark:text-sky-950 dark:hover:bg-sky-400",
    },
  },
  fire: {
    label: "Fire & rescue",
    badge: "Courage with crew discipline",
    icon: Flame,
    focus: "Move fast, stay humble, protect the crew, and serve the person in front of you.",
    prayer:
      "Lord of mercy, give me courage without recklessness, speed without panic, and love for every soul we are sent to protect. Amen.",
    steps: [
      "Breathe once before entry or action; courage still needs attention.",
      "Crew check: location, air, assignment, exit, and the one person most at risk.",
      "Let no adrenaline become pride; receive orders and give help cleanly.",
    ],
    reset: "After the call: wash up slowly, check on your crew, and offer the names of the injured and the rescued to God.",
    suitedFor: ["Firefighters", "Rescue", "Wildland", "Technical rescue"],
    theme: {
      card: "border-red-500/30 bg-gradient-to-br from-red-500/10 via-card to-orange-500/10",
      orbOne: "border-red-400/25 bg-red-400/10",
      orbTwo: "border-orange-500/25 bg-orange-500/10",
      badge: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
      icon: "bg-red-500/10 text-red-700 ring-1 ring-red-500/25 dark:text-red-300",
      focus: "border-red-500/20 bg-red-500/10",
      quote: "border-orange-500/20 bg-orange-950/5 dark:bg-orange-500/10",
      step: "bg-red-500/10 text-red-700 dark:text-red-300",
      reset: "border-orange-500/25 bg-orange-500/10 text-orange-900 dark:text-orange-100",
      tag: "bg-red-500/10 text-red-800 dark:text-red-200",
      checklist: "border-orange-500/25 text-orange-800 dark:text-orange-200",
      primaryButton: "bg-red-700 text-white hover:bg-red-800 dark:bg-red-500 dark:text-red-950 dark:hover:bg-red-400",
      modeButton: "border-red-500/20 hover:bg-red-500/10 hover:text-red-800 dark:hover:text-red-200",
      modeButtonActive: "border-red-700 bg-red-700 text-white hover:bg-red-800 dark:border-red-400 dark:bg-red-500 dark:text-red-950 dark:hover:bg-red-400",
    },
  },
  ems: {
    label: "EMS / medical",
    badge: "Clinical calm",
    icon: Ambulance,
    focus: "Treat the patient as an icon of God while your training keeps the scene moving.",
    prayer:
      "Christ the Physician, steady my hands and clear my mind. Help me treat this person, not only the problem, with skill, patience, and mercy. Amen.",
    steps: [
      "Scene safe, gloves on, first impression; let the algorithm carry what emotion cannot.",
      "Speak one human sentence to the patient or family before the next task.",
      "When outcomes are heavy, remember: faithfulness is not the same as control.",
    ],
    reset: "After the call: hydrate, document truthfully, and release what was never yours to command.",
    suitedFor: ["EMT", "Paramedic", "ER teams", "Medics"],
    theme: {
      card: "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/10",
      orbOne: "border-emerald-400/25 bg-emerald-400/10",
      orbTwo: "border-teal-500/25 bg-teal-500/10",
      badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      icon: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-300",
      focus: "border-emerald-500/20 bg-emerald-500/10",
      quote: "border-teal-500/20 bg-teal-950/5 dark:bg-teal-500/10",
      step: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      reset: "border-teal-500/25 bg-teal-500/10 text-teal-900 dark:text-teal-100",
      tag: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
      checklist: "border-teal-500/25 text-teal-800 dark:text-teal-200",
      primaryButton: "bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400",
      modeButton: "border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-800 dark:hover:text-emerald-200",
      modeButtonActive: "border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800 dark:border-emerald-400 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400",
    },
  },
  dispatch: {
    label: "Dispatch / comms",
    badge: "Voice in the storm",
    icon: Radio,
    focus: "Be the calm line between panic and help, even when no one sees the weight you carry.",
    prayer:
      "Lord Jesus Christ, make my voice calm, my listening sharp, and my heart protected from despair. Guide the responders I cannot see. Amen.",
    steps: [
      "Lower your shoulders before answering; your breath shapes the caller’s breath.",
      "Clarify location, danger, and need; do not absorb the panic as your own identity.",
      "Between calls, let silence return before the next voice arrives.",
    ],
    reset: "After the call: stand if you can, breathe out slowly, and pray for the caller and the units by role if you do not know their names.",
    suitedFor: ["911", "Dispatch", "Call takers", "Radio operators"],
    theme: {
      card: "border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-card to-fuchsia-500/10",
      orbOne: "border-violet-400/25 bg-violet-400/10",
      orbTwo: "border-fuchsia-500/20 bg-fuchsia-500/10",
      badge: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
      icon: "bg-violet-500/10 text-violet-700 ring-1 ring-violet-500/25 dark:text-violet-300",
      focus: "border-violet-500/20 bg-violet-500/10",
      quote: "border-fuchsia-500/20 bg-fuchsia-950/5 dark:bg-fuchsia-500/10",
      step: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
      reset: "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-900 dark:text-fuchsia-100",
      tag: "bg-violet-500/10 text-violet-800 dark:text-violet-200",
      checklist: "border-fuchsia-500/25 text-fuchsia-800 dark:text-fuchsia-200",
      primaryButton: "bg-violet-700 text-white hover:bg-violet-800 dark:bg-violet-500 dark:text-violet-950 dark:hover:bg-violet-400",
      modeButton: "border-violet-500/20 hover:bg-violet-500/10 hover:text-violet-800 dark:hover:text-violet-200",
      modeButtonActive: "border-violet-700 bg-violet-700 text-white hover:bg-violet-800 dark:border-violet-400 dark:bg-violet-500 dark:text-violet-950 dark:hover:bg-violet-400",
    },
  },
  custody: {
    label: "Corrections / custody",
    badge: "Order with restraint",
    icon: Users,
    focus: "Keep order without cruelty and remember that every confined person remains a person.",
    prayer:
      "Lord, set a guard over my mouth and my temper. Help me keep order with justice, restraint, and remembrance of every person’s dignity. Amen.",
    steps: [
      "Enter the unit with a settled face; do not let provocation choose your spirit.",
      "Use the least forceful lawful option that protects people and restores order.",
      "Watch for despair, manipulation, illness, and danger without becoming hard-hearted.",
    ],
    reset: "After the shift: leave the unit at the gate, pray for those still inside, and do one gentle thing at home on purpose.",
    suitedFor: ["Corrections", "Detention", "Jail staff", "Custody teams"],
    theme: {
      card: "border-slate-500/30 bg-gradient-to-br from-slate-500/10 via-card to-zinc-500/10",
      orbOne: "border-slate-400/25 bg-slate-400/10",
      orbTwo: "border-zinc-500/20 bg-zinc-500/10",
      badge: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
      icon: "bg-slate-500/10 text-slate-700 ring-1 ring-slate-500/25 dark:text-slate-300",
      focus: "border-slate-500/20 bg-slate-500/10",
      quote: "border-zinc-500/20 bg-zinc-950/5 dark:bg-zinc-500/10",
      step: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
      reset: "border-zinc-500/25 bg-zinc-500/10 text-zinc-900 dark:text-zinc-100",
      tag: "bg-slate-500/10 text-slate-800 dark:text-slate-200",
      checklist: "border-zinc-500/25 text-zinc-800 dark:text-zinc-200",
      primaryButton: "bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-300 dark:text-slate-950 dark:hover:bg-slate-200",
      modeButton: "border-slate-500/20 hover:bg-slate-500/10 hover:text-slate-800 dark:hover:text-slate-200",
      modeButtonActive: "border-slate-800 bg-slate-800 text-white hover:bg-slate-900 dark:border-slate-300 dark:bg-slate-300 dark:text-slate-950 dark:hover:bg-slate-200",
    },
  },
  chaplain: {
    label: "Chaplain / peer support",
    badge: "Presence before answers",
    icon: HeartHandshake,
    focus: "Bring prayerful presence without forcing words, fixing grief, or carrying everything alone.",
    prayer:
      "Holy Spirit, teach me when to speak, when to be silent, and when to simply remain. Make me a servant of peace and not the center of the moment. Amen.",
    steps: [
      "Arrive small: listen first, ask permission, and respect the chain of command.",
      "Offer a short prayer or blessing only when welcome; presence is already ministry.",
      "After trauma exposure, consult support instead of privately carrying every sorrow.",
    ],
    reset: "After the call: write one boundary, one grief, and one gratitude; place all three before God.",
    suitedFor: ["Chaplains", "Peer support", "Clergy", "CISM teams"],
    theme: {
      card: "border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-yellow-500/10",
      orbOne: "border-amber-400/25 bg-amber-400/10",
      orbTwo: "border-yellow-500/25 bg-yellow-500/10",
      badge: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
      icon: "bg-amber-500/10 text-amber-800 ring-1 ring-amber-500/25 dark:text-amber-300",
      focus: "border-amber-500/20 bg-amber-500/10",
      quote: "border-yellow-500/20 bg-yellow-950/5 dark:bg-yellow-500/10",
      step: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
      reset: "border-yellow-500/25 bg-yellow-500/10 text-yellow-900 dark:text-yellow-100",
      tag: "bg-amber-500/10 text-amber-900 dark:text-amber-200",
      checklist: "border-yellow-500/25 text-yellow-900 dark:text-yellow-200",
      primaryButton: "bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-400 dark:text-amber-950 dark:hover:bg-amber-300",
      modeButton: "border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-900 dark:hover:text-amber-200",
      modeButtonActive: "border-amber-700 bg-amber-700 text-white hover:bg-amber-800 dark:border-amber-400 dark:bg-amber-400 dark:text-amber-950 dark:hover:bg-amber-300",
    },
  },
};

export function DutyModeCard({ onOpenFieldManual }: { onOpenFieldManual?: () => void }) {
  const [mode, setMode] = useState<ResponderMode>("law");
  const active = responderModes[mode];
  const theme = active.theme;
  const Icon = active.icon;

  const checklist = useMemo(
    () => ["Prayer", "Safety", "Restraint", "Mercy", "Debrief"],
    [],
  );

  async function copyPrayer() {
    try {
      await navigator.clipboard.writeText(active.prayer);
      showSuccess(`${active.label} prayer copied.`);
    } catch {
      showError("Couldn't copy prayer.");
    }
  }

  async function copyBrief() {
    const brief = `${active.label}\n${active.focus}\n\nPrayer:\n${active.prayer}\n\nSteps:\n${active.steps
      .map((step, index) => `${index + 1}. ${step}`)
      .join("\n")}\n\nReset:\n${active.reset}`;

    try {
      await navigator.clipboard.writeText(brief);
      showSuccess(`${active.label} brief copied.`);
    } catch {
      showError("Couldn't copy brief.");
    }
  }

  return (
    <Card className={cn("overflow-hidden rounded-3xl shadow-sm transition-colors duration-300", theme.card)}>
      <div className="relative p-5 sm:p-6">
        <div className={cn("absolute -right-16 -top-16 h-44 w-44 rounded-full border transition-colors duration-300", theme.orbOne)} />
        <div className={cn("absolute -right-24 -top-24 h-60 w-60 rounded-full border transition-colors duration-300", theme.orbTwo)} />

        <div className="relative grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div>
            <Badge className={cn("rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-300", theme.badge)}>
              <Crosshair className="mr-1.5 h-3.5 w-3.5" /> First responder modes
            </Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Choose your field mode</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Role-specific watch briefs for public safety and emergency service work. Each occupation switches the card color, prayer, tactical focus, practical steps, and after-call reset.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(Object.keys(responderModes) as ResponderMode[]).map((key) => {
                const item = responderModes[key];
                const ItemIcon = item.icon;
                const selected = mode === key;
                return (
                  <Button
                    key={key}
                    type="button"
                    variant="outline"
                    className={cn(
                      "tap h-auto min-h-16 justify-start whitespace-normal rounded-2xl px-3 py-2 text-left transition-all duration-200",
                      selected ? item.theme.modeButtonActive : item.theme.modeButton,
                    )}
                    onClick={() => setMode(key)}
                  >
                    <ItemIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span>
                      <span className="block text-xs font-semibold leading-tight">{item.label}</span>
                      <span className="block text-[11px] font-normal opacity-80">{item.badge}</span>
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur">
            <div className="flex items-start gap-3">
              <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-colors duration-300", theme.icon)}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{active.badge}</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">{active.label}</h3>
              </div>
            </div>

            <p className={cn("mt-4 rounded-2xl border p-4 text-sm leading-relaxed text-foreground/90 transition-colors duration-300", theme.focus)}>
              {active.focus}
            </p>

            <blockquote className={cn("mt-3 rounded-2xl border p-4 text-sm leading-relaxed text-foreground/90 transition-colors duration-300", theme.quote)}>
              {active.prayer}
            </blockquote>

            <ol className="mt-4 grid gap-2 text-sm leading-relaxed text-muted-foreground">
              {active.steps.map((step, index) => (
                <li key={step} className="flex gap-2">
                  <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-colors duration-300", theme.step)}>
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className={cn("mt-4 rounded-2xl border p-3 transition-colors duration-300", theme.reset)}>
              <div className="flex items-start gap-2 text-sm leading-relaxed">
                <HeartPulse className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{active.reset}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {active.suitedFor.map((item) => (
                <Badge key={item} variant="secondary" className={cn("rounded-full px-3 py-1 text-xs font-medium", theme.tag)}>
                  {item}
                </Badge>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {checklist.map((item) => (
                <Badge key={item} variant="outline" className={cn("rounded-full px-3 py-1 text-xs font-medium", theme.checklist)}>
                  <CheckCircle2 className="mr-1 h-3 w-3" /> {item}
                </Badge>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" size="sm" className={cn("rounded-2xl", theme.primaryButton)} onClick={copyPrayer}>
                <Radio className="mr-2 h-4 w-4" /> Copy prayer
              </Button>
              <Button type="button" size="sm" variant="outline" className={cn("rounded-2xl", theme.modeButton)} onClick={copyBrief}>
                <Search className="mr-2 h-4 w-4" /> Copy brief
              </Button>
              <Button type="button" size="sm" variant="outline" className={cn("rounded-2xl", theme.modeButton)} onClick={onOpenFieldManual}>
                <HeartHandshake className="mr-2 h-4 w-4" /> Field manual
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

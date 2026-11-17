import type { LucideIcon } from "lucide-react";
import {
  Ambulance,
  Crosshair,
  Flag,
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
import { hallowCardClass, hallowGlowClass } from "@/components/app/hallowCard";

import { responderModeOrder, useResponderMode, type ResponderMode } from "@/lib/responderMode";
import { showError, showSuccess } from "@/utils/toast";

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
  civilian: {
    label: "Everyday life",
    badge: "Everyday faithfulness",
    icon: Users,
    focus: "Build watchfulness in ordinary life: home, work, school, family, stress, rest, and the next faithful step.",
    prayer:
      "Lord Jesus Christ, steady my heart in the ordinary duties of this day. Teach me to pray simply, act faithfully, and return to peace without fear. Amen.",
    steps: [
      "Pause before the next task: breathe once and name the next faithful action.",
      "Keep one small prayer rule today rather than trying to fix everything at once.",
      "If stress rises, step back, pray the Jesus Prayer, and ask for help when needed.",
    ],
    reset: "After pressure: unclench your hands, thank God for one mercy, and return to one simple duty.",
    suitedFor: ["Home", "Work", "School", "Everyday stress"],

    theme: {
      card: "candlelight-card border-primary/25 bg-gradient-to-br from-primary/12 via-card to-card/10",
      orbOne: "border-primary/20 bg-primary/10",
      orbTwo: "border-icon-gold/[0.58] bg-secondary/[0.58]",
      badge: "border-primary/35 bg-primary/12 text-liturgical-warm dark:text-liturgical-warm",
      icon: "bg-primary/12 text-liturgical-warm ring-1 ring-primary/30 dark:text-liturgical-warm",
      focus: "border-primary/20 bg-primary/10",
      quote: "border-primary/20 bg-primary/10",
      step: "bg-primary/10 text-liturgical-warm dark:text-liturgical-warm",
      reset: "border-primary/20 bg-primary/10 text-liturgical-warm dark:text-liturgical-warm",
      tag: "bg-primary/10 text-liturgical-warm dark:text-liturgical-warm",
      checklist: "border-primary/25 text-liturgical-warm dark:text-liturgical-warm",
      primaryButton: "gold-foil text-primary-foreground hover:brightness-110",
      modeButton: "border-primary/20 hover:bg-primary/10 hover:text-primary",
      modeButtonActive: "gold-foil border-primary text-primary-foreground hover:brightness-110",
    },
  },
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
      card: "border-accent/40 bg-gradient-to-br from-accent/15 via-card to-accent/10 dark:border-accent/40 dark:from-accent/50 dark:to-accent/20",
      orbOne: "border-accent/40 bg-accent/[0.14] dark:border-accent/40 dark:bg-accent/[0.14]",
      orbTwo: "border-accent/40 bg-accent/[0.14] dark:border-accent/40 dark:bg-accent/[0.14]",
      badge: "border-accent/40 bg-accent/[0.14] text-accent dark:border-accent/40 dark:bg-accent/[0.14] dark:text-accent",
      icon: "bg-accent/[0.14] text-accent ring-1 ring-byzantine-blue/[0.46] dark:bg-accent/[0.14] dark:text-accent dark:ring-byzantine-blue/[0.46]",
      focus: "border-accent/40 bg-accent/[0.14] dark:border-accent/40 dark:bg-accent/[0.14]",
      quote: "border-accent/40 bg-accent/[0.14] dark:border-accent/40 dark:bg-accent/[0.14]",
      step: "bg-accent/[0.14] text-accent dark:bg-accent/[0.14] dark:text-accent",
      reset: "border-accent/40 bg-accent/[0.14] text-accent dark:border-accent/40 dark:bg-accent/[0.14] dark:text-accent",
      tag: "bg-accent/[0.14] text-accent dark:bg-accent/[0.14] dark:text-accent",
      checklist: "border-accent/40 text-accent dark:border-accent/40 dark:text-accent",
      primaryButton: "bg-accent/[0.14] text-white hover:bg-accent/[0.14] dark:bg-accent/[0.14] dark:text-accent dark:hover:bg-accent/[0.14]",
      modeButton: "border-accent/40 hover:bg-accent/[0.14] hover:text-accent dark:border-accent/40 dark:hover:bg-accent/[0.14] dark:hover:text-accent",
      modeButtonActive: "border-accent/40 bg-accent/[0.14] text-white hover:bg-accent/[0.14] dark:border-accent/40 dark:bg-accent/[0.14] dark:text-accent dark:hover:bg-accent/[0.14]",
    },
  },
  military: {
    label: "Military",
    badge: "Mission with restraint",
    icon: Flag,
    focus: "Stay mission-ready while guarding humility, discipline, lawful obedience, and the souls entrusted to your left and right.",
    prayer:
      "Lord Jesus Christ, guard me in danger, steady me under orders, and keep my strength obedient to mercy, truth, and lawful duty. Protect my unit and those we are sent to defend. Amen.",
    steps: [
      "Before movement or watch: check gear, orders, buddy, and conscience.",
      "Keep discipline under stress: speak clearly, obey lawful command, and refuse needless cruelty.",
      "Remember the person beside you; courage includes checking on your team after the adrenaline drops.",
    ],
    reset: "After the mission or watch: secure your gear, thank God for preservation, pray for your unit, and hand over what you cannot carry alone.",
    suitedFor: ["Active duty", "Guard", "Reserve", "Veterans"],
    theme: {
      card: "border-success/40 bg-gradient-to-br from-success/10 via-card to-card/10",
      orbOne: "border-success/40 bg-success/[0.14]",
      orbTwo: "border-border/[0.72] bg-card",
      badge: "border-success/40 bg-success/[0.14] text-success dark:text-success",
      icon: "bg-success/[0.14] text-success ring-1 ring-byzantine-blue/[0.46] dark:text-success",
      focus: "border-success/40 bg-success/[0.14]",
      quote: "border-border/[0.72] bg-card dark:bg-card",
      step: "bg-success/[0.14] text-success dark:text-success",
      reset: "border-border/[0.72] bg-card text-foreground dark:text-foreground",
      tag: "bg-success/[0.14] text-success dark:text-success",
      checklist: "border-border/[0.72] text-foreground dark:text-foreground",
      primaryButton: "bg-success/[0.14] text-white hover:bg-success/[0.14] dark:bg-success/[0.14] dark:text-success dark:hover:bg-success/[0.14]",
      modeButton: "border-success/40 hover:bg-success/[0.14] hover:text-success dark:hover:text-success",
      modeButtonActive: "border-success/40 bg-success/[0.14] text-white hover:bg-success/[0.14] dark:border-success/40 dark:bg-success/[0.14] dark:text-success dark:hover:bg-success/[0.14]",
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
      card: "border-cinnabar/[0.44] bg-gradient-to-br from-cinnabar/10 via-card to-cinnabar/10",
      orbOne: "border-cinnabar/[0.44] bg-cinnabar/[0.14]",
      orbTwo: "border-cinnabar/[0.44] bg-cinnabar/[0.14]",
      badge: "border-cinnabar/[0.44] bg-cinnabar/[0.14] text-cinnabar dark:text-cinnabar",
      icon: "bg-cinnabar/[0.14] text-cinnabar ring-1 ring-cinnabar/[0.48] dark:text-cinnabar",
      focus: "border-cinnabar/[0.44] bg-cinnabar/[0.14]",
      quote: "border-cinnabar/[0.44] bg-cinnabar/[0.14] dark:bg-cinnabar/[0.14]",
      step: "bg-cinnabar/[0.14] text-cinnabar dark:text-cinnabar",
      reset: "border-cinnabar/[0.44] bg-cinnabar/[0.14] text-cinnabar dark:text-cinnabar",
      tag: "bg-cinnabar/[0.14] text-cinnabar dark:text-cinnabar",
      checklist: "border-cinnabar/[0.44] text-cinnabar dark:text-cinnabar",
      primaryButton: "bg-cinnabar/[0.14] text-white hover:bg-cinnabar/[0.14] dark:bg-cinnabar/[0.14] dark:text-cinnabar dark:hover:bg-cinnabar/[0.14]",
      modeButton: "border-cinnabar/[0.44] hover:bg-cinnabar/[0.14] hover:text-cinnabar dark:hover:text-cinnabar",
      modeButtonActive: "border-cinnabar/[0.44] bg-cinnabar/[0.14] text-white hover:bg-cinnabar/[0.14] dark:border-cinnabar/[0.44] dark:bg-cinnabar/[0.14] dark:text-cinnabar dark:hover:bg-cinnabar/[0.14]",
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
      card: "border-border/[0.72] bg-gradient-to-br from-white via-card to-cinnabar/5 dark:border-border/[0.72] dark:from-white/10 dark:via-card dark:to-cinnabar/10",
      orbOne: "border-border/[0.72] bg-white/50 dark:border-border/[0.72] dark:bg-white/10",
      orbTwo: "border-cinnabar/[0.44] bg-cinnabar/[0.14]",
      badge: "border-border/[0.72] bg-white text-foreground dark:border-border/[0.72] dark:bg-white/10 dark:text-white",
      icon: "bg-white text-cinnabar ring-1 ring-ring/[0.48] dark:bg-white/10 dark:text-cinnabar dark:ring-ring/[0.48]",
      focus: "border-border/[0.72] bg-white/80 dark:border-border/[0.72] dark:bg-white/10",
      quote: "border-cinnabar/[0.44] bg-white/70 dark:bg-white/10",
      step: "bg-white text-cinnabar ring-1 ring-ring/[0.48] dark:bg-white/10 dark:text-cinnabar dark:ring-ring/[0.48]",
      reset: "border-cinnabar/[0.44] bg-white/80 text-foreground dark:bg-white/10 dark:text-white",
      tag: "bg-white text-foreground ring-1 ring-ring/[0.48] dark:bg-white/10 dark:text-white dark:ring-ring/[0.48]",
      checklist: "border-border/[0.72] text-foreground dark:border-border/[0.72] dark:text-white",
      primaryButton: "bg-white text-foreground ring-1 ring-ring/[0.48] hover:bg-card dark:bg-white dark:text-foreground dark:hover:bg-card",
      modeButton: "border-border/[0.72] hover:bg-white hover:text-foreground dark:border-border/[0.72] dark:hover:bg-white/10 dark:hover:text-white",
      modeButtonActive: "border-border/[0.72] bg-white text-foreground hover:bg-card dark:border-border/[0.72] dark:bg-white dark:text-foreground dark:hover:bg-card",
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
      card: "border-border/[0.72] bg-gradient-to-br from-primary/10 via-card to-primary/10",
      orbOne: "border-border/[0.72] bg-secondary/[0.48]",
      orbTwo: "border-border/[0.72] bg-secondary/[0.48]",
      badge: "border-border/[0.72] bg-secondary/[0.48] text-primary dark:text-primary",
      icon: "bg-secondary/[0.48] text-primary ring-1 ring-ring/[0.48] dark:text-primary",
      focus: "border-border/[0.72] bg-secondary/[0.48]",
      quote: "border-border/[0.72] bg-secondary/[0.48] dark:bg-secondary/[0.48]",
      step: "bg-secondary/[0.48] text-primary dark:text-primary",
      reset: "border-border/[0.72] bg-secondary/[0.48] text-primary dark:text-primary",
      tag: "bg-secondary/[0.48] text-primary dark:text-primary",
      checklist: "border-border/[0.72] text-primary dark:text-primary",
      primaryButton: "bg-secondary/[0.48] text-white hover:bg-secondary/[0.48] dark:bg-secondary/[0.48] dark:text-primary dark:hover:bg-secondary/[0.48]",
      modeButton: "border-border/[0.72] hover:bg-secondary/[0.48] hover:text-primary dark:hover:text-primary",
      modeButtonActive: "border-border/[0.72] bg-secondary/[0.48] text-white hover:bg-secondary/[0.48] dark:border-border/[0.72] dark:bg-secondary/[0.48] dark:text-primary dark:hover:bg-secondary/[0.48]",
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
      card: "border-border/[0.72] bg-gradient-to-br from-card/10 via-card to-card/10",
      orbOne: "border-border/[0.72] bg-card",
      orbTwo: "border-border/[0.72] bg-card",
      badge: "border-border/[0.72] bg-card text-foreground dark:text-foreground",
      icon: "bg-card text-foreground ring-1 ring-ring/[0.48] dark:text-foreground",
      focus: "border-border/[0.72] bg-card",
      quote: "border-border/[0.72] bg-card dark:bg-card",
      step: "bg-card text-foreground dark:text-foreground",
      reset: "border-border/[0.72] bg-card text-foreground dark:text-foreground",
      tag: "bg-card text-foreground dark:text-foreground",
      checklist: "border-border/[0.72] text-foreground dark:text-foreground",
      primaryButton: "bg-card text-white hover:bg-card dark:bg-card dark:text-foreground dark:hover:bg-card",
      modeButton: "border-border/[0.72] hover:bg-card hover:text-foreground dark:hover:text-foreground",
      modeButtonActive: "border-border/[0.72] bg-card text-white hover:bg-card dark:border-border/[0.72] dark:bg-card dark:text-foreground dark:hover:bg-card",
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
      card: "border-icon-gold/[0.58] bg-gradient-to-br from-icon-gold/10 via-card to-icon-gold/10",
      orbOne: "border-icon-gold/[0.58] bg-secondary/[0.58]",
      orbTwo: "border-icon-gold/[0.58] bg-secondary/[0.58]",
      badge: "border-icon-gold/[0.58] bg-secondary/[0.58] text-liturgical-warm dark:text-liturgical-warm",
      icon: "bg-secondary/[0.58] text-liturgical-warm ring-1 ring-icon-gold/50 dark:text-liturgical-warm",
      focus: "border-icon-gold/[0.58] bg-secondary/[0.58]",
      quote: "border-icon-gold/[0.58] bg-secondary/[0.58] dark:bg-secondary/[0.58]",
      step: "bg-secondary/[0.58] text-liturgical-warm dark:text-liturgical-warm",
      reset: "border-icon-gold/[0.58] bg-secondary/[0.58] text-liturgical-warm dark:text-liturgical-warm",
      tag: "bg-secondary/[0.58] text-liturgical-warm dark:text-liturgical-warm",
      checklist: "border-icon-gold/[0.58] text-liturgical-warm dark:text-liturgical-warm",
      primaryButton: "bg-secondary/[0.58] text-white hover:bg-secondary/[0.58] dark:bg-secondary/[0.58] dark:text-liturgical-warm dark:hover:bg-secondary/[0.58]",
      modeButton: "border-icon-gold/[0.58] hover:bg-secondary/[0.58] hover:text-liturgical-warm dark:hover:text-liturgical-warm",
      modeButtonActive: "border-icon-gold/[0.58] bg-secondary/[0.58] text-white hover:bg-secondary/[0.58] dark:border-icon-gold/[0.58] dark:bg-secondary/[0.58] dark:text-liturgical-warm dark:hover:bg-secondary/[0.58]",
    },
  },
};

export function DutyModeCard({ onOpenFieldManual }: { onOpenFieldManual?: () => void }) {
  const [mode, setMode] = useResponderMode();
  const active = responderModes[mode];
  const theme = active.theme;
  const Icon = active.icon;

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
    <Card className={hallowCardClass}>
      <div className={hallowGlowClass} />
      <div className="relative z-10">

        <div className="relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))] items-start gap-5">
          <div>
            <Badge className={cn("rounded-full border px-3 py-1 text-xs font-bold transition-colors duration-300", theme.badge)}>
              <Crosshair className="mr-1.5 h-3.5 w-3.5" /> Life & service modes
            </Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Choose your mode</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Prayer, focus, and reset language for ordinary life, public safety, and service work.
            </p>

            <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))] gap-2">
              {responderModeOrder.map((key) => {
                const item = responderModes[key];
                const ItemIcon = item.icon;
                const selected = mode === key;
                return (
                  <Button
                    key={key}
                    type="button"
                    variant="outline"
                    className={cn(
                      "tap h-auto min-h-16 justify-start whitespace-normal rounded-2xl px-3 py-2 text-left leading-tight transition-all duration-200",
                      selected ? item.theme.modeButtonActive : item.theme.modeButton,
                    )}
                    onClick={() => setMode(key)}
                  >
                    <ItemIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="min-w-0 flex-1 break-words">
                      <span className="block text-xs font-semibold leading-tight">{item.label}</span>
                      <span className="block text-xs font-normal leading-tight opacity-80">{item.badge}</span>
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
              <div className="min-w-0 break-words">
                <p className="text-xs font-bold text-muted-foreground">{active.badge}</p>
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
                  <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors duration-300", theme.step)}>
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

            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" size="sm" className={cn("rounded-2xl", theme.primaryButton)} onClick={copyPrayer}>
                <Radio className="mr-2 h-4 w-4" /> Copy prayer
              </Button>
              <Button type="button" size="sm" variant="outline" className={cn("rounded-2xl", theme.modeButton)} onClick={copyBrief}>
                <Search className="mr-2 h-4 w-4" /> Copy brief
              </Button>
              {onOpenFieldManual ? (
                <Button type="button" size="sm" variant="outline" className={cn("rounded-2xl", theme.modeButton)} onClick={onOpenFieldManual}>
                  <HeartHandshake className="mr-2 h-4 w-4" /> Life & service guide
                </Button>
              ) : null}

            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

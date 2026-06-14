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
import { showError, showSuccess } from "@/utils/toast";

type ResponderMode = "law" | "fire" | "ems" | "dispatch" | "custody" | "chaplain";

type ResponderBrief = {
  label: string;
  badge: string;
  icon: LucideIcon;
  focus: string;
  prayer: string;
  steps: string[];
  reset: string;
  suitedFor: string[];
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
  },
};

export function DutyModeCard({ onOpenFieldManual }: { onOpenFieldManual?: () => void }) {
  const [mode, setMode] = useState<ResponderMode>("law");
  const active = responderModes[mode];
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
    <Card className="overflow-hidden rounded-3xl border-primary/20 bg-card shadow-sm">
      <div className="relative p-5 sm:p-6">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-primary/15" />
        <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full border border-accent/15" />

        <div className="relative grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div>
            <Badge className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <Crosshair className="mr-1.5 h-3.5 w-3.5" /> First responder modes
            </Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Choose your field mode</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Role-specific watch briefs for public safety and emergency service work: short prayer, tactical focus, practical steps, and a reset after the call.
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
                    variant={selected ? "default" : "outline"}
                    className="tap h-auto min-h-16 justify-start whitespace-normal rounded-2xl px-3 py-2 text-left"
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

          <div className="rounded-3xl border border-border/60 bg-background/60 p-4 shadow-sm backdrop-blur">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{active.badge}</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">{active.label}</h3>
              </div>
            </div>

            <p className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm leading-relaxed text-foreground/90">
              {active.focus}
            </p>

            <blockquote className="mt-3 rounded-2xl border border-border/60 bg-muted/25 p-4 text-sm leading-relaxed text-foreground/90">
              {active.prayer}
            </blockquote>

            <ol className="mt-4 grid gap-2 text-sm leading-relaxed text-muted-foreground">
              {active.steps.map((step, index) => (
                <li key={step} className="flex gap-2">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-3">
              <div className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{active.reset}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {active.suitedFor.map((item) => (
                <Badge key={item} variant="secondary" className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {item}
                </Badge>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {checklist.map((item) => (
                <Badge key={item} variant="outline" className="rounded-full border-border/60 px-3 py-1 text-xs font-medium">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> {item}
                </Badge>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" size="sm" className="rounded-2xl" onClick={copyPrayer}>
                <Radio className="mr-2 h-4 w-4" /> Copy prayer
              </Button>
              <Button type="button" size="sm" variant="outline" className="rounded-2xl border-border/60" onClick={copyBrief}>
                <Search className="mr-2 h-4 w-4" /> Copy brief
              </Button>
              <Button type="button" size="sm" variant="outline" className="rounded-2xl border-border/60" onClick={onOpenFieldManual}>
                <HeartHandshake className="mr-2 h-4 w-4" /> Field manual
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

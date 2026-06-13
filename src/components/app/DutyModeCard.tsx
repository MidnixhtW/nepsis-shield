import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Crosshair, HeartHandshake, Radio, ShieldCheck, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { showError, showSuccess } from "@/utils/toast";

type DutyMode = "watch" | "stress" | "after" | "field-fast";

const dutyModes: Record<
  DutyMode,
  {
    label: string;
    badge: string;
    icon: typeof ShieldCheck;
    prayer: string;
    steps: string[];
  }
> = {
  watch: {
    label: "Before watch",
    badge: "Start clean",
    icon: ShieldCheck,
    prayer:
      "Lord Jesus Christ, guard my mind and my post. Make me watchful without fear, firm without anger, and merciful without weakness. Amen.",
    steps: ["Cross yourself slowly", "Pray the Jesus Prayer 3 times", "Name one person you must protect today"],
  },
  stress: {
    label: "Stress spike",
    badge: "60-second reset",
    icon: AlertTriangle,
    prayer:
      "Lord Jesus Christ, Son of God, have mercy on me. Give me one clear breath, one honest word, and one faithful next step. Amen.",
    steps: ["Breathe in silence", "Relax your jaw and hands", "Do the next right thing, not the whole future"],
  },
  after: {
    label: "After action",
    badge: "Return to peace",
    icon: CheckCircle2,
    prayer:
      "Glory to You, O God, for preserving us. Heal what was wounded, forgive what was sinful, and teach me to end this day in repentance and gratitude. Amen.",
    steps: ["Give thanks before debriefing yourself", "Check on someone else", "Write one sentence of truth before sleep"],
  },
  "field-fast": {
    label: "Field fasting",
    badge: "No scruples",
    icon: Utensils,
    prayer:
      "Lord, receive my obedience and my limits. Teach me fasting with humility, food with gratitude, and mercy above judgment. Amen.",
    steps: ["Follow lawful orders and health needs", "Keep the spirit of the fast: prayer, restraint, mercy", "Ask your priest for a practical field rule"],
  },
};

export function DutyModeCard({ onOpenFieldManual }: { onOpenFieldManual?: () => void }) {
  const [mode, setMode] = useState<DutyMode>("watch");
  const active = dutyModes[mode];
  const Icon = active.icon;

  const checklist = useMemo(
    () => ["Prayer", "Restraint", "Mercy", "Safety", "Pastoral care"],
    [],
  );

  async function copyPrayer() {
    try {
      await navigator.clipboard.writeText(active.prayer);
      showSuccess("Duty prayer copied.");
    } catch {
      showError("Couldn't copy prayer.");
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
              <Crosshair className="mr-1.5 h-3.5 w-3.5" /> Duty mode
            </Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Orthodox field-ready rhythm</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A fast-access watch brief for military, first responders, public safety, chaplains, medical teams, and all who keep watch: short prayer, clear action, and no guilt when duty limits a normal rule.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">

              {(Object.keys(dutyModes) as DutyMode[]).map((key) => {
                const item = dutyModes[key];
                const ItemIcon = item.icon;
                const selected = mode === key;
                return (
                  <Button
                    key={key}
                    type="button"
                    variant={selected ? "default" : "outline"}
                    className="tap h-auto min-h-14 justify-start whitespace-normal rounded-2xl px-3 py-2 text-left"
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

            <blockquote className="mt-4 rounded-2xl border border-border/60 bg-muted/25 p-4 text-sm leading-relaxed text-foreground/90">
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

            <div className="mt-4 flex flex-wrap gap-2">
              {checklist.map((item) => (
                <Badge key={item} variant="secondary" className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {item}
                </Badge>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" size="sm" className="rounded-2xl" onClick={copyPrayer}>
                <Radio className="mr-2 h-4 w-4" /> Copy prayer
              </Button>
              <Button type="button" size="sm" variant="outline" className="rounded-2xl" onClick={onOpenFieldManual}>
                <HeartHandshake className="mr-2 h-4 w-4" /> Field manual
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

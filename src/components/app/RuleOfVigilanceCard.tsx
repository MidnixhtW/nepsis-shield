import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronDown, Clock3, Compass, Eye, MoonStar, Plus, ShieldCheck, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RuleVariantPicker } from "@/components/app/RuleVariantPicker";
import { getStoredResponderMode } from "@/lib/responderMode";
import {
  RULE_OF_VIGILANCE_CHANGED_EVENT,
  buildRuleOfVigilance,
  getStoredRuleOfVigilance,
  ruleNeeds,
  setStoredRuleOfVigilance,
  type RuleOfVigilance,
  type RuleTarget,
} from "@/lib/ruleOfVigilance";

import type { AppSection } from "@/components/app/AppShell";

function defaultRule() {
  return buildRuleOfVigilance({
    need: "peace",
    rhythm: "morning",
    role: getStoredResponderMode(),
  });
}

function RuleRow({ icon, label, body }: { icon: React.ReactNode; label: string; body: string }) {
  return (
    <div className="rounded-3xl bg-background/45 p-4 shadow-[inset_0_1px_0_hsl(42_92%_58%/0.10)]">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-[0.16em]">{label}</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{body}</p>
    </div>
  );
}

export function RuleOfVigilanceCard({
  onNavigate,
  compact = false,
}: {
  onNavigate?: (to: { section: AppSection; tab?: string; read?: string }) => void;
  /** During a fasting season the journey leads, so the rule starts collapsed to one line. */
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [storedRule, setStoredRule] = useState<RuleOfVigilance | null>(() => getStoredRuleOfVigilance());

  useEffect(() => {
    function refreshRule() {
      setStoredRule(getStoredRuleOfVigilance());
    }

    window.addEventListener(RULE_OF_VIGILANCE_CHANGED_EVENT, refreshRule);
    window.addEventListener("storage", refreshRule);
    window.addEventListener("focus", refreshRule);
    return () => {
      window.removeEventListener(RULE_OF_VIGILANCE_CHANGED_EVENT, refreshRule);
      window.removeEventListener("storage", refreshRule);
      window.removeEventListener("focus", refreshRule);
    };
  }, []);

  const [choosingVersion, setChoosingVersion] = useState(false);
  // Rebuild so rules saved before versions existed gain their practice and destination.
  const rule = useMemo(() => {
    const base = storedRule ?? defaultRule();
    return buildRuleOfVigilance({ needs: ruleNeeds(base), rhythm: base.rhythm, role: base.role, variant: base.variant });
  }, [storedRule]);

  function chooseVersion(variant: string) {
    const next = buildRuleOfVigilance({ needs: ruleNeeds(rule), rhythm: rule.rhythm, role: rule.role, variant });
    setStoredRuleOfVigilance(next);
    setStoredRule(next);
  }

  function begin() {
    const target: RuleTarget = rule.target ?? { section: "pray", tab: "daily" };
    onNavigate?.(target);
  }

  if (compact && !expanded) {
    return (
      <Card className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border p-4 sm:p-5">
        <Compass className="h-5 w-5 shrink-0 text-accent" />
        <p className="min-w-0 flex-1 text-sm">
          <span className="text-muted-foreground">Your rule: </span>
          <span className="font-semibold">{rule.title}</span>
          <span className="text-muted-foreground"> · {rule.variantLabel}</span>
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" className="rounded-full" aria-expanded={false} onClick={() => setExpanded(true)}>
            Show rule
          </Button>
          {onNavigate ? (
            <Button type="button" size="sm" className="rounded-full" onClick={begin}>
              Begin <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </Card>
    );
  }

  return (
    <Card className="candlelight-card rounded-[2rem] border p-5 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <div className="min-w-0">
          <div className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Compass className="mr-1.5 h-3.5 w-3.5" /> Today’s Rule
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{rule.title}</h2>
          <button
            type="button"
            aria-expanded={choosingVersion}
            onClick={() => setChoosingVersion((open) => !open)}
            className="mt-2 inline-flex items-center gap-1 rounded-md text-sm font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {rule.variantLabel} · Change version
            <ChevronDown className={"h-4 w-4 transition-transform " + (choosingVersion ? "rotate-180" : "")} />
          </button>
          {choosingVersion ? (
            <RuleVariantPicker need={rule.need} value={rule.variant} onChange={chooseVersion} className="mt-3 sm:grid-cols-1" />
          ) : null}
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{rule.pastoralNote}</p>
          {onNavigate ? (
            <Button type="button" className="gold-foil mt-6 h-12 rounded-full px-6 font-bold text-primary-foreground" onClick={begin}>
              {rule.primaryAction}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="mt-6 inline-flex min-h-12 items-center rounded-full border border-dashed border-border/70 bg-muted/30 px-6 text-sm font-semibold text-muted-foreground">
              {rule.primaryAction}
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">

          <RuleRow icon={<Sun className="h-4 w-4" />} label="Morning" body={rule.morning} />
          <RuleRow icon={<Clock3 className="h-4 w-4" />} label="Midday" body={rule.midday} />
          <RuleRow icon={<MoonStar className="h-4 w-4" />} label="Evening" body={rule.evening} />
          <RuleRow icon={<ShieldCheck className="h-4 w-4" />} label="Pressure" body={rule.underPressure} />
          {rule.practice ? <RuleRow icon={<Eye className="h-4 w-4" />} label="Focus" body={rule.practice} /> : null}
          {(rule.also ?? []).map((item) => (
            <RuleRow key={item.need} icon={<Plus className="h-4 w-4" />} label={`Also: ${item.label}`} body={item.body} />
          ))}
        </div>
      </div>
    </Card>
  );
}

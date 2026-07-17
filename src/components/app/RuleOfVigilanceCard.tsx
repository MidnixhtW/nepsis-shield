import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3, Compass, MoonStar, ShieldCheck, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getStoredResponderMode } from "@/lib/responderMode";
import {
  RULE_OF_VIGILANCE_CHANGED_EVENT,
  buildRuleOfVigilance,
  getStoredRuleOfVigilance,
  type RuleOfVigilance,
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
}: {
  onNavigate?: (to: { section: AppSection; tab?: string; read?: string }) => void;
}) {
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

  const rule = useMemo(() => storedRule ?? defaultRule(), [storedRule]);

  function begin() {
    if (rule.need === "scripture") {
      onNavigate?.({ section: "read", read: "daily" });
      return;
    }
    if (rule.need === "sleep") {
      onNavigate?.({ section: "pray", tab: "sleep" });
      return;
    }
    if (rule.need === "confession") {
      onNavigate?.({ section: "pray", tab: "prep" });
      return;
    }
    if (rule.need === "fasting") {
      onNavigate?.({ section: "today" });
      return;
    }
    onNavigate?.({ section: "pray", tab: "daily" });
  }

  return (
    <Card className="candlelight-card rounded-[2rem] border p-5 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <div className="min-w-0">
          <div className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Compass className="mr-1.5 h-3.5 w-3.5" /> Today’s Rule
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{rule.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{rule.pastoralNote}</p>
          <Button type="button" className="gold-foil mt-6 h-12 rounded-full px-6 font-bold text-primary-foreground" onClick={begin}>
            {rule.primaryAction}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <RuleRow icon={<Sun className="h-4 w-4" />} label="Morning" body={rule.morning} />
          <RuleRow icon={<Clock3 className="h-4 w-4" />} label="Midday" body={rule.midday} />
          <RuleRow icon={<MoonStar className="h-4 w-4" />} label="Evening" body={rule.evening} />
          <RuleRow icon={<ShieldCheck className="h-4 w-4" />} label="Pressure" body={rule.underPressure} />
        </div>
      </div>
    </Card>
  );
}

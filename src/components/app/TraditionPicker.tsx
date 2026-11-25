import { Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";
import { choiceHaptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { getTradition, markTraditionChosen, traditionChosen, traditionPatch, TRADITION_OPTIONS, type Tradition } from "@/lib/tradition";

// "How do you pray?" One answer sets the jurisdiction, the Western Rite switch and the calendar for Melkite and
// Byzantine Catholic parishes, so labels, fasting wording and church links follow it.
// Until the person answers, nothing is checked: a Melkite should not open the question with "Orthodox" already chosen.
// quiet: inside the setup screens, where the check mark is confirmation enough and a toast would cover the Continue button.
export function TraditionPicker({ onChosen, quiet = false }: { onChosen?: (tradition: Tradition) => void; quiet?: boolean }) {
  const { settings, updateSettings } = useSettings();
  const current = traditionChosen(settings) ? getTradition(settings) : null;
  return (
    <div role="radiogroup" aria-label="How do you pray?" className="border-t border-border/80">
      {TRADITION_OPTIONS.map((option) => {
        const selected = current === option.id;
        return (
          <div key={option.id} className="border-b border-border/80">
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => {
                choiceHaptic();
                updateSettings(traditionPatch(option.id, settings));
                markTraditionChosen();
                if (!selected && !quiet) toast({ title: `Set to ${option.title}`, description: "You can change this anytime in Settings." });
                onChosen?.(option.id);
              }}
              className="flex min-h-14 w-full items-center gap-3 py-3 text-left transition-colors active:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="min-w-0 flex-1">
                <span className={cn("block font-display text-lg", selected && "text-accent")}>{option.title}</span>
                <span className="block text-sm text-muted-foreground">{option.description}</span>
              </span>
              <Check aria-hidden className={cn("h-5 w-5 shrink-0 text-accent", selected ? "opacity-100" : "opacity-0")} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/** Asked once on Today, until the person answers or sets their church in Settings. */
export function TraditionPrompt({ onAnswered }: { onAnswered: () => void }) {
  return (
    <section aria-labelledby="tradition-title" className="px-1 text-left">
      <h2 id="tradition-title" className="text-2xl">How do you pray?</h2>
      <p className="mt-1 text-sm text-muted-foreground">The prayers, fasting notes and church links follow your answer. You can change it in Settings.</p>
      <div className="mt-3">
        <TraditionPicker onChosen={onAnswered} />
      </div>
    </section>
  );
}

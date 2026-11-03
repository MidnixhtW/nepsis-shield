import { cn } from "@/lib/utils";
import { ruleVariants, type VigilanceNeed } from "@/lib/ruleOfVigilance";

// Lets someone pick which version of their rule to keep, e.g. "Daily examen" or "Preparing for confession".
export function RuleVariantPicker({
  need,
  value,
  onChange,
  className,
}: {
  need: VigilanceNeed;
  value?: string;
  onChange: (variant: string) => void;
  className?: string;
}) {
  const variants = ruleVariants[need];
  const active = variants.find((variant) => variant.id === value)?.id ?? variants[0].id;

  return (
    <div role="radiogroup" aria-label="Version of this rule" className={cn("grid gap-2 sm:grid-cols-3", className)}>
      {variants.map((variant) => {
        const selected = variant.id === active;
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(variant.id)}
            className={cn(
              "rounded-2xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected ? "border-accent/60 bg-accent/10" : "border-border/60 bg-background/40 hover:border-accent/35",
            )}
          >
            <span className={cn("block text-sm font-semibold", selected ? "text-accent" : "text-foreground")}>{variant.label}</span>
            <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{variant.description}</span>
          </button>
        );
      })}
    </div>
  );
}

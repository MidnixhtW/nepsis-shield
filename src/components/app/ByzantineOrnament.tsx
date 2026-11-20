import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { cn } from "@/lib/utils";

export function ByzantineDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center gap-3 text-[hsl(var(--icon-gold))]", className)}>
      <span className="h-px flex-1 bg-[hsl(var(--icon-gold)/0.34)]" />
      <span className="grid h-7 w-7 place-items-center rounded-full border border-[hsl(var(--icon-gold)/0.5)] bg-card shadow-sm">
        <OrthodoxCrossIcon className="h-3 w-3" />
      </span>
      <span className="h-px flex-1 bg-[hsl(var(--icon-gold)/0.34)]" />
    </div>
  );
}

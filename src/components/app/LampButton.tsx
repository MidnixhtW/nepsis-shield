import { VigilLampIcon } from "@/components/app/OrthodoxMotifs";
import { toggleLamp } from "@/lib/vigilLamps";
import { cn } from "@/lib/utils";

// The lamp beside a name. Lit, it glows gold with a slow flicker (still for reduced motion); unlit, it is a quiet outline.
export function LampButton({ id, name, lit, className }: { id: string; name: string; lit: boolean; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={lit}
      aria-label={lit ? `Lamp lit for ${name}` : `Light a lamp for ${name}`}
      title={lit ? "Lit until morning" : "Light a lamp"}
      onClick={() => toggleLamp(id)}
      className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        lit ? "" : "text-muted-foreground hover:bg-accent/10 hover:text-foreground",
        className,
      )}
    >
      <VigilLampIcon aria-hidden className={cn("h-6 w-6", lit && "lamp-lit")} />
    </button>
  );
}

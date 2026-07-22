import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ByzantineDivider } from "@/components/app/ByzantineOrnament";
import { GospelBookIcon, VigilLampIcon } from "@/components/app/OrthodoxMotifs";

export function OrthodoxHero({
  onAction,
}: {
  onAction?: (to: { section: "today" | "pray" | "read" | "learn"; tab?: string; read?: string }) => void;
}) {
  return (
    <section className="orthodox-hero relative overflow-hidden rounded-lg border border-border bg-card p-6 text-center shadow-sm sm:p-8 lg:p-10">
      <div className="mx-auto max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <VigilLampIcon className="h-3.5 w-3.5 text-[hsl(var(--icon-gold))]" /> A quiet place to begin
        </span>

        <h1 className="mt-7 text-4xl font-semibold leading-tight tracking-wide text-foreground sm:text-5xl lg:text-6xl">
          Return to what is essential.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          Pray simply, receive today&apos;s Scripture, and carry one faithful step into the day.
        </p>

        <figure className="icon-window mx-auto mt-8 max-w-2xl rounded-lg border border-border bg-background/45 p-2 shadow-sm">
          <img
            src="/assets/byzantine-deesis.png"
            alt="Byzantine-inspired Deesis composition with Christ, the Theotokos, and Saint John the Forerunner"
            className="h-auto w-full rounded-md object-contain"
          />
          <figcaption className="px-3 pb-1 pt-3 text-xs leading-relaxed text-muted-foreground">
            A Byzantine-inspired Deesis: Christ at the center, with the Theotokos and the Forerunner in prayer.
          </figcaption>
        </figure>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            className="h-12 rounded-lg px-5 font-semibold shadow-sm"
            onClick={() => onAction?.({ section: "pray", tab: "daily" })}
          >
            Begin daily prayer <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.6} />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-lg border-border bg-background/45 px-5 shadow-none hover:bg-muted"
            onClick={() => onAction?.({ section: "read", read: "daily" })}
          >
            <GospelBookIcon className="mr-2 h-4 w-4 text-[hsl(var(--icon-gold))]" /> Today&apos;s readings
          </Button>
        </div>

        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onAction?.({ section: "pray", tab: "counter" })}
        >
          <RotateCcw className="h-4 w-4" strokeWidth={1.6} /> Need a one-minute reset?
        </button>

        <ByzantineDivider className="mx-auto mt-9 max-w-md" />

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {["Prayer", "Scripture", "Mercy"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-border bg-background/45 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

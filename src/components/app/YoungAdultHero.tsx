import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ByzantineDivider } from "@/components/app/ByzantineOrnament";
import { GospelBookIcon, VigilLampIcon } from "@/components/app/OrthodoxMotifs";
import { ORTHODOX_ICONOGRAPHY } from "@/lib/orthodoxIconography";

export function OrthodoxHero({
  onAction,
}: {
  onAction?: (to: { section: "today" | "pray" | "read" | "learn"; tab?: string; read?: string }) => void;
}) {

  return (
    <section className="orthodox-hero relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 text-center shadow-sm sm:p-8 lg:p-10">
      <div className="mx-auto max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.07] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
          <VigilLampIcon className="h-3.5 w-3.5 text-[hsl(var(--icon-gold))]" /> A quiet place to begin
        </span>

        <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
          Return to what is essential.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          Pray simply, receive today&apos;s Scripture, and carry one faithful step into the day.
        </p>

        <figure className="icon-window mx-auto mt-7 max-w-2xl overflow-hidden rounded-2xl border border-border bg-background/45 p-2 shadow-sm">

          <img
            src={ORTHODOX_ICONOGRAPHY.deesis.imageUrl}
            alt={ORTHODOX_ICONOGRAPHY.deesis.alt}
            className="h-auto w-full rounded-md object-contain"
          />
          <figcaption className="px-3 pb-1 pt-3 text-xs leading-relaxed text-muted-foreground">
            <a
              href={ORTHODOX_ICONOGRAPHY.deesis.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-primary/40 underline-offset-2 hover:text-foreground"
            >
              {ORTHODOX_ICONOGRAPHY.deesis.credit}
            </a>
          </figcaption>
        </figure>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            className="h-12 rounded-xl px-5 font-bold shadow-[0_12px_30px_hsl(var(--primary)/0.2)]"
            onClick={() => onAction?.({ section: "pray", tab: "daily" })}
          >
            Begin daily prayer <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.8} />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl border-border/70 bg-background/45 px-5 font-semibold shadow-none backdrop-blur hover:border-primary/30 hover:bg-muted/70"
            onClick={() => onAction?.({ section: "read", read: "daily" })}
          >
            <GospelBookIcon className="mr-2 h-4 w-4 text-[hsl(var(--icon-gold))]" /> Today&apos;s readings
          </Button>
        </div>

        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

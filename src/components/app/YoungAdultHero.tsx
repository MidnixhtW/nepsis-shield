import { ArrowRight, BookOpen, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { PremiumHeroShell } from "@/components/app/PremiumHeroShell";

export function OrthodoxHero({
  onAction,
}: {
  onAction?: (to: { section: "today" | "pray" | "read" | "learn"; tab?: string; read?: string }) => void;
}) {
  return (
    <PremiumHeroShell>
      <OrthodoxCrossIcon className="absolute -bottom-8 -right-5 h-44 w-44 rotate-3 text-white/[0.035] sm:h-56 sm:w-56" />

      <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end lg:p-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200/90 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> A quiet place to begin
          </div>

          <h2 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-5xl lg:text-[3.5rem]">
            Return to what is essential.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            Pray simply, receive today’s Scripture, and carry one faithful step into the day.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              className="tap h-12 rounded-full bg-white px-5 font-semibold text-slate-950 shadow-[0_14px_38px_hsl(0_0%_0%/0.22)] hover:bg-amber-50"
              onClick={() => onAction?.({ section: "pray", tab: "daily" })}
            >
              Begin daily prayer <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="tap h-12 rounded-full border-white/15 bg-white/[0.055] px-5 text-white shadow-none backdrop-blur-md hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
              onClick={() => onAction?.({ section: "read", read: "daily" })}
            >
              <BookOpen className="mr-2 h-4 w-4 text-amber-200" /> Today’s readings
            </Button>
          </div>

          <button
            type="button"
            className="mt-4 inline-flex items-center gap-2 rounded-full px-1 py-1 text-xs font-medium text-white/55 transition-colors hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
            onClick={() => onAction?.({ section: "pray", tab: "counter" })}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Need a one-minute reset?
          </button>
        </div>

        <div className="rounded-[1.6rem] border border-white/10 bg-black/15 p-4 backdrop-blur-xl sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">Today’s rhythm</p>
              <p className="mt-1 text-sm font-medium text-white/90">Three quiet movements</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-amber-200/20 bg-amber-200/10 text-amber-200">
              <OrthodoxCrossIcon className="h-4 w-4" />
            </span>
          </div>
          <ol className="mt-5 grid gap-3">
            {["Be still and pray", "Attend to the Word", "Practice one mercy"].map((step, index) => (
              <li key={step} className="flex items-center gap-3 text-xs font-medium text-white/68">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] text-amber-200">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </PremiumHeroShell>
  );
}

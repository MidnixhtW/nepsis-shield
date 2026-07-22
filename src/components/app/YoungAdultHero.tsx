import type { ReactNode } from "react";
import { ArrowRight, BookOpen, Check, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";

function SecondaryAction({
  icon,
  title,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="tap h-11 justify-start rounded-full border-white/15 bg-white/[0.07] px-4 text-white shadow-none backdrop-blur-md hover:border-white/30 hover:bg-white/[0.12] hover:text-white"
      onClick={onClick}
    >
      <span className="mr-2 text-amber-300">{icon}</span>
      {title}
    </Button>
  );
}

export function OrthodoxHero({
  onAction,
}: {
  onAction?: (to: { section: "today" | "pray" | "read" | "learn"; tab?: string; read?: string }) => void;
}) {
  return (
    <Card className="young-adult-hero group overflow-hidden rounded-[2rem] border-white/10 text-white shadow-[0_30px_100px_hsl(225_60%_5%/0.36)]">
      <div className="relative p-5 sm:p-8 lg:p-10">
        <div aria-hidden className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl transition-transform duration-700 group-hover:scale-110" />
        <div aria-hidden className="absolute -bottom-28 left-[28%] h-60 w-60 rounded-full bg-amber-400/20 blur-3xl" />
        <OrthodoxCrossIcon className="absolute -right-3 bottom-4 h-36 w-36 rotate-6 text-white/[0.06] sm:h-48 sm:w-48" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" /> Your rhythm, rooted
            </div>

            <h2 className="mt-5 max-w-2xl text-4xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Faith for real life.
              <span className="mt-1 block bg-gradient-to-r from-amber-200 via-orange-300 to-rose-300 bg-clip-text text-transparent">
                One step at a time.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              A quiet place to pray, reset, and stay grounded—whether your day feels focused, messy, or somewhere in between.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                className="tap h-12 rounded-full bg-white px-5 font-semibold text-slate-950 shadow-[0_12px_35px_hsl(0_0%_100%/0.16)] hover:bg-amber-50"
                onClick={() => onAction?.({ section: "pray", tab: "daily" })}
              >
                Start a prayer <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <SecondaryAction
                title="Today’s reading"
                icon={<BookOpen className="h-4 w-4" />}
                onClick={() => onAction?.({ section: "read", read: "daily" })}
              />
              <SecondaryAction
                title="Reset now"
                icon={<RotateCcw className="h-4 w-4" />}
                onClick={() => onAction?.({ section: "pray", tab: "counter" })}
              />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/15 bg-slate-950/25 p-4 backdrop-blur-xl sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">Today’s rhythm</p>
                <p className="mt-1 text-sm font-semibold">Keep it simple</p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-300 text-slate-950">
                <OrthodoxCrossIcon className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-5 grid gap-2.5">
              {["Pause and pray", "Read something true", "Carry it into your day"].map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/[0.07] px-3 py-2.5">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/15 text-[10px] font-bold text-amber-200">
                    {index === 0 ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <span className="text-xs font-medium text-white/80">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

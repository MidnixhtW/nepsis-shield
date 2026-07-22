import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ByzantineApse, ByzantineDivider } from "@/components/app/ByzantineOrnament";
import { GospelBookIcon, VigilLampIcon } from "@/components/app/OrthodoxMotifs";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";

export function OrthodoxHero({
  onAction,
}: {
  onAction?: (to: { section: "today" | "pray" | "read" | "learn"; tab?: string; read?: string }) => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-8 lg:p-10">
      <OrthodoxCrossIcon
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -right-10 h-56 w-56 text-zinc-50/[0.02]"
      />

      <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_13rem]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/40 px-3 py-1 text-xs font-medium text-zinc-300">
            <VigilLampIcon className="h-3.5 w-3.5" /> A quiet place to begin
          </span>

          <h1 className="mt-8 max-w-3xl text-4xl font-extrabold leading-[0.98] tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            Return to what is essential.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400">
            Pray simply, receive today&apos;s Scripture, and carry one faithful step into the day.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              className="h-11 rounded-lg bg-zinc-50 px-4 font-medium text-zinc-950 shadow-none transition-all duration-200 ease-in-out hover:bg-zinc-200"
              onClick={() => onAction?.({ section: "pray", tab: "daily" })}
            >
              Begin daily prayer <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.75} />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-lg border-zinc-700 bg-zinc-800/50 px-4 text-zinc-50 shadow-none transition-all duration-200 ease-in-out hover:bg-zinc-700 hover:text-zinc-50"
              onClick={() => onAction?.({ section: "read", read: "daily" })}
            >
              <GospelBookIcon className="mr-2 h-4 w-4" /> Today&apos;s readings
            </Button>
          </div>

          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-medium text-zinc-400 transition-all duration-200 ease-in-out hover:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
            onClick={() => onAction?.({ section: "pray", tab: "counter" })}
          >
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} /> Need a one-minute reset?
          </button>

          <ByzantineDivider className="mt-9 max-w-sm" />

          <div className="mt-5 flex flex-wrap gap-2">
            {["Prayer", "Scripture", "Mercy"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-700 bg-zinc-800/40 px-3 py-1 text-xs font-medium text-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <ByzantineApse className="hidden lg:block" />
      </div>
    </section>
  );
}

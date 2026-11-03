import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** At most this many of the day's occasional cards show before the rest fold away. */
const MAX_VISIBLE = 2;

export type TodayMoment = { id: string; label: string; node: ReactNode };

// The occasional Today cards (feast, name day, fasting season, memorials) in priority order.
// Each card decides for itself whether it has anything to say, so this measures which ones rendered,
// shows the first two and folds the rest behind one "Also today" line. Folded cards stay mounted,
// so their background work (like rolling reminders forward) keeps running.
export function TodayMoments({ moments }: { moments: TodayMoment[] }) {
  const container = useRef<HTMLDivElement>(null);
  const [present, setPresent] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const ids = moments.map((moment) => moment.id).join(",");

  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    const measure = () => {
      const rendered = Array.from(root.querySelectorAll<HTMLElement>(":scope > [data-moment]"))
        .filter((slot) => slot.childElementCount > 0)
        .map((slot) => slot.dataset.moment!);
      setPresent((previous) => (previous.join(",") === rendered.join(",") ? previous : rendered));
    };
    measure();
    const observer = new MutationObserver(measure);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [ids]);

  const folded = present.slice(MAX_VISIBLE);
  const foldedLabels = moments.filter((moment) => folded.includes(moment.id)).map((moment) => moment.label);

  return (
    <div ref={container} className="contents">
      {moments.map((moment) => (
        <div key={moment.id} data-moment={moment.id} className={folded.includes(moment.id) && !open ? "hidden" : "contents"}>
          {moment.node}
        </div>
      ))}
      {folded.length ? (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="min-w-0">
            <span className="font-semibold">{open ? "Show less" : "Also today"}</span>
            {open ? null : <span className="text-muted-foreground"> · {foldedLabels.join(", ")}</span>}
          </span>
          <ChevronDown aria-hidden className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} />
        </button>
      ) : null}
    </div>
  );
}

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// A row of choices where the highlight glides to the one chosen, so the change is seen rather than just happening.
// Still for reduced motion. Behaves as a radio group: arrow keys move the choice.
export function SlidingToggle<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: Array<{ id: T; label: string }>;
  /** May be a value not in the options, in which case nothing is highlighted. */
  value: string;
  onChange: (value: T) => void;
  className?: string;
}) {
  const row = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    function measure() {
      const active = row.current?.querySelector<HTMLElement>('[aria-checked="true"]');
      setBox(active ? { left: active.offsetLeft, top: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight } : null);
    }
    measure();
    // Re-measure when the row's size changes: on a resize, or when a closed section opens and lays it out.
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    if (row.current) observer?.observe(row.current);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [value, options.length]);

  function step(direction: 1 | -1) {
    const index = options.findIndex((option) => option.id === value);
    const next = options[(index + direction + options.length) % options.length];
    onChange(next.id);
    window.requestAnimationFrame(() => row.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus());
  }

  return (
    <div
      ref={row}
      role="radiogroup"
      aria-label={label}
      className={cn("relative inline-flex max-w-full flex-wrap gap-y-1 rounded-[1.4rem] border border-border/60 bg-background/40 p-1", className)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          step(1);
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          step(-1);
        }
      }}
    >
      {box ? (
        <span
          aria-hidden
          className="absolute left-0 top-0 rounded-full bg-accent/15 ring-1 ring-accent/50 transition-[transform,width] duration-300 motion-reduce:transition-none"
          style={{
            width: box.width,
            height: box.height,
            transform: `translate(${box.left}px, ${box.top}px)`,
            transitionTimingFunction: "cubic-bezier(0.34, 1.3, 0.64, 1)",
          }}
        />
      ) : null}
      {options.map((option) => {
        const checked = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked || (!options.some((item) => item.id === value) && option === options[0]) ? 0 : -1}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative z-10 h-9 whitespace-nowrap rounded-full px-3.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              checked ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

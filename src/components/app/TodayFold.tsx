import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

// On a phone, Today keeps its secondary pieces folded so the page reads in a screen or two. The heading and one line
// stay visible; a tap opens the rest. On wider screens there is room, so it starts open.
function startsOpen() {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function TodayFold({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  const [open, setOpen] = useState(startsOpen);
  const panelId = useId();

  if (open) return <>{children}</>;

  return (
    <section aria-label={title} className="border-t border-border/60 px-1 py-5">
      <button
        type="button"
        aria-expanded={false}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
        className="flex min-h-11 w-full items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-xl text-cinnabar">{title}</span>
          {hint ? <span className="mt-0.5 block text-sm text-foreground/75">{hint}</span> : null}
        </span>
        <ChevronDown aria-hidden className="h-5 w-5 shrink-0 text-accent" />
      </button>
      <div id={panelId} hidden />
    </section>
  );
}

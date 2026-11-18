import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

const SPACING = 52; // pixels of pull per knot
const SHOWN = 3; // knots shown above and below the current one

// A prayer rope you pull: drag down with the thumb and each knot that crosses the gold line counts one, settling into
// place with a small spring. Marker beads (every `every` knots) are larger and carry a cross. Keyboard: Down arrow or
// Space counts a knot. Pulling up does nothing, as on a real rope.
export function RopeTrack({
  count,
  every,
  onKnot,
  locked = false,
  stopAtMarker = false,
}: {
  count: number;
  every: number;
  onKnot: () => void;
  /** While the marker bead is held for its pause, the rope does not move. */
  locked?: boolean;
  /** Stop the pull at a marker bead, so its pause cannot be pulled past. */
  stopAtMarker?: boolean;
}) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<number | null>(null);
  const used = useRef(0);

  useEffect(() => {
    if (locked) {
      start.current = null;
      setDragging(false);
      setOffset(0);
    }
  }, [locked]);

  function down(event: PointerEvent<HTMLDivElement>) {
    if (locked) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = event.clientY;
    used.current = 0;
    setDragging(true);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (start.current === null || locked) return;
    const pulled = event.clientY - start.current;
    let counted = 0;
    while (pulled - used.current >= SPACING) {
      used.current += SPACING;
      onKnot();
      counted += 1;
      // A marker stops the pull until its pause is kept; the parent then sets `locked`.
      if (stopAtMarker && (count + counted) % every === 0) {
        start.current = null;
        setDragging(false);
        setOffset(0);
        return;
      }
    }
    // A little give when pulled up, none past that.
    setOffset(Math.max(-10, pulled - used.current));
  }

  function up() {
    start.current = null;
    setDragging(false);
    setOffset(0);
  }

  function key(event: KeyboardEvent<HTMLDivElement>) {
    if (locked) return;
    if (event.key === "ArrowDown" || event.key === " ") {
      event.preventDefault();
      onKnot();
    }
  }

  const knots = [];
  for (let k = count - SHOWN; k <= count + SHOWN + 1; k += 1) {
    if (k < 0) continue;
    const marker = k > 0 && k % every === 0;
    const current = k === count;
    knots.push(
      <div
        key={k}
        aria-hidden
        className="absolute left-1/2 top-1/2"
        style={{ transform: `translate(-50%, -50%) translateY(${-(k - count) * SPACING}px)` }}
      >
        {marker ? (
          <span className={cn("grid h-9 w-9 place-items-center rounded-full border-2 border-icon-gold/70 bg-card text-icon-gold", current && "lamp-lit")}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M12 3v18M9 6h6M7 10h10M9 16l6 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        ) : (
          <span
            className={cn(
              "block h-6 w-6 rounded-full border-2 border-foreground/40 bg-muted shadow-[inset_0_-3px_0_hsl(0_0%_0%/0.35)]",
              current && "border-icon-gold/80",
            )}
          />
        )}
      </div>,
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={locked ? "Prayer rope, held at the marker" : `Prayer rope, ${count} knots. Pull down to count a knot, or press the down arrow.`}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={key}
      className={cn(
        "relative h-72 w-full touch-none select-none overflow-hidden rounded-2xl border border-border/60 bg-background/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        locked ? "cursor-default" : "cursor-grab active:cursor-grabbing",
      )}
    >
      {/* The cord, and the gold line a knot crosses to count. */}
      <div aria-hidden className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-foreground/25" />
      <div aria-hidden className="absolute inset-x-6 top-1/2 h-px bg-icon-gold/60" />
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${offset}px)`,
          transition: dragging ? "none" : "transform 360ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {knots}
      </div>
      <p aria-hidden className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs text-muted-foreground">
        {locked ? "" : "Pull down"}
      </p>
    </div>
  );
}

const HOLD_MS = 1500;

// At a marker bead: press and hold the cross while a ring fills, one breath, before the rope moves on.
export function HoldToContinue({ onDone }: { onDone: () => void }) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<number | null>(null);

  function begin() {
    setHolding(true);
    timer.current = window.setTimeout(() => {
      setHolding(false);
      onDone();
    }, HOLD_MS);
  }

  function end() {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  }

  useEffect(() => () => end(), []);

  const circumference = 2 * Math.PI * 30;
  return (
    <div className="grid justify-items-center gap-2 text-center">
      <button
        type="button"
        aria-label="Hold to continue"
        onPointerDown={begin}
        onPointerUp={end}
        onPointerLeave={end}
        onPointerCancel={end}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onDone();
          }
        }}
        onContextMenu={(event) => event.preventDefault()}
        className="relative grid h-20 w-20 touch-none select-none place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg viewBox="0 0 72 72" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
          <circle cx="36" cy="36" r="30" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
          <circle
            cx="36"
            cy="36"
            r="30"
            fill="none"
            stroke="hsl(var(--icon-gold))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: holding ? 0 : circumference,
              transition: holding ? `stroke-dashoffset ${HOLD_MS}ms linear` : "stroke-dashoffset 200ms ease-out",
            }}
          />
        </svg>
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-icon-gold" fill="none" aria-hidden>
          <path d="M12 3v18M9 6h6M7 10h10M9 16l6 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <p className="text-sm text-muted-foreground">A marker. Hold the cross for one breath, then go on.</p>
    </div>
  );
}

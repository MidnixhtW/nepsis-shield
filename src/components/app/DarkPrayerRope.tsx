import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { knotHaptic, markerHaptic } from "@/lib/haptics";

type WakeLockSentinelLike = { release: () => Promise<void> };

/**
 * Watchfulness mode: the whole screen goes pure black (OLED pixels off, night vision kept) and any tap counts a knot.
 * A firm pulse marks every `every` knots so the count can be kept without looking. Hold anywhere for a second, or press
 * Escape, to leave. The screen is kept awake while it is open.
 */
export function DarkPrayerRope({
  count,
  every,
  onKnot,
  onClose,
  isMarker,
  haptics = true,
  shownLabel,
  footer,
  name = "Prayer rope",
  unit = "knots",
}: {
  count: number;
  every: number;
  onKnot: () => void;
  onClose: () => void;
  /** Overrides the every-N rule for which count gets the firm pulse. */
  isMarker?: (count: number) => boolean;
  /** Off when the caller plays its own haptics. */
  haptics?: boolean;
  /** Shown in place of the bare number when the count is revealed. */
  shownLabel?: string;
  footer?: string;
  name?: string;
  unit?: string;
}) {
  const [showCount, setShowCount] = useState(false);
  const holdTimer = useRef<number | null>(null);
  const held = useRef(false);

  useEffect(() => {
    let lock: WakeLockSentinelLike | null = null;
    const nav = navigator as Navigator & { wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> } };
    nav.wakeLock?.request("screen").then((sentinel) => { lock = sentinel; }).catch(() => {});
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        onKnot();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      lock?.release().catch(() => {});
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onKnot]);

  // The pulse follows the count, so a knot that lands on a marker gets the firm pulse instead of the small bump.
  const previous = useRef(count);
  useEffect(() => {
    if (haptics && count > previous.current) {
      if (isMarker ? isMarker(count) : count % every === 0) markerHaptic();
      else knotHaptic();
    }
    previous.current = count;
  }, [count, every, haptics, isMarker]);

  function startHold() {
    held.current = false;
    holdTimer.current = window.setTimeout(() => {
      held.current = true;
      onClose();
    }, 900);
  }

  function endHold() {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = null;
    if (!held.current) onKnot();
  }

  function cancelHold() {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = null;
  }

  return createPortal(
    <div
      role="button"
      tabIndex={0}
      aria-label={`${name}, dark mode. ${count} ${unit}. Tap anywhere to count; hold to leave.`}
      className="fixed inset-0 z-[100] select-none touch-none bg-black outline-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
      onPointerDown={startHold}
      onPointerUp={endHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="pointer-events-none flex h-full flex-col items-center justify-between py-[max(2rem,env(safe-area-inset-top))] text-center">
        <p className="text-xs tracking-wide text-[#2a2a2a]">Tap anywhere. Hold to leave.</p>
        <p aria-live="off" className="text-5xl font-light tabular-nums text-[#262626]">{showCount ? (shownLabel ?? count) : ""}</p>
        <p className="text-sm text-[#2a2a2a]">{footer ?? `A pulse every ${every}`}</p>
      </div>
      <button
        type="button"
        className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] rounded-full px-3 py-2 text-xs text-[#2f2f2f]"
        onPointerDown={(event) => event.stopPropagation()}
        onPointerUp={(event) => {
          event.stopPropagation();
          setShowCount((value) => !value);
        }}
      >
        {showCount ? "Hide count" : "Show count"}
      </button>
    </div>,
    document.body,
  );
}

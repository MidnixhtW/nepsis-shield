import { useMemo } from "react";
import { cn } from "@/lib/utils";

// The Jesus Prayer counter drawn as a real Byzantine prayer rope (chotki): black wool knots tied in the woven cross
// knot, a wooden or red bead after each marker, and at the bottom the woven cross and tassel. Knots prayed this round
// catch a little gold, the knot under the fingers glows, and every tap gives the rope a small tug.

const W = 300;
const H = 396;
const CX = 150;
const CY = 146;
const R = 112;
const GAP = 0.34; // radians left open at the bottom, where the rope is gathered at the bead and cross

type Unit = { kind: "knot"; index: number } | { kind: "bead" };

/** How many knots the drawn rope has, from how often a marker comes. */
function ropeSize(markerEvery: number) {
  if (markerEvery >= 100) return 100;
  if (markerEvery === 33) return 33;
  return 50;
}

// Beads mark the markers. Where the marker is the whole rope (33, 50 or 100), the rope still carries beads the way
// real ones do: every 11 knots on a 33, every 10 on a 50, every 25 on a 100.
function beadEvery(size: number, markerEvery: number) {
  if (markerEvery < size) return markerEvery;
  return size === 33 ? 11 : size === 50 ? 10 : 25;
}

function layout(size: number, markerEveryIn: number) {
  const markerEvery = beadEvery(size, markerEveryIn);
  const units: Unit[] = [];
  for (let i = 0; i < size; i += 1) {
    units.push({ kind: "knot", index: i });
    // A bead after every marker knot, but not at the end, where the large bead already sits.
    if ((i + 1) % markerEvery === 0 && i + 1 < size) units.push({ kind: "bead" });
  }
  const weight = (unit: Unit) => (unit.kind === "bead" ? 1.25 : 1);
  const total = units.reduce((sum, unit) => sum + weight(unit), 0);
  const span = Math.PI * 2 - GAP;
  const step = (R * span) / total;
  let along = 0;
  return {
    knotSize: Math.min(19, step * 1.12),
    beadSize: Math.min(10, step * 0.72),
    placed: units.map((unit) => {
      const middle = along + weight(unit) / 2;
      along += weight(unit);
      // Start just left of the gap at the bottom and go round clockwise on screen (up the left side first).
      const angle = Math.PI / 2 + GAP / 2 + (middle / total) * span;
      return { unit, x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle), deg: (angle * 180) / Math.PI + 90 };
    }),
  };
}

export function PrayerRopeLoop({
  count,
  goal,
  markerEvery,
  onTap,
  className,
}: {
  count: number;
  goal: number;
  markerEvery: number;
  onTap: () => void;
  className?: string;
}) {
  const size = ropeSize(markerEvery);
  const { placed, knotSize, beadSize } = useMemo(() => layout(size, markerEvery), [size, markerEvery]);
  // Where the fingers are on the rope this time round. After a full round the rope starts again, all dark.
  const onRope = count % size;
  const reached = goal > 0 && count >= goal;
  const scale = knotSize / 16;

  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={`Prayer rope. Count a prayer. ${count} of ${goal} today.`}
      className={cn(
        "relative mx-auto block w-full max-w-[19rem] rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden>
        <defs>
          <radialGradient id="rope-wool" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#2a2826" />
            <stop offset="65%" stopColor="#131211" />
            <stop offset="100%" stopColor="#050505" />
          </radialGradient>
          <radialGradient id="rope-wood" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#e8a25a" />
            <stop offset="50%" stopColor="#a9581c" />
            <stop offset="100%" stopColor="#4d220a" />
          </radialGradient>
          <radialGradient id="rope-garnet" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#e0606f" />
            <stop offset="45%" stopColor="#9b1f31" />
            <stop offset="100%" stopColor="#3d0710" />
          </radialGradient>
          <radialGradient id="rope-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d8b26a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#d8b26a" stopOpacity="0" />
          </radialGradient>
          {/* A knot of black wool: a soft round lump, its strands crossing over it at a slant. */}
          <symbol id="rope-knot" viewBox="-8 -8 16 16" overflow="visible">
            <circle r="7.4" fill="url(#rope-wool)" />
            <g fill="none" stroke="#3a3633" strokeWidth="1.5" strokeLinecap="round">
              <path d="M-4.8 -3.6 L-1.6 -5.6" />
              <path d="M-5.6 0.6 L0.6 -4.4" />
              <path d="M-4 4.2 L4 -2.2" />
              <path d="M0.2 5.4 L5 1.6" />
            </g>
            <ellipse cx="-2.4" cy="-3" rx="2.6" ry="1.7" fill="#fff" opacity="0.06" />
          </symbol>
          <symbol id="rope-knot-lit" viewBox="-8 -8 16 16" overflow="visible">
            <circle r="7.4" fill="url(#rope-wool)" />
            <g fill="none" stroke="#7d6a43" strokeOpacity="0.85" strokeWidth="1.5" strokeLinecap="round">
              <path d="M-4.8 -3.6 L-1.6 -5.6" />
              <path d="M-5.6 0.6 L0.6 -4.4" />
              <path d="M-4 4.2 L4 -2.2" />
              <path d="M0.2 5.4 L5 1.6" />
            </g>
            <ellipse cx="-2.4" cy="-3" rx="2.6" ry="1.7" fill="#f2d48a" opacity="0.14" />
          </symbol>
          {/* Wool is fuzzy: a fine noise roughens every edge a little. */}
          <filter id="rope-fuzz" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="1.3" />
          </filter>
        </defs>

        {/* key={count}: every knot counted gives the whole rope a small tug downward, the way it moves in the hand. */}
        <g key={count} className="motion-safe:animate-[rope-tug_280ms_ease-out]">
          <g filter="url(#rope-fuzz)">
          {/* The cord the knots are tied on, gathered at the bottom. */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#0e0e10" strokeWidth={2.4} />

          {placed.map(({ unit, x, y, deg }, i) => {
            if (unit.kind === "bead") {
              return (
                <g key={`b${i}`}>
                  <circle cx={x} cy={y} r={beadSize} fill="url(#rope-wood)" />
                  <ellipse cx={x} cy={y} rx={beadSize * 0.95} ry={beadSize * 0.35} fill="none" stroke="#5a2a0c" strokeOpacity={0.35} strokeWidth={0.8} transform={`rotate(${deg} ${x} ${y})`} />
                  <ellipse cx={x - beadSize * 0.3} cy={y - beadSize * 0.35} rx={beadSize * 0.32} ry={beadSize * 0.2} fill="#fff" opacity={0.28} />
                </g>
              );
            }
            const current = unit.index === onRope;
            const lit = unit.index < onRope;
            return (
              <g key={`k${unit.index}`} transform={`translate(${x} ${y}) rotate(${deg})`}>
                {current ? <circle r={knotSize * 1.25} fill="url(#rope-glow)" className="motion-safe:animate-pulse" /> : null}
                <use
                  href={lit ? "#rope-knot-lit" : "#rope-knot"}
                  x={-8}
                  y={-8}
                  width={16}
                  height={16}
                  transform={`scale(${current ? scale * 1.18 : scale})`}
                />
                {current ? <circle r={knotSize * 0.68} fill="none" stroke="#d8b26a" strokeWidth={1.6} /> : null}
              </g>
            );
          })}

          </g>

          {/* Gathered at the bottom: a wooden bead, then the cross, itself tied of knots. */}
          <circle cx={CX} cy={CY + R + 13} r={10} fill="url(#rope-wood)" />
          <ellipse cx={CX} cy={CY + R + 13} rx={9.5} ry={3.4} fill="none" stroke="#5a2a0c" strokeOpacity={0.35} strokeWidth={0.8} />
          <ellipse cx={CX - 3.2} cy={CY + R + 9} rx={3.4} ry={2} fill="#fff" opacity={0.3} />
          <g filter="url(#rope-fuzz)" transform={`translate(${CX} ${CY + R + 30})`}>
            {[
              [0, 0], [0, 12], [-13, 24], [-25, 24], [13, 24], [25, 24], [0, 24], [0, 36], [0, 48], [0, 60], [0, 72],
            ].map(([dx, dy]) => (
              <use key={`${dx},${dy}`} href="#rope-knot" x={dx - 8} y={dy - 8} width={16} height={16} />
            ))}
          </g>
        </g>
      </svg>

      <span className="pointer-events-none absolute inset-x-0 top-[37%] grid -translate-y-1/2 justify-items-center">
        <span className="text-5xl font-semibold tabular-nums tracking-tight">{count}</span>
        <span className="mt-1 text-sm font-semibold text-muted-foreground">of {goal}</span>
        <span className="mt-1 text-sm text-muted-foreground">{reached ? "Glory to God" : "Tap to pray"}</span>
      </span>
    </button>
  );
}

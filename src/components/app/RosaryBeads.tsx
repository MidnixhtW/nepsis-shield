import { useMemo } from "react";
import type { RosaryBeadKind } from "@/lib/rosaryBeads";
import { cn } from "@/lib/utils";

type Placed = { kind: RosaryBeadKind; x: number; y: number };

const WIDTH = 300;
const HEIGHT = 430;
const CX = 150;
const CY = 146;
const R = 118;
const CENTRE_Y = CY + R;
const PENDANT_UNITS = 7; // Cross, Our Father, three Hail Marys, Glory be, Our Father of the first mystery.

const WEIGHT: Record<RosaryBeadKind, number> = { small: 1, chain: 0.8, large: 1.9, cross: 0, centre: 0 };
const LOOP_PAD = 1.6;

function layout(units: RosaryBeadKind[]): Placed[] {
  // The pendant, from the Cross up to the centerpiece.
  const pendantY = [384, 344, 328, 314, 300, 290, 284];
  const placed: Placed[] = units.slice(0, PENDANT_UNITS).map((kind, index) => ({ kind, x: CX, y: pendantY[index] }));

  // The loop, starting at the centerpiece and going round to the left.
  const loop = units.slice(PENDANT_UNITS, -1);
  const total = loop.reduce((sum, kind) => sum + WEIGHT[kind], 0) + LOOP_PAD * 2;
  let along = LOOP_PAD;
  for (const kind of loop) {
    const middle = along + WEIGHT[kind] / 2;
    along += WEIGHT[kind];
    const angle = Math.PI / 2 + (middle / total) * Math.PI * 2;
    placed.push({ kind, x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) });
  }

  placed.push({ kind: "centre", x: CX, y: CENTRE_Y });
  return placed;
}

/**
 * The whole Rosary drawn as it lies in the hand. Prayed beads fill in, the one under the fingers glows, and the chain
 * lights for each Glory be. The drawing is a button: tapping it moves to the next bead.
 */
export function RosaryBeads({
  units,
  current,
  label,
  onTap,
  className,
}: {
  units: RosaryBeadKind[];
  current: number;
  label?: string;
  onTap: () => void;
  className?: string;
}) {
  const placed = useMemo(() => layout(units), [units]);
  const finished = current >= units.length;
  const here = placed[Math.min(current, placed.length - 1)];

  return (
    <button
      type="button"
      onClick={onTap}
      disabled={finished}
      aria-label={finished ? "Rosary complete" : `Rosary beads, ${current + 1} of ${units.length}. Tap to move to the next bead.`}
      className={cn("tap mx-auto block w-full max-w-[240px] rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" aria-hidden="true">
        <defs>
          {/* Deep blue wooden beads with a little grain, on tan cord; bronze beads for each Our Father. */}
          <radialGradient id="rb-blue" cx="34%" cy="30%" r="78%">
            <stop offset="0%" stopColor="#5d86c4" />
            <stop offset="45%" stopColor="#1f3f78" />
            <stop offset="100%" stopColor="#0a1733" />
          </radialGradient>
          <radialGradient id="rb-blue-lit" cx="34%" cy="30%" r="78%">
            <stop offset="0%" stopColor="#8fb3e6" />
            <stop offset="45%" stopColor="#2f5aa0" />
            <stop offset="100%" stopColor="#12264d" />
          </radialGradient>
          <linearGradient id="rb-bronze" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0d79a" />
            <stop offset="45%" stopColor="#b38a45" />
            <stop offset="100%" stopColor="#5e4318" />
          </linearGradient>
          <radialGradient id="rb-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f2d48a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f2d48a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* The cord. */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#c7a679" strokeWidth={2.2} />
        <line x1={CX} y1={CENTRE_Y} x2={CX} y2={360} stroke="#c7a679" strokeWidth={2.2} />

        {!finished ? (
          <circle cx={here.x} cy={here.y} r={here.kind === "small" || here.kind === "chain" ? 14 : 20} fill="url(#rb-glow)" className="motion-safe:animate-pulse" />
        ) : null}

        {placed.map((item, index) => {
          const prayed = index < current;
          const isHere = index === current;
          const dim = !prayed && !isHere ? 0.7 : 1;
          const ring = isHere ? "#f2d48a" : "#5e4318";
          if (item.kind === "cross") {
            // A Byzantine cross in bronze: three bars, the lower one slanted, with a deep red field.
            const x = item.x;
            const y = item.y;
            const outline = `M ${x - 5} ${y - 34} h 10 v 6 h 6 v 5 h -6 v 4 h 15 v 9 h -15 v 30 h -10 v -30 h -15 v -9 h 15 v -4 h -6 v -5 h 6 z`;
            return (
              <g key={index} opacity={dim}>
                <path d={outline} fill="url(#rb-bronze)" stroke={ring} strokeWidth={isHere ? 1.6 : 0.9} strokeLinejoin="round" />
                <path d={`M ${x - 2.6} ${y - 31} h 5.2 v 48 h -5.2 z M ${x - 12} ${y - 16.5} h 24 v 4.2 h -24 z`} fill="#7a1622" />
                <path d={`M ${x - 7} ${y + 13} L ${x + 7} ${y + 8}`} stroke="url(#rb-bronze)" strokeWidth={3} strokeLinecap="round" />
              </g>
            );
          }
          if (item.kind === "centre") {
            // The centrepiece: a small square icon of the Theotokos in a bronze frame.
            const x = item.x;
            const y = item.y;
            return (
              <g key={index} opacity={dim}>
                <rect x={x - 13} y={y - 15} width={26} height={30} rx={2} fill="url(#rb-bronze)" stroke={ring} strokeWidth={isHere ? 1.6 : 0.8} />
                <rect x={x - 10} y={y - 12} width={20} height={24} fill="#d9a93c" />
                <circle cx={x} cy={y - 4} r={5.2} fill="#f3d27a" stroke="#a87b22" strokeWidth={0.6} />
                <path d={`M ${x - 8.5} ${y + 12} C ${x - 8} ${y - 2} ${x - 4} ${y - 9} ${x} ${y - 9} C ${x + 4} ${y - 9} ${x + 8} ${y - 2} ${x + 8.5} ${y + 12} z`} fill="#1d2f66" />
                <circle cx={x} cy={y - 4} r={2.6} fill="#c99566" />
                <circle cx={x + 3.2} cy={y + 3.5} r={1.7} fill="#c99566" />
                <path d={`M ${x + 1} ${y + 5.5} q 2.5 -1 4.5 0.5 v 5 h -4.5 z`} fill="#8e1d24" />
              </g>
            );
          }
          if (item.kind === "chain") {
            // The Glory be is said on the cord between decades: a small wrapped knot of cord marks it.
            return (
              <ellipse key={index} cx={item.x} cy={item.y} rx={3.4} ry={2.6} fill={prayed || isHere ? "#f2d48a" : "#b89466"} stroke="#7d6240" strokeWidth={0.6} />
            );
          }
          if (item.kind === "large") {
            // A bronze bead with a scroll pattern, for each Our Father.
            return (
              <g key={index} opacity={dim}>
                <ellipse cx={item.x} cy={item.y} rx={9} ry={8} fill="url(#rb-bronze)" stroke={ring} strokeWidth={isHere ? 1.6 : 0.8} />
                <path d={`M ${item.x - 6} ${item.y} q 3 -4 6 0 t 6 0`} fill="none" stroke="#6b4c1c" strokeWidth={0.9} />
                <path d={`M ${item.x - 5} ${item.y - 4.5} h 10 M ${item.x - 5} ${item.y + 4.5} h 10`} stroke="#6b4c1c" strokeWidth={0.6} />
              </g>
            );
          }
          const r = 5.6;
          return (
            <g key={index} opacity={dim}>
              <circle cx={item.x} cy={item.y} r={r} fill={prayed || isHere ? "url(#rb-blue-lit)" : "url(#rb-blue)"} />
              <path d={`M ${item.x - r * 0.8} ${item.y + 1} q ${r * 0.8} -2 ${r * 1.6} 0`} fill="none" stroke="#0b1a3a" strokeOpacity={0.45} strokeWidth={0.7} />
              <ellipse cx={item.x - r * 0.32} cy={item.y - r * 0.38} rx={r * 0.34} ry={r * 0.2} fill="#fff" opacity={0.38} />
              {isHere ? <circle cx={item.x} cy={item.y} r={r + 2.4} fill="none" stroke="#f2d48a" strokeWidth={1.5} /> : null}
            </g>
          );
        })}

        {label ? (
          <text x={CX} y={CY + 5} textAnchor="middle" className="fill-muted-foreground text-[15px] font-medium">
            {label}
          </text>
        ) : null}
      </svg>
    </button>
  );
}

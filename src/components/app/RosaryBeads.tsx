import { useMemo } from "react";
import type { RosaryBeadKind } from "@/lib/rosaryBeads";
import { cn } from "@/lib/utils";

type Placed = { kind: RosaryBeadKind; x: number; y: number };

const WIDTH = 300;
const HEIGHT = 400;
const CX = 150;
const CY = 146;
const R = 118;
const CENTRE_Y = CY + R;
const PENDANT_UNITS = 7; // Cross, Our Father, three Hail Marys, Glory be, Our Father of the first mystery.

const WEIGHT: Record<RosaryBeadKind, number> = { small: 1, chain: 0.8, large: 1.9, cross: 0, centre: 0 };
const LOOP_PAD = 1.6;

function layout(units: RosaryBeadKind[]): Placed[] {
  // The pendant, from the Cross up to the centerpiece.
  const pendantY = [378, 350, 334, 321, 308, 297, 285];
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

function stateClass(index: number, current: number) {
  if (index < current) return "fill-primary stroke-primary";
  if (index === current) return "fill-accent stroke-primary";
  return "fill-muted stroke-border";
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
        {/* Chain */}
        <circle cx={CX} cy={CY} r={R} fill="none" className="stroke-border" strokeWidth={1.5} />
        <line x1={CX} y1={CENTRE_Y} x2={CX} y2={372} className="stroke-border" strokeWidth={1.5} />

        {/* Glow under the current bead */}
        {!finished ? (
          <circle cx={here.x} cy={here.y} r={here.kind === "small" || here.kind === "chain" ? 11 : 16} className="fill-accent/40 motion-safe:animate-pulse" />
        ) : null}

        {placed.map((item, index) => {
          const state = stateClass(index, current);
          if (item.kind === "cross") {
            return (
              <path
                key={index}
                d={`M ${item.x - 3} ${item.y - 16} h 6 v 8 h 9 v 6 h -9 v 20 h -6 v -20 h -9 v -6 h 9 z`}
                className={state}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            );
          }
          if (item.kind === "centre") {
            return (
              <rect
                key={index}
                x={item.x - 9}
                y={item.y - 11}
                width={18}
                height={22}
                rx={9}
                className={state}
                strokeWidth={1.5}
              />
            );
          }
          if (item.kind === "chain") {
            return <circle key={index} cx={item.x} cy={item.y} r={2.2} className={state} strokeWidth={1} />;
          }
          return <circle key={index} cx={item.x} cy={item.y} r={item.kind === "large" ? 6.8 : 4.3} className={state} strokeWidth={1.5} />;
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

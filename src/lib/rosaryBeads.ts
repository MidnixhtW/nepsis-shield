import type { RosaryStep } from "@/content/rosary";

/** What sits under the fingers for one prayer: the Cross, a large or small bead, the chain (Glory be), or the centerpiece. */
export type RosaryBeadKind = "cross" | "large" | "small" | "chain" | "centre";

/** One entry per prayer, in the order prayed, so the drawing and the steps can never fall out of step. */
export function rosaryUnits(steps: RosaryStep[]): RosaryBeadKind[] {
  const units: RosaryBeadKind[] = [];
  steps.forEach((step, index) => {
    let kind: RosaryBeadKind;
    if (index === 0) kind = "cross";
    else if (index === steps.length - 1) kind = "centre";
    else if (step.repeat > 1) kind = "small";
    else if (step.text.startsWith("Glory be")) kind = "chain";
    else kind = "large";
    for (let i = 0; i < step.repeat; i += 1) units.push(kind);
  });
  return units;
}

/** Whether arriving on this prayer gets the firm pulse: the Glory be closes a decade (and the opening three). */
export function isRosaryMarker(kind: RosaryBeadKind | undefined) {
  return kind === "chain" || kind === "centre";
}

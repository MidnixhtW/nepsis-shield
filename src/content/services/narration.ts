import type { ServiceBlock } from "./types.ts";

// What a recorded reader says for a service: one part per heading, instructions left out, and long parts split so no
// recording runs much past a few minutes. Shared by the app and scripts/narration, so recordings match the screen.
const MAX_PART = 4200;

export function serviceNarration(blocks: ServiceBlock[]): string[][] {
  const parts: string[][] = [];
  let current: string[] = [];
  let size = 0;
  const flush = () => {
    if (current.length) parts.push(current);
    current = [];
    size = 0;
  };
  for (const block of blocks) {
    if (block.kind === "rubric") continue;
    if (block.kind === "heading") flush();
    const line = block.kind === "heading" || block.kind === "subheading" ? `${block.text}.` : block.text;
    if (size + line.length > MAX_PART && current.length) flush();
    current.push(line);
    size += line.length;
  }
  flush();
  return parts;
}

/** A prayer as a reader says it: its title, then its lines. */
export function prayerNarration(title: string, lines: string[]): string[] {
  return [`${title}.`, ...lines];
}

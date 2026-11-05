// What a recorded reader says for a piece of text, and the id its recording is saved under.
// Shared by the app and scripts/narration, so a recording always matches the words on screen.
// No imports, so Node can run it directly with --experimental-strip-types.

const REPEAT_MARK = /\s*\((\d+)x\)\s*$/i;
const REPEAT_NOTE = /\s*\(Repeat[^)]*\)\s*$/i;

/** One line as spoken: "Lord, have mercy. (3x)" is said three times; "(Repeat slowly 3, 12, or 33 times.)" three times. */
export function spokenLine(line: string): string {
  const mark = line.match(REPEAT_MARK);
  if (mark) {
    const text = line.replace(REPEAT_MARK, "").trim();
    return Array.from({ length: Math.min(3, Math.max(1, Number(mark[1]))) }, () => text).join(" ");
  }
  if (REPEAT_NOTE.test(line)) {
    const text = line.replace(REPEAT_NOTE, "").trim();
    return [text, text, text].join(" ");
  }
  return line.trim();
}

export function spokenText(lines: string[]): string {
  return lines.map(spokenLine).filter(Boolean).join("\n\n");
}

// FNV-1a, twice with different seeds, for a short id that is the same in the browser and in Node.
function fnv(text: string, seed: number) {
  let hash = seed >>> 0;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function clipId(text: string): string {
  return fnv(text, 0x811c9dc5) + fnv(text, 0x050c5d1f);
}

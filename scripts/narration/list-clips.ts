// Lists every clip in a recording batch with its id and spoken text, as JSON.
//   node --experimental-strip-types scripts/narration/list-clips.ts > narration-samples/batch1.json
import { developerPrayerRule, longExtras, seraphimRule, shortFlows, standardExtras } from "../../src/content/dailyPrayerSteps.ts";
import { SAINT_STORIES } from "../../src/content/familyPrayer.ts";
import { angelus, marianAntiphonNarration, reginaCaeli, rosaryNarration } from "../../src/content/rosary.ts";
import { clipId, spokenText } from "../../src/lib/narrationText.ts";

type Clip = { id: string; label: string; text: string };
const clips = new Map<string, Clip>();

function add(label: string, lines: string[]) {
  const text = spokenText(lines);
  const id = clipId(text);
  if (!clips.has(id)) clips.set(id, { id, label, text });
}

for (const time of ["morning", "evening", "night"] as const) {
  for (const step of [...shortFlows[time], ...standardExtras[time], ...longExtras[time]]) add(`${time}: ${step.title}`, step.body);
}
for (const step of seraphimRule) add(`seraphim: ${step.title}`, step.body);
if (process.argv.includes("--developer")) for (const step of developerPrayerRule) add(`developer: ${step.title}`, step.body);
for (const set of ["joyful", "luminous", "sorrowful", "glorious"] as const) {
  rosaryNarration(set).forEach((lines, index) => add(`rosary ${set} ${index}`, lines));
}
add("angelus", marianAntiphonNarration(angelus));
add("regina caeli", marianAntiphonNarration(reginaCaeli));
for (const story of SAINT_STORIES) add(`story: ${story.title}`, [`${story.title}.`, ...story.story, story.lesson]);

const list = [...clips.values()];
console.log(JSON.stringify({ count: list.length, characters: list.reduce((n, c) => n + c.text.length, 0), clips: list }, null, 2));

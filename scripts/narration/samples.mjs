// Makes one short sample clip per candidate voice with ElevenLabs, so a voice can be chosen before
// recording everything. Reads ELEVENLABS_API_KEY from .env.local (ignored by git) or the environment.
// The key is only sent to api.elevenlabs.io and is never printed.
//
//   node scripts/narration/samples.mjs              # the default candidate voices
//   node scripts/narration/samples.mjs "Name" ...   # specific voices from your account by name
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const OUT = path.join(ROOT, "narration-samples");
const API = "https://api.elevenlabs.io/v1";
const MODEL = "eleven_multilingual_v2";

function readKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  const file = path.join(ROOT, ".env.local");
  if (!existsSync(file)) return "";
  const line = readFileSync(file, "utf8").split(/\r?\n/).find((l) => l.trim().startsWith("ELEVENLABS_API_KEY="));
  return line ? line.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "") : "";
}

const key = readKey();
if (!key) {
  console.error("No ELEVENLABS_API_KEY found. Add a line ELEVENLABS_API_KEY=... to .env.local in the project folder.");
  process.exit(1);
}

async function api(pathname, init = {}) {
  const response = await fetch(`${API}${pathname}`, { ...init, headers: { "xi-api-key": key, ...(init.headers ?? {}) } });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ElevenLabs ${pathname} answered ${response.status}: ${body.slice(0, 300)}`);
  }
  return response;
}

// Traditional prayers, from Orthodox Daily Prayers (St. Tikhon's Seminary Press, 1982), public domain.
const SAMPLE = [
  "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
  "Glory to Thee, our God, glory to Thee.",
  "O Heavenly King, the Comforter, the Spirit of Truth, Who art everywhere present and fillest all things, Treasury of blessings and Giver of life: come and abide in us, and cleanse us from every impurity, and save our souls, O Good One.",
  "Holy God, Holy Mighty, Holy Immortal, have mercy on us.",
].join("\n\n");

// Calm, unhurried readers from the ElevenLabs default voices; any that are missing from the account are skipped.
const DEFAULT_CANDIDATES = ["George", "Brian", "Daniel", "Bill", "Alice"];

const subscription = await (await api("/user/subscription")).json();
const left = subscription.character_limit - subscription.character_count;
console.log(`Plan: ${subscription.tier}. Credits left this period: ${left.toLocaleString()} of ${subscription.character_limit.toLocaleString()}.`);

const { voices } = await (await api("/voices")).json();
mkdirSync(OUT, { recursive: true });
writeFileSync(
  path.join(OUT, "voices.txt"),
  voices.map((v) => `${v.name}\t${v.category ?? ""}\t${[v.labels?.gender, v.labels?.accent, v.labels?.age, v.labels?.description].filter(Boolean).join(", ")}`).join("\n") + "\n",
);

const wanted = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_CANDIDATES;
const chosen = wanted
  .map((name) => voices.find((v) => v.name.toLowerCase().startsWith(name.toLowerCase())))
  .filter(Boolean);
if (!chosen.length) {
  console.error("None of those voices are in this account. See narration-samples/voices.txt for the names.");
  process.exit(1);
}

const cost = SAMPLE.length * chosen.length;
console.log(`Making ${chosen.length} samples of ${SAMPLE.length} characters each (about ${cost.toLocaleString()} credits).`);
if (cost > left) {
  console.error("Not enough credits left for these samples.");
  process.exit(1);
}

for (const voice of chosen) {
  const response = await api(`/text-to-speech/${voice.voice_id}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text: SAMPLE,
      model_id: MODEL,
      voice_settings: { stability: 0.6, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 0.9 },
    }),
  });
  const file = path.join(OUT, `${voice.name.split(/\s+/)[0].toLowerCase()}.mp3`);
  writeFileSync(file, Buffer.from(await response.arrayBuffer()));
  console.log(`Saved ${path.relative(ROOT, file)}  (${voice.name}${voice.labels?.accent ? `, ${voice.labels.accent}` : ""})`);
}
console.log("Done. Listen to the files in narration-samples and pick a voice.");

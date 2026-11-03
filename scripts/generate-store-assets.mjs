// Renders Play Store screenshots, the feature graphic, and a Nativity Fast share image into marketing/.
// Start a local build first (`pnpm build && pnpm preview --port 4173`), then run:
//   node scripts/generate-store-assets.mjs [baseUrl]
// Uses Playwright's Chromium, or installed Microsoft Edge when PLAYWRIGHT_CHANNEL=msedge.

import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(rootDir, "marketing");
const base = process.argv[2] || "http://127.0.0.1:4173";

const fontData = async (pkg, file) =>
  `data:font/woff2;base64,${(await readFile(path.join(rootDir, "node_modules", "@fontsource", pkg, "files", file))).toString("base64")}`;
const emblem = `data:image/svg+xml;base64,${(await readFile(path.join(rootDir, "public", "military-orthodox-cross.svg"))).toString("base64")}`;

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
await mkdir(path.join(outDir, "play-store"), { recursive: true });

// 360x720 at 3x = 1080x2160, within Google Play's 2:1 limit.
async function phonePage(fixedDate, seed = {}) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 720 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: "dark" });
  await ctx.addInitScript((items) => {
    const wrap = (v) => JSON.stringify({ __wrapped: 1, v, ts: Date.now() });
    localStorage.setItem("onboarding:quickstart_done", wrap(true));
    for (const [key, value] of Object.entries(items)) localStorage.setItem(key, wrap(value));
  }, seed);
  const page = await ctx.newPage();
  if (fixedDate) await page.clock.setFixedTime(fixedDate);
  return page;
}

const nativityDay = new Date(2026, 10, 21, 8, 30);
const shots = [
  {
    name: "1-today-journey",
    date: nativityDay,
    run: async (page) => {
      await page.goto(`${base}/today`, { waitUntil: "networkidle" });
      await page.locator("#season-journey-title").scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, -120));
    },
  },
  {
    name: "2-full-screen-prayer",
    date: nativityDay,
    run: async (page) => {
      await page.goto(`${base}/pray?tab=daily`, { waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Begin prayer" }).first().click();
    },
  },
  {
    name: "3-help-now",
    date: nativityDay,
    run: async (page) => {
      await page.goto(`${base}/today`, { waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Need help now" }).click();
    },
  },
  {
    name: "4-names",
    date: nativityDay,
    seed: {
      "commemorations:v1": {
        living: [{ id: "a", name: "Nicholas" }, { id: "b", name: "Fr. John" }, { id: "c", name: "Mary" }],
        departed: [{ id: "d", name: "Helen" }, { id: "e", name: "George" }],
      },
    },
    run: async (page) => {
      await page.goto(`${base}/pray?tab=names`, { waitUntil: "networkidle" });
      await page.getByRole("heading", { name: "For the health of" }).scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, -140));
    },
  },
  {
    name: "5-scripture",
    date: nativityDay,
    run: async (page) => {
      await page.goto(`${base}/read?read=daily`, { waitUntil: "networkidle" });
      await page.evaluate(() => window.scrollBy(0, 260));
    },
  },
];

for (const shot of shots) {
  const page = await phonePage(shot.date, shot.seed);
  await shot.run(page);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(outDir, "play-store", `${shot.name}.png`) });
  await page.context().close();
  console.log(`marketing/play-store/${shot.name}.png`);
}

const fonts = `
  @font-face{font-family:"Barlow Condensed";font-weight:700;src:url("${await fontData("barlow-condensed", "barlow-condensed-latin-700-normal.woff2")}")}
  @font-face{font-family:"Barlow";font-weight:500;src:url("${await fontData("barlow", "barlow-latin-500-normal.woff2")}")}
  @font-face{font-family:"Literata";font-weight:400;src:url("${await fontData("literata", "literata-latin-400-normal.woff2")}")}`;

async function render(name, width, height, html) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(`<!doctype html><style>${fonts}
    html,body{margin:0;width:${width}px;height:${height}px}
    body{box-sizing:border-box;background:radial-gradient(circle at 20% 45%,#3a4428 0,#1b2113 62%);color:#f1e8c8;font-family:"Barlow",sans-serif}
    .k{font:700 24px "Barlow Condensed";letter-spacing:.2em;text-transform:uppercase;color:#d0b063}
    h1{font:700 88px/0.95 "Barlow Condensed";text-transform:uppercase;margin:10px 0 16px}
    p{margin:0;color:#d9d2b4}
  </style>${html}`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(outDir, name) });
  await page.close();
  console.log(`marketing/${name}`);
}

await render(
  "play-store/feature-graphic.png",
  1024,
  500,
  `<div style="display:flex;align-items:center;gap:48px;height:100%;padding:0 64px;box-sizing:border-box">
     <img src="${emblem}" style="width:240px;height:240px;filter:drop-shadow(0 16px 36px rgba(0,0,0,.45))">
     <div><div class="k">Orthodox watchfulness</div><h1>Nepsis Shield</h1>
     <p style="font-size:28px;line-height:1.3;max-width:560px">Prayer, Scripture, the saints, and the fasts, for everyday life and for those who serve.</p></div>
   </div>`,
);

await render(
  "nativity-fast-share.png",
  1080,
  1080,
  `<div style="display:grid;place-items:center;align-content:center;gap:28px;height:100%;padding:90px;box-sizing:border-box;text-align:center">
     <img src="${emblem}" style="width:180px;height:180px">
     <div class="k" style="font-size:30px">Begins November 15</div>
     <h1 style="font-size:120px;margin:0">The Nativity Fast</h1>
     <p style="font-family:Literata,serif;font-size:36px;line-height:1.45;max-width:820px">Forty days of preparation for the birth of Christ: a short prayer and practice each day, with the saints along the way.</p>
     <p style="font:700 30px 'Barlow Condensed';letter-spacing:.14em;color:#d0b063">FREE · NO ACCOUNT · NEPSISSHIELD.COM</p>
   </div>`,
);

await browser.close();

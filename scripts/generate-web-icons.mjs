// Renders the PNG app icons and the social link-preview image from public/military-orthodox-cross.svg.
// Run after changing the SVG: `node scripts/generate-web-icons.mjs` (uses Playwright's Chromium,
// or installed Microsoft Edge when PLAYWRIGHT_CHANNEL=msedge).

import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");
const iconsDir = path.join(publicDir, "icons");
// setContent pages cannot load file:// URLs, so fonts are inlined as data URIs.
const fontData = async (pkg, file) =>
  `data:font/woff2;base64,${(await readFile(path.join(rootDir, "node_modules", "@fontsource", pkg, "files", file))).toString("base64")}`;

const svg = await readFile(path.join(publicDir, "military-orthodox-cross.svg"), "utf8");
// Home-screen launchers apply their own corner mask, so platform icons are rendered square.
const squareSvg = svg.replaceAll('rx="104"', 'rx="0"');
// Maskable icons may be cropped to a circle: keep the camo full-bleed and shrink the emblem into the safe zone.
const backgroundEnd = squareSvg.lastIndexOf("<rect");
const emblemStart = squareSvg.indexOf(">", backgroundEnd) + 1;
const maskableSvg =
  squareSvg.slice(0, emblemStart) +
  '<g transform="translate(51.2 51.2) scale(0.8)">' +
  squareSvg.slice(emblemStart).replace("</svg>", "</g></svg>");
const dataUri = (markup) => `data:image/svg+xml;base64,${Buffer.from(markup).toString("base64")}`;

const icons = [
  { file: "apple-touch-icon.png", size: 180, markup: squareSvg, transparent: false },
  { file: "icon-192.png", size: 192, markup: svg, transparent: true },
  { file: "icon-512.png", size: 512, markup: svg, transparent: true },
  { file: "icon-maskable-512.png", size: 512, markup: maskableSvg, transparent: false },
];

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
const page = await browser.newPage();
await mkdir(iconsDir, { recursive: true });

for (const icon of icons) {
  await page.setViewportSize({ width: icon.size, height: icon.size });
  await page.setContent(`<!doctype html>
    <style>html,body{margin:0;background:transparent}img{display:block}</style>
    <img src="${dataUri(icon.markup)}" width="${icon.size}" height="${icon.size}">`);
  await page.locator("img").evaluate((img) => img.decode());
  await page.screenshot({ path: path.join(iconsDir, icon.file), omitBackground: icon.transparent });
  console.log(`icons/${icon.file}`);
}

await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<!doctype html>
  <style>
    @font-face{font-family:"Barlow Condensed";font-weight:700;src:url("${await fontData("barlow-condensed", "barlow-condensed-latin-700-normal.woff2")}")}
    @font-face{font-family:"Barlow";font-weight:500;src:url("${await fontData("barlow", "barlow-latin-500-normal.woff2")}")}
    html,body{margin:0;width:1200px;height:630px}
    body{display:flex;align-items:center;gap:64px;padding:0 88px;box-sizing:border-box;
      background:radial-gradient(circle at 18% 50%,#3a4428 0,#1b2113 62%);color:#f1e8c8;font-family:"Barlow",sans-serif}
    img{width:300px;height:300px;flex:none;filter:drop-shadow(0 18px 40px rgba(0,0,0,.45))}
    .kicker{font:700 26px "Barlow Condensed";letter-spacing:.22em;text-transform:uppercase;color:#d0b063}
    h1{margin:10px 0 18px;font:700 104px/0.95 "Barlow Condensed";letter-spacing:.01em;text-transform:uppercase}
    p{margin:0;max-width:640px;font-size:32px;line-height:1.3;color:#d9d2b4}
    .url{margin-top:30px;font:700 28px "Barlow Condensed";letter-spacing:.12em;color:#d0b063}
  </style>
  <img src="${dataUri(svg)}">
  <div>
    <div class="kicker">Orthodox watchfulness</div>
    <h1>Nepsis Shield</h1>
    <p>Prayer, Scripture, and a steady daily rule for those who serve and protect.</p>
    <div class="url">nepsisshield.com</div>
  </div>`);
await page.evaluate(() => document.fonts.ready);
await page.locator("img").evaluate((img) => img.decode());
await page.screenshot({ path: path.join(publicDir, "og-image.png") });
console.log("og-image.png");

await browser.close();

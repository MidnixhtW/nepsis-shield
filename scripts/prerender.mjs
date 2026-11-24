// After `vite build`: writes dist/<page>.html for each public page, with that page's title, description and canonical
// link, and its text already rendered, so crawlers and link previews that skip JavaScript see the real page.
// The app still starts as usual on top of it. Run by `npm run build`.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const serverOut = path.join(root, "node_modules", ".prerender");

await build({
  root,
  logLevel: "warn",
  build: { ssr: path.join(root, "src/prerender/entry.tsx"), outDir: serverOut, emptyOutDir: true, copyPublicDir: false },
  ssr: { noExternal: true },
});

const entry = await import(pathToFileURL(path.join(serverOut, "entry.js")).href);

// Vercel only serves these files if vercel.json sends the page there, so the two lists must match.
const vercel = JSON.parse(await readFile(path.join(root, "vercel.json"), "utf8"));
// Top-level pages ("/about") use the "/:page(...)" rewrite; guide pages ("/feasts/pascha") use "/:section(...)/:slug".
const pageRewrite = vercel.rewrites.find((rule) => rule.destination === "/:page.html");
const routed = new Set(pageRewrite?.source.match(/\(([^)]*)\)/)?.[1].split("|") ?? []);
const sectionRewrite = vercel.rewrites.find((rule) => rule.destination === "/:section/:slug.html");
const sections = new Set(sectionRewrite?.source.match(/\(([^)]*)\)/)?.[1].split("|") ?? []);
const missing = entry.PUBLIC_ROUTES.map((route) => route.path.slice(1)).filter((page) => {
  const [first, slug] = page.split("/");
  return slug ? !sections.has(first) : !routed.has(page);
});
if (missing.length) throw new Error(`prerender: add ${missing.join(", ")} to the page or section rewrite in vercel.json`);
const shell = await readFile(path.join(dist, "index.html"), "utf8");

function escape(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function replaceOnce(html, pattern, replacement, what) {
  if (!pattern.test(html)) throw new Error(`prerender: index.html has no ${what}`);
  return html.replace(pattern, replacement);
}

let written = 0;
for (const meta of entry.PUBLIC_ROUTES) {
  const url = entry.canonicalUrl(meta);
  let body;
  try {
    body = entry.render(meta.path);
  } catch (error) {
    // A page that can't render on the server still gets its own title and canonical link.
    console.warn(`prerender: ${meta.path} rendered without its text (${error.message})`);
    if (process.env.PRERENDER_DEBUG) console.warn(error.stack);
    body = null;
  }

  let html = shell;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`, "<title>");
  html = replaceOnce(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`, "canonical link");
  html = replaceOnce(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`, "og:url");
  html = replaceOnce(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(meta.description)}" />`, "description");
  html = replaceOnce(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escape(meta.title)}" />`, "og:title");
  html = replaceOnce(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escape(meta.title)}" />`, "twitter:title");
  if (body) {
    // React replaces everything inside #root when it starts, so this text is only what shows before then.
    html = replaceOnce(html, /<div id="root">[\s\S]*?<\/div>\s*<\/div>/, `<div id="root">${body}</div>`, "#root boot shell");
  }

  const file = path.join(dist, `${meta.path.slice(1)}.html`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
  written += 1;
}

// A sitemap, so crawlers find every public page even if they never follow a footer link.
const sitemapUrls = [`${entry.SITE_ORIGIN}/`, ...entry.PUBLIC_ROUTES.map((meta) => entry.canonicalUrl(meta))];
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
);

// The current version, so the Android app can tell when a newer one is out (src/lib/appUpdate.ts).
const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
await writeFile(path.join(dist, "version.json"), `${JSON.stringify({ version: pkg.version })}\n`);

await rm(serverOut, { recursive: true, force: true });
console.log(`prerender: wrote ${written} pages, sitemap.xml and version.json`);

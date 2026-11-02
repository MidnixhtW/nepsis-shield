// Production web server for hosts that run a Node process (Railway, Render, a VPS).
// Serves the Vite build in dist/, falls back to index.html for client-side routes,
// and applies the security headers from public/_headers (copied to dist/_headers).
// No dependencies: uses only Node's standard library.

import { createReadStream, existsSync, readFileSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { constants as zlibConstants, createBrotliCompress, createGzip } from "node:zlib";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(rootDir, "dist");
const indexPath = path.join(distDir, "index.html");
const port = Number(process.env.PORT) || 3000;

if (!existsSync(indexPath)) {
  console.error("dist/index.html not found. Run `pnpm build` before starting the server.");
  process.exit(1);
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
};

// Read the "/*" block of the Netlify-style _headers file so there is one source of truth.
function loadSecurityHeaders() {
  const headersPath = path.join(distDir, "_headers");
  if (!existsSync(headersPath)) {
    console.warn("dist/_headers not found; serving without security headers.");
    return {};
  }

  const headers = {};
  let inGlobalBlock = false;
  for (const line of readFileSync(headersPath, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    if (!/^\s/.test(line)) {
      inGlobalBlock = line.trim() === "/*";
      continue;
    }
    if (!inGlobalBlock) continue;
    const separator = line.indexOf(":");
    if (separator > 0) headers[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return headers;
}

const securityHeaders = {
  ...loadSecurityHeaders(),
  "Strict-Transport-Security": "max-age=31536000",
};

function cacheControlFor(urlPath) {
  // Vite puts a content hash in every file name under /assets/, so they never change.
  if (urlPath.startsWith("/assets/") && /-[A-Za-z0-9_-]{8,}\.\w+$/.test(urlPath)) {
    return "public, max-age=31536000, immutable";
  }
  // Everything else (index.html, sw.js, manifest) must be rechecked so updates reach users.
  return "public, max-age=0, must-revalidate";
}

async function resolveFile(urlPath) {
  const filePath = path.normalize(path.join(distDir, urlPath));
  // Block path traversal outside dist/ and never expose the _headers config itself.
  if (!filePath.startsWith(distDir + path.sep) || path.basename(filePath) === "_headers") return null;
  try {
    const info = await stat(filePath);
    if (info.isFile()) return { filePath, info };
  } catch {
    // Not a file on disk; caller decides what to do.
  }
  return null;
}

const compressibleTypes = /^(text\/|application\/(json|manifest\+json)|image\/svg\+xml)/;

function pickEncoding(req, contentType) {
  if (!compressibleTypes.test(contentType)) return null;
  const accepted = String(req.headers["accept-encoding"] ?? "");
  if (/\bbr\b/.test(accepted)) return "br";
  if (/\bgzip\b/.test(accepted)) return "gzip";
  return null;
}

function send(req, res, status, headers, filePath) {
  const encoding = pickEncoding(req, headers["Content-Type"]);
  const finalHeaders = { ...securityHeaders, ...headers, Vary: "Accept-Encoding" };
  if (encoding) {
    finalHeaders["Content-Encoding"] = encoding;
    delete finalHeaders["Content-Length"];
  }
  res.writeHead(status, finalHeaders);
  if (req.method === "HEAD") return res.end();

  const source = createReadStream(filePath);
  if (!encoding) return source.pipe(res);
  const compressor =
    encoding === "br"
      ? createBrotliCompress({ params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 5 } })
      : createGzip();
  source.pipe(compressor).pipe(res);
}

const server = createServer(async (req, res) => {
  const method = req.method ?? "GET";
  if (method !== "GET" && method !== "HEAD") {
    res.writeHead(405, { ...securityHeaders, Allow: "GET, HEAD" });
    return res.end();
  }

  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
  } catch {
    res.writeHead(400, securityHeaders);
    return res.end("Bad request");
  }

  if (urlPath === "/healthz") {
    res.writeHead(200, { ...securityHeaders, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    return res.end("ok");
  }

  // Reserved for future server endpoints; never answer API calls with the app shell.
  if (urlPath === "/api" || urlPath.startsWith("/api/")) {
    res.writeHead(404, { ...securityHeaders, "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify({ error: "Not found" }));
  }

  const found = urlPath === "/" ? null : await resolveFile(urlPath);
  if (found) {
    const ext = path.extname(found.filePath).toLowerCase();
    return send(
      req,
      res,
      200,
      {
        "Content-Type": mimeTypes[ext] ?? "application/octet-stream",
        "Content-Length": found.info.size,
        "Cache-Control": cacheControlFor(urlPath),
        "Last-Modified": found.info.mtime.toUTCString(),
      },
      found.filePath,
    );
  }

  // Missing files that look like assets get a real 404 instead of the app shell.
  if (path.extname(urlPath) && urlPath !== "/index.html") {
    res.writeHead(404, { ...securityHeaders, "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Not found");
  }

  // Client-side route (e.g. /prayers): let React Router handle it.
  const index = await stat(indexPath);
  return send(
    req,
    res,
    200,
    {
      "Content-Type": mimeTypes[".html"],
      "Content-Length": index.size,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
    indexPath,
  );
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Nepsis Shield listening on http://localhost:${port}`);
});

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}

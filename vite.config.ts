import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import { nitro } from "nitro/vite";

const serverDir = path.resolve(__dirname, "server");
const routeExtensions = new Set([".ts", ".js", ".mts", ".mjs", ".tsx", ".jsx"]);

function hasServerRoutes(directory: string): boolean {
  if (!existsSync(directory)) return false;

  for (const entry of readdirSync(directory)) {
    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory() && hasServerRoutes(fullPath)) return true;
    if (stats.isFile() && routeExtensions.has(path.extname(entry))) return true;
  }

  return false;
}

export default defineConfig(() => {
  const shouldEnableNitro =
    process.env.VITE_DISABLE_NITRO !== "1" && process.env.VERCEL !== "1" && hasServerRoutes(serverDir);
  const plugins = shouldEnableNitro ? [react(), nitro()] : [react()];

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

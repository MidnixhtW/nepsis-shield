import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

import { nitro } from "nitro/vite";

export default defineConfig(() => {
  const shouldDisableNitro = process.env.VITE_DISABLE_NITRO === "1" || process.env.VERCEL === "1";
  const plugins = shouldDisableNitro ? [react()] : [react(), nitro()];

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

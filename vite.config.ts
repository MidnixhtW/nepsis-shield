import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

import { nitro } from "nitro/vite";

export default defineConfig(() => {
  const plugins = process.env.VITE_DISABLE_NITRO === "1" ? [react()] : [react(), nitro()];

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

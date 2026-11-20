import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { version } from "./package.json";

export default defineConfig(() => {
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          // Libraries change far less often than the app, so they get their own long-lived files: a deploy that only
          // touches app code leaves these cached (in the browser and the offline service worker), and they download in
          // parallel with the app code on a first visit.
          manualChunks(id: string) {
            if (!id.includes("node_modules")) return undefined;
            if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "vendor-react";
            if (/node_modules[\\/](react-router|@remix-run)[\\/]/.test(id)) return "vendor-router";
            if (/node_modules[\\/](@radix-ui|@floating-ui|react-remove-scroll|react-remove-scroll-bar|react-style-singleton|use-callback-ref|use-sidecar|aria-hidden|get-nonce)[\\/]/.test(id)) return "vendor-ui";
            if (/node_modules[\\/](@tanstack|date-fns|tailwind-merge|clsx|class-variance-authority|sonner)[\\/]/.test(id)) return "vendor-utils";
            return undefined;
          },
        },
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

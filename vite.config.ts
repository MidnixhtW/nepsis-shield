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

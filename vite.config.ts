import { resolve } from "path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr"; // TODO: no longer needed?
import electron from "vite-plugin-electron/simple";

const isElectron = process.env.ELECTRON === "true";

// https://vitejs.dev/config/
export default defineConfig({
  base: isElectron ? "./" : "/",
  plugins: [
    TanStackRouterVite(),
    svgr(),
    react(),
    ...(isElectron
      ? [
          electron({
            main: {
              entry: "electron/main.ts",
            },
            preload: {
              input: "electron/preload.ts",
            },
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
    },
  },
});

import { resolve } from "path";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron/simple";
import svgr from "vite-plugin-svgr"; // TODO: no longer needed?

const isElectron = process.env.ELECTRON === "true";

// https://vitejs.dev/config/
export default defineConfig({
  base: isElectron ? "./" : "/",
  plugins: [
    tanstackStart(),
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

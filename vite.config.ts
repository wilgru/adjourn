import { resolve } from "path";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron/simple";

const isElectron = process.env.ELECTRON === "true";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // "./" base is only needed for production Electron builds (file:// paths).
  // In dev, the BrowserWindow loads from http://localhost, so "/" is correct
  // and avoids breaking TanStack Start's server function routing.
  const base = isElectron && command === "build" ? "./" : "/";
  const outDir = isElectron && command === "build" ? "dist" : "dist-cloud";
  return {
    base,
    plugins: [
      tanstackStart(),
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
    build: {
      outDir,
    },
    resolve: {
      alias: {
        src: resolve(__dirname, "src"),
      },
    },
  };
});

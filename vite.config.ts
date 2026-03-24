import { resolve } from "path";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [tanstackStart(), react(), nitro({ output: { dir: "dist-cloud" } })],
  environments: {
    ssr: { build: { rollupOptions: { input: "./src/server.ts" } } },
  },
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
    },
  },
});

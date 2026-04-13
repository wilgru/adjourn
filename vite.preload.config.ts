import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
    },
  },
  // build: {
  //   outDir: ".vite/dist",
  // rollupOptions: {
  //   output: {
  //     format: "es",
  //     entryFileNames: "[name].mjs",
  //     chunkFileNames: "[name]-[hash].mjs",
  //   },
  // },
  // },
});

import type { ElectrobunConfig } from "electrobun";

export default {
  app: {
    name: "Ajourn",
    identifier: "com.adjourn.app",
    version: "0.0.1",
  },
  build: {
    bun: {
      entrypoint: "electron/index.ts",
    },
    mac: {
      icons: "resources/icon.iconset", // TODO: create icons of different sizes and put in this dir for macOS
    },
  },
} satisfies ElectrobunConfig;

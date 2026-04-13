import { VitePlugin } from "@electron-forge/plugin-vite";
import type { ForgeConfig } from "@electron-forge/shared-types";

const config: ForgeConfig = {
  packagerConfig: {
    name: "Adjourn",
    icon: "resources/icon.icon",
    extraResource: ["drizzle"],
  },
  outDir: "dist",
  rebuildConfig: {}, // This config wont rebuild better-sqlite3, we have to do it manually with electron-rebuild in the build script, see package.json
  makers: [
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
      config: {},
    },
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: "electron/main.ts",
          config: "vite.main.config.ts",
        },
        {
          entry: "electron/preload.ts",
          config: "vite.preload.config.ts",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.config.ts",
        },
      ],
    }),
  ],
};

export default config;

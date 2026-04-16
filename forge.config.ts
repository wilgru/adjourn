import { cpSync, mkdirSync } from "node:fs";
import path from "node:path";
import { VitePlugin } from "@electron-forge/plugin-vite";
import type { ForgeConfig } from "@electron-forge/shared-types";

const config: ForgeConfig = {
  packagerConfig: {
    name: "Pocketbook",
    icon: "resources/icon.icon",
    extraResource: ["drizzle"],
    asar: {
      unpack: "**/node_modules/{better-sqlite3,bindings,file-uri-to-path}/**",
    },
  },
  outDir: "dist",
  hooks: {
    packageAfterCopy: async (_forgeConfig, buildPath) => {
      const nativeDeps = ["better-sqlite3", "bindings", "file-uri-to-path"];
      for (const dep of nativeDeps) {
        const src = path.join(__dirname, "node_modules", dep);
        const dest = path.join(buildPath, "node_modules", dep);
        mkdirSync(path.dirname(dest), { recursive: true });
        cpSync(src, dest, { recursive: true });
      }
    },
  },
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

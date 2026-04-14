import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

function getDbPath(): string {
  const isProduction = process.env.NODE_ENV === "production";
  const isElectron = !!(process.versions && process.versions.electron);

  if (isElectron && isProduction) {
    const platform = process.platform;
    let appDataDir: string;

    if (platform === "darwin") {
      appDataDir = path.join(
        homedir(),
        "Library",
        "Application Support",
        "Pocketbook",
      );
    } else if (platform === "win32") {
      appDataDir = path.join(
        process.env.APPDATA ?? path.join(homedir(), "AppData", "Roaming"),
        "Pocketbook",
      );
    } else {
      appDataDir = path.join(
        process.env.XDG_DATA_HOME ?? path.join(homedir(), ".local", "share"),
        "Pocketbook",
      );
    }
    mkdirSync(appDataDir, { recursive: true });
    return path.join(appDataDir, "pocketbook.db");
  }

  // Not Electron: use a standard server location (can be customized)
  if (isProduction) {
    const serverDbDir = "/var/lib/pocketbook";

    mkdirSync(serverDbDir, { recursive: true });
    return path.join(serverDbDir, "pocketbook.db");
  }

  // In dev (both for Electron and web modes) use dev-db. Uses process.cwd() which is always the project root
  const devDbDir = path.join(process.cwd(), "dev-db");

  mkdirSync(devDbDir, { recursive: true });
  return path.join(devDbDir, "pocketbook.db");
}

const sqlite = new Database(getDbPath());
sqlite.pragma("journal_mode = WAL");

const db = drizzle(sqlite);
migrate(db, {
  migrationsFolder:
    process.env.NODE_ENV === "production"
      ? path.join(process.resourcesPath, "drizzle")
      : path.join(process.cwd(), "drizzle"),
});

export { db };

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow } from "electron";
import type { ChildProcess } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const isProd = !VITE_DEV_SERVER_URL;
const POCKETBASE_PORT = 8080;

app.setName("Adjourn");

let win: BrowserWindow | null = null;
let pocketbaseProcess: ChildProcess | null = null;

function getPocketBasePath(): string {
  const binaryName =
    process.platform === "win32" ? "pocketbase.exe" : "pocketbase";
  if (isProd) {
    return path.join(process.resourcesPath, binaryName);
  }
  // In dev, place the binary at pocketbase/<binaryName> in the project root.
  return path.join(__dirname, "..", "pocketbase", binaryName);
}

function getDataDir(): string {
  if (isProd) {
    // Store data in the OS user data directory so it persists across updates.
    return path.join(app.getPath("userData"), "pb_data");
  }
  // In dev, reuse the same pb_data folder used by Docker.
  return path.join(__dirname, "..", "pocketbase", "pb_data");
}

function waitForPocketBase(retries = 30, intervalMs = 500): Promise<void> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      const req = http.get(
        `http://127.0.0.1:${POCKETBASE_PORT}/api/health`,
        (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            retry();
          }
        },
      );
      req.on("error", retry);
      req.end();
    };
    const retry = () => {
      if (++attempts >= retries) {
        reject(new Error("PocketBase did not start in time"));
        return;
      }
      setTimeout(check, intervalMs);
    };
    check();
  });
}

async function startPocketBase(): Promise<void> {
  const execPath = getPocketBasePath();

  if (!existsSync(execPath)) {
    console.warn(
      `[PocketBase] Executable not found at: ${execPath} — skipping.`,
    );
    return;
  }

  const dataDir = getDataDir();

  pocketbaseProcess = spawn(
    execPath,
    ["serve", `--http=127.0.0.1:${POCKETBASE_PORT}`, `--dir=${dataDir}`],
    { stdio: "pipe" },
  );

  pocketbaseProcess.stdout?.on("data", (d) =>
    console.log("[PocketBase]", d.toString()),
  );
  pocketbaseProcess.stderr?.on("data", (d) =>
    console.error("[PocketBase]", d.toString()),
  );
  pocketbaseProcess.on("error", (err) =>
    console.error("[PocketBase] Process error:", err),
  );

  await waitForPocketBase();
  console.log("[PocketBase] Ready on port", POCKETBASE_PORT);
}

function createWindow() {
  const isMac = process.platform === "darwin";

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Adjourn",
    ...(isMac
      ? {
          titleBarStyle: "hidden",
          trafficLightPosition: { x: 21, y: 21 },
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("before-quit", () => {
  pocketbaseProcess?.kill();
  pocketbaseProcess = null;
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(async () => {
  await startPocketBase();
  createWindow();
});

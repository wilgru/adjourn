import { log } from "node:console";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow } from "electron";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

app.setName("Adjourn");

let win: BrowserWindow | null = null;

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

  log("VITE_DEV_SERVER_URL:", VITE_DEV_SERVER_URL);
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    // Always load from 'dist' for Electron production build
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
  // DB is managed by TanStack Start server functions via Drizzle
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
  console.log("YOOO __dirname:", __dirname);
});

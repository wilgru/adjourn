import { spawn } from "child_process";
import { log } from "console";
import http from "http";
import path from "node:path";
import { ApplicationMenu, BrowserWindow } from "electrobun/bun";

if (process.env.NODE_ENV === "development") {
  const devProcess = spawn(
    process.platform === "win32" ? "bun.exe" : "bun",
    ["--bun", "vite"],
    {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
      env: { ...process.env, VITE_ELECTROBUN: "true" },
      shell: process.platform === "win32",
    },
  );

  devProcess.on("error", (err) => {
    log("Failed to start dev server:", err);
  });
} else {
  const nitroProcess = spawn(
    process.platform === "win32" ? "bun.exe" : "bun",
    ["run", ".vite/dist/server/index.mjs"],
    {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
      env: { ...process.env, VITE_ELECTROBUN: "true" },
      shell: process.platform === "win32",
    },
  );

  nitroProcess.on("error", (err) => {
    log("Failed to start Nitro server:", err);
  });
}

function waitForServer(
  url: string,
  timeout = 10000,
  interval = 300,
): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      http
        .get(url, (res) => {
          if (res.statusCode && res.statusCode < 500) {
            resolve();
          } else {
            retry();
          }
        })
        .on("error", retry);
    }
    function retry() {
      if (Date.now() - start > timeout) {
        reject(new Error("Server did not start in time"));
      } else {
        setTimeout(check, interval);
      }
    }
    check();
  });
}

const serverUrl = "http://localhost:3000/";

await waitForServer(serverUrl);

ApplicationMenu.setApplicationMenu([
  {
    submenu: [{ label: "Quit", role: "quit" }],
  },
]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const win = new BrowserWindow({
  title: "Adjourn",
  url: "http://localhost:3000/",
  titleBarStyle: "hiddenInset",
  // trafficLightPosition: { x: 21, y: 21 }, // TODO: not supported yet in electrobun
});

// TODO: rename dir from electron to electrobun, is causing errors when renaming for some reason

// This script removes the "type": "module" line from the packaged app's package.json after build.
// Usage: node scripts/post-build.mjs

import fs from "fs";
import path from "path";

// Adjust this path if your build output changes
const buildPkgPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "../dist/Adjourn-darwin-arm64/Adjourn.app/Contents/Resources/app/package.json",
);

if (!fs.existsSync(buildPkgPath)) {
  console.error("package.json not found at", buildPkgPath);
  process.exit(1);
}

const pkgRaw = fs.readFileSync(buildPkgPath, "utf8");
let pkg;
try {
  pkg = JSON.parse(pkgRaw);
} catch (e) {
  console.error("Failed to parse package.json:", e);
  process.exit(1);
}

if (pkg.type === "module") {
  delete pkg.type;
  fs.writeFileSync(buildPkgPath, JSON.stringify(pkg, null, 2));
  console.log('Removed "type": "module" from', buildPkgPath);
} else {
  console.log('No "type": "module" field found in', buildPkgPath);
}

// Copies kids-game/index.html into android-app/www/ and runs `npx cap sync android`.
// Run from android-app/ via `npm run sync`.

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, "..");
const repoRoot = resolve(appRoot, "..");

const src = resolve(repoRoot, "kids-game", "index.html");
const dst = resolve(appRoot, "www", "index.html");

if (!existsSync(src)) {
  console.error(`ERROR: source HTML not found at ${src}`);
  process.exit(1);
}

mkdirSync(dirname(dst), { recursive: true });
copyFileSync(src, dst);
console.log(`copied ${src} -> ${dst}`);

// Only run cap sync if android platform has been added; on first run the platform
// doesn't exist yet, and cap sync would error out.
const androidDir = resolve(appRoot, "android");
if (existsSync(androidDir)) {
  console.log("running: npx cap sync android");
  execSync("npx cap sync android", { cwd: appRoot, stdio: "inherit" });
} else {
  console.log("(android platform not yet added; skipping cap sync)");
}

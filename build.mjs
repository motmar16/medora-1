import { cpSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");

// Clean and recreate dist directory
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// Files and folders to exclude from dist
const exclude = new Set([
  ".git",
  ".gitignore",
  "node_modules",
  "dist",
  "package.json",
  "package-lock.json",
  "server.mjs",
  "build.mjs",
  ".DS_Store",
  ".claude",
  "skills-lock.json",
  "ui-prompt-library",
  "ios",
  "mobile",
  "capacitor.config.json",
  "capacitor.config.ts"
]);

for (const item of readdirSync(process.cwd())) {
  if (exclude.has(item)) continue;
  cpSync(join(process.cwd(), item), join(dist, item), { recursive: true });
}

console.log("Build successful: output directory 'dist' created.");

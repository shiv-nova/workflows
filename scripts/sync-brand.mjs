#!/usr/bin/env node
// sync-brand.mjs — keep every skill's assets/brand.md byte-identical to the ONE canonical
// digest, so the brand never drifts between skills.
//
// Canonical:  skills/novagentica-engagement-pack/assets/brand.md
// Targets:    every other skills/<name>/assets/brand.md that exists.
//
// (Replaces the Design System project's `integrations/vendor-brand.js`, which was referenced
// in the repo-fixes APPLY.md but not shipped into this repo. Same job, repo-local.)
//
// Usage:  node scripts/sync-brand.mjs        # fix any drift, report what changed
//         node scripts/sync-brand.mjs --check # exit 1 if anything is out of sync (for CI)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CANON = path.join(REPO, "skills", "novagentica-engagement-pack", "assets", "brand.md");
const check = process.argv.includes("--check");

const canon = fs.readFileSync(CANON);
const skillsDir = path.join(REPO, "skills");
let drift = 0;

for (const name of fs.readdirSync(skillsDir)) {
  const bp = path.join(skillsDir, name, "assets", "brand.md");
  if (!fs.existsSync(bp) || bp === CANON) continue;
  if (fs.readFileSync(bp).equals(canon)) continue;
  drift++;
  if (check) {
    console.error(`brand drift: skills/${name}/assets/brand.md != canonical`);
  } else {
    fs.writeFileSync(bp, canon);
    console.log(`synced skills/${name}/assets/brand.md <- canonical`);
  }
}

if (check && drift) process.exit(1);
console.log(check ? "brand: all in sync" : `brand: ${drift} file(s) synced`);

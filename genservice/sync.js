#!/usr/bin/env node
// Local-dev helper: populate ./generators and ./orderforms from the CANONICAL skills/,
// so `node server.js` works outside Docker. These two folders are gitignored — the skills
// are the single source. (In Docker they are COPYed straight from skills/; see Dockerfile.)
// Runs automatically via the `prestart` npm hook.
const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const MAP = [
  ["skills/novagentica-engagement-pack/assets/generators", "generators"],
  ["skills/novagentica-order-form/scripts", "orderforms"],
];

for (const [src, dst] of MAP) {
  const from = path.join(REPO, src);
  const to = path.join(__dirname, dst);
  if (!fs.existsSync(from)) {
    console.error(`sync: canonical source missing: ${src}`);
    process.exit(1);
  }
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
  console.log(`sync: ${src} -> genservice/${dst}`);
}

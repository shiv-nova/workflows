#!/usr/bin/env node
// build-plugins.mjs — regenerate plugins/ from skills/ + the marketplace catalog.
//
// This is the ONE tool that keeps the marketplace in sync. Never hand-edit plugins/.
//
// Model (single source of truth):
//   .claude-plugin/marketplace.json  — the curated catalog (name, displayName, description,
//                                       author, license, category, keywords). Add/remove/edit
//                                       a plugin HERE.
//   skills/<name>/                    — the canonical skill content.
//   plugins/<name>/                   — GENERATED: a self-contained wrapper committed for the
//                                       git marketplace (real copies, never symlinks, so Cowork
//                                       installs are non-empty).
//
// For each catalog entry it:
//   1. refreshes plugins/<name>/skills/<name>/  as a real (dereferenced) copy of skills/<name>
//   2. writes plugins/<name>/.claude-plugin/plugin.json from the catalog fields
//   3. ensures plugins/<name>/agents/<name>.md exists (keeps a hand-tuned one; generates if missing)
//   4. bumps the version (patch by default, or --version=X.Y.Z) in the catalog + every plugin.json
//   5. prunes plugins/<name> dirs and .claude/skills/<name> symlinks not in the catalog
//   6. refreshes .claude/skills/<name> -> ../../skills/<name> for in-repo use
//
// Usage:
//   node scripts/build-plugins.mjs            # bump patch, regenerate, validate
//   node scripts/build-plugins.mjs --version=1.2.0
//   node scripts/build-plugins.mjs --no-bump  # regenerate without changing versions
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG = path.join(REPO, ".claude-plugin", "marketplace.json");

const argv = process.argv.slice(2);
const explicit = argv.find((a) => a.startsWith("--version="))?.split("=")[1];
const noBump = argv.includes("--no-bump");

function bumpPatch(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v || "");
  if (!m) return "1.0.0";
  return `${m[1]}.${m[2]}.${Number(m[3]) + 1}`;
}

const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
const entries = catalog.plugins;

// One version string for the whole catalog (they are released together).
const current = entries[0]?.version || "1.0.0";
const version = explicit || (noBump ? current : bumpPatch(current));

const defaultAgent = (name, displayName, description) => `---
name: ${name}
description: "${description.replace(/"/g, "'")} Runs the ${name} skill."
skills: [${name}]
---

You are the ${displayName} agent. The \`${name}\` skill is preloaded and is your single source of truth.

When invoked:
1. Apply the \`${name}\` skill's workflow, conventions, and templates exactly.
2. Ask for any missing critical inputs instead of fabricating them.
3. Produce the artefacts the skill defines.

Do not improvise outside the skill's defined process.
`;

const keep = new Set();
for (const e of entries) {
  const name = e.name;
  keep.add(name);
  const skillDir = path.join(REPO, "skills", name);
  if (!fs.existsSync(skillDir)) throw new Error(`catalog references missing skills/${name}`);

  const pdir = path.join(REPO, "plugins", name);
  // 1. skill copy (real, dereferenced)
  const skillsDest = path.join(pdir, "skills", name);
  fs.rmSync(skillsDest, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(skillsDest), { recursive: true });
  fs.cpSync(skillDir, skillsDest, { recursive: true, dereference: true });

  // 2. plugin.json from the catalog entry
  e.version = version;
  const manifest = {
    name: e.name,
    displayName: e.displayName,
    description: e.description,
    version,
    author: e.author,
    license: e.license,
    keywords: e.keywords,
  };
  const mdir = path.join(pdir, ".claude-plugin");
  fs.mkdirSync(mdir, { recursive: true });
  fs.writeFileSync(path.join(mdir, "plugin.json"), JSON.stringify(manifest, null, 2) + "\n");

  // 3. agent (preserve a hand-tuned one; generate if missing)
  const adir = path.join(pdir, "agents");
  fs.mkdirSync(adir, { recursive: true });
  const apath = path.join(adir, `${name}.md`);
  if (!fs.existsSync(apath)) {
    fs.writeFileSync(apath, defaultAgent(name, e.displayName, e.description));
  }

  // 6. in-repo symlink
  const link = path.join(REPO, ".claude", "skills", name);
  fs.rmSync(link, { recursive: true, force: true });
  fs.symlinkSync(path.join("..", "..", "skills", name), link);
}

// 5. prune plugins/ and .claude/skills/ not in the catalog
for (const dir of fs.readdirSync(path.join(REPO, "plugins"))) {
  if (!keep.has(dir)) fs.rmSync(path.join(REPO, "plugins", dir), { recursive: true, force: true });
}
for (const link of fs.readdirSync(path.join(REPO, ".claude", "skills"))) {
  if (!keep.has(link)) fs.rmSync(path.join(REPO, ".claude", "skills", link), { recursive: true, force: true });
}

fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2) + "\n");
console.log(`build-plugins: regenerated ${entries.length} plugins at version ${version}`);

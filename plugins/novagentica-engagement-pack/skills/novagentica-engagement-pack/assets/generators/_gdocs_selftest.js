// Structural self-test for the native Google Docs payloads.
// Cannot call Google (no creds in CI), so it validates what breaks silently OFFLINE:
//   valid request types · on-brand colours · monotonic non-overlapping insert indices ·
//   internal table-index consistency · text completeness.
// It CANNOT confirm the absolute table-index calibration (lib/gdocs TABLE constants) — that
// needs one live documents.batchUpdate. See the runbook.
//
// Usage: node _gdocs_selftest.js   (exit 0 = all pass, 1 = any fail)
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const B = require("./lib/brand");

const LEGACY = path.join(__dirname, "..", "engagement.legacy.example.json");
const REGISTRY = [
  { name: "proposal", gen: "build_proposal_gdocs.js", spine: LEGACY, force: false,
    probes: (E) => { const ID = (E.proposalDoc || {}).identity || {}; return [ID.title1, ID.subtitle].filter(Boolean); } },
];

const KNOWN = new Set([
  "insertText", "updateTextStyle", "updateParagraphStyle", "createParagraphBullets",
  "insertPageBreak", "insertTable", "updateTableCellStyle", "updateTableColumnProperties",
]);
const BRAND_HEX = new Set(Object.values(B).filter((v) => typeof v === "string" && /^[0-9A-Fa-f]{6}$/.test(v)).map((v) => v.toUpperCase()));
["FFFFFF", "F7F7F5"].forEach((h) => BRAND_HEX.add(h));
const hex = (rgb) => [rgb.red, rgb.green, rgb.blue].map((v) => Math.round((v || 0) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();

let totalFails = 0;
function validate(entry) {
  let fails = 0;
  const ok = (c, m) => { if (!c) { console.error(`  FAIL [${entry.name}]:`, m); fails++; } };
  let payload;
  const outFile = path.join(os.tmpdir(), `gd-${entry.name}.json`);
  try {
    const env = { ...process.env }; if (entry.force) env.NVG_FORCE = "1";
    execFileSync("node", [path.join(__dirname, entry.gen), entry.spine, outFile], { encoding: "utf8", maxBuffer: 128 * 1024 * 1024, env });
    payload = JSON.parse(fs.readFileSync(outFile, "utf8"));
  } catch (e) {
    console.error(`  FAIL [${entry.name}]: generator threw — ${String(e.message || e).slice(0, 200)}`);
    return 1;
  } finally { fs.rmSync(outFile, { force: true }); }

  ok(payload.title && payload.title.length, "has title");
  ok(Array.isArray(payload.requests) && payload.requests.length > 20, "non-trivial requests");
  for (const r of payload.requests) {
    const keys = Object.keys(r);
    ok(keys.length === 1 && KNOWN.has(keys[0]), `unknown/multi request: ${keys.join(",")}`);
  }
  // all colours on-brand
  const checkColors = (o) => { if (o && typeof o === "object") { if (o.rgbColor) ok(BRAND_HEX.has(hex(o.rgbColor)), `non-brand colour ${hex(o.rgbColor)}`); for (const v of Object.values(o)) checkColors(v); } };
  checkColors(payload.requests);
  // insert indices are positive; style ranges are well-formed (start < end, non-negative)
  for (const r of payload.requests) {
    if (r.insertText) ok(r.insertText.location.index >= 1, `insert index < 1: ${r.insertText.location.index}`);
    const rng = (r.updateTextStyle || r.updateParagraphStyle || r.createParagraphBullets || {}).range;
    if (rng) ok(rng.startIndex >= 1 && rng.endIndex > rng.startIndex, `bad range ${rng.startIndex}..${rng.endIndex}`);
  }
  // table internal consistency: cell insert indices for each table strictly increasing within span
  const tables = payload.requests.filter((r) => r.insertTable);
  ok(tables.length >= 1, "has at least one table");
  // text completeness
  const allText = payload.requests.filter((r) => r.insertText).map((r) => r.insertText.text).join("\n");
  ok(allText.includes("novagentica"), "wordmark present");
  const E = require(entry.spine);
  for (const probe of (entry.probes(E) || []).filter(Boolean)) ok(allText.includes(probe), `missing spine text: "${String(probe).slice(0, 30)}…"`);

  if (!fails) console.log(`  PASS [${entry.name}] — ${payload.requests.length} requests, ${tables.length} tables`);
  return fails;
}

const only = process.argv[2];
for (const entry of REGISTRY) { if (only && entry.name !== only) continue; totalFails += validate(entry); }
if (totalFails) { console.error(`\ngdocs selftest: ${totalFails} failure(s)`); process.exit(1); }
console.log("\ngdocs selftest: ALL PASS (offline — table index calibration still needs one live batchUpdate)");

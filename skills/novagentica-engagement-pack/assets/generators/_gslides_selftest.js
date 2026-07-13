// Structural self-test for the native Google Slides payloads (all converted decks).
// Cannot call Google (no creds in CI), so it validates the batchUpdate payload is well-formed,
// on-brand, on-canvas, and text-complete — the parts that break silently.
//
// Usage: node _gslides_selftest.js   (exit 0 = all pass, 1 = any fail)
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const B = require("./lib/brand");
const { SLIDE_W_IN, SLIDE_H_IN, EMU } = require("./lib/gslides");

// Registry: each converted deck + a spine that exercises it + text probes that must appear.
const LEGACY = path.join(__dirname, "..", "engagement.legacy.example.json");
const EXAMPLE = path.join(__dirname, "..", "engagement.example.json");
const REGISTRY = [
  { name: "execsummary", gen: "build_execsummary_gslides.js", spine: LEGACY,
    probes: (E) => { const X = (E.decks || {}).execSummary || {}; return [X.coverHeadline, X.situationHeadline, X.slateHeadline]; } },
  { name: "timeline", gen: "build_timeline_gslides.js", spine: EXAMPLE, probes: () => [] },
  { name: "proposaldeck", gen: "build_proposaldeck_gslides.js", spine: LEGACY, probes: () => [] },
  { name: "summary6", gen: "build_summary6_gslides.js", spine: path.join(__dirname, "..", "engagement.example.json"), force: true, probes: () => [] },
];

const KNOWN = new Set([
  "createSlide", "updatePageProperties", "createShape", "insertText", "updateTextStyle",
  "updateParagraphStyle", "updateShapeProperties", "createLine", "updateLineProperties",
  "createTable", "updateTableColumnProperties", "updateTableBorderProperties",
  "updateTableCellProperties", "updateTableRowProperties",
]);
const BRAND_HEX = new Set(Object.values(B).filter((v) => typeof v === "string" && /^[0-9A-Fa-f]{6}$/.test(v)).map((v) => v.toUpperCase()));
BRAND_HEX.add("FFFFFF");
const hex = (rgb) => [rgb.red, rgb.green, rgb.blue].map((v) => Math.round((v || 0) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();

let totalFails = 0;
function validate(entry) {
  let fails = 0;
  const ok = (cond, msg) => { if (!cond) { console.error(`  FAIL [${entry.name}]:`, msg); fails++; } };
  let payload;
  const outFile = path.join(os.tmpdir(), `gs-${entry.name}-${entry.gen.length}.json`);
  try {
    const env = { ...process.env };
    if (entry.force) env.NVG_FORCE = "1";
    // pass an out-file arg so the payload never shares stdout with preflight/log noise
    execFileSync("node", [path.join(__dirname, entry.gen), entry.spine, outFile], { encoding: "utf8", maxBuffer: 128 * 1024 * 1024, env });
    payload = JSON.parse(fs.readFileSync(outFile, "utf8"));
  } catch (e) {
    console.error(`  FAIL [${entry.name}]: generator threw — ${String(e.message || e).slice(0, 200)}`);
    return 1;
  } finally {
    fs.rmSync(outFile, { force: true });
  }
  ok(payload.title && payload.title.length, "has title");
  ok(payload.slideCount >= 1, "has slides");
  ok(Array.isArray(payload.requests) && payload.requests.length > 20, "non-trivial requests");

  const created = new Set();
  for (const r of payload.requests) {
    const keys = Object.keys(r);
    ok(keys.length === 1 && KNOWN.has(keys[0]), `unknown/multi request: ${keys.join(",")}`);
    const c = r.createSlide || r.createShape || r.createLine || r.createTable;
    if (c) { ok(!created.has(c.objectId), `dup id ${c.objectId}`); created.add(c.objectId); }
  }
  for (const r of payload.requests) {
    const t = r.insertText || r.updateTextStyle || r.updateShapeProperties || r.updateLineProperties || r.updateParagraphStyle;
    if (t && t.objectId) ok(created.has(t.objectId), `targets uncreated id ${t.objectId}`);
  }

  const checkColors = (obj) => {
    if (obj && typeof obj === "object") {
      if (obj.rgbColor) ok(BRAND_HEX.has(hex(obj.rgbColor)), `non-brand colour ${hex(obj.rgbColor)}`);
      for (const v of Object.values(obj)) checkColors(v);
    }
  };
  checkColors(payload.requests);

  const Wemu = SLIDE_W_IN * EMU, Hemu = SLIDE_H_IN * EMU;
  for (const r of payload.requests) {
    const c = r.createShape || r.createLine || r.createTable;
    if (!c || !c.elementProperties.transform) continue;
    const tr = c.elementProperties.transform;
    // rotated elements carry shear; skip the strict bound check for those
    if (tr.shearX || tr.shearY) continue;
    ok(tr.translateX >= -2 && tr.translateX <= Wemu + 2, `x off-canvas: ${tr.translateX}`);
    ok(tr.translateY >= -2 && tr.translateY <= Hemu + 2, `y off-canvas: ${tr.translateY}`);
  }

  const allText = payload.requests.filter((r) => r.insertText).map((r) => r.insertText.text).join("\n");
  ok(allText.includes("nova") && allText.includes("gentica"), "wordmark present");
  const E = require(entry.spine);
  for (const probe of (entry.probes(E) || []).filter(Boolean)) {
    ok(allText.includes(probe), `missing spine text: "${String(probe).slice(0, 30)}…"`);
  }

  if (!fails) console.log(`  PASS [${entry.name}] — ${payload.slideCount} slides, ${payload.requests.length} requests`);
  return fails;
}

const only = process.argv[2];
for (const entry of REGISTRY) {
  if (only && entry.name !== only) continue;
  totalFails += validate(entry);
}
if (totalFails) { console.error(`\ngslides selftest: ${totalFails} failure(s)`); process.exit(1); }
console.log("\ngslides selftest: ALL PASS");

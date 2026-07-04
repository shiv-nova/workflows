// Structural self-test for the native Google Slides payload builder.
// It cannot call Google (no creds in CI), so it validates that the batchUpdate payload is
// well-formed, on-brand, on-canvas, and text-complete — the parts that break silently.
//
// Usage: node _gslides_selftest.js   (exit 0 = pass, 1 = fail)
const { execFileSync } = require("child_process");
const path = require("path");
const B = require("./lib/brand");
const { SLIDE_W_IN, SLIDE_H_IN, EMU } = require("./lib/gslides");

const SPINE = path.join(__dirname, "..", "engagement.legacy.example.json");
const GEN = path.join(__dirname, "build_execsummary_gslides.js");

const KNOWN_REQUESTS = new Set([
  "createSlide", "updatePageProperties", "createShape", "insertText",
  "updateTextStyle", "updateParagraphStyle", "updateShapeProperties", "createLine", "updateLineProperties",
]);
// every colour a brand token may resolve to (hex, no #)
const BRAND_HEX = new Set(Object.values(B).filter((v) => typeof v === "string" && /^[0-9A-Fa-f]{6}$/.test(v)));

let fails = 0;
const ok = (cond, msg) => { if (!cond) { console.error("FAIL:", msg); fails++; } };

const payload = JSON.parse(execFileSync("node", [GEN, SPINE], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }));

// 1. shape
ok(payload.title && payload.title.length > 0, "payload has a title");
ok(payload.slideCount === 6, `expected 6 slides, got ${payload.slideCount}`);
ok(Array.isArray(payload.requests) && payload.requests.length > 100, "requests[] is non-trivial");

// 2. every request is a single known Slides API request type
for (const r of payload.requests) {
  const keys = Object.keys(r);
  ok(keys.length === 1 && KNOWN_REQUESTS.has(keys[0]), `unknown/multi request: ${keys.join(",")}`);
}

// 3. objectIds are unique across all create* requests; every insert/style targets a created id
const created = new Set();
let dupe = 0;
for (const r of payload.requests) {
  const c = r.createSlide || r.createShape || r.createLine;
  if (c) { if (created.has(c.objectId)) dupe++; created.add(c.objectId); }
}
ok(dupe === 0, `${dupe} duplicate objectIds`);
for (const r of payload.requests) {
  const t = r.insertText || r.updateTextStyle || r.updateShapeProperties || r.updateLineProperties || r.updateParagraphStyle;
  if (t && t.objectId) ok(created.has(t.objectId), `request targets uncreated id ${t.objectId}`);
}

// 4. every colour used is a brand token
const hex = (rgb) => [rgb.red, rgb.green, rgb.blue].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
function checkColors(obj) {
  if (obj && typeof obj === "object") {
    if (obj.rgbColor) ok(BRAND_HEX.has(hex(obj.rgbColor)), `non-brand colour ${hex(obj.rgbColor)}`);
    for (const v of Object.values(obj)) checkColors(v);
  }
}
checkColors(payload.requests);

// 5. every element sits on the canvas (0..slide bounds, EMU)
const Wemu = SLIDE_W_IN * EMU, Hemu = SLIDE_H_IN * EMU;
for (const r of payload.requests) {
  const c = r.createShape || r.createLine;
  if (!c) continue;
  const ep = c.elementProperties, tr = ep.transform, sz = ep.size;
  ok(tr.translateX >= -1 && tr.translateX <= Wemu + 1, `x off-canvas: ${tr.translateX}`);
  ok(tr.translateY >= -1 && tr.translateY <= Hemu + 1, `y off-canvas: ${tr.translateY}`);
  ok(tr.translateX + sz.width.magnitude <= Wemu + 5000, `overflows right: ${c.objectId}`);
}

// 6. text completeness — key spine strings must appear in some insertText
const allText = payload.requests.filter((r) => r.insertText).map((r) => r.insertText.text).join("\n");
const E = require(SPINE);
const X = (E.decks || {}).execSummary || {};
for (const probe of [X.coverHeadline, X.situationHeadline, X.slateHeadline].filter(Boolean)) {
  ok(allText.includes(probe), `missing spine text: "${String(probe).slice(0, 30)}…"`);
}
ok(allText.includes("nova") && allText.includes("gentica"), "wordmark present on slides");

if (fails) { console.error(`\ngslides selftest: ${fails} failure(s)`); process.exit(1); }
console.log(`gslides selftest: PASS — ${payload.slideCount} slides, ${payload.requests.length} requests, all on-brand & on-canvas`);

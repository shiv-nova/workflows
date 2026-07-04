// Novagentica engagement-pack — Executive Summary deck, NATIVE GOOGLE SLIDES.
// Same 6-slide spine as build_execsummary.js (pptx), same brand, but emits a Google Slides
// `presentations.batchUpdate` payload instead of a .pptx file. n8n runs:
//   presentations.create {title}  ->  presentations.batchUpdate {requests}
// See workflows/n8n/docs/gslides-execution-runbook.md.
//
// Usage: node build_execsummary_gslides.js [engagement.json] [out.json]
//        (no out.json -> prints the payload to stdout)
const fs = require("fs");
const { Deck, brand: B } = require("./lib/gslides");

const SPINE_PATH = process.argv[2] || "engagement.json";
const E = JSON.parse(fs.readFileSync(SPINE_PATH, "utf8"));
const D = E.decks || {};
const X = D.execSummary || {};
const C = E.commercials || {};
const client = E.client || {};

const M = 0.6, W = 13.333, CW = W - 2 * M;
const TOTAL = 6;
const CLIENT = client.name || "[Client]";
const META = `NOVAGENTICA × ${CLIENT.toUpperCase()} · ${X.metaSuffix || ""}`;
const cur = C.currency || "CHF";
const dayRate = C.dayRate || 0;
const money = (n) => `${cur} ${Number(n).toLocaleString("en-US")}`;
const lic = C.licence || {};
const tot = C.totals || {};

// map the spine's colour tokens to brand hex (same contract as the pptx renderer)
const COLORS = { ACCENT: B.ACCENT, INK: B.INK, MUTED: B.MUTED };
const norm = (runs) => (runs || []).map((r) => {
  const o = Object.assign({}, r.options);
  if (o.color && COLORS[o.color]) o.color = COLORS[o.color];
  return { text: r.text, options: o };
});

const deck = new Deck(X.presentationTitle || `Novagentica × ${CLIENT} — Executive Summary`);

// ---- composite helpers (mirror build_execsummary.js) ----
function base(roman) {
  const s = deck.slide(B.BG);
  if (roman) {
    deck.textBox(s, roman, { x: M, y: 0.42, w: 1, h: 0.4, font: B.SERIF, italic: true, bold: true, size: 14, color: B.ACCENT });
  } else {
    deck.rect(s, { x: M, y: 0.48, w: 0.2, h: 0.2, fill: B.ACCENT });
  }
  deck.rect(s, { x: M, y: 0.8, w: 0.5, h: 0.028, fill: B.ACCENT });
  deck.textBox(s, META, { x: W - M - 6.5, y: 0.42, w: 6.5, h: 0.3, align: "right", font: B.SANS, bold: true, size: 9.5, color: B.MUTED });
  rule(s, 1.02);
  return s;
}
const rule = (s, y) => deck.line(s, { x: M, y, w: CW, color: B.RULE, weight: 0.75 });
const eyebrow = (s, t, y) => deck.textBox(s, t || "", { x: M, y, w: CW, h: 0.3, font: B.SANS, bold: true, size: 11.5, color: B.MUTED });
const headline = (s, t, y, size) => deck.textBox(s, t || "", { x: M, y, w: CW, h: 1.2, font: B.SANS, bold: true, size: size || 40, color: B.INK });
const subhead = (s, t, y) => deck.textBox(s, t || "", { x: M, y, w: CW, h: 0.6, font: B.SERIF, italic: true, bold: true, size: 22, color: B.ACCENT });
const closer = (s, runs) => { rule(s, 6.55); deck.textBox(s, runs, { x: M, y: 6.62, w: CW, h: 0.35, font: B.SERIF, italic: true, size: 14.5, color: B.INK }); };
function footer(s, page) {
  deck.textBox(s, [{ text: "nova", options: { color: B.INK } }, { text: "gentica", options: { color: B.ACCENT } }],
    { x: M, y: 7.0, w: 3, h: 0.3, font: B.SANS, bold: true, size: 14 });
  deck.textBox(s, `0${page} / 0${TOTAL}`, { x: W - M - 2, y: 7.02, w: 2, h: 0.3, align: "right", font: B.SANS, size: 10, color: B.MUTED });
}
function themedRows(s, rows, top) {
  let y = top; const rowH = 0.92;
  (rows || []).forEach((r, i) => {
    if (i > 0) deck.line(s, { x: M, y: y - 0.06, w: CW, color: B.RULE, weight: 0.5 });
    deck.textBox(s, r.label, { x: M, y: y + 0.04, w: 2.7, h: 0.6, font: B.SANS, bold: true, size: 12, color: B.ACCENT });
    deck.textBox(s, r.fact, { x: M + 2.9, y: y - 0.02, w: CW - 2.9, h: 0.8, font: B.SERIF, size: 16.5, color: B.INK });
    y += rowH;
  });
}
function numberedStack(s, items, top) {
  let y = top; const rowH = 0.98;
  (items || []).forEach((it) => {
    const col = it.hi ? B.ACCENT : B.INK;
    deck.textBox(s, it.n, { x: M, y: y - 0.05, w: 0.9, h: 0.7, font: B.SANS, bold: true, size: 26, color: col });
    deck.textBox(s, it.label, { x: M + 1.0, y: y - 0.04, w: 4.2, h: 0.7, font: B.SANS, bold: true, size: 14.5, color: B.INK, valign: "middle" });
    deck.textBox(s, it.body, { x: M + 5.3, y: y - 0.04, w: CW - 5.3, h: 0.7, font: B.SERIF, size: 15, color: B.INK, valign: "middle" });
    y += rowH;
    deck.line(s, { x: M, y: y - 0.1, w: CW, color: B.RULE, weight: 0.5 });
  });
}
function archFlow(s, tiles, top) {
  const n = (tiles || []).length, gap = 0.22, tw = (CW - gap * (n - 1)) / n, th = 2.55;
  let x = M;
  (tiles || []).forEach((t) => {
    deck.rect(s, { x, y: top, w: tw, h: th, fill: B.BG, line: { color: B.RULE, width: 0.75 } });
    deck.rect(s, { x: x + 0.16, y: top + 0.18, w: 0.48, h: 0.48, fill: B.ACCENT });
    deck.textBox(s, t.n, { x: x + 0.16, y: top + 0.18, w: 0.48, h: 0.48, align: "center", valign: "middle", font: B.SANS, bold: true, size: 15, color: B.WHITE });
    deck.textBox(s, t.when, { x: x + 0.16, y: top + 0.78, w: tw - 0.32, h: 0.4, font: B.SANS, bold: true, size: 9, color: t.gate ? B.ACCENT : B.MUTED });
    deck.textBox(s, t.label, { x: x + 0.16, y: top + 1.2, w: tw - 0.32, h: 0.4, font: B.SANS, bold: true, size: 12.5, color: B.INK });
    deck.textBox(s, t.desc, { x: x + 0.16, y: top + 1.6, w: tw - 0.32, h: 0.85, font: B.SERIF, size: 10.5, color: B.INK, valign: "top" });
    x += tw + gap;
  });
}

// ---------- SLIDE 1 — Title ----------
let s = base(null);
eyebrow(s, X.coverEyebrow, 1.45);
headline(s, X.coverHeadline, 1.95, 50);
subhead(s, X.coverSubhead, 3.95);
rule(s, 4.7);
deck.textBox(s, D.preparedFor || "", { x: M, y: 4.85, w: CW, h: 0.35, font: B.SERIF, italic: true, size: 14, color: B.MUTED });
closer(s, norm(X.coverCloser));
footer(s, 1);

// ---------- SLIDE 2 — Situation ----------
s = base("I.");
eyebrow(s, X.situationEyebrow, 1.35);
headline(s, X.situationHeadline, 1.75, 33);
rule(s, 2.95);
themedRows(s, X.situationRows, 3.25);
closer(s, norm(X.situationCloser));
footer(s, 2);

// ---------- SLIDE 3 — The slate ----------
s = base("II.");
eyebrow(s, X.slateEyebrow, 1.35);
headline(s, X.slateHeadline, 1.75, 36);
rule(s, 2.85);
numberedStack(s, X.slate, 3.15);
closer(s, norm(X.slateCloser));
footer(s, 3);

// ---------- SLIDE 4 — The plan ----------
s = base("III.");
eyebrow(s, D.planEyebrow, 1.35);
headline(s, D.planHeadline, 1.75, 34);
rule(s, 2.95);
archFlow(s, D.planTiles, 3.25);
closer(s, norm(D.planCloser));
footer(s, 4);

// ---------- SLIDE 5 — Why safe + economics ----------
s = base("IV.");
eyebrow(s, X.whyEyebrow, 1.35);
headline(s, X.whyHeadline, 1.75, 34);
rule(s, 2.95);
deck.rect(s, { x: M + CW / 2 - 0.01, y: 3.25, w: 0.022, h: 2.9, fill: B.ACCENT });
const colL = M, colR = M + CW / 2 + 0.4, colW = CW / 2 - 0.45;
deck.textBox(s, X.controlTitle || "", { x: colL, y: 3.2, w: colW, h: 0.3, font: B.SANS, bold: true, size: 11.5, color: B.ACCENT });
deck.textBox(s, (X.controlBullets || []).join("\n"), { x: colL, y: 3.55, w: colW, h: 2.6, font: B.SERIF, size: 14.5, color: B.INK, valign: "top" });
deck.textBox(s, X.economicsTitle || "", { x: colR, y: 3.2, w: colW, h: 0.3, font: B.SANS, bold: true, size: 11.5, color: B.ACCENT });
const econRuns = [
  { text: `${X.economicsLicenceLabel || ""}${lic.tier || ""} tier · `, options: {} },
  { text: `${money(lic.annualPrice || 0)} / yr`, options: { bold: true } },
  { text: `  (${lic.term || ""} term)\n`, options: {} },
  { text: `${X.economicsIntroNote || ""}\n`, options: { fontSize: 11, color: B.MUTED } },
  { text: `${X.economicsDeliveryLabel || ""}${(tot.fullSlate || {}).days || 0} days · `, options: {} },
  { text: `${money((tot.fullSlate || {}).amount || 0)}\n`, options: { bold: true } },
  { text: `(confirmed-only ${(tot.confirmedOnly || {}).days || 0} days · ${money((tot.confirmedOnly || {}).amount || 0)})\n`, options: { fontSize: 12.5, color: B.MUTED } },
  { text: `${X.economicsServicesPre || ""}${money(dayRate)}${X.economicsServicesPost || ""}`, options: {} },
];
deck.textBox(s, econRuns, { x: colR, y: 3.55, w: colW, h: 2.7, font: B.SERIF, size: 14.5, color: B.INK, valign: "top" });
closer(s, norm(X.whyCloser));
footer(s, 5);

// ---------- SLIDE 6 — The ask ----------
s = base("V.");
eyebrow(s, X.askEyebrow, 1.35);
headline(s, D.askHeadline, 1.75, 34);
rule(s, 2.95);
themedRows(s, D.askRows, 3.25);
rule(s, 6.45);
deck.textBox(s, norm(D.askLine), { x: M, y: 6.55, w: CW, h: 0.4, font: B.SERIF, size: 16, color: B.INK });
footer(s, 6);

const payload = deck.payload();
const out = process.argv[3];
if (out) { fs.writeFileSync(out, JSON.stringify(payload, null, 2)); console.log(`gslides payload written: ${out} (${payload.slideCount} slides, ${payload.requests.length} requests)`); }
else { process.stdout.write(JSON.stringify(payload, null, 2)); }

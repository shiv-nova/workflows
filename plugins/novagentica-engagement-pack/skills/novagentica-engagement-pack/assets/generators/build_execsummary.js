// Novagentica engagement-pack — Executive Summary deck (6 slides).
// PURE RENDERER. No client / date / price literals. Slide text lives in the spine
// at engagement.json → decks (shared fields) + decks.execSummary; numbers and the
// META/identity line are derived from client / commercials. See references/data-model.md.
// Usage: node build_execsummary.js [engagement.json] [out.pptx]
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "NOVA", width: 13.333, height: 7.5 });
p.layout = "NOVA";

const SPINE_PATH = process.argv[2] || "engagement.json";
const E = JSON.parse(fs.readFileSync(SPINE_PATH, "utf8"));
const D = E.decks || {};
const X = D.execSummary || {};
const C = E.commercials || {};
const client = E.client || {};

// Tokens
const BG = "FAFBF6", INK = "0E0E0C", ACCENT = "CC0D2C", MUTED = "8A8A86", RULE = "D9D9D2";
const SANS = "Inter", SERIF = "Georgia";
const M = 0.6, W = 13.333, CW = W - 2 * M;
const TOTAL = 6;

// ---- derived identity + numbers ----
const CLIENT = client.name || "[Client]";
const META = `NOVAGENTICA × ${CLIENT.toUpperCase()} · ${X.metaSuffix || ""}`;
const cur = C.currency || "CHF";
const dayRate = C.dayRate || 0;
const money = n => `${cur} ${Number(n).toLocaleString("en-US")}`;
const lic = C.licence || {};
const tot = C.totals || {};

// map color tokens used in spine run-specs to brand hex
const COLORS = { ACCENT, INK, MUTED };
function norm(runs) {
  return (runs || []).map(r => {
    const o = Object.assign({}, r.options);
    if (o.color && COLORS[o.color]) o.color = COLORS[o.color];
    return { text: r.text, options: o };
  });
}

function base(roman) {
  const s = p.addSlide();
  s.background = { color: BG };
  if (roman) {
    s.addText(roman, { x: M, y: 0.42, w: 1, h: 0.4, fontFace: SERIF, italic: true, bold: true, fontSize: 14, color: ACCENT });
  } else {
    s.addShape(p.ShapeType.rect, { x: M, y: 0.48, w: 0.2, h: 0.2, fill: { color: ACCENT } });
  }
  s.addShape(p.ShapeType.rect, { x: M, y: 0.8, w: 0.5, h: 0.028, fill: { color: ACCENT } });
  s.addText(META, { x: W - M - 6.5, y: 0.42, w: 6.5, h: 0.3, align: "right", fontFace: SANS, bold: true, fontSize: 9.5, color: MUTED, charSpacing: 1.5 });
  rule(s, 1.02);
  return s;
}
function rule(s, y) { s.addShape(p.ShapeType.line, { x: M, y, w: CW, h: 0, line: { color: RULE, width: 0.75 } }); }
function eyebrow(s, t, y) { s.addText(t, { x: M, y, w: CW, h: 0.3, fontFace: SANS, bold: true, fontSize: 11.5, color: MUTED, charSpacing: 1.8 }); }
function headline(s, t, y, size) { s.addText(t, { x: M, y, w: CW, h: 1.2, fontFace: SANS, bold: true, fontSize: size || 40, color: INK, lineSpacing: (size || 40) * 1.05 }); }
function subhead(s, t, y) { s.addText(t, { x: M, y, w: CW, h: 0.6, fontFace: SERIF, italic: true, bold: true, fontSize: 22, color: ACCENT }); }
function closer(s, runs) { rule(s, 6.55); s.addText(runs, { x: M, y: 6.62, w: CW, h: 0.35, fontFace: SERIF, italic: true, fontSize: 14.5, color: INK }); }
function footer(s, page) {
  s.addText([{ text: "nova", options: { color: INK } }, { text: "gentica", options: { color: ACCENT } }],
    { x: M, y: 7.0, w: 3, h: 0.3, fontFace: SANS, bold: true, fontSize: 14 });
  s.addText(`0${page} / 0${TOTAL}`, { x: W - M - 2, y: 7.02, w: 2, h: 0.3, align: "right", fontFace: SANS, fontSize: 10, color: MUTED });
}
function themedRows(s, rows, top) {
  let y = top; const rowH = 0.92;
  rows.forEach((r, i) => {
    if (i > 0) s.addShape(p.ShapeType.line, { x: M, y: y - 0.06, w: CW, h: 0, line: { color: RULE, width: 0.5 } });
    s.addText(r.label, { x: M, y: y + 0.04, w: 2.7, h: 0.6, fontFace: SANS, bold: true, fontSize: 12, color: ACCENT, charSpacing: 1.2 });
    s.addText(r.fact, { x: M + 2.9, y: y - 0.02, w: CW - 2.9, h: 0.8, fontFace: SERIF, fontSize: 16.5, color: INK, lineSpacing: 21 });
    y += rowH;
  });
}
function numberedStack(s, items, top) {
  let y = top; const rowH = 0.98;
  items.forEach((it) => {
    const col = it.hi ? ACCENT : INK;
    s.addText(it.n, { x: M, y: y - 0.05, w: 0.9, h: 0.7, fontFace: SANS, bold: true, fontSize: 26, color: col });
    s.addText(it.label, { x: M + 1.0, y: y - 0.04, w: 4.2, h: 0.7, fontFace: SANS, bold: true, fontSize: 14.5, color: INK, valign: "middle" });
    s.addText(it.body, { x: M + 5.3, y: y - 0.04, w: CW - 5.3, h: 0.7, fontFace: SERIF, fontSize: 15, color: INK, valign: "middle", lineSpacing: 19 });
    y += rowH;
    s.addShape(p.ShapeType.line, { x: M, y: y - 0.1, w: CW, h: 0, line: { color: RULE, width: 0.5 } });
  });
}
function archFlow(s, tiles, top) {
  const n = tiles.length, gap = 0.22, tw = (CW - gap * (n - 1)) / n, th = 2.55;
  let x = M;
  tiles.forEach((t) => {
    s.addShape(p.ShapeType.rect, { x, y: top, w: tw, h: th, fill: { color: BG }, line: { color: RULE, width: 0.75 } });
    s.addShape(p.ShapeType.rect, { x: x + 0.16, y: top + 0.18, w: 0.48, h: 0.48, fill: { color: ACCENT } });
    s.addText(t.n, { x: x + 0.16, y: top + 0.18, w: 0.48, h: 0.48, align: "center", valign: "middle", fontFace: SANS, bold: true, fontSize: 15, color: "FFFFFF" });
    s.addText(t.when, { x: x + 0.16, y: top + 0.78, w: tw - 0.32, h: 0.4, fontFace: SANS, bold: true, fontSize: 9, color: t.gate ? ACCENT : MUTED, charSpacing: 0.8, lineSpacing: 11 });
    s.addText(t.label, { x: x + 0.16, y: top + 1.2, w: tw - 0.32, h: 0.4, fontFace: SANS, bold: true, fontSize: 12.5, color: INK });
    s.addText(t.desc, { x: x + 0.16, y: top + 1.6, w: tw - 0.32, h: 0.85, fontFace: SERIF, fontSize: 10.5, color: INK, lineSpacing: 13, valign: "top" });
    x += tw + gap;
  });
}

// ---------- SLIDE 1 — Title ----------
let s = base(null);
eyebrow(s, X.coverEyebrow, 1.45);
headline(s, X.coverHeadline, 1.95, 50);
subhead(s, X.coverSubhead, 3.95);
rule(s, 4.7);
s.addText(D.preparedFor, { x: M, y: 4.85, w: CW, h: 0.35, fontFace: SERIF, italic: true, fontSize: 14, color: MUTED });
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
s.addShape(p.ShapeType.rect, { x: M + CW / 2 - 0.01, y: 3.25, w: 0.022, h: 2.9, fill: { color: ACCENT } });
const colL = M, colR = M + CW / 2 + 0.4, colW = CW / 2 - 0.45;
s.addText(X.controlTitle, { x: colL, y: 3.2, w: colW, h: 0.3, fontFace: SANS, bold: true, fontSize: 11.5, color: ACCENT, charSpacing: 1.5 });
const ctrlRuns = X.controlBullets.map((t, i) =>
  i < X.controlBullets.length - 1 ? { text: t, options: { breakLine: true, paraSpaceAfter: 10 } } : { text: t, options: {} });
s.addText(ctrlRuns, { x: colL, y: 3.55, w: colW, h: 2.6, fontFace: SERIF, fontSize: 14.5, color: INK, lineSpacing: 18, valign: "top" });
s.addText(X.economicsTitle, { x: colR, y: 3.2, w: colW, h: 0.3, fontFace: SANS, bold: true, fontSize: 11.5, color: ACCENT, charSpacing: 1.5 });
const econRuns = [
  { text: `${X.economicsLicenceLabel}${lic.tier} tier · `, options: {} },
  { text: `${money(lic.annualPrice)} / yr`, options: { bold: true } },
  { text: `  (${lic.term} term)`, options: { breakLine: true } },
  { text: X.economicsIntroNote, options: { fontSize: 11, color: MUTED, breakLine: true, paraSpaceAfter: 12 } },
  { text: `${X.economicsDeliveryLabel}${tot.fullSlate.days} days · `, options: {} },
  { text: `${money(tot.fullSlate.amount)}`, options: { bold: true, breakLine: true } },
  { text: `(confirmed-only ${tot.confirmedOnly.days} days · ${money(tot.confirmedOnly.amount)})`, options: { fontSize: 12.5, color: MUTED, breakLine: true, paraSpaceAfter: 12 } },
  { text: `${X.economicsServicesPre}${money(dayRate)}${X.economicsServicesPost}`, options: {} },
];
s.addText(econRuns, { x: colR, y: 3.55, w: colW, h: 2.7, fontFace: SERIF, fontSize: 14.5, color: INK, lineSpacing: 18, valign: "top" });
closer(s, norm(X.whyCloser));
footer(s, 5);

// ---------- SLIDE 6 — The ask ----------
s = base("V.");
eyebrow(s, X.askEyebrow, 1.35);
headline(s, D.askHeadline, 1.75, 34);
rule(s, 2.95);
themedRows(s, D.askRows, 3.25);
rule(s, 6.45);
s.addText(norm(D.askLine), { x: M, y: 6.55, w: CW, h: 0.4, fontFace: SERIF, fontSize: 16, color: INK });
footer(s, 6);

p.writeFile({ fileName: process.argv[3] || "Novagentica-Hensoldt-ExecutiveSummary-v1.0.pptx" }).then(() => console.log("deck written"));

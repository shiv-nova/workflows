// Novagentica engagement-pack — Solution Proposal deck (13 slides).
// PURE RENDERER. No client / date / price literals. Slide text lives in the spine at
// engagement.json → decks (shared) + decks.proposalDeck; numbers, the licence box, cost
// rows and the META/identity line derive from client / commercials. See references/data-model.md.
// Usage: node build_proposaldeck.js [engagement.json] [out.pptx]
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "NOVA", width: 13.333, height: 7.5 });
p.layout = "NOVA";

const SPINE_PATH = process.argv[2] || "engagement.json";
const E = JSON.parse(fs.readFileSync(SPINE_PATH, "utf8"));
const D = E.decks || {};
const PD = D.proposalDeck || {};
const C = E.commercials || {};
const client = E.client || {};

const BG = "FAFBF6", INK = "0E0E0C", ACCENT = "CC0D2C", MUTED = "8A8A86", RULE = "D9D9D2";
const SANS = "Inter", SERIF = "Gelasio";
const M = 0.6, W = 13.333, CW = W - 2 * M;
const TOTAL = 13;

const CLIENT = client.name || "[Client]";
const META = `NOVAGENTICA × ${CLIENT.toUpperCase()} · ${PD.metaSuffix || ""}`;
const cur = C.currency || "CHF";
const dayRate = C.dayRate || 0;
const money = n => `${cur} ${Number(n).toLocaleString("en-US")}`;
const lic = C.licence || {};
const tot = C.totals || {};
const mvps = E.mvps || [];
const d = i => (mvps[i] && mvps[i].sizing && mvps[i].sizing.consultantDays) || 0;
const COLORS = { ACCENT, INK, MUTED };
function norm(runs) { return (runs || []).map(r => { const o = Object.assign({}, r.options); if (o.color && COLORS[o.color]) o.color = COLORS[o.color]; return { text: r.text, options: o }; }); }

function base(roman) {
  const s = p.addSlide(); s.background = { color: BG };
  if (roman) s.addText(roman, { x: M, y: 0.42, w: 1, h: 0.4, fontFace: SERIF, italic: true, bold: true, fontSize: 14, color: ACCENT });
  else s.addShape(p.ShapeType.rect, { x: M, y: 0.48, w: 0.2, h: 0.2, fill: { color: ACCENT } });
  s.addShape(p.ShapeType.rect, { x: M, y: 0.8, w: 0.5, h: 0.028, fill: { color: ACCENT } });
  s.addText(META, { x: W - M - 6.5, y: 0.42, w: 6.5, h: 0.3, align: "right", fontFace: SANS, bold: true, fontSize: 9.5, color: MUTED, charSpacing: 1.5 });
  rule(s, 1.02);
  return s;
}
function rule(s, y) { s.addShape(p.ShapeType.line, { x: M, y, w: CW, h: 0, line: { color: RULE, width: 0.75 } }); }
function eyebrow(s, t, y) { s.addText(t, { x: M, y, w: CW, h: 0.3, fontFace: SANS, bold: true, fontSize: 11.5, color: MUTED, charSpacing: 1.8 }); }
function headline(s, t, y, size) { s.addText(t, { x: M, y, w: CW, h: 1.2, fontFace: SANS, bold: true, fontSize: size || 40, color: INK, lineSpacing: (size || 40) * 1.05 }); }
function subhead(s, t, y) { s.addText(t, { x: M, y, w: CW, h: 0.5, fontFace: SERIF, italic: true, bold: true, fontSize: 20, color: ACCENT }); }
function closer(s, runs, y) { rule(s, y || 6.55); s.addText(runs, { x: M, y: (y || 6.55) + 0.07, w: CW, h: 0.35, fontFace: SERIF, italic: true, fontSize: 14, color: INK }); }
function footer(s, page) {
  s.addText([{ text: "nova", options: { color: INK } }, { text: "gentica", options: { color: ACCENT } }], { x: M, y: 7.0, w: 3, h: 0.3, fontFace: SANS, bold: true, fontSize: 14 });
  s.addText(`${page < 10 ? "0" + page : page} / ${TOTAL}`, { x: W - M - 2, y: 7.02, w: 2, h: 0.3, align: "right", fontFace: SANS, fontSize: 10, color: MUTED });
}
function themedRows(s, rows, top, rowH) {
  let y = top; rowH = rowH || 0.92;
  rows.forEach((r, i) => {
    if (i > 0) s.addShape(p.ShapeType.line, { x: M, y: y - 0.06, w: CW, h: 0, line: { color: RULE, width: 0.5 } });
    s.addText(r.label, { x: M, y: y + 0.04, w: 3.2, h: 0.6, fontFace: SANS, bold: true, fontSize: 11.5, color: ACCENT, charSpacing: 1.1, lineSpacing: 13 });
    s.addText(r.fact, { x: M + 3.4, y: y - 0.02, w: CW - 3.4, h: 0.75, fontFace: SERIF, fontSize: 15.5, color: INK, lineSpacing: 19 });
    y += rowH;
  });
}
function numberedStack(s, items, top) {
  let y = top; const rowH = 0.98;
  items.forEach((it) => {
    const col = it.hi ? ACCENT : INK;
    s.addText(it.n, { x: M, y: y - 0.05, w: 0.9, h: 0.7, fontFace: SANS, bold: true, fontSize: 26, color: col });
    s.addText(it.label, { x: M + 1.0, y: y - 0.04, w: 4.0, h: 0.7, fontFace: SANS, bold: true, fontSize: 14.5, color: INK, valign: "middle" });
    s.addText(it.body, { x: M + 5.1, y: y - 0.04, w: CW - 5.1, h: 0.7, fontFace: SERIF, fontSize: 15, color: INK, valign: "middle", lineSpacing: 19 });
    y += rowH; s.addShape(p.ShapeType.line, { x: M, y: y - 0.1, w: CW, h: 0, line: { color: RULE, width: 0.5 } });
  });
}
function twoCol(s, left, right, top) {
  const colW = CW / 2 - 0.45, colL = M, colR = M + CW / 2 + 0.4, h = 2.95;
  s.addShape(p.ShapeType.rect, { x: M + CW / 2 - 0.011, y: top, w: 0.022, h: h, fill: { color: ACCENT } });
  [[colL, left], [colR, right]].forEach(([x, c]) => {
    s.addText(c.title, { x, y: top - 0.05, w: colW, h: 0.3, fontFace: SANS, bold: true, fontSize: 11.5, color: ACCENT, charSpacing: 1.3 });
    const runs = c.items.map((t, i) => ({ text: t, options: { breakLine: true, paraSpaceAfter: i < c.items.length - 1 ? 10 : 0 } }));
    s.addText(runs, { x, y: top + 0.38, w: colW, h: h - 0.4, fontFace: SERIF, fontSize: 14.5, color: INK, lineSpacing: 18, valign: "top" });
  });
}
function tocList(s, items, top) {
  let y = top; const rowH = 0.38;
  items.forEach((it) => {
    s.addText(it.r, { x: M, y, w: 0.9, h: 0.35, fontFace: SERIF, italic: true, bold: true, fontSize: 14, color: ACCENT, valign: "middle" });
    s.addText(it.t, { x: M + 1.0, y, w: CW - 1.0, h: 0.35, fontFace: SANS, fontSize: 14, color: INK, valign: "middle" });
    y += rowH; s.addShape(p.ShapeType.line, { x: M, y: y - 0.05, w: CW, h: 0, line: { color: RULE, width: 0.4 } });
  });
}
function archFlow(s, tiles, top) {
  const n = tiles.length, gap = 0.22, tw = (CW - gap * (n - 1)) / n, th = 2.55; let x = M;
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
function costRows(s, rows, top) {
  let y = top; const rowH = 0.4;
  rows.forEach((r) => {
    const col = r.hi ? ACCENT : (r.muted ? MUTED : INK);
    s.addText(r.phase, { x: M, y, w: 7.3, h: 0.38, fontFace: r.header ? SANS : SERIF, bold: r.header || r.hi, fontSize: r.header ? 11 : 14, color: r.header ? MUTED : col, charSpacing: r.header ? 1.2 : 0, valign: "middle" });
    s.addText(r.days, { x: M + 7.4, y, w: 1.6, h: 0.38, align: "center", fontFace: SANS, bold: r.header || r.hi, fontSize: r.header ? 10 : 13, color: r.header ? MUTED : col, valign: "middle" });
    s.addText(r.amt, { x: M + 9.1, y, w: CW - 9.1, h: 0.38, align: "right", fontFace: SANS, bold: true, fontSize: r.header ? 10 : 13, color: r.header ? MUTED : col, valign: "middle" });
    y += rowH; if (!r.last) s.addShape(p.ShapeType.line, { x: M, y: y - 0.04, w: CW, h: 0, line: { color: RULE, width: 0.5 } });
  });
}

let s;
// 1 — Cover
s = base(null);
eyebrow(s, PD.cover.eyebrow, 1.45);
headline(s, PD.cover.headline, 1.95, 48);
subhead(s, PD.cover.subhead, 4.0);
rule(s, 4.7);
s.addText(D.preparedFor, { x: M, y: 4.85, w: CW, h: 0.35, fontFace: SERIF, italic: true, fontSize: 14, color: MUTED });
closer(s, norm(PD.cover.closer));
footer(s, 1);

// 2 — Outline
s = base(null);
eyebrow(s, PD.toc.eyebrow, 1.35);
headline(s, PD.toc.headline, 1.75, 34);
rule(s, 2.8);
tocList(s, PD.toc.items, 2.98);
footer(s, 2);

// 3 — Situation
s = base("I.");
eyebrow(s, PD.situation.eyebrow, 1.35);
headline(s, PD.situation.headline, 1.75, 32);
rule(s, 2.9);
themedRows(s, PD.situation.rows, 3.2);
closer(s, norm(PD.situation.closer));
footer(s, 3);

// 4 — Slate
s = base("II.");
eyebrow(s, PD.slate.eyebrow, 1.35);
headline(s, PD.slate.headline, 1.75, 36);
rule(s, 2.85);
numberedStack(s, PD.slate.items, 3.1);
closer(s, norm(PD.slate.closer));
footer(s, 4);

// 5 — MVP 3 fork
s = base("II.");
eyebrow(s, PD.mvp3.eyebrow, 1.35);
headline(s, PD.mvp3.headline, 1.75, 36);
rule(s, 2.85);
twoCol(s, PD.mvp3.left, PD.mvp3.right, 3.2);
closer(s, norm(PD.mvp3.closer));
footer(s, 5);

// 6 — Why safe
s = base("III.");
eyebrow(s, PD.why.eyebrow, 1.35);
headline(s, PD.why.headline, 1.75, 34);
rule(s, 2.9);
themedRows(s, PD.why.rows, 3.15, 0.8);
closer(s, norm(PD.why.closer));
footer(s, 6);

// 7 — How we'll deliver
s = base("IV.");
eyebrow(s, PD.deliver.eyebrow, 1.35);
headline(s, PD.deliver.headline, 1.75, 36);
rule(s, 2.85);
numberedStack(s, PD.deliver.items, 3.1);
closer(s, norm(PD.deliver.closer));
footer(s, 7);

// 8 — Two paths
s = base("V.");
eyebrow(s, PD.routes.eyebrow, 1.35);
headline(s, PD.routes.headline, 1.75, 34);
rule(s, 2.9);
twoCol(s, PD.routes.left, PD.routes.right, 3.2);
closer(s, norm(PD.routes.closer));
footer(s, 8);

// 9 — Mobilisation
s = base("V.");
eyebrow(s, PD.loi.eyebrow, 1.45);
s.addText(PD.loi.big, { x: M, y: 1.95, w: CW, h: 2.2, fontFace: SERIF, italic: true, bold: true, fontSize: 50, color: ACCENT, lineSpacing: 54 });
s.addShape(p.ShapeType.rect, { x: M, y: 4.85, w: CW, h: 1.25, fill: { color: BG }, line: { color: RULE, width: 0.75 } });
s.addText(PD.loi.box, { x: M + 0.3, y: 5.0, w: CW - 0.6, h: 0.95, fontFace: SERIF, fontSize: 16, color: INK, lineSpacing: 22, valign: "middle" });
closer(s, norm(PD.loi.closer));
footer(s, 9);

// 10 — The plan (shared)
s = base("VI.");
eyebrow(s, D.planEyebrow, 1.35);
headline(s, D.planHeadline, 1.75, 34);
rule(s, 2.95);
archFlow(s, D.planTiles, 3.25);
closer(s, norm(D.planCloser));
footer(s, 10);

// 11 — Commercials
const PC = PD.commercials;
s = base("VII.");
eyebrow(s, PC.eyebrow, 1.35);
headline(s, PC.headline, 1.75, 36);
rule(s, 2.85);
s.addShape(p.ShapeType.rect, { x: M, y: 2.96, w: CW, h: 0.96, fill: { color: BG }, line: { color: ACCENT, width: 1 } });
s.addText([
  { text: `${PC.licenceLabel}${lic.tier} tier · `, options: { color: INK } },
  { text: `${money(lic.annualPrice)}${PC.licenceTail}`, options: { bold: true, color: ACCENT } },
  { text: `   (${lic.term} term)`, options: { color: MUTED, breakLine: true } },
  { text: PC.introNote, options: { color: INK, fontSize: 12 } },
], { x: M + 0.3, y: 2.96, w: CW - 0.6, h: 0.96, fontFace: SERIF, fontSize: 16, valign: "middle", lineSpacing: 19 });
costRows(s, [
  { phase: PC.costHeader.phase, days: PC.costHeader.days, amt: PC.costHeader.amt, header: true },
  { phase: PC.costMvpLabels[0], days: String(d(0)), amt: money(d(0) * dayRate) },
  { phase: PC.costMvpLabels[1], days: String(d(1)), amt: money(d(1) * dayRate) },
  { phase: PC.costMvpLabels[2], days: String(d(2)), amt: money(d(2) * dayRate) },
  { phase: PC.costFull, days: String(tot.fullSlate.days), amt: money(tot.fullSlate.amount), hi: true },
  { phase: PC.costConfirmed, days: String(tot.confirmedOnly.days), amt: money(tot.confirmedOnly.amount), muted: true, last: true },
], 4.0);
closer(s, [{ text: `${PC.closerPre}${money(dayRate)}${PC.closerPost}`, options: { italic: true } }]);
footer(s, 11);

// 12 — Risks
s = base("VIII.");
eyebrow(s, PD.risks.eyebrow, 1.35);
headline(s, PD.risks.headline, 1.75, 36);
rule(s, 2.85);
themedRows(s, PD.risks.rows, 3.15, 0.8);
closer(s, norm(PD.risks.closer));
footer(s, 12);

// 13 — Next steps & ask
s = base("IX.");
eyebrow(s, PD.nextSteps.eyebrow, 1.35);
headline(s, D.askHeadline, 1.75, 32);
rule(s, 2.9);
numberedStack(s, PD.nextSteps.items, 3.15);
rule(s, 6.4);
s.addText(norm(PD.nextSteps.askLine), { x: M, y: 6.5, w: CW, h: 0.5, fontFace: SERIF, fontSize: 14.5, color: INK, lineSpacing: 18 });
footer(s, 13);

p.writeFile({ fileName: process.argv[3] || `${(E.output && E.output.fileStem) || `Novagentica-${CLIENT}`}-SolutionProposal-Deck-v${(E.output && E.output.version) || "1.0"}.pptx` }).then(() => console.log("proposal deck written"));

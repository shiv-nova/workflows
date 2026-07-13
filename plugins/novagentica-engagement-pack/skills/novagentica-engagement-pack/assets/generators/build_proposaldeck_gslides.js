// Novagentica engagement-pack — Solution Proposal deck (13 slides), NATIVE GOOGLE SLIDES.
// Same 13-slide spine as build_proposaldeck.js (pptx), same brand, but emits a Google Slides
// `presentations.batchUpdate` payload instead of a .pptx file. n8n runs:
//   presentations.create {title}  ->  presentations.batchUpdate {requests}
// See workflows/n8n/docs/gslides-execution-runbook.md.
//
// Usage: node build_proposaldeck_gslides.js [engagement.json] [out.json]
//        (no out.json -> prints the payload to stdout)
const fs = require("fs");
const { Deck, brand: B } = require("./lib/gslides");

const SPINE_PATH = process.argv[2] || "engagement.json";
const E = JSON.parse(fs.readFileSync(SPINE_PATH, "utf8"));
const D = E.decks || {};
const PD = D.proposalDeck || {};
const C = E.commercials || {};
const client = E.client || {};

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
// section guard: a no-op when the spine section exists (real proposal spines always carry
// decks.proposalDeck); only shields the content-less example spine from throwing.
const G = o => o || {};

// map the spine's colour tokens to brand hex (same contract as the pptx renderer)
const COLORS = { ACCENT: B.ACCENT, INK: B.INK, MUTED: B.MUTED };
function norm(runs) { return (runs || []).map(r => { const o = Object.assign({}, r.options); if (o.color && COLORS[o.color]) o.color = COLORS[o.color]; return { text: r.text, options: o }; }); }

const deck = new Deck(PD.presentationTitle || `Novagentica × ${CLIENT} — Solution Proposal`);

function base(roman) {
  const s = deck.slide(B.BG);
  if (roman) deck.textBox(s, roman, { x: M, y: 0.42, w: 1, h: 0.4, font: B.SERIF, italic: true, bold: true, size: 14, color: B.ACCENT });
  else deck.rect(s, { x: M, y: 0.48, w: 0.2, h: 0.2, fill: B.ACCENT });
  deck.rect(s, { x: M, y: 0.8, w: 0.5, h: 0.028, fill: B.ACCENT });
  deck.textBox(s, META, { x: W - M - 6.5, y: 0.42, w: 6.5, h: 0.3, align: "right", font: B.SANS, bold: true, size: 9.5, color: B.MUTED });
  rule(s, 1.02);
  return s;
}
function rule(s, y) { deck.line(s, { x: M, y, w: CW, color: B.RULE, weight: 0.75 }); }
function eyebrow(s, t, y) { deck.textBox(s, t || "", { x: M, y, w: CW, h: 0.3, font: B.SANS, bold: true, size: 11.5, color: B.MUTED }); }
function headline(s, t, y, size) { deck.textBox(s, t || "", { x: M, y, w: CW, h: 1.2, font: B.SANS, bold: true, size: size || 40, color: B.INK }); }
function subhead(s, t, y) { deck.textBox(s, t || "", { x: M, y, w: CW, h: 0.5, font: B.SERIF, italic: true, bold: true, size: 20, color: B.ACCENT }); }
function closer(s, runs, y) { rule(s, y || 6.55); deck.textBox(s, runs, { x: M, y: (y || 6.55) + 0.07, w: CW, h: 0.35, font: B.SERIF, italic: true, size: 14, color: B.INK }); }
function footer(s, page) {
  deck.textBox(s, [{ text: "nova", options: { color: B.INK } }, { text: "gentica", options: { color: B.ACCENT } }], { x: M, y: 7.0, w: 3, h: 0.3, font: B.SANS, bold: true, size: 14 });
  deck.textBox(s, `${page < 10 ? "0" + page : page} / ${TOTAL}`, { x: W - M - 2, y: 7.02, w: 2, h: 0.3, align: "right", font: B.SANS, size: 10, color: B.MUTED });
}
function themedRows(s, rows, top, rowH) {
  let y = top; rowH = rowH || 0.92;
  (rows || []).forEach((r, i) => {
    if (i > 0) deck.line(s, { x: M, y: y - 0.06, w: CW, color: B.RULE, weight: 0.5 });
    deck.textBox(s, r.label, { x: M, y: y + 0.04, w: 3.2, h: 0.6, font: B.SANS, bold: true, size: 11.5, color: B.ACCENT });
    deck.textBox(s, r.fact, { x: M + 3.4, y: y - 0.02, w: CW - 3.4, h: 0.75, font: B.SERIF, size: 15.5, color: B.INK });
    y += rowH;
  });
}
function numberedStack(s, items, top) {
  let y = top; const rowH = 0.98;
  (items || []).forEach((it) => {
    const col = it.hi ? B.ACCENT : B.INK;
    deck.textBox(s, it.n, { x: M, y: y - 0.05, w: 0.9, h: 0.7, font: B.SANS, bold: true, size: 26, color: col });
    deck.textBox(s, it.label, { x: M + 1.0, y: y - 0.04, w: 4.0, h: 0.7, font: B.SANS, bold: true, size: 14.5, color: B.INK, valign: "middle" });
    deck.textBox(s, it.body, { x: M + 5.1, y: y - 0.04, w: CW - 5.1, h: 0.7, font: B.SERIF, size: 15, color: B.INK, valign: "middle" });
    y += rowH; deck.line(s, { x: M, y: y - 0.1, w: CW, color: B.RULE, weight: 0.5 });
  });
}
function twoCol(s, left, right, top) {
  const colW = CW / 2 - 0.45, colL = M, colR = M + CW / 2 + 0.4, h = 2.95;
  deck.rect(s, { x: M + CW / 2 - 0.011, y: top, w: 0.022, h: h, fill: B.ACCENT });
  [[colL, left], [colR, right]].forEach(([x, c0]) => {
    const c = c0 || {};
    deck.textBox(s, c.title || "", { x, y: top - 0.05, w: colW, h: 0.3, font: B.SANS, bold: true, size: 11.5, color: B.ACCENT });
    deck.textBox(s, (c.items || []).join("\n"), { x, y: top + 0.38, w: colW, h: h - 0.4, font: B.SERIF, size: 14.5, color: B.INK, valign: "top" });
  });
}
function tocList(s, items, top) {
  let y = top; const rowH = 0.38;
  (items || []).forEach((it) => {
    deck.textBox(s, it.r, { x: M, y, w: 0.9, h: 0.35, font: B.SERIF, italic: true, bold: true, size: 14, color: B.ACCENT, valign: "middle" });
    deck.textBox(s, it.t, { x: M + 1.0, y, w: CW - 1.0, h: 0.35, font: B.SANS, size: 14, color: B.INK, valign: "middle" });
    y += rowH; deck.line(s, { x: M, y: y - 0.05, w: CW, color: B.RULE, weight: 0.4 });
  });
}
function archFlow(s, tiles, top) {
  tiles = tiles || [];
  const n = tiles.length || 1, gap = 0.22, tw = (CW - gap * (n - 1)) / n, th = 2.55; let x = M;
  tiles.forEach((t) => {
    deck.rect(s, { x, y: top, w: tw, h: th, fill: B.BG, line: { color: B.RULE, width: 0.75 } });
    deck.rect(s, { x: x + 0.16, y: top + 0.18, w: 0.48, h: 0.48, fill: B.ACCENT });
    deck.textBox(s, t.n, { x: x + 0.16, y: top + 0.18, w: 0.48, h: 0.48, align: "center", valign: "middle", font: B.SANS, bold: true, size: 15, color: B.WHITE });
    deck.textBox(s, t.when, { x: x + 0.16, y: top + 0.78, w: tw - 0.32, h: 0.4, font: B.SANS, bold: true, size: 9, color: t.gate ? B.ACCENT : B.MUTED });
    deck.textBox(s, t.label, { x: x + 0.16, y: top + 1.2, w: tw - 0.32, h: 0.4, font: B.SANS, bold: true, size: 12.5, color: B.INK });
    deck.textBox(s, t.desc, { x: x + 0.16, y: top + 1.6, w: tw - 0.32, h: 0.85, font: B.SERIF, size: 10.5, color: B.INK, valign: "top" });
    x += tw + gap;
  });
}
function costRows(s, rows, top) {
  let y = top; const rowH = 0.4;
  rows.forEach((r) => {
    const col = r.hi ? B.ACCENT : (r.muted ? B.MUTED : B.INK);
    deck.textBox(s, r.phase, { x: M, y, w: 7.3, h: 0.38, font: r.header ? B.SANS : B.SERIF, bold: r.header || r.hi, size: r.header ? 11 : 14, color: r.header ? B.MUTED : col, valign: "middle" });
    deck.textBox(s, r.days, { x: M + 7.4, y, w: 1.6, h: 0.38, align: "center", font: B.SANS, bold: r.header || r.hi, size: r.header ? 10 : 13, color: r.header ? B.MUTED : col, valign: "middle" });
    deck.textBox(s, r.amt, { x: M + 9.1, y, w: CW - 9.1, h: 0.38, align: "right", font: B.SANS, bold: true, size: r.header ? 10 : 13, color: r.header ? B.MUTED : col, valign: "middle" });
    y += rowH; if (!r.last) deck.line(s, { x: M, y: y - 0.04, w: CW, color: B.RULE, weight: 0.5 });
  });
}

let s;
// 1 — Cover
s = base(null);
eyebrow(s, G(PD.cover).eyebrow, 1.45);
headline(s, G(PD.cover).headline, 1.95, 48);
subhead(s, G(PD.cover).subhead, 4.0);
rule(s, 4.7);
deck.textBox(s, D.preparedFor || "", { x: M, y: 4.85, w: CW, h: 0.35, font: B.SERIF, italic: true, size: 14, color: B.MUTED });
closer(s, norm(G(PD.cover).closer));
footer(s, 1);

// 2 — Outline
s = base(null);
eyebrow(s, G(PD.toc).eyebrow, 1.35);
headline(s, G(PD.toc).headline, 1.75, 34);
rule(s, 2.8);
tocList(s, G(PD.toc).items, 2.98);
footer(s, 2);

// 3 — Situation
s = base("I.");
eyebrow(s, G(PD.situation).eyebrow, 1.35);
headline(s, G(PD.situation).headline, 1.75, 32);
rule(s, 2.9);
themedRows(s, G(PD.situation).rows, 3.2);
closer(s, norm(G(PD.situation).closer));
footer(s, 3);

// 4 — Slate
s = base("II.");
eyebrow(s, G(PD.slate).eyebrow, 1.35);
headline(s, G(PD.slate).headline, 1.75, 36);
rule(s, 2.85);
numberedStack(s, G(PD.slate).items, 3.1);
closer(s, norm(G(PD.slate).closer));
footer(s, 4);

// 5 — MVP 3 fork
s = base("II.");
eyebrow(s, G(PD.mvp3).eyebrow, 1.35);
headline(s, G(PD.mvp3).headline, 1.75, 36);
rule(s, 2.85);
twoCol(s, G(PD.mvp3).left, G(PD.mvp3).right, 3.2);
closer(s, norm(G(PD.mvp3).closer));
footer(s, 5);

// 6 — Why safe
s = base("III.");
eyebrow(s, G(PD.why).eyebrow, 1.35);
headline(s, G(PD.why).headline, 1.75, 34);
rule(s, 2.9);
themedRows(s, G(PD.why).rows, 3.15, 0.8);
closer(s, norm(G(PD.why).closer));
footer(s, 6);

// 7 — How we'll deliver
s = base("IV.");
eyebrow(s, G(PD.deliver).eyebrow, 1.35);
headline(s, G(PD.deliver).headline, 1.75, 36);
rule(s, 2.85);
numberedStack(s, G(PD.deliver).items, 3.1);
closer(s, norm(G(PD.deliver).closer));
footer(s, 7);

// 8 — Two paths
s = base("V.");
eyebrow(s, G(PD.routes).eyebrow, 1.35);
headline(s, G(PD.routes).headline, 1.75, 34);
rule(s, 2.9);
twoCol(s, G(PD.routes).left, G(PD.routes).right, 3.2);
closer(s, norm(G(PD.routes).closer));
footer(s, 8);

// 9 — Mobilisation
s = base("V.");
eyebrow(s, G(PD.loi).eyebrow, 1.45);
deck.textBox(s, G(PD.loi).big || "", { x: M, y: 1.95, w: CW, h: 2.2, font: B.SERIF, italic: true, bold: true, size: 50, color: B.ACCENT });
deck.rect(s, { x: M, y: 4.85, w: CW, h: 1.25, fill: B.BG, line: { color: B.RULE, width: 0.75 } });
deck.textBox(s, G(PD.loi).box || "", { x: M + 0.3, y: 5.0, w: CW - 0.6, h: 0.95, font: B.SERIF, size: 16, color: B.INK, valign: "middle" });
closer(s, norm(G(PD.loi).closer));
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
const PC = PD.commercials || {};
s = base("VII.");
eyebrow(s, PC.eyebrow, 1.35);
headline(s, PC.headline, 1.75, 36);
rule(s, 2.85);
deck.rect(s, { x: M, y: 2.96, w: CW, h: 0.96, fill: B.BG, line: { color: B.ACCENT, width: 1 } });
deck.textBox(s, [
  { text: `${PC.licenceLabel}${lic.tier} tier · `, options: { color: B.INK } },
  { text: `${money(lic.annualPrice)}${PC.licenceTail}`, options: { bold: true, color: B.ACCENT } },
  { text: `   (${lic.term} term)\n`, options: { color: B.MUTED } },
  { text: PC.introNote, options: { color: B.INK, fontSize: 12 } },
], { x: M + 0.3, y: 2.96, w: CW - 0.6, h: 0.96, font: B.SERIF, size: 16, valign: "middle" });
costRows(s, [
  { phase: G(PC.costHeader).phase, days: G(PC.costHeader).days, amt: G(PC.costHeader).amt, header: true },
  { phase: (PC.costMvpLabels || [])[0], days: String(d(0)), amt: money(d(0) * dayRate) },
  { phase: (PC.costMvpLabels || [])[1], days: String(d(1)), amt: money(d(1) * dayRate) },
  { phase: (PC.costMvpLabels || [])[2], days: String(d(2)), amt: money(d(2) * dayRate) },
  { phase: PC.costFull, days: String(G(tot.fullSlate).days), amt: money(G(tot.fullSlate).amount), hi: true },
  { phase: PC.costConfirmed, days: String(G(tot.confirmedOnly).days), amt: money(G(tot.confirmedOnly).amount), muted: true, last: true },
], 4.0);
closer(s, [{ text: `${PC.closerPre}${money(dayRate)}${PC.closerPost}`, options: { italic: true } }]);
footer(s, 11);

// 12 — Risks
s = base("VIII.");
eyebrow(s, G(PD.risks).eyebrow, 1.35);
headline(s, G(PD.risks).headline, 1.75, 36);
rule(s, 2.85);
themedRows(s, G(PD.risks).rows, 3.15, 0.8);
closer(s, norm(G(PD.risks).closer));
footer(s, 12);

// 13 — Next steps & ask
s = base("IX.");
eyebrow(s, G(PD.nextSteps).eyebrow, 1.35);
headline(s, D.askHeadline, 1.75, 32);
rule(s, 2.9);
numberedStack(s, G(PD.nextSteps).items, 3.15);
rule(s, 6.4);
deck.textBox(s, norm(G(PD.nextSteps).askLine), { x: M, y: 6.5, w: CW, h: 0.5, font: B.SERIF, size: 14.5, color: B.INK });
footer(s, 13);

const payload = deck.payload();
const out = process.argv[3];
if (out) { require("fs").writeFileSync(out, JSON.stringify(payload, null, 2)); console.log("wrote " + out); }
else { process.stdout.write(JSON.stringify(payload, null, 2)); }

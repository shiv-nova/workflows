// Generic delivery-timeline deck — NATIVE GOOGLE SLIDES.
// Faithful port of build_timeline.js (pptxgenjs): same archetype-driven spine, week-axis math,
// and derived values, but emits a Google Slides `presentations.batchUpdate` payload instead of a
// .pptx file. n8n runs:
//   presentations.create {title}  ->  presentations.batchUpdate {requests}
// See workflows/n8n/docs/gslides-execution-runbook.md.
//
// Usage: node build_timeline_gslides.js [path/to/brief.json] [out.json]
//        (no out.json -> prints the payload to stdout)
const path = require("path");
const { Deck, brand: B } = require("./lib/gslides");
const { expand } = require("./lib/timelines");

const briefPath = process.argv[2] || path.join(__dirname, "..", "timeline.example.json");
const E = require(briefPath);
const C = E.client || {}, OUT = E.output || {}, T = E.timeline || {};
const TL = expand(T);

const M = 0.6, W = 13.333, CW = W - 2 * M;
const META = `NOVAGENTICA${C.name ? " × " + C.name.toUpperCase() : ""} · DELIVERY TIMELINE`;
let TOTAL = 4;

const deck = new Deck(`Novagentica${C.name ? " × " + C.name : ""} — Delivery Timeline`);

function base(roman) {
  const s = deck.slide(B.BG);
  if (roman) deck.textBox(s, roman, { x: M, y: 0.42, w: 1, h: 0.4, font: B.SERIF, italic: true, bold: true, size: 14, color: B.ACCENT });
  else deck.rect(s, { x: M, y: 0.48, w: 0.2, h: 0.2, fill: B.ACCENT });
  deck.rect(s, { x: M, y: 0.8, w: 0.5, h: 0.028, fill: B.ACCENT });
  deck.textBox(s, META, { x: W - M - 6.5, y: 0.42, w: 6.5, h: 0.3, align: "right", font: B.SANS, bold: true, size: 9.5, color: B.MUTED });
  rule(s, 1.02); return s;
}
function rule(s, y) { deck.line(s, { x: M, y, w: CW, color: B.RULE, weight: 0.75 }); }
function eyebrow(s, t, y) { deck.textBox(s, t, { x: M, y, w: CW, h: 0.3, font: B.SANS, bold: true, size: 11.5, color: B.MUTED }); }
function headline(s, t, y, size) { deck.textBox(s, t, { x: M, y, w: CW, h: 1.2, font: B.SANS, bold: true, size: size || 38, color: B.INK }); }
function subhead(s, t, y) { deck.textBox(s, t, { x: M, y, w: CW, h: 0.5, font: B.SERIF, italic: true, bold: true, size: 22, color: B.ACCENT }); }
function closer(s, txt, y) { const yy = y || 6.55; rule(s, yy); deck.textBox(s, [{ text: txt, options: { italic: true } }], { x: M, y: yy + 0.07, w: CW, h: 0.35, font: B.SERIF, size: 14, color: B.INK }); }
function footer(s, page) {
  deck.textBox(s, B.wordmarkRuns(B.INK, B.ACCENT).map((r) => ({ text: r.text, options: { color: r.color } })),
    { x: M, y: 7.0, w: 3, h: 0.3, font: B.SANS, bold: true, size: 14 });
  deck.textBox(s, `${String(page).padStart(2, "0")} / ${String(TOTAL).padStart(2, "0")}`, { x: W - M - 2, y: 7.02, w: 2, h: 0.3, align: "right", font: B.SANS, size: 10, color: B.MUTED });
}
function themedRows(s, rows, top) {
  let y = top; const rowH = 0.95;
  rows.forEach((r, i) => {
    if (i > 0) deck.line(s, { x: M, y: y - 0.06, w: CW, color: B.RULE, weight: 0.5 });
    deck.textBox(s, r.label, { x: M, y: y + 0.04, w: 3.6, h: 0.6, font: B.SANS, bold: true, size: 11.5, color: B.ACCENT });
    deck.textBox(s, r.fact, { x: M + 3.8, y: y - 0.02, w: CW - 3.8, h: 0.75, font: B.SERIF, size: 15.5, color: B.INK });
    y += rowH;
  });
}
function tiles(s, items, top) {
  const n = items.length, gap = 0.22, tw = (CW - gap * (n - 1)) / n, th = 2.7; let x = M;
  items.forEach((t) => {
    deck.rect(s, { x, y: top, w: tw, h: th, fill: B.BG, line: { color: t.goLive ? B.ACCENT : B.RULE, width: t.goLive ? 1.25 : 0.75 } });
    deck.rect(s, { x: x + 0.16, y: top + 0.18, w: 0.48, h: 0.48, fill: B.ACCENT });
    deck.textBox(s, t.n, { x: x + 0.16, y: top + 0.18, w: 0.48, h: 0.48, align: "center", valign: "middle", font: B.SANS, bold: true, size: 15, color: B.WHITE });
    deck.textBox(s, t.when, { x: x + 0.16, y: top + 0.78, w: tw - 0.32, h: 0.4, font: B.SANS, bold: true, size: 9, color: B.MUTED });
    deck.textBox(s, t.label, { x: x + 0.16, y: top + 1.12, w: tw - 0.32, h: 0.55, font: B.SANS, bold: true, size: 12.5, color: B.INK });
    deck.textBox(s, t.desc, { x: x + 0.16, y: top + 1.66, w: tw - 0.32, h: 0.95, font: B.SERIF, size: 10.5, color: B.INK, valign: "top" });
    x += tw + gap;
  });
}
function gantt(s, top) {
  const weeks = TL.weeks, rows = TL.ganttRows;
  const labelW = 3.6, gridX = M + labelW + 0.15, gridRight = W - M;
  const colW = (gridRight - gridX) / weeks.length;
  weeks.forEach((wk, i) => deck.textBox(s, wk, { x: gridX + i * colW, y: top, w: colW, h: 0.3, align: "center", font: B.SANS, bold: true, size: 10, color: B.MUTED }));
  deck.line(s, { x: M, y: top + 0.34, w: CW, color: B.RULE, weight: 0.75 });
  let y = top + 0.5; const rowH = Math.min(0.62, (6.4 - (top + 0.5)) / rows.length);
  rows.forEach((r) => {
    deck.textBox(s, r.label, { x: M, y, w: labelW, h: rowH - 0.06, font: B.SERIF, size: 11.5, color: B.INK, valign: "middle" });
    const bx = gridX + r.a * colW + 0.06, bw = (r.b - r.a + 1) * colW - 0.12;
    deck.roundRect(s, { x: bx, y: y + 0.08, w: Math.max(bw, 0.12), h: rowH - 0.26, fill: B.CRIMSON_LIGHT, line: { type: "none" } });
    if (r.live !== undefined && r.live !== false) {
      const mx = gridX + r.live * colW + colW / 2;
      deck.rect(s, { x: mx - 0.1, y: y + 0.1, w: 0.2, h: 0.2, fill: B.ACCENT, rotate: 45 });
    }
    y += rowH; deck.line(s, { x: M, y: y - 0.03, w: CW, color: B.RULE, weight: 0.4 });
  });
}

let s;
// 1 — Cover
s = base(null);
eyebrow(s, "INDICATIVE DELIVERY TIMELINE", 1.45);
headline(s, "How a Novagentica\nengagement runs.", 1.95, 46);
subhead(s, TL.archetypeLabel + (T.agents ? ` · ${T.agents} agents` : ""), 4.0);
rule(s, 4.7);
deck.textBox(s, `${C.name || "[Prospect]"} · use cases confirmed at discovery${T.kickoffAnchor ? " · kickoff " + T.kickoffAnchor : ""}`,
  { x: M, y: 4.85, w: CW, h: 0.35, font: B.SERIF, italic: true, size: 14, color: B.MUTED });
closer(s, TL.blurb);
footer(s, 1);

// 2 — Phases
s = base("I.");
eyebrow(s, "THE PLAN — PHASES", 1.35);
headline(s, "Signature to go-live.", 1.75, 36);
rule(s, 2.95);
tiles(s, TL.phaseTiles, 3.2);
closer(s, `${TL.goLiveWeek} weeks, end to end — indicative; firmed at discovery.`);
footer(s, 2);

// 3 — Gantt
s = base("II.");
eyebrow(s, "THE PLAN — GANTT CHART", 1.35);
headline(s, "The delivery Gantt.", 1.75, 36);
rule(s, 2.85);
gantt(s, 3.0);
closer(s, "Bars show active weeks; ◆ marks go-live. Weeks are relative to kickoff.");
footer(s, 3);

// 4 — What happens next
s = base("III.");
eyebrow(s, "WHAT HAPPENS NEXT", 1.35);
headline(s, "Discovery confirms the\nuse cases.", 1.75, 34);
rule(s, 3.15);
themedRows(s, [
  { label: "NO DEFINED USE CASE YET?", fact: "This timeline holds regardless — the engagement shape is the same; discovery names the agents." },
  { label: "DISCOVERY", fact: "We confirm the agents in scope, the authority bands, and the runtimes — then fix the plan." },
  { label: "GOVERN IN PLACE", fact: "No rip-and-replace. We govern what you already run; NO PASSPORT = NO EXECUTION from day one." },
], 3.4);
closer(s, "The ask: a short discovery session to turn this into a dated plan.", 6.4);
footer(s, 4);

const payload = deck.payload();
const out = process.argv[3];
if (out) { require("fs").writeFileSync(out, JSON.stringify(payload, null, 2)); console.log("wrote " + out); }
else { process.stdout.write(JSON.stringify(payload, null, 2)); }

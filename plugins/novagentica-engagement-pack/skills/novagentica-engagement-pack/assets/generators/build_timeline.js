// Generic delivery-timeline deck — for prospects WITHOUT a defined use case.
// Driven by an engagement archetype (ingestion / greenfield / govern-in-place /
// hybrid), not by specific MVPs. Run: node build_timeline.js [path/to/brief.json]
const path = require("path");
const pptxgen = require("pptxgenjs");
const B = require("./lib/brand");
const { expand } = require("./lib/timelines");

const briefPath = process.argv[2] || path.join(__dirname, "..", "timeline.example.json");
const E = require(briefPath);
const C = E.client || {}, OUT = E.output || {}, T = E.timeline || {};
const TL = expand(T);

const p = new pptxgen();
p.defineLayout({ name: "NOVA", width: 13.333, height: 7.5 });
p.layout = "NOVA";
const { BG, INK, ACCENT, MUTED, RULE, CRIMSON_LIGHT, SANS, SERIF } = B;
const M = 0.6, W = 13.333, CW = W - 2 * M;
const META = `NOVAGENTICA${C.name ? " × " + C.name.toUpperCase() : ""} · DELIVERY TIMELINE`;
let TOTAL = 4;

function base(roman) {
  const s = p.addSlide(); s.background = { color: BG };
  if (roman) s.addText(roman, { x: M, y: 0.42, w: 1, h: 0.4, fontFace: SERIF, italic: true, bold: true, fontSize: 14, color: ACCENT });
  else s.addShape(p.ShapeType.rect, { x: M, y: 0.48, w: 0.2, h: 0.2, fill: { color: ACCENT } });
  s.addShape(p.ShapeType.rect, { x: M, y: 0.8, w: 0.5, h: 0.028, fill: { color: ACCENT } });
  s.addText(META, { x: W - M - 6.5, y: 0.42, w: 6.5, h: 0.3, align: "right", fontFace: SANS, bold: true, fontSize: 9.5, color: MUTED, charSpacing: 1.5 });
  rule(s, 1.02); return s;
}
function rule(s, y) { s.addShape(p.ShapeType.line, { x: M, y, w: CW, h: 0, line: { color: RULE, width: 0.75 } }); }
function eyebrow(s, t, y) { s.addText(t, { x: M, y, w: CW, h: 0.3, fontFace: SANS, bold: true, fontSize: 11.5, color: MUTED, charSpacing: 1.8 }); }
function headline(s, t, y, size) { s.addText(t, { x: M, y, w: CW, h: 1.2, fontFace: SANS, bold: true, fontSize: size || 38, color: INK, lineSpacing: (size || 38) * 1.05 }); }
function subhead(s, t, y) { s.addText(t, { x: M, y, w: CW, h: 0.5, fontFace: SERIF, italic: true, bold: true, fontSize: 22, color: ACCENT }); }
function closer(s, txt, y) { rule(s, y || 6.55); s.addText([{ text: txt, options: { italic: true } }], { x: M, y: (y || 6.55) + 0.07, w: CW, h: 0.35, fontFace: SERIF, fontSize: 14, color: INK }); }
function footer(s, page) {
  s.addText(B.wordmarkRuns(INK, ACCENT).map((r) => ({ text: r.text, options: { color: r.color } })),
    { x: M, y: 7.0, w: 3, h: 0.3, fontFace: SANS, bold: true, fontSize: 14 });
  s.addText(`${String(page).padStart(2, "0")} / ${String(TOTAL).padStart(2, "0")}`, { x: W - M - 2, y: 7.02, w: 2, h: 0.3, align: "right", fontFace: SANS, fontSize: 10, color: MUTED });
}
function themedRows(s, rows, top) {
  let y = top; const rowH = 0.95;
  rows.forEach((r, i) => {
    if (i > 0) s.addShape(p.ShapeType.line, { x: M, y: y - 0.06, w: CW, h: 0, line: { color: RULE, width: 0.5 } });
    s.addText(r.label, { x: M, y: y + 0.04, w: 3.6, h: 0.6, fontFace: SANS, bold: true, fontSize: 11.5, color: ACCENT, charSpacing: 1.1, lineSpacing: 13 });
    s.addText(r.fact, { x: M + 3.8, y: y - 0.02, w: CW - 3.8, h: 0.75, fontFace: SERIF, fontSize: 15.5, color: INK, lineSpacing: 19 });
    y += rowH;
  });
}
function tiles(s, items, top) {
  const n = items.length, gap = 0.22, tw = (CW - gap * (n - 1)) / n, th = 2.7; let x = M;
  items.forEach((t) => {
    s.addShape(p.ShapeType.rect, { x, y: top, w: tw, h: th, fill: { color: BG }, line: { color: t.goLive ? ACCENT : RULE, width: t.goLive ? 1.25 : 0.75 } });
    s.addShape(p.ShapeType.rect, { x: x + 0.16, y: top + 0.18, w: 0.48, h: 0.48, fill: { color: ACCENT } });
    s.addText(t.n, { x: x + 0.16, y: top + 0.18, w: 0.48, h: 0.48, align: "center", valign: "middle", fontFace: SANS, bold: true, fontSize: 15, color: "FFFFFF" });
    s.addText(t.when, { x: x + 0.16, y: top + 0.78, w: tw - 0.32, h: 0.4, fontFace: SANS, bold: true, fontSize: 9, color: MUTED, charSpacing: 0.8 });
    s.addText(t.label, { x: x + 0.16, y: top + 1.12, w: tw - 0.32, h: 0.55, fontFace: SANS, bold: true, fontSize: 12.5, color: INK, lineSpacing: 14 });
    s.addText(t.desc, { x: x + 0.16, y: top + 1.66, w: tw - 0.32, h: 0.95, fontFace: SERIF, fontSize: 10.5, color: INK, lineSpacing: 13, valign: "top" });
    x += tw + gap;
  });
}
function gantt(s, top) {
  const weeks = TL.weeks, rows = TL.ganttRows;
  const labelW = 3.6, gridX = M + labelW + 0.15, gridRight = W - M;
  const colW = (gridRight - gridX) / weeks.length;
  weeks.forEach((wk, i) => s.addText(wk, { x: gridX + i * colW, y: top, w: colW, h: 0.3, align: "center", fontFace: SANS, bold: true, fontSize: 10, color: MUTED }));
  s.addShape(p.ShapeType.line, { x: M, y: top + 0.34, w: CW, h: 0, line: { color: RULE, width: 0.75 } });
  let y = top + 0.5; const rowH = Math.min(0.62, (6.4 - (top + 0.5)) / rows.length);
  rows.forEach((r) => {
    s.addText(r.label, { x: M, y, w: labelW, h: rowH - 0.06, fontFace: SERIF, fontSize: 11.5, color: INK, valign: "middle" });
    const bx = gridX + r.a * colW + 0.06, bw = (r.b - r.a + 1) * colW - 0.12;
    s.addShape(p.ShapeType.roundRect, { x: bx, y: y + 0.08, w: Math.max(bw, 0.12), h: rowH - 0.26, fill: { color: CRIMSON_LIGHT }, line: { type: "none" }, rectRadius: 0.05 });
    if (r.live !== undefined && r.live !== false) {
      const mx = gridX + r.live * colW + colW / 2;
      s.addShape(p.ShapeType.rect, { x: mx - 0.1, y: y + 0.1, w: 0.2, h: 0.2, fill: { color: ACCENT }, line: { type: "none" }, rotate: 45 });
    }
    y += rowH; s.addShape(p.ShapeType.line, { x: M, y: y - 0.03, w: CW, h: 0, line: { color: RULE, width: 0.4 } });
  });
}

let s;
// 1 — Cover
s = base(null);
eyebrow(s, "INDICATIVE DELIVERY TIMELINE", 1.45);
headline(s, "How a Novagentica\nengagement runs.", 1.95, 46);
subhead(s, TL.archetypeLabel + (T.agents ? ` · ${T.agents} agents` : ""), 4.0);
rule(s, 4.7);
s.addText(`${C.name || "[Prospect]"} · use cases confirmed at discovery${T.kickoffAnchor ? " · kickoff " + T.kickoffAnchor : ""}`,
  { x: M, y: 4.85, w: CW, h: 0.35, fontFace: SERIF, italic: true, fontSize: 14, color: MUTED });
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

const outName = `${OUT.fileStem || "Novagentica"}-DeliveryTimeline-v${OUT.version || "1.0"}.pptx`;
p.writeFile({ fileName: outName }).then(() => console.log("wrote " + outName));

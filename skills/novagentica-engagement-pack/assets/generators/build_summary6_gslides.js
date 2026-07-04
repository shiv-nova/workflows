// Summary deck (slate · why · phases · Gantt · licence model · services · ask), NATIVE GOOGLE
// SLIDES. Faithful port of build_summary6.js: same reconcile()/preflight/format contract and
// same layout, but emits a Google Slides batchUpdate payload instead of a .pptx.
// Run: node build_summary6_gslides.js [engagement.json] [out.json]
const path = require("path");
const B = require("./lib/brand");
const { Deck } = require("./lib/gslides");
const { money, perDay, perYear, fmtDate } = require("./lib/format");
const { reconcile } = require("./lib/commercials");
const { preflight, report } = require("./lib/preflight");

const briefPath = process.argv[2] || "engagement.json"; // explicit spine or cwd engagement.json — never a customer fixture
const E = require(path.resolve(briefPath));
const R = reconcile(E);

const pf = preflight(E, R);
const blocked = report(pf, "Summary deck");
if (blocked && process.env.NVG_FORCE !== "1") {
  console.error("Refusing to generate: answer the questions above (or set NVG_FORCE=1 to draft with gaps).");
  process.exit(2);
}

const C = E.client || {}, OUT = E.output || {}, DATES = E.dates || {};
const cur = R.currency;
const nonBackup = R.mvps.filter((m) => !m.isBackup);
const META = `NOVAGENTICA × ${(C.name || "CLIENT").toUpperCase()} · SOLUTION SUMMARY`;

const GATE = DATES.gate || null;

function resolveStart(proc) {
  const pr = proc || {};
  let type = pr.start && pr.start.type ? pr.start.type : (pr.loi ? "loi" : null);
  if (!type) return null;
  const note = (pr.start && pr.start.note) || (typeof pr.loi === "string" ? pr.loi : null);
  const D = {
    loi: { word: "an LOI", short: "LOI", askNote: "An LOI — without commitment or prejudice — lets ingestion begin immediately.", coverCloser: "Without commitment or prejudice." },
    po: { word: "a purchase order", short: "PO", askNote: "A purchase order authorises ingestion and discovery to begin immediately.", coverCloser: "Commercial summary." },
    contract: { word: "the signed contract", short: "START", askNote: "Signature on the order form authorises ingestion and discovery to begin.", coverCloser: "Commercial summary." },
  };
  const d = D[type] || D.loi;
  const labelWord = pr.start && pr.start.label ? `a ${pr.start.label}` : d.word;
  return { type, word: labelWord, short: d.short, askNote: note || d.askNote, coverCloser: d.coverCloser, trackVerb: "ingest & gap-analyse" };
}
const START = resolveStart(E.procurement);

const { BG, INK, ACCENT, MUTED, RULE, CRIMSON_LIGHT, DOM_TINT, SANS, SERIF, WHITE } = B;
const M = 0.6, W = 13.333, CW = W - 2 * M;
let TOTAL = 8;
const deck = new Deck(`${OUT.fileStem || "Novagentica"} — Solution Summary`);

function base(roman) {
  const s = deck.slide(BG);
  if (roman) deck.textBox(s, roman, { x: M, y: 0.42, w: 1, h: 0.4, font: SERIF, italic: true, bold: true, size: 14, color: ACCENT });
  else deck.rect(s, { x: M, y: 0.48, w: 0.2, h: 0.2, fill: ACCENT });
  deck.rect(s, { x: M, y: 0.8, w: 0.5, h: 0.028, fill: ACCENT });
  deck.textBox(s, META, { x: W - M - 6.5, y: 0.42, w: 6.5, h: 0.3, align: "right", font: SANS, bold: true, size: 9.5, color: MUTED });
  rule(s, 1.02); return s;
}
const rule = (s, y) => deck.line(s, { x: M, y, w: CW, color: RULE, weight: 0.75 });
const eyebrow = (s, t, y) => deck.textBox(s, t || "", { x: M, y, w: CW, h: 0.3, font: SANS, bold: true, size: 11.5, color: MUTED });
const headline = (s, t, y, size) => deck.textBox(s, t || "", { x: M, y, w: CW, h: 1.2, font: SANS, bold: true, size: size || 40, color: INK });
const subhead = (s, t, y) => deck.textBox(s, t || "", { x: M, y, w: CW, h: 0.5, font: SERIF, italic: true, bold: true, size: 22, color: ACCENT });
const closer = (s, runs, y) => { rule(s, y || 6.55); deck.textBox(s, runs, { x: M, y: (y || 6.55) + 0.07, w: CW, h: 0.35, font: SERIF, italic: true, size: 14, color: INK }); };
function footer(s, page) {
  deck.textBox(s, B.wordmarkRuns(INK, ACCENT).map((r) => ({ text: r.text, options: { color: r.color } })), { x: M, y: 7.0, w: 3, h: 0.3, font: SANS, bold: true, size: 14 });
  deck.textBox(s, `${String(page).padStart(2, "0")} / ${String(TOTAL).padStart(2, "0")}`, { x: W - M - 2, y: 7.02, w: 2, h: 0.3, align: "right", font: SANS, size: 10, color: MUTED });
}
function themedRows(s, rows, top, rowH) {
  let y = top; rowH = rowH || 0.92;
  rows.forEach((r, i) => {
    if (i > 0) deck.line(s, { x: M, y: y - 0.06, w: CW, color: RULE, weight: 0.5 });
    deck.textBox(s, r.label, { x: M, y: y + 0.04, w: 3.4, h: 0.6, font: SANS, bold: true, size: 11.5, color: ACCENT });
    deck.textBox(s, r.fact, { x: M + 3.6, y: y - 0.02, w: CW - 3.6, h: 0.75, font: SERIF, size: 15.5, color: INK });
    y += rowH;
  });
}
function numberedStack(s, items, top) {
  let y = top; const rowH = 0.98;
  items.forEach((it) => {
    const col = it.hi ? ACCENT : INK;
    deck.textBox(s, it.n, { x: M, y: y - 0.05, w: 0.9, h: 0.7, font: SANS, bold: true, size: 26, color: col });
    deck.textBox(s, it.label, { x: M + 1.0, y: y - 0.04, w: 4.0, h: 0.7, font: SANS, bold: true, size: 14.5, color: INK, valign: "middle" });
    deck.textBox(s, it.body, { x: M + 5.1, y: y - 0.04, w: CW - 5.1, h: 0.7, font: SERIF, size: 15, color: INK, valign: "middle" });
    y += rowH; deck.line(s, { x: M, y: y - 0.1, w: CW, color: RULE, weight: 0.5 });
  });
}
function archFlow(s, tiles, top) {
  const n = tiles.length, gap = 0.22, tw = (CW - gap * (n - 1)) / n, th = 2.55; let x = M;
  tiles.forEach((t) => {
    deck.rect(s, { x, y: top, w: tw, h: th, fill: BG, line: { color: RULE, width: 0.75 } });
    deck.rect(s, { x: x + 0.16, y: top + 0.18, w: 0.48, h: 0.48, fill: ACCENT });
    deck.textBox(s, t.n, { x: x + 0.16, y: top + 0.18, w: 0.48, h: 0.48, align: "center", valign: "middle", font: SANS, bold: true, size: 15, color: WHITE });
    deck.textBox(s, t.when, { x: x + 0.16, y: top + 0.78, w: tw - 0.32, h: 0.4, font: SANS, bold: true, size: 9, color: t.gate ? ACCENT : MUTED });
    deck.textBox(s, t.label, { x: x + 0.16, y: top + 1.2, w: tw - 0.32, h: 0.4, font: SANS, bold: true, size: 12.5, color: INK });
    deck.textBox(s, t.desc, { x: x + 0.16, y: top + 1.6, w: tw - 0.32, h: 0.85, font: SERIF, size: 10.5, color: INK, valign: "top" });
    x += tw + gap;
  });
}
function costRows(s, rows, top) {
  let y = top; const rowH = 0.4;
  rows.forEach((r) => {
    const col = r.hi ? ACCENT : (r.muted ? MUTED : INK);
    deck.textBox(s, r.phase, { x: M, y, w: 7.3, h: 0.38, font: r.header ? SANS : SERIF, bold: r.header || r.hi, size: r.header ? 11 : 14, color: r.header ? MUTED : col, valign: "middle" });
    deck.textBox(s, r.days, { x: M + 7.4, y, w: 1.6, h: 0.38, align: "center", font: SANS, bold: r.header || r.hi, size: r.header ? 10 : 13, color: r.header ? MUTED : col, valign: "middle" });
    deck.textBox(s, r.amt, { x: M + 9.1, y, w: CW - 9.1, h: 0.38, align: "right", font: SANS, bold: true, size: r.header ? 10 : 13, color: r.header ? MUTED : col, valign: "middle" });
    y += rowH; if (!r.last) deck.line(s, { x: M, y: y - 0.04, w: CW, color: RULE, weight: 0.5 });
  });
}
function weekAxis() {
  const wnum = (t) => { const m = /^W(\d+)/.exec(t); return m ? parseInt(m[1], 10) : null; };
  const toks = [];
  R.mvps.forEach((m) => { const t = m.timeline || {}; ["startWeek", "endWeek", "liveWeek"].forEach((k) => { if (t[k]) toks.push(t[k]); }); });
  const nums = toks.map(wnum).filter((n) => n !== null);
  const lo = nums.length ? Math.min(...nums) : 0;
  const hi = nums.length ? Math.max(...nums) : 0;
  const axis = [];
  for (let i = lo; i <= hi; i++) axis.push("W" + i);
  [...new Set(toks)].forEach((t) => { if (wnum(t) === null || !axis.includes(t)) axis.push(t); });
  return START ? [START.short, ...axis] : axis;
}
function ganttChart(s) {
  const weeks = weekAxis();
  const idx = (t) => Math.max(0, weeks.indexOf(t));
  const labelW = 3.3, gridX = M + labelW + 0.15, gridRight = W - M;
  const colW = (gridRight - gridX) / weeks.length;
  const headerY = 3.0, rowH = 0.58;
  const rows = [];
  if (START) rows.push({ label: `${START.short} — ${START.trackVerb}`, a: 0, b: 0 });
  R.mvps.forEach((m) => {
    const t = m.timeline || {};
    rows.push({
      label: `${m.id} — ${m.title}${(m.timeline && m.timeline.gate) ? " (gated)" : (m.status === "conditional" ? " (conditional)" : "")}`,
      a: idx(t.startWeek), b: idx(t.endWeek), ms: t.liveWeek ? idx(t.liveWeek) : undefined,
      def: (m.defined === false && m.definitionDueWeek != null) ? idx("W" + m.definitionDueWeek) : undefined,
    });
  });
  weeks.forEach((w, i) => deck.textBox(s, w, { x: gridX + i * colW, y: headerY, w: colW, h: 0.3, align: "center", font: SANS, bold: true, size: 10, color: MUTED }));
  deck.line(s, { x: M, y: headerY + 0.34, w: CW, color: RULE, weight: 0.75 });
  let y = headerY + 0.5;
  rows.forEach((r) => {
    deck.textBox(s, r.label, { x: M, y, w: labelW, h: rowH - 0.08, font: SERIF, size: 12, color: INK, valign: "middle" });
    const bx = gridX + r.a * colW + 0.06, bw = (r.b - r.a + 1) * colW - 0.12;
    deck.roundRect(s, { x: bx, y: y + 0.09, w: Math.max(bw, 0.12), h: rowH - 0.28, fill: CRIMSON_LIGHT, line: { type: "none" } });
    if (r.ms !== undefined) {
      const mx = gridX + r.ms * colW + colW / 2;
      deck.rect(s, { x: mx - 0.1, y: y + 0.13, w: 0.2, h: 0.2, fill: ACCENT, line: { type: "none" }, rotate: 45 });
    }
    if (r.def !== undefined) {
      const dx = gridX + r.def * colW + colW / 2;
      deck.rect(s, { x: dx - 0.09, y: y + 0.14, w: 0.18, h: 0.18, fill: BG, line: { color: ACCENT, width: 1.25 }, rotate: 45 });
    }
    y += rowH;
    deck.line(s, { x: M, y: y - 0.03, w: CW, color: RULE, weight: 0.4 });
  });
}

const numWord = (n) => (["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][n] || String(n));
let s;

// 1 — Cover
s = base(null);
eyebrow(s, "SOLUTION SUMMARY", 1.45);
headline(s, "Agentic AI under\nenforced authority.", 1.95, 48);
subhead(s, `${numWord(nonBackup.length).replace(/^\w/, (c) => c.toUpperCase())} MVPs · the plan · the cost.`, 4.0);
rule(s, 4.7);
deck.textBox(s, `Prepared for ${C.sponsor || "[sponsor]"} · ${C.name || "[client]"} · Novagentica · ${((E.proposalDoc || {}).identity || {}).date || "[date]"}`, { x: M, y: 4.85, w: CW, h: 0.35, font: SERIF, italic: true, size: 14, color: MUTED });
closer(s, [{ text: START ? START.coverCloser : "Commercial summary.", options: { italic: true } }]);
footer(s, 1);

// 2 — The slate
s = base("I.");
eyebrow(s, "THE SOLUTION PROPOSAL", 1.35);
headline(s, `${numWord(nonBackup.length).replace(/^\w/, (c) => c.toUpperCase())} MVPs worth building now.`, 1.75, 36);
rule(s, 2.85);
numberedStack(s, nonBackup.slice(0, 3).map((m, i) => ({ n: String(i + 1).padStart(2, "0"), label: m.title, body: m.oneLiner || m.agentDoes || "", hi: m.status === "confirmed" && i === 0 })), 3.1);
closer(s, [{ text: "Built on what you already run.", options: { italic: true } }]);
footer(s, 2);

// 3 — Why safe + how delivered
s = base("II.");
eyebrow(s, "WHY IT'S SAFE · HOW WE DELIVER", 1.35);
headline(s, "Govern in place. No rip-and-replace.", 1.75, 34);
rule(s, 2.9);
themedRows(s, [
  { label: "NO PASSPORT = NO EXECUTION", fact: "Every high-stakes commit gated by a signed passport bound to a live contract." },
  { label: "RUNTIME-NEUTRAL", fact: `We govern ${R.runtimes.slice(0, 3).join(", ")} in place — no rebuild.` },
  { label: (E.commercials.services[0] && E.commercials.services[0].deliveryModel || "Novagentica-built").toUpperCase(), fact: "Architect → Authority → Control. Production from day one." },
  { label: "CERTIFIED", fact: "Three-tier AQVP certification before any agent goes live." },
], 3.15, 0.8);
closer(s, [{ text: "EU AI Act Article 43/47 documentation falls out as a by-product.", options: { italic: true } }]);
footer(s, 3);

// 4 — Phases
s = base("III.");
eyebrow(s, "THE PLAN — PHASES", 1.35);
headline(s, "Signature to first value, compressed.", 1.75, 34);
rule(s, 2.95);
const phaseTiles = [];
if (START) phaseTiles.push({ n: "01", when: "ON " + START.short, label: "Ingest & gap-analyse", desc: "Reverse-engineer the existing build. Surface the governance gaps." });
R.mvps.slice(0, 4).forEach((m) => phaseTiles.push({
  n: String(phaseTiles.length + 1).padStart(2, "0"),
  when: `${m.timeline.startWeek}–${m.timeline.endWeek}${m.timeline.gate ? " · GATED " + (m.timeline.gate.match(/\d+ \w+/) || [""])[0] : ""}`.toUpperCase(),
  gate: !!m.timeline.gate, label: `${m.id} live`, desc: m.oneLiner || m.title,
}));
archFlow(s, phaseTiles.slice(0, 5), 3.25);
closer(s, [{ text: `First value, ${DATES.firstValue || "soon"}.`, options: { bold: true, italic: true } }]);
footer(s, 4);

// 5 — Gantt
s = base("III.");
eyebrow(s, "THE PLAN — GANTT CHART", 1.35);
headline(s, "The delivery Gantt.", 1.75, 34);
rule(s, 2.8);
ganttChart(s);
const gate = (GATE && GATE.name) ? `${GATE.name}` : null;
const hasDef = R.undefinedMvps && R.undefinedMvps.length;
closer(s, [{ text: `Bars show active weeks; ◆ go-live${hasDef ? "; ◇ use-case definition due, 2 weeks before build" : ""}.${gate ? " Gated items await " + gate + "." : ""}`, options: { italic: true } }]);
footer(s, 5);

// 6 — Licence model / Commercial options
s = base("IV.");
// cell helper: fill is a hex string for deck.table (not {color})
const cell = (text, o = {}) => ({ text, options: { fontFace: o.head ? SANS : SERIF, fontSize: o.head ? 12 : 11.5, align: o.align || "left", bold: o.bold, color: o.color || INK, fill: o.fill || undefined } });
if (R.options) {
  eyebrow(s, "COMMERCIAL OPTIONS", 1.3);
  const opts = R.options, rec = R.recommendedOption;
  headline(s, `${numWord(opts.length).replace(/^\w/, (c) => c.toUpperCase())} ways to start.`, 1.62, 32);
  rule(s, 2.62);
  deck.roundRect(s, { x: M, y: 2.76, w: CW, h: 0.9, fill: BG, line: { color: ACCENT, width: 1.25 } });
  deck.textBox(s, [
    { text: `${rec.name} — `, options: { bold: true, color: ACCENT } },
    { text: `customer pays ${money(rec.customerPays, cur)} Year 1 on a ${rec.term.label} term${rec.coInvestment ? `; ${money(rec.coInvestment, cur)} co-invested by Novagentica` : ""}.`, options: { color: INK } },
  ], { x: M + 0.3, y: 2.76, w: CW - 0.6, h: 0.9, font: SERIF, size: 14, valign: "middle" });
  const colLabel = 3.4, colOpt = (CW - colLabel) / opts.length;
  const head = [cell("")].concat(opts.map((o) => cell(o.name.toUpperCase(), { head: true, bold: true, align: "center", color: o.recommended ? WHITE : MUTED, fill: o.recommended ? ACCENT : undefined })));
  const orow = (label, get) => [cell(label, { bold: true })].concat(opts.map((o) => cell(get(o), { align: "center", bold: o.recommended, color: o.recommended ? ACCENT : INK, fill: o.recommended ? DOM_TINT : undefined })));
  const dash = "—";
  const otbl = [
    head,
    orow("Customer pays (Yr 1)", (o) => o.customerPays != null ? money(o.customerPays, cur) : dash),
    orow("Term", (o) => o.term.label || dash),
    orow("Delivery-support days", (o) => o.deliveryDays != null ? String(o.deliveryDays) : dash),
    orow("Nova co-investment", (o) => o.coInvestment ? money(o.coInvestment, cur) : dash),
    orow("Total value (Yr 1)", (o) => o.totalValue != null ? money(o.totalValue, cur) : dash),
  ];
  const ocolW = [colLabel].concat(opts.map(() => colOpt));
  deck.table(s, otbl, { x: M, y: 3.82, w: CW, colW: ocolW, rowH: 0.4, border: { color: RULE, pt: 0.5 } });
  rule(s, 6.42);
  const ofoot = E.commercials.tierFootnote || "";
  if (ofoot) deck.textBox(s, ofoot, { x: M, y: 6.48, w: CW, h: 0.22, font: SERIF, italic: true, size: 12, color: INK });
  const odd = R.licence && R.licence.domainDefinition;
  if (odd) deck.textBox(s, [{ text: odd, options: { color: INK } }], { x: M, y: 6.7, w: CW, h: 0.22, font: SERIF, italic: true, size: 12.5 });
} else {
  eyebrow(s, "LICENCE MODEL", 1.3);
  const L = R.licence;
  const tierWord = /^[A-Z][a-z]+$/.test(L.quotedTier || "") ? " tier" : "";
  const licHeadline = L.introOffer
    ? `${L.quotedTier} price. ${L.introOffer.promoTier} for ${numWord(L.introOffer.promoMonths)} months.`
    : `${L.quotedTier}${tierWord} · ${L.term.label} term.`;
  headline(s, licHeadline, 1.62, 30);
  rule(s, 2.62);
  deck.roundRect(s, { x: M, y: 2.76, w: CW, h: 0.9, fill: BG, line: { color: ACCENT, width: 1.25 } });
  const calloutText = L.introOffer
    ? [{ text: `The ${C.name} offer — `, options: { bold: true, color: ACCENT } }, { text: L.introOffer.sentence, options: { color: INK } }]
    : [{ text: `${L.quotedTier}${tierWord} — `, options: { bold: true, color: ACCENT } }, { text: `${perYear(L.annualFee, cur)} on a ${L.term.label} term.`, options: { color: INK } }];
  deck.textBox(s, calloutText, { x: M + 0.3, y: 2.76, w: CW - 0.6, h: 0.9, font: SERIF, size: 14, valign: "middle" });
  const tiers = R.tiers;
  const colLabel = 3.0, colTier = (CW - colLabel) / tiers.length;
  const head = [cell("")].concat(tiers.map((t) => cell(t.name.toUpperCase(), { head: true, bold: true, align: "center", color: t.highlight ? WHITE : MUTED, fill: t.highlight ? ACCENT : undefined })));
  const row = (label, get) => [cell(label, { bold: true })].concat(tiers.map((t) => cell(get(t), { align: "center", bold: t.highlight, color: t.highlight ? ACCENT : INK, fill: t.highlight ? DOM_TINT : undefined })));
  const tbl = [
    head,
    row("Annual fee", (t) => money(t.annualFee, cur)),
    row("Agents governed", (t) => t.agents || ""),
    row("Runs / month", (t) => t.runs || ""),
    row("Runtimes", (t) => t.runtimes || ""),
    row("CDAP™", (t) => t.cdap || ""),
    row("Support", (t) => t.support || ""),
  ];
  const colW = [colLabel].concat(tiers.map(() => colTier));
  deck.table(s, tbl, { x: M, y: 3.82, w: CW, colW, rowH: 0.355, border: { color: RULE, pt: 0.5 } });
  rule(s, 6.42);
  const foot = E.commercials.tierFootnote || "";
  if (foot) deck.textBox(s, foot, { x: M, y: 6.48, w: CW, h: 0.22, font: SERIF, italic: true, size: 12, color: INK });
  if (L.domainDefinition) deck.textBox(s, [{ text: L.domainDefinition, options: { color: INK } }], { x: M, y: 6.7, w: CW, h: 0.22, font: SERIF, italic: true, size: 12.5 });
}
footer(s, 6);

// 7 — Services
s = base("IV.");
eyebrow(s, "SERVICES", 1.35);
headline(s, "What delivery costs.", 1.75, 36);
rule(s, 2.85);
if (R.options) {
  const rec = R.recommendedOption;
  const oRows = [{ phase: "DELIVERY (PROFESSIONAL SERVICES)", days: "DAYS", amt: "", header: true }];
  nonBackup.forEach((m) => oRows.push({ phase: `${m.id} — ${m.title} · ${m.elapsedWeeks} wk`, days: String(m.days), amt: "incl." }));
  oRows.push({ phase: "Delivery-support — total", days: rec.deliveryDays != null ? String(rec.deliveryDays) : String(R.services.totalDays), amt: "", hi: true });
  if (rec.coInvestment) oRows.push({ phase: "Novagentica co-investment (not invoiced)", days: "—", amt: "−" + money(rec.coInvestment, cur), muted: true });
  oRows.push({ phase: "Customer pays Year 1 (blended licence + delivery)", days: "—", amt: money(rec.customerPays, cur), hi: true, last: true });
  costRows(s, oRows, 3.2);
  const oNote = (E.commercials.services && E.commercials.services[0] && E.commercials.services[0].note) || "";
  deck.textBox(s, `Day rate ${perDay(R.dayRate, cur)}. ${oNote}`, { x: M, y: 5.95, w: CW, h: 0.55, font: SERIF, italic: true, size: 13, color: MUTED });
  closer(s, [{ text: `Customer pays ${money(rec.customerPays, cur)} Year 1 (blended licence + delivery)${rec.coInvestment ? `; ${money(rec.coInvestment, cur)} co-invested by Novagentica` : ""}.`, options: { italic: true } }]);
} else {
  const svcStageLines = R.services.lines.filter((l) => l.stages && l.stages.length);
  const totalDiscount = svcStageLines.reduce((a, l) => a + (l.discount || 0), 0);
  const netServices = svcStageLines.reduce((a, l) => a + (l.payable || 0), 0);
  const coInvested = totalDiscount > 0;
  const svcRows = [{ phase: "DELIVERY (PROFESSIONAL SERVICES)", days: "DAYS", amt: coInvested ? "VALUE" : "INVESTMENT", header: true }];
  nonBackup.forEach((m) => svcRows.push({
    phase: `${m.id} — ${m.title}${(m.timeline && m.timeline.gate) ? " (gated)" : (m.status === "conditional" ? " (conditional)" : "")} · ${m.elapsedWeeks} wk`,
    days: String(m.days), amt: money(m.cost, cur),
  }));
  const confDiffers = R.scenarios.confirmed.amount !== R.scenarios.fullSlate.amount;
  svcRows.push({ phase: coInvested ? "Delivery value — all tracks" : "Full slate — incl. conditional", days: String(R.scenarios.fullSlate.days), amt: money(R.scenarios.fullSlate.amount, cur), hi: !coInvested, last: !coInvested && !confDiffers });
  if (!coInvested && confDiffers) svcRows.push({ phase: "Confirmed-only", days: String(R.scenarios.confirmed.days), amt: money(R.scenarios.confirmed.amount, cur), muted: true, last: true });
  if (coInvested) {
    svcRows.push({ phase: "Novagentica co-investment (not invoiced)", days: "—", amt: "−" + money(totalDiscount, cur), muted: true });
    svcRows.push({ phase: "Net professional services — customer pays", days: "—", amt: money(netServices, cur), hi: true, last: true });
  }
  costRows(s, svcRows, 3.2);
  const psLine = E.commercials.services[0] || {};
  deck.textBox(s, `Day rate ${perDay(R.dayRate, cur)}. ${psLine.note || ""}`, { x: M, y: 5.95, w: CW, h: 0.55, font: SERIF, italic: true, size: 13, color: MUTED });
  closer(s, [{
    text: coInvested
      ? `Licence payable in full; ${money(totalDiscount, cur)} of delivery co-invested by Novagentica. Year-1 total ${money(R.year1Total, cur)}.`
      : "Indicative ± 15%, fixed at SoW sign-off. Platform licence quoted separately.",
    options: { italic: true },
  }]);
}
footer(s, 7);

// 8 — The ask
s = base("V.");
eyebrow(s, "THE ASK", 1.35);
headline(s, START ? `Start under ${START.word}.` : "Confirm the engagement.", 1.75, 32);
rule(s, 2.9);
const askRows = [];
if (START) askRows.push({ label: "START NOW", fact: START.askNote });
if (GATE) askRows.push({ label: "DEPENDENCY", fact: `${GATE.name}${GATE.date ? " " + GATE.date : ""} → first production value, ${DATES.firstValue || "shortly after"}.` });
if (R.undefinedMvps && R.undefinedMvps.length) {
  const parts = R.undefinedMvps.map((m) => `${m.id} by ${m.definitionDue ? fmtDate(m.definitionDue) : (m.definitionDueWeek != null ? "W" + m.definitionDueWeek : "TBC")}`);
  askRows.push({ label: "DEFINITION DUE", fact: `${parts.join("; ")} — each two weeks before its own build starts, so every MVP enters build on a fixed scope.` });
}
themedRows(s, askRows.length ? askRows : [{ label: "NEXT", fact: "Confirm scope and commercials to proceed." }], 3.25);
rule(s, 6.4);
deck.textBox(s, [{ text: "The ask:  ", options: { bold: true, color: ACCENT } }, { text: `confirm on ${DATES.sponsorMeeting || "the agreed date"}.`, options: { italic: true } }], { x: M, y: 6.5, w: CW, h: 0.4, font: SERIF, size: 16, color: INK });
footer(s, 8);

const payload = deck.payload();
const out = process.argv[3];
if (out) { require("fs").writeFileSync(out, JSON.stringify(payload, null, 2)); console.log(`gslides payload written: ${out} (${payload.slideCount} slides, ${payload.requests.length} requests)`); }
else { process.stdout.write(JSON.stringify(payload, null, 2)); }

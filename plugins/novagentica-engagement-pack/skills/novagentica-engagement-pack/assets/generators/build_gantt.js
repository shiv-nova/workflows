// Novagentica engagement-pack — Delivery Timeline (Gantt) generator.
// PURE RENDERER. No client, date, week, tier or price literals live here.
// Everything is read from the engagement spine (engagement.json):
//   - client / commercials                  → header, footer, day-rate, effort numbers
//   - mvps[].sizing / .timeline / .status   → milestone columns, effort table, totals, key-milestones
//   - mvps[].delivery                       → authored task rows + section header per MVP
//   - gantt.frameSections / .dependencies   → pre-contract / foundation / scale + authored gate prose
// Usage: node build_gantt.NEW.js [engagement.json] [out.docx]
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Footer, AlignmentType, PageOrientation, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, TabStopType
} = require("docx");

// ---- inputs ----
const SPINE_PATH = process.argv[2] || "engagement.json";
const E = JSON.parse(fs.readFileSync(SPINE_PATH, "utf8"));
const G = E.gantt || {};
const C = E.commercials || {};
const CLIENT = (E.client && E.client.name) || "[Client]";

// ---- brand (fixed document styling, not deal data) ----
const B = require("./lib/brand");
const CRIMSON = B.ACCENT, CRIMSON_LIGHT = B.CRIMSON_LIGHT, INK = B.INK,
      DARK = B.DARK, WHITE = B.WHITE, GREY = B.GREY, BODY = B.SANS, SERIF = B.SERIF;
const border = { style: BorderStyle.SINGLE, size: 1, color: GREY };
const borders = { top: border, bottom: border, left: border, right: border };
const cm = { top: 50, bottom: 50, left: 80, right: 80 };

// ---- derived: week axis + label→index map ----
const WEEKS = G.weekAxis || ["W0", "W1", "W2", "W3", "W4", "W5", "W6", "W6+"];
const WIDX = Object.fromEntries(WEEKS.map((w, i) => [w, i]));
const COL_WS = 2500, COL_OWN = 1701, COL_WK = 1084;
const colWidths = [COL_WS, COL_OWN, ...WEEKS.map(() => COL_WK)];
const TOTAL = colWidths.reduce((a, b) => a + b, 0);

// ---- derived: money + small-number words ----
const cur = C.currency || "CHF";
const dayRate = C.dayRate || 0;
const money = n => `${cur} ${Number(n).toLocaleString("en-US")}`;
const dayRateStr = money(dayRate);                 // "CHF 2,500"
const WORDS = ["zero","one","two","three","four","five","six","seven","eight","nine","ten"];
const word = n => WORDS[n] || String(n);

// ---- slate views (status-driven, no stored totals) ----
const mvps = E.mvps || [];
const live = mvps.filter(m => !m.isBackup);                                  // shown as gantt sections
const sumDays = arr => arr.reduce((a, m) => a + ((m.sizing && m.sizing.consultantDays) || 0), 0);
const confirmed = mvps.filter(m => m.status === "confirmed" && !m.isBackup);
const backups = mvps.filter(m => m.isBackup);
const totals = {
  fullSlate:    sumDays(live),
  confirmedOnly: sumDays(confirmed),
  backupPath:   sumDays(confirmed) + sumDays(backups),
};

// ---- cell / paragraph helpers ----
function tc(width, children, opts = {}) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA }, margins: cm,
    verticalAlign: VerticalAlign.CENTER, columnSpan: opts.span,
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined, children
  });
}
function p(text, opts = {}) {
  return new Paragraph({ alignment: opts.align, children: [new TextRun({ text, size: opts.size || 16, bold: opts.bold, italics: opts.italics, color: opts.color || INK, font: opts.font })] });
}
function headerRow() {
  return new TableRow({ tableHeader: true, children: [
    tc(COL_WS, [p("Workstream", { bold: true, color: WHITE, size: 17 })], { fill: CRIMSON }),
    tc(COL_OWN, [p("Owner", { bold: true, color: WHITE, size: 17 })], { fill: CRIMSON }),
    ...WEEKS.map(w => tc(COL_WK, [p(w, { bold: true, color: WHITE, size: 15, align: AlignmentType.CENTER })], { fill: CRIMSON }))
  ]});
}
function sectionRow(label) {
  return new TableRow({ children: [tc(TOTAL, [p(label, { bold: true, color: WHITE, size: 16 })], { span: 2 + WEEKS.length, fill: DARK })] });
}
function taskRow(ws, owner, activeWeeks = [], milestoneWeek = null, opts = {}) {
  const active = activeWeeks.map(w => WIDX[w]).filter(i => i !== undefined);
  const mi = milestoneWeek != null ? WIDX[milestoneWeek] : null;
  const cells = [
    tc(COL_WS, [new Paragraph({ children: [new TextRun({ text: ws, size: 16, bold: opts.bold, color: opts.color || INK })] })]),
    tc(COL_OWN, [p(owner, { size: 15, color: DARK })]),
  ];
  for (let i = 0; i < WEEKS.length; i++) {
    if (mi === i) cells.push(tc(COL_WK, [p("◆", { color: WHITE, bold: true, size: 16, align: AlignmentType.CENTER })], { fill: CRIMSON }));
    else if (active.includes(i)) cells.push(tc(COL_WK, [p("", {})], { fill: CRIMSON_LIGHT }));
    else cells.push(tc(COL_WK, [p("", {})]));
  }
  return new TableRow({ children: cells });
}
// render one section block (frame or MVP): header → tasks → optional milestone
function sectionBlock(rows, header, tasks, milestone) {
  rows.push(sectionRow(header));
  (tasks || []).forEach(t => rows.push(taskRow(t.label, t.owner, t.weeks || [])));
  if (milestone) rows.push(taskRow(milestone.label, "Milestone", [], milestone.week, { bold: true, color: CRIMSON }));
}

// ---- build the gantt rows from the spine ----
const frames = G.frameSections || [];
const before = frames.filter(f => f.position === "before");
const after = frames.filter(f => f.position === "after");
const rows = [headerRow()];
before.forEach(f => sectionBlock(rows, f.header, f.tasks, f.milestone));
live.forEach(m => {
  const d = m.delivery || {};
  const liveWeek = (d.milestone && d.milestone.week) || (m.timeline && m.timeline.liveWeek);
  sectionBlock(rows, d.sectionHeader, d.tasks, d.milestone || (liveWeek ? { label: `◆ ${m.id} LIVE`, week: liveWeek } : null));
});
after.forEach(f => sectionBlock(rows, f.header, f.tasks, f.milestone));
const gantt = new Table({ width: { size: TOTAL, type: WidthType.DXA }, columnWidths: colWidths, rows });

// ---- legend ----
function legendChip(fill, label) {
  const none = { style: BorderStyle.NONE };
  return new Table({
    width: { size: 3200, type: WidthType.DXA }, columnWidths: [360, 2840],
    borders: { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none },
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 360, type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders, children: [p("", {})] }),
      new TableCell({ width: { size: 2840, type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none }, margins: { left: 120 }, verticalAlign: VerticalAlign.CENTER, children: [p(label, { size: 16 })] })
    ]})]
  });
}

// ---- footer (client derived) ----
const footer = new Footer({ children: [new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: 13958 }],
  border: { top: { style: BorderStyle.SINGLE, size: 4, color: CRIMSON, space: 6 } },
  children: [
    ...B.wordmarkRuns(INK, CRIMSON).map(w => new TextRun({ text: w.text, bold: true, color: w.color, size: 18 })),
    new TextRun({ text: `    ${CLIENT} · Delivery Timeline · Confidential`, color: B.MUTED, size: 14 }),
    new TextRun({ text: "\tPage ", size: 16, color: B.MUTED }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: B.MUTED }),
  ]
})]});

// ---- effort table (per-MVP rows derived; totals status-driven) ----
function effRow(phase, days, chf, opts = {}) {
  return new TableRow({ children: [
    tc(6400, [p(phase, { size: 17, bold: opts.bold })], { fill: opts.fill }),
    tc(1600, [p(days, { size: 17, bold: opts.bold, align: AlignmentType.CENTER })], { fill: opts.fill }),
    tc(2400, [p(chf, { size: 17, bold: opts.bold, align: AlignmentType.RIGHT })], { fill: opts.fill }),
  ]});
}
const tl = G.totalsLabels || {};
const effortRows = [
  new TableRow({ tableHeader: true, children: [
    tc(6400, [p("Phase / MVP", { color: WHITE, bold: true, size: 17 })], { fill: CRIMSON }),
    tc(1600, [p("Days", { color: WHITE, bold: true, size: 17, align: AlignmentType.CENTER })], { fill: CRIMSON }),
    tc(2400, [p(`At ${dayRateStr}/day`, { color: WHITE, bold: true, size: 16, align: AlignmentType.RIGHT })], { fill: CRIMSON }),
  ]}),
];
live.forEach(m => {
  const days = (m.sizing && m.sizing.consultantDays) || 0;
  const label = (m.delivery && m.delivery.effortLabel) || `${m.id} — ${m.title}`;
  effortRows.push(effRow(label, String(days), money(days * dayRate)));
});
effortRows.push(effRow(tl.fullSlate || "Full slate", String(totals.fullSlate), money(totals.fullSlate * dayRate), { bold: true, fill: CRIMSON_LIGHT }));
// only show the alternative-path totals when they actually differ from the full slate
if (totals.confirmedOnly !== totals.fullSlate)
  effortRows.push(effRow(tl.confirmedOnly || "Confirmed-only", String(totals.confirmedOnly), money(totals.confirmedOnly * dayRate), { fill: "F7F7F5" }));
if (backups.length > 0)
  effortRows.push(effRow(tl.backupPath || "Backup path", String(totals.backupPath), money(totals.backupPath * dayRate), { fill: "F7F7F5" }));
const effortTable = new Table({ width: { size: 10400, type: WidthType.DXA }, columnWidths: [6400, 1600, 2400], rows: effortRows });

// ---- derived: title strap + key-milestones bullet ----
const strap = `${CLIENT.toUpperCase()}  ·  ${word(live.length)} MVPs on one enforcement layer  ·  weeks shown relative to formal kickoff`;
const keyMs = ["Kickoff (W0)"]
  .concat(live.map((m, i) => {
    const lw = (m.delivery && m.delivery.milestone && m.delivery.milestone.week) || (m.timeline && m.timeline.liveWeek);
    const gated = m.timeline && m.timeline.gate ? ", gated" : "";
    return `MVP ${i + 1} live (${lw}${gated})`;
  }))
  .concat([`Scale (${WEEKS[WEEKS.length - 1]})`]);
const keyMsBullet = `• Key milestones: ${keyMs.join(" · ")}.`;
const dependencies = (G.dependencies || []).concat([keyMsBullet]);
const effortNote = (G.effortNote || "").replace("{dayRate}", dayRateStr);

const none = { style: BorderStyle.NONE };
const doc = new Document({
  background: { color: B.BG },
  styles: { default: { document: { run: { font: BODY, size: 20, color: INK } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }, margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 } } },
    footers: { default: footer },
    children: [
      new Paragraph({ spacing: { after: 0 }, children: B.wordmarkRuns(INK, CRIMSON).map(w => new TextRun({ text: w.text, bold: true, color: w.color, size: 24 })) }),
      new Paragraph({ spacing: { before: 60, after: 20 }, children: [new TextRun({ text: G.title || "Delivery Timeline", bold: true, size: 36, color: INK })] }),
      new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: strap, italics: true, font: SERIF, size: 22, color: DARK })] }),
      gantt,
      new Paragraph({ spacing: { before: 200, after: 60 }, children: [new TextRun({ text: "Legend", bold: true, color: CRIMSON, size: 22 })] }),
      new Table({
        width: { size: 9600, type: WidthType.DXA }, columnWidths: [3200, 3200, 3200],
        borders: { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none },
        rows: [new TableRow({ children: [
          new TableCell({ borders: { top: none, bottom: none, left: none, right: none }, width: { size: 3200, type: WidthType.DXA }, children: [legendChip(CRIMSON_LIGHT, "Active work")] }),
          new TableCell({ borders: { top: none, bottom: none, left: none, right: none }, width: { size: 3200, type: WidthType.DXA }, children: [legendChip(CRIMSON, "◆  Milestone / go-live")] }),
          new TableCell({ borders: { top: none, bottom: none, left: none, right: none }, width: { size: 3200, type: WidthType.DXA }, children: [legendChip(DARK, "Section / phase header")] }),
        ]})]
      }),
      new Paragraph({ spacing: { before: 240, after: 60 }, children: [new TextRun({ text: "External dependencies & gates", bold: true, color: CRIMSON, size: 22 })] }),
      ...dependencies.map(t => new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: t, size: 18 })] })),
      new Paragraph({ spacing: { before: 240, after: 60 }, children: [new TextRun({ text: `Indicative consultancy effort  ·  ${effortNote}`, bold: true, color: CRIMSON, size: 22 })] }),
      effortTable,
      new Paragraph({ spacing: { before: 120 }, children: [new TextRun({ text: "No execution without a Crypto Passport.", bold: true, italics: true, font: SERIF, color: CRIMSON, size: 20 })] }),
    ]
  }]
});

const stem = (E.output && E.output.fileStem) || `Novagentica-${CLIENT}`;
const ver = (E.output && E.output.version) || "1.0";
const out = process.argv[3] || `${stem}-DeliveryTimeline-v${ver}.docx`;
Packer.toBuffer(doc).then(buffer => { fs.writeFileSync(out, buffer); console.log("gantt written →", out); });

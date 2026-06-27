// Novagentica engagement-pack — Solution Proposal (DOCX, 9 sections).
// PURE RENDERER. Identity and all narrative prose live in the spine at engagement.json →
// proposalDoc (identity + ordered sections of run-specs); the commercial cost table, the
// CLIENT identity and the footer derive from client / commercials / mvps. A new customer is
// a new proposalDoc block, never a generator edit. See references/data-model.md.
// Usage: node build_proposal.js [engagement.json] [out.docx]
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak, TabStopType
} = require("docx");

const SPINE_PATH = process.argv[2] || "engagement.json";
const E = JSON.parse(fs.readFileSync(SPINE_PATH, "utf8"));
const C = E.commercials || {};
const client = E.client || {};
const PD = E.proposalDoc || {};
const ID = PD.identity || {};
const CLIENT = client.name || "[Client]";
const cur = C.currency || "CHF";
const dayRate = C.dayRate || 0;
const money = n => `${cur} ${Number(n).toLocaleString("en-US")}`;
const mvps = E.mvps || [];
const liveMvps = mvps.filter(m => !m.isBackup);
const backups = mvps.filter(m => m.isBackup);
const sumDays = arr => arr.reduce((a, m) => a + ((m.sizing && m.sizing.consultantDays) || 0), 0);
const confirmedDays = sumDays(mvps.filter(m => m.status === "confirmed" && !m.isBackup));
const totals = { fullSlate: sumDays(liveMvps), confirmedOnly: confirmedDays, backupPath: confirmedDays + sumDays(backups) };
const d = i => (mvps[i] && mvps[i].sizing && mvps[i].sizing.consultantDays) || 0;

const CRIMSON = "CC0D2C", CRIMSON_LIGHT = "F5C6CE", INK = "0E0E0C", DARK = "2B2B2B", WHITE = "FFFFFF", GREY = "CCCCCC";
const BODY = "Inter", SERIF = "Georgia";
const border = { style: BorderStyle.SINGLE, size: 1, color: GREY };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// ---- run-spec → TextRun ----
function run(r) {
  if (typeof r === "string") return new TextRun(r);
  const o = { text: r.t };
  if (r.b) o.bold = true;
  if (r.c) { o.bold = true; o.color = CRIMSON; }
  if (r.i) { o.italics = true; o.font = SERIF; }
  if (r.dark) o.color = DARK;
  return new TextRun(o);
}
function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] }); }
function body(runs, opts = {}) { return new Paragraph({ spacing: { after: 140, line: 276 }, ...opts, children: runs }); }
function bullet(runs) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80, line: 264 }, children: runs }); }
function bold(t) { return new TextRun({ text: t, bold: true }); }
function txt(t) { return new TextRun(t); }

function headerCell(text, width) {
  return new TableCell({ borders, width: { size: width, type: WidthType.DXA }, margins: cellMargins,
    shading: { fill: CRIMSON, type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: WHITE, size: 19 })] })] });
}
function dataCell(runsOrText, width, opts = {}) {
  const children = Array.isArray(runsOrText) ? runsOrText : [new Paragraph({ children: [new TextRun({ text: runsOrText, size: 19 })] })];
  return new TableCell({ borders, width: { size: width, type: WidthType.DXA }, margins: cellMargins,
    verticalAlign: VerticalAlign.CENTER,
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined, children });
}
function cellPara(text, opts = {}) { return new Paragraph({ children: [new TextRun({ text, size: 19, bold: opts.bold, color: opts.color })] }); }

const footer = new Footer({
  children: [new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: 9026 }],
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: CRIMSON, space: 6 } },
    children: [
      new TextRun({ text: "novagentica", bold: true, color: CRIMSON, size: 18 }),
      new TextRun({ text: `    ${CLIENT} · ${ID.footerLabel || ""}`, color: DARK, size: 14 }),
      new TextRun({ text: "\tPage ", size: 16, color: DARK }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: DARK }),
    ]
  })]
});

const styles = {
  default: { document: { run: { font: BODY, size: 22, color: INK } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 30, bold: true, font: BODY, color: CRIMSON }, paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 0 } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 24, bold: true, font: BODY, color: INK }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
  ]
};
const numbering = {
  config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT,
      style: { run: { color: CRIMSON }, paragraph: { indent: { left: 460, hanging: 260 } } } }] },
    { reference: "nums", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 460, hanging: 260 } } } }] },
  ]
};
const CW = 9026;

// ===== COVER (from identity) =====
const cover = [
  new Paragraph({ spacing: { before: 1200, after: 0 }, children: [new TextRun({ text: "novagentica", bold: true, color: CRIMSON, size: 30 })] }),
  new Paragraph({ spacing: { before: 40, after: 600 }, children: [new TextRun({ text: ID.kicker, color: DARK, size: 18, characterSpacing: 40 })] }),
  new Paragraph({ spacing: { before: 200, after: 0 }, children: [new TextRun({ text: ID.title1, bold: true, size: 56, color: INK })] }),
  new Paragraph({ spacing: { before: 0, after: 240 }, children: [new TextRun({ text: ID.title2, bold: true, size: 56, color: INK })] }),
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: ID.subtitle, italics: true, font: SERIF, size: 26, color: DARK })] }),
  new Paragraph({ spacing: { before: 500, after: 60 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: CRIMSON, space: 8 } },
    children: [new TextRun({ text: ID.tagline, size: 20, color: INK })] }),
  new Paragraph({ spacing: { before: 280, after: 30 }, children: [bold("Prepared for:  "), txt(ID.preparedFor)] }),
  new Paragraph({ spacing: { after: 30 }, children: [bold("From:  "), txt(ID.from)] }),
  new Paragraph({ spacing: { after: 30 }, children: [bold("Date:  "), txt(ID.date)] }),
  new Paragraph({ spacing: { after: 30 }, children: [bold("Status:  "), txt(ID.status)] }),
  new Paragraph({ spacing: { before: 360 }, children: [new TextRun({ text: ID.passportLine, bold: true, color: CRIMSON, size: 18, characterSpacing: 30 })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

// ===== tables =====
function routesTable(item) {
  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [1500, 3763, 3763],
    rows: [
      new TableRow({ tableHeader: true, children: [headerCell(item.headers[0], 1500), headerCell(item.headers[1], 3763), headerCell(item.headers[2], 3763)] }),
      ...item.rows.map(r => new TableRow({ children: [
        dataCell([cellPara(r.label, { bold: true })], 1500, { fill: "F7F7F5" }),
        dataCell(r.r1, 3763), dataCell(r.r2, 3763)
      ]}))
    ]});
}
function risksTable(item) {
  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [4513, 4513],
    rows: [
      new TableRow({ tableHeader: true, children: [headerCell(item.headers[0], 4513), headerCell(item.headers[1], 4513)] }),
      ...item.rows.map(r => new TableRow({ children: [dataCell([cellPara(r.risk)], 4513), dataCell([cellPara(r.mit)], 4513)] }))
    ]});
}
function daysRow(phase, days, chf, opts = {}) {
  return new TableRow({ children: [
    dataCell([cellPara(phase, { bold: opts.bold })], 5226, { fill: opts.fill }),
    dataCell([new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: days, size: 19, bold: opts.bold })] })], 1700, { fill: opts.fill }),
    dataCell([new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: chf, size: 19, bold: opts.bold })] })], 2100, { fill: opts.fill }),
  ]});
}
function daysTable(item) {
  const rateHeader = `${item.rateHeaderPre}${money(dayRate)}${item.rateHeaderPost}`;
  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [5226, 1700, 2100],
    rows: [
      new TableRow({ tableHeader: true, children: [headerCell(item.header[0], 5226), headerCell(item.header[1], 1700), headerCell(rateHeader, 2100)] }),
      daysRow(item.mvpRows[0], String(d(0)), money(d(0) * dayRate)),
      daysRow(item.mvpRows[1], String(d(1)), money(d(1) * dayRate)),
      daysRow(item.mvpRows[2], String(d(2)), money(d(2) * dayRate)),
      daysRow(item.fullLabel, String(totals.fullSlate), money(totals.fullSlate * dayRate), { bold: true, fill: CRIMSON_LIGHT }),
      daysRow(item.confirmedLabel, String(totals.confirmedOnly), money(totals.confirmedOnly * dayRate), { fill: "F7F7F5" }),
      daysRow(item.backupLabel, String(totals.backupPath), money(totals.backupPath * dayRate), { fill: "F7F7F5" }),
    ]});
}

// ===== section dispatch =====
function quote(item) {
  return new Paragraph({ spacing: { before: 120, after: 160 },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: CRIMSON, space: 12 } }, indent: { left: 200 },
    children: [new TextRun({ text: item.t, italics: true, font: SERIF, size: 24, color: INK })] });
}
function render(item) {
  switch (item.k) {
    case "h1": return [h1(item.t)];
    case "h2": return [h2(item.t)];
    case "body": return [body(item.runs.map(run), item.before ? { spacing: { before: item.before } } : {})];
    case "bullet": return [bullet(item.runs.map(run))];
    case "quote": return [quote(item)];
    case "numbered": return [new Paragraph({ numbering: { reference: "nums", level: 0 }, spacing: { after: 80 }, children: item.runs.map(run) })];
    case "routesTable": return [routesTable(item)];
    case "risksTable": return [risksTable(item)];
    case "daysTable": return [daysTable(item)];
    default: return [];
  }
}
const sectionChildren = (PD.sections || []).flatMap(render);

const doc = new Document({
  styles, numbering,
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    footers: { default: footer },
    children: [...cover, ...sectionChildren]
  }]
});
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(process.argv[3] || "Novagentica-Hensoldt-SolutionProposal-v1.2.docx", buffer);
  console.log("proposal written");
});

// Novagentica engagement-pack — Statement of Work generator.
// PURE RENDERER. No client, date, name or price literals.
// Authored SoW prose lives in the spine at engagement.json → `sow`; structure,
// people, the commercials tables, status-filtered totals and the footer are derived
// from client / nova / mvps / commercials. See references/data-model.md.
// Usage: node build_sow.js [engagement.json] [out.docx]
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak, TabStopType
} = require("docx");
const B = require("./lib/brand");
const { money: fmtMoney } = require("./lib/format");
const { reconcile } = require("./lib/commercials");
const { preflight, report } = require("./lib/preflight");

const SPINE_PATH = process.argv[2] || "engagement.json"; // explicit spine or cwd engagement.json — never a customer fixture
const E = require(path.resolve(SPINE_PATH));
const R = reconcile(E);
// Prompt, don't fabricate: missing critical inputs stop generation with questions.
const pf = preflight(E, R);
if (report(pf, "SoW") && process.env.NVG_FORCE !== "1") {
  console.error("Refusing to generate: answer the questions above (or set NVG_FORCE=1 to draft with gaps).");
  process.exit(2);
}
const S = E.sow || {};
const C = E.commercials || {};
const client = E.client || {};
const nova = E.nova || {};
const CLIENT = client.name || "[Client]";

// Brand
const CRIMSON = B.ACCENT, CRIMSON_LIGHT = B.CRIMSON_LIGHT, INK = B.INK,
      DARK = B.DARK, WHITE = B.WHITE, GREY = B.GREY, BODY = B.SANS, SERIF = B.SERIF;
const FILLS = { CRIMSON_LIGHT, F7F7F5: B.PAPER_2 /* legacy key, PAPER_2 token */ };
const border = { style: BorderStyle.SINGLE, size: 1, color: GREY };
const borders = { top: border, bottom: border, left: border, right: border };
const cm = { top: 80, bottom: 80, left: 120, right: 120 };
const CW = 9026;

// ---- derived: money + slate views (status-driven, shared rules with the Gantt) ----
const cur = R.currency || "CHF";
const dayRate = C.dayRate || 0;
const money = n => fmtMoney(n, cur);
const dayRateStr = money(dayRate);
const mvps = R.mvps || [];
const liveMvps = mvps.filter(m => !m.isBackup);
const backups = mvps.filter(m => m.isBackup);
const totals = {
  fullSlate: R.scenarios.fullSlate.days,
  confirmedOnly: R.scenarios.confirmed.days,
  backupPath: R.scenarios.backupPath.days,
};
const amounts = {
  fullSlate: R.scenarios.fullSlate.amount,
  confirmedOnly: R.scenarios.confirmed.amount,
  backupPath: R.scenarios.backupPath.amount,
};
const firstName = s => String(s || "").split(" — ")[0];

function h1(t) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] }); }
function h2(t) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] }); }
// body prose is Gelasio 11pt (design DOCX convention); tables/labels stay Inter via cp()/hcell.
function body(runs, opts = {}) {
  const arr = Array.isArray(runs) ? runs : [new TextRun({ text: runs, font: SERIF })];
  return new Paragraph({ spacing: { after: 140, line: 276 }, ...opts, children: arr });
}
function bullet(runs) {
  const arr = Array.isArray(runs) ? runs : [new TextRun({ text: runs, font: SERIF })];
  return new Paragraph({ numbering: { reference: "b", level: 0 }, spacing: { after: 70, line: 264 }, children: arr });
}
function bold(t) { return new TextRun({ text: t, bold: true, font: SERIF }); }
function txt(t) { return new TextRun({ text: t, font: SERIF }); }
function runs(spec) { return spec.map(r => new TextRun({ text: r.t, bold: !!r.b, font: SERIF })); }
function cp(text, opts = {}) { return new Paragraph({ alignment: opts.align, children: [new TextRun({ text, size: 19, bold: opts.bold, color: opts.color, italics: opts.italics })] }); }
function hcell(text, w) { return new TableCell({ borders, width: { size: w, type: WidthType.DXA }, margins: cm, shading: { fill: CRIMSON, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: WHITE, size: 19 })] })] }); }
function dcell(content, w, opts = {}) {
  const children = Array.isArray(content) ? content : [cp(content)];
  return new TableCell({ borders, width: { size: w, type: WidthType.DXA }, margins: cm, verticalAlign: VerticalAlign.CENTER, shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined, children });
}

const footer = new Footer({ children: [new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: CW }],
  border: { top: { style: BorderStyle.SINGLE, size: 4, color: CRIMSON, space: 6 } },
  children: [
    ...B.wordmarkRuns(INK, CRIMSON).map(w => new TextRun({ text: w.text, bold: true, color: w.color, size: 18 })),
    new TextRun({ text: `    ${CLIENT} · Statement of Work ${S.footerVersion || ""} · Confidential`, color: B.MUTED, size: 14 }),
    new TextRun({ text: "\tPage ", size: 16, color: B.MUTED }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: B.MUTED }),
  ]
})]});

const styles = {
  default: { document: { run: { font: BODY, size: 22, color: INK } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 28, bold: true, font: BODY, color: CRIMSON }, paragraph: { spacing: { before: 260, after: 140 }, outlineLevel: 0 } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 23, bold: true, font: BODY, color: INK }, paragraph: { spacing: { before: 180, after: 90 }, outlineLevel: 1 } },
  ]
};
const numbering = { config: [
  { reference: "b", levels: [{ level: 0, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT, style: { run: { color: CRIMSON }, paragraph: { indent: { left: 460, hanging: 260 } } } }] },
]};

// ---- Cover (people/fields derived) ----
function kv(k, v) { return new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: k, bold: true }), new TextRun({ text: v })] }); }
const cover = [
  new Paragraph({ spacing: { before: 400, after: 0 }, children: B.wordmarkRuns(INK, CRIMSON).map(w => new TextRun({ text: w.text, bold: true, color: w.color, size: 30 })) }),
  new Paragraph({ spacing: { before: 240, after: 0 }, children: [new TextRun({ text: "Statement of Work", bold: true, size: 52, color: INK })] }),
  new Paragraph({ spacing: { before: 40, after: 300 }, children: [new TextRun({ text: "Architect — agentic AI under enforced authority", italics: true, font: SERIF, size: 24, color: DARK })] }),
  new Paragraph({ spacing: { before: 200 }, border: { top: { style: BorderStyle.SINGLE, size: 4, color: CRIMSON, space: 8 }, bottom: { style: BorderStyle.SINGLE, size: 4, color: CRIMSON, space: 8 } }, children: [new TextRun({ text: " ", size: 6 })] }),
  new Paragraph({ spacing: { before: 200, after: 80 }, children: [new TextRun({ text: " ", size: 2 })] }),
  kv("Client:  ", client.legalEntity || CLIENT),
  kv("Project:  ", S.projectName || ""),
  kv("Platform:  ", S.platform || ""),
  kv("Version:  ", S.version || ""),
  kv("Date:  ", S.date || ""),
  kv("Status:  ", S.status || ""),
  kv("Novagentica Lead:  ", nova.deliveryLead || ""),
  kv("Client Lead:  ", client.mainContact || ""),
  kv("Executive Sponsor (Client):  ", firstName(client.sponsor)),
  kv("Executive Sponsor (Novagentica):  ", nova.commercialLead || ""),
  new Paragraph({ spacing: { before: 320 }, children: [new TextRun({ text: "NO PASSPORT = NO EXECUTION", bold: true, color: CRIMSON, size: 18, characterSpacing: 30 })] }),
  new Paragraph({ children: [new PageBreak()] }),
];

const exec = [h1("1.  Executive summary"), body(runs(S.execSummary || []))];
const objectives = [h1("2.  Objectives"), ...(S.objectives || []).map(o => bullet([txt(o)]))];

// ---- Scope ----
function scopeRow(n, deliv, desc) { return new TableRow({ children: [ dcell([cp(n, { align: AlignmentType.CENTER })], 600), dcell([cp(deliv, { bold: true })], 2800), dcell([cp(desc)], 5626) ]}); }
const inScope = new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [600, 2800, 5626], rows: [
  new TableRow({ tableHeader: true, children: [hcell("#", 600), hcell("Deliverable", 2800), hcell("Description", 5626)] }),
  ...(S.scopeIn || []).map(r => scopeRow(r.n, r.deliverable, r.description)),
]});
const scope = [ h1("3.  Scope"), h2("3a.  In scope"), inScope, h2("3b.  Out of scope"), ...(S.scopeOut || []).map(o => bullet([txt(o)])) ];

// ---- Deliverables ----
function delRow(d, fmt, ac) { return new TableRow({ children: [ dcell([cp(d, { bold: true })], 3400), dcell([cp(fmt)], 2200), dcell([cp(ac)], 3426) ]}); }
const deliverables = [
  h1("4.  Deliverables"),
  new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [3400, 2200, 3426], rows: [
    new TableRow({ tableHeader: true, children: [hcell("Deliverable", 3400), hcell("Format", 2200), hcell("Acceptance criteria", 3426)] }),
    ...(S.deliverables || []).map(r => delRow(r.deliverable, r.format, r.acceptance)),
  ]}),
];

// ---- Timeline & milestones ----
function msRow(m, d, opts = {}) { return new TableRow({ children: [ dcell([cp(m, { bold: opts.bold })], 5626, { fill: opts.fill }), dcell([cp(d, { bold: opts.bold })], 3400, { fill: opts.fill }) ]}); }
const timeline = [
  h1("5.  Timeline & milestones"),
  body([txt(S.timelineIntro || "")]),
  new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [5626, 3400], rows: [
    new TableRow({ tableHeader: true, children: [hcell("Milestone", 5626), hcell("Target", 3400)] }),
    ...(S.milestones || []).map(r => msRow(r.m, r.d, { bold: r.bold, fill: FILLS[r.fill] })),
  ]}),
];

// ---- Assumptions & dependencies ----
function riskFlag(text) {
  return new Paragraph({ spacing: { before: 80, after: 100 }, border: { left: { style: BorderStyle.SINGLE, size: 18, color: CRIMSON, space: 10 } }, indent: { left: 180 },
    children: [new TextRun({ text: "⚠ Dependency risk:  ", bold: true, color: CRIMSON }), new TextRun({ text, font: SERIF })] });
}
const assumptions = [
  h1("6.  Assumptions & dependencies"),
  h2("Standard assumptions"),
  ...(S.assumptions || []).map(a => bullet([txt(a)])),
  h2("Specific risk flags"),
  ...(S.riskFlags || []).map(r => riskFlag(r)),
];

// ---- Governance + RACI ----
function govRow(role, resp, name) { return new TableRow({ children: [ dcell([cp(role, { bold: true })], 3000), dcell([cp(resp)], 4026), dcell([cp(name)], 2000) ]}); }
const governance = [
  h1("7.  Governance"),
  new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [3000, 4026, 2000], rows: [
    new TableRow({ tableHeader: true, children: [hcell("Role", 3000), hcell("Responsibility", 4026), hcell("Name", 2000)] }),
    ...(S.govRows || []).map(r => govRow(r.role, r.resp, r.name)),
  ]}),
  body([bold("Cadence.  "), txt(S.cadence || "")], { spacing: { before: 160 } }),
  h2("RACI matrix"),
  body([new TextRun({ text: "R = Responsible · A = Accountable · C = Consulted · I = Informed.", italics: true, font: SERIF, color: DARK })]),
];
const raciCols = S.raciCols || ["Nova", "Alex", "SME", "Sponsor"];
function raciRow(activity, vals, opts = {}) {
  const c = (v) => dcell([cp(v, { align: AlignmentType.CENTER, bold: v === "A" })], 1140, { fill: opts.fill });
  return new TableRow({ children: [ dcell([cp(activity)], 4466, { fill: opts.fill }), ...vals.map(c) ]});
}
const raci = new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [4466, 1140, 1140, 1140, 1140], rows: [
  new TableRow({ tableHeader: true, children: [hcell("Activity", 4466), ...raciCols.map(c => hcell(c, 1140))] }),
  ...(S.raci || []).map(r => raciRow(r.activity, r.v)),
]});
const raciNote = body([new TextRun({ text: S.raciNote || "", italics: true, font: SERIF, color: DARK })], { spacing: { before: 100 } });

const change = [ h1("8.  Change control"), body([txt(S.changeControl || "")]) ];

// ---- Commercials (days table derived; terms interpolated) ----
function daysRow(phase, days, fee, opts = {}) {
  return new TableRow({ children: [
    dcell([cp(phase, { bold: opts.bold })], 5226, { fill: opts.fill }),
    dcell([cp(days, { align: AlignmentType.CENTER, bold: opts.bold })], 1700, { fill: opts.fill }),
    dcell([cp(fee, { align: AlignmentType.RIGHT, bold: opts.bold })], 2100, { fill: opts.fill }),
  ]});
}
function comRow(item, detail, opts = {}) { return new TableRow({ children: [ dcell([cp(item, { bold: true })], 3400, { fill: opts.fill }), dcell([cp(detail, { bold: opts.bold })], 5626, { fill: opts.fill }) ]}); }
const dayLabels = S.commercialsDayLabels || [];
const ctl = S.commercialsTotalsLabels || {};
const daysRows = [
  new TableRow({ tableHeader: true, children: [hcell("Phase / MVP", 5226), hcell("Consultant-days", 1700), hcell(`At ${dayRateStr}/day`, 2100)] }),
];
liveMvps.forEach((m, i) => {
  const days = m.days || 0;
  daysRows.push(daysRow(dayLabels[i] || `${m.id} — ${m.title}`, String(days), money(typeof m.cost === "number" ? m.cost : days * dayRate)));
});
daysRows.push(daysRow(ctl.fullSlate || "Full slate", String(totals.fullSlate), money(amounts.fullSlate), { bold: true, fill: CRIMSON_LIGHT }));
if (totals.confirmedOnly !== totals.fullSlate)
  daysRows.push(daysRow(ctl.confirmedOnly || "Confirmed-only", String(totals.confirmedOnly), money(amounts.confirmedOnly), { fill: "F7F7F5" }));
if (backups.length > 0)
  daysRows.push(daysRow(ctl.backupPath || "Backup path", String(totals.backupPath), money(amounts.backupPath), { fill: "F7F7F5" }));

const lic = R.licence || {};
const subst = {
  "{dayRate}": dayRateStr, "{cur}": cur,
  "{fullDays}": String(totals.fullSlate), "{fullFee}": money(amounts.fullSlate),
  "{confDays}": String(totals.confirmedOnly), "{confFee}": money(amounts.confirmedOnly),
  "{tier}": lic.quotedTier || "", "{annualPrice}": money(lic.annualFee || 0), "{term}": (lic.term && lic.term.label) || "",
};
const fill = s => String(s || "").replace(/\{[a-zA-Z]+\}/g, k => (k in subst ? subst[k] : k));
const commercials = [
  h1("9.  Commercials"),
  body([new TextRun({ text: S.commercialsNote || "", italics: true, font: SERIF, color: DARK })]),
  new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [5226, 1700, 2100], rows: daysRows }),
  body([bold("Terms.")], { spacing: { before: 160, after: 60 } }),
  new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [3400, 5626], rows: [
    new TableRow({ tableHeader: true, children: [hcell("Item", 3400), hcell("Detail", 5626)] }),
    ...(S.termsRows || []).map(r => comRow(fill(r.item), fill(r.detail), { bold: r.bold })),
  ]}),
  body([new TextRun({ text: S.commercialsFootnote || "", italics: true, font: SERIF, color: DARK })], { spacing: { before: 120 } }),
];

// ---- Sign-off ----
function sigBlock(entity) {
  return [
    body([bold("On behalf of " + entity + ":")], { spacing: { before: 200, after: 200 } }),
    new Paragraph({ spacing: { after: 160 }, tabStops: [{ type: TabStopType.RIGHT, position: CW }], children: [txt("Signature: ____________________________"), txt("\tDate: ________________")] }),
    new Paragraph({ spacing: { after: 160 }, children: [txt("Name: ____________________________")] }),
    new Paragraph({ spacing: { after: 240 }, children: [txt("Title: ____________________________")] }),
  ];
}
const signoff = [h1("10.  Sign-off"), ...(S.signoffEntities || []).flatMap(sigBlock)];

// ---- Appendix A ----
const stem = (E.output && E.output.fileStem) || `Novagentica-${CLIENT}`;
const ganttFile = `${stem}-DeliveryTimeline-v${(E.output && E.output.version) || "1.0"}.docx`;
const appendix = [
  new Paragraph({ children: [new PageBreak()] }),
  h1("Appendix A — Delivery timeline"),
  body([txt(S.appendixIntro || ""), bold(ganttFile), txt(". Summary phases:")]),
  new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [3600, 5426], rows: [
    new TableRow({ tableHeader: true, children: [hcell("Phase", 3600), hcell("Window", 5426)] }),
    ...(S.appendixPhases || []).map(r => msRow(r.m, r.d)),
  ]}),
];

const doc = new Document({ background: { color: B.BG }, styles, numbering, sections: [{
  properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
  footers: { default: footer },
  children: [
    ...cover, ...exec, ...objectives, ...scope, ...deliverables, ...timeline,
    ...assumptions, ...governance, raci, raciNote, ...change, ...commercials, ...signoff, ...appendix
  ]
}]});

const ver = (S.version || "1.0").split(" ")[0];
const out = process.argv[3] || `${stem}-SoW-v${ver}.docx`;
Packer.toBuffer(doc).then(buffer => { fs.writeFileSync(out, buffer); console.log("sow written →", out); });

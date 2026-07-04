const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, TabStopType, BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber
} = require("docx");

// Brand tokens — kept in SYNC with the ONE source: lib/brand.js
// (canonical: Novagentica Design System — styles.css + tokens/). Do not
// diverge these values; if the design system changes, update lib/brand.js
// first, then mirror the brand-facing tokens here. This skill inlines them
// (rather than importing lib/brand.js) so it stays self-contained when the
// order-form skill is installed on its own, without the engagement-pack lib/.
const T = {
  CRIMSON: "CC0D2C", CREAM: "FAFBF6", CREAM2: "F2F2EC", INK: "0E0E0C",
  GREY: "8A8A86", HAIR: "D9D9D2", NOTECLR: "9A6B12", SANS: "Inter", SERIF: "Georgia",
  CONTENT_W: 9026, HALF: 4513,
};
const BOX = "\u2610";
const border = (color = T.HAIR, size = 2) => ({ style: BorderStyle.SINGLE, size, color });
const cellBorders = (color = T.HAIR) => ({ top: border(color), bottom: border(color), left: border(color), right: border(color) });
const cellMargins = { top: 90, bottom: 90, left: 130, right: 130 };

function gap(s = 120) { return new Paragraph({ spacing: { after: s }, children: [] }); }
function rule(color = T.CRIMSON, size = 14, after = 160, before = 0) {
  return new Paragraph({ spacing: { before, after }, border: { bottom: { style: BorderStyle.SINGLE, size, color, space: 1 } }, children: [] });
}
function rns(arr, base) {
  return (Array.isArray(arr) ? arr : [arr]).map(r => typeof r === "string"
    ? new TextRun(Object.assign({ text: r }, base)) : new TextRun(Object.assign({}, base, r)));
}
function head(text) {
  return new Paragraph({ spacing: { before: 300, after: 90 }, keepNext: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: T.CRIMSON, space: 4 } },
    children: [new TextRun({ text, bold: true, color: T.INK, font: T.SANS, size: 23, allCaps: true, characterSpacing: 12 })] });
}
function body(content, opts = {}) {
  return new Paragraph({ spacing: { after: opts.after ?? 120, line: 268 }, alignment: opts.align,
    children: rns(content, { font: T.SANS, size: 19, color: T.INK }) });
}
function note(text) {
  return new Paragraph({ spacing: { after: 130, line: 258 }, indent: { left: 120 },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: T.NOTECLR, space: 10 } },
    children: [new TextRun({ text: "\u2039 drafting note \u203A ", italics: true, bold: true, color: T.NOTECLR, font: T.SANS, size: 16 }),
      ...rns(text, { italics: true, color: T.NOTECLR, font: T.SANS, size: 16 })] });
}
function clause(num, content) {
  return new Paragraph({ spacing: { after: 100, line: 268 }, indent: { left: 560, hanging: 560 },
    tabStops: [{ type: TabStopType.LEFT, position: 560 }],
    children: [new TextRun({ text: num + "\t", font: T.SANS, size: 19, color: T.INK }), ...rns(content, { font: T.SANS, size: 19, color: T.INK })] });
}
function lead(label, rest) { return [{ text: label, bold: true }, { text: " " + rest }]; }
function cellPara(content, o = {}) {
  return new Paragraph({ spacing: { after: 0, line: 262 }, alignment: o.align,
    children: rns(content, { font: T.SANS, size: o.size ?? 18, color: o.color ?? T.INK, bold: o.bold, italics: o.italics }) });
}
function tc(content, { w, fill, bold, color, align, italics } = {}) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, borders: cellBorders(), margins: cellMargins,
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined, verticalAlign: VerticalAlign.CENTER,
    children: Array.isArray(content) && content[0] instanceof Paragraph ? content : [cellPara(content, { bold, color, align, italics })] });
}
function hRow(cells, widths) {
  return new TableRow({ tableHeader: true, children: cells.map((x, i) => tc(x, { w: widths[i], fill: T.CRIMSON, bold: true, color: "FFFFFF" })) });
}
function table(widths, rows) { return new Table({ width: { size: T.CONTENT_W, type: WidthType.DXA }, columnWidths: widths, rows }); }
function fieldRow(label, value, widths = [3000, 6026], fill = T.CREAM2) {
  return new TableRow({ children: [tc(label, { w: widths[0], fill, bold: true }), tc(value ?? "", { w: widths[1] })] });
}

function masthead(title, subtitle) {
  return [
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "novagentica", bold: true, font: T.SANS, size: 28, color: T.CRIMSON, characterSpacing: -10 })] }),
    rule(T.CRIMSON, 16, 170, 30),
    new Paragraph({ spacing: { after: 18 }, children: [new TextRun({ text: title, bold: true, font: T.SANS, size: 38, color: T.INK, characterSpacing: 12 })] }),
    new Paragraph({ spacing: { after: 130 }, children: [new TextRun({ text: subtitle, italics: true, font: T.SERIF, size: 21, color: T.CRIMSON })] }),
  ];
}
function draftPanel(lines) {
  return new Table({ width: { size: T.CONTENT_W, type: WidthType.DXA }, columnWidths: [T.CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: T.CONTENT_W, type: WidthType.DXA },
      borders: { top: border(T.NOTECLR, 6), bottom: border(T.NOTECLR, 6), left: border(T.NOTECLR, 6), right: border(T.NOTECLR, 6) },
      shading: { fill: T.CREAM, type: ShadingType.CLEAR }, margins: { top: 140, bottom: 140, left: 180, right: 180 },
      children: [
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "DRAFT TEMPLATE \u2014 COMPLETE & DELETE THIS PANEL BEFORE ISSUE", bold: true, color: T.NOTECLR, font: T.SANS, size: 17, characterSpacing: 6 })] }),
        ...lines.map((l, i) => new Paragraph({ spacing: { after: i === lines.length - 1 ? 0 : 60, line: 258 }, children: [new TextRun({ text: l, color: T.NOTECLR, font: T.SANS, size: 17, line: 258 })] })),
      ] })] })] });
}
function addressBlock() {
  return table([T.HALF, T.HALF], [new TableRow({ children: [
    new TableCell({ width: { size: T.HALF, type: WidthType.DXA }, borders: cellBorders(), margins: cellMargins, verticalAlign: VerticalAlign.TOP, children: [
      cellPara([{ text: "Supplier", bold: true, color: T.CRIMSON, size: 16 }]),
      cellPara([{ text: "Novagentica AG", bold: true }]),
      cellPara("Chl\u00E4usj\u00E4gergasse 8"), cellPara("CH-6403 K\u00FCssnacht am Rigi, Switzerland"),
      cellPara([{ text: "Reg. no. CH-020.3.051.524-2", size: 16, color: T.GREY }]) ] }),
    new TableCell({ width: { size: T.HALF, type: WidthType.DXA }, borders: cellBorders(), margins: cellMargins, verticalAlign: VerticalAlign.TOP, children: [
      cellPara([{ text: "Customer", bold: true, color: T.CRIMSON, size: 16 }]),
      cellPara([{ text: "[Customer legal entity]", bold: true }]),
      cellPara("[Street, no.]"), cellPara("[Postcode, place, country]"),
      cellPara([{ text: "[Reg. no.]", size: 16, color: T.GREY }]) ] }),
  ] })]);
}
function sigBlock(rightLabel) {
  const mkLine = () => new Paragraph({ spacing: { before: 360, after: 20 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: T.INK, space: 2 } }, children: [] });
  const lbl = (t) => new Paragraph({ spacing: { after: 140 }, children: [new TextRun({ text: t, font: T.SANS, size: 16, color: T.GREY })] });
  const col = (title) => [new Paragraph({ children: [new TextRun({ text: title, bold: true, font: T.SANS, size: 19, color: T.CRIMSON })] }),
    mkLine(), lbl("Signature / Date"), mkLine(), lbl("Name / Title")];
  return table([T.HALF, T.HALF], [new TableRow({ children: [
    new TableCell({ width: { size: T.HALF, type: WidthType.DXA }, borders: cellBorders(), margins: { top: 120, bottom: 200, left: 160, right: 160 }, children: col("For Novagentica AG") }),
    new TableCell({ width: { size: T.HALF, type: WidthType.DXA }, borders: cellBorders(), margins: { top: 120, bottom: 200, left: 160, right: 160 }, children: col(rightLabel) }),
  ] })]);
}
function buildDoc(children, { docTitle, headerLabel }) {
  return new Document({
    creator: "Novagentica AG", title: docTitle,
    styles: { default: { document: { run: { font: T.SANS, size: 19, color: T.INK } } } },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 } } },
      headers: { default: new Header({ children: [new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: T.CONTENT_W }], spacing: { after: 0 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: T.CRIMSON, space: 4 } },
        children: [new TextRun({ text: "novagentica", bold: true, font: T.SANS, size: 16, color: T.CRIMSON, characterSpacing: -6 }),
          new TextRun({ text: "\t" + headerLabel + " \u00B7 Confidential", font: T.SANS, size: 14, color: T.GREY })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: T.CONTENT_W }],
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: T.HAIR, space: 4 } },
        children: [new TextRun({ text: "Novagentica AG \u00B7 K\u00FCssnacht am Rigi, Switzerland \u00B7 Subject to the MSA; Swiss law, Zurich courts", font: T.SANS, size: 13, color: T.GREY }),
          new TextRun({ text: "\tPage ", font: T.SANS, size: 13, color: T.GREY }), new TextRun({ children: [PageNumber.CURRENT], font: T.SANS, size: 13, color: T.GREY }),
          new TextRun({ text: " of ", font: T.SANS, size: 13, color: T.GREY }), new TextRun({ children: [PageNumber.TOTAL_PAGES], font: T.SANS, size: 13, color: T.GREY })] })] }) },
      children,
    }],
  });
}
function write(doc, path) { return Packer.toBuffer(doc).then(buf => { require("fs").writeFileSync(path, buf); console.log("written", path, buf.length); }); }

module.exports = { T, BOX, AlignmentType, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, VerticalAlign,
  border, cellBorders, cellMargins, gap, rule, rns, head, body, note, clause, lead, cellPara, tc, hRow, table, fieldRow,
  masthead, draftPanel, addressBlock, sigBlock, buildDoc, write };

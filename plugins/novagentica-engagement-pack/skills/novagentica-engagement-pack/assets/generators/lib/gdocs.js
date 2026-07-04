// lib/gdocs.js — build Google Docs API `documents.batchUpdate` requests[] in brand.
//
// Native-Google counterpart to the `docx` renderers. A generator builds a Doc with the same
// primitives it used with docx (heading, para with styled runs, bullet, table, pageBreak); the
// Doc emits a payload that n8n executes:
//   1. documents.create   { title }                    -> documentId
//   2. documents.batchUpdate { documentId, requests }  -> the branded document
// genservice returns { title, requests } as JSON; it holds no Google credentials.
//
// INDEX MODEL (read this before touching tables):
//   Google Docs is a linear character stream. The body's first insertable index is 1. We build
//   FORWARD: insert each block's text at a running `cursor`, then style the absolute range
//   [cursor, cursor+len); later blocks insert after, so earlier ranges never shift. Batch
//   requests execute in array order, so style requests emitted after all inserts see final indices.
//
//   Tables are the one structure whose internal index arithmetic can only be *confirmed* against
//   the live Docs API. The structural constants are collected in TABLE below. If a live smoke test
//   shows cell text landing one row/cell off, adjust TABLE.START_PAD / ROW_PAD / CELL_STRIDE by ±1
//   — that is the single calibration knob. Cells are inserted in reverse (high index first) using
//   the empty-table baseline, and styled afterwards using final indices, so the model is internally
//   consistent regardless of content length.
const B = require("./brand");

// Table structure index constants (calibration knob — see header).
const TABLE = { START_PAD: 2, ROW_PAD: 1, CELL_STRIDE: 2 };

function hexToRgb(hex) {
  const h = String(hex).replace("#", "");
  return { red: parseInt(h.slice(0, 2), 16) / 255, green: parseInt(h.slice(2, 4), 16) / 255, blue: parseInt(h.slice(4, 6), 16) / 255 };
}
const rgb = (hex) => ({ color: { rgbColor: hexToRgb(hex) } });
const PT = (n) => ({ magnitude: n, unit: "PT" });

class Doc {
  constructor(title) {
    this.title = title;
    this.requests = [];
    this.cursor = 1;
  }

  // Insert a run-styled line of text ending in "\n"; returns [start, endWithNewline).
  _insertLine(runs, paraStyle, paraFields) {
    const list = typeof runs === "string" ? [{ text: runs }] : runs;
    const text = list.map((r) => r.text).join("") + "\n";
    const start = this.cursor;
    this.requests.push({ insertText: { location: { index: start }, text } });
    // per-run text styling
    let c = start;
    for (const r of list) {
      const s = c, e = c + r.text.length;
      c = e;
      if (e <= s) continue;
      const style = {}, fields = [];
      style.foregroundColor = rgb(r.color || B.INK); fields.push("foregroundColor");
      style.weightedFontFamily = { fontFamily: r.font || B.SANS }; fields.push("weightedFontFamily");
      style.fontSize = PT(r.size || 11); fields.push("fontSize");
      style.bold = !!r.bold; fields.push("bold");
      style.italic = !!r.italic; fields.push("italic");
      this.requests.push({ updateTextStyle: { range: { startIndex: s, endIndex: e }, textStyle: style, fields: fields.join(",") } });
    }
    // paragraph styling over the whole line (incl. newline)
    if (paraStyle && paraFields) {
      this.requests.push({ updateParagraphStyle: { range: { startIndex: start, endIndex: c + 1 }, paragraphStyle: paraStyle, fields: paraFields } });
    }
    this.cursor = start + text.length;
    return [start, start + text.length];
  }

  heading(text, o = {}) {
    const size = o.size || (o.level === 2 ? 13 : 16);
    const runs = [{ text, bold: o.bold !== false, color: o.color || B.ACCENT, font: o.font || B.SANS, size }];
    const ps = {}, pf = [];
    if (o.align) { ps.alignment = { left: "START", center: "CENTER", right: "END" }[o.align] || "START"; pf.push("alignment"); }
    ps.spaceAbove = PT(o.spaceBefore != null ? o.spaceBefore : 10); pf.push("spaceAbove");
    ps.spaceBelow = PT(o.spaceAfter != null ? o.spaceAfter : 4); pf.push("spaceBelow");
    if (o.namedStyle) { ps.namedStyleType = o.namedStyle; pf.push("namedStyleType"); }
    return this._insertLine(runs, ps, pf.join(","));
  }

  para(runs, o = {}) {
    const list = typeof runs === "string" ? [{ text: runs, color: o.color, font: o.font, size: o.size, bold: o.bold, italic: o.italic }] : runs;
    const ps = {}, pf = [];
    ps.alignment = { left: "START", center: "CENTER", right: "END", justify: "JUSTIFIED" }[o.align || "left"] || "START"; pf.push("alignment");
    ps.spaceBelow = PT(o.spaceAfter != null ? o.spaceAfter : 8); pf.push("spaceBelow");
    if (o.bullet) { ps.indentStart = PT(18); pf.push("indentStart"); }
    if (o.indent) { ps.indentStart = PT(o.indent); if (!pf.includes("indentStart")) pf.push("indentStart"); }
    const [s, e] = this._insertLine(list.map((r) => ({ text: r.text, bold: r.bold, italic: r.italic, color: r.color || o.color, font: r.font || o.font, size: r.size || o.size || 11 })), ps, pf.join(","));
    // a real bullet glyph — createParagraphBullets keeps it a list item
    if (o.bullet) this.requests.push({ createParagraphBullets: { range: { startIndex: s, endIndex: e }, bulletPreset: "BULLET_DISC_CIRCLE_SQUARE" } });
    return [s, e];
  }

  pageBreak() {
    this.requests.push({ insertPageBreak: { location: { index: this.cursor } } });
    this.cursor += 1;
  }

  // rows: [[cell,…],…]; cell = { runs|text, fill, align, bold, color, size, font }
  // o: { colW?: inches[], border?: {color,pt}, cellPad? }
  table(rows, o = {}) {
    const R = rows.length, C = Math.max(...rows.map((r) => r.length));
    this.requests.push({ insertTable: { rows: R, columns: C, location: { index: this.cursor } } });
    // Docs inserts a newline before the table, so the table element starts one index past the cursor.
    const tableStart = this.cursor + 1;

    // Baseline (empty-table) index of each cell's first paragraph.
    const baseOf = (r, c) => tableStart + TABLE.START_PAD + r * (TABLE.ROW_PAD + C * TABLE.CELL_STRIDE) + TABLE.ROW_PAD + c * TABLE.CELL_STRIDE;
    const cells = [];
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const cell = rows[r][c] || { text: "" };
      const list = cell.runs || (cell.text != null ? [{ text: String(cell.text) }] : [{ text: "" }]);
      cells.push({ r, c, base: baseOf(r, c), list, cell, text: list.map((x) => x.text).join("") });
    }
    // Final index of each cell = baseline + total text length of cells with a lower baseline.
    const sorted = [...cells].sort((a, b) => a.base - b.base);
    let acc = 0;
    for (const cell of sorted) { cell.final = cell.base + acc; acc += cell.text.length; }

    // 1) insert cell text in REVERSE baseline order, at baseline indices (correct at exec time).
    for (const cell of [...sorted].reverse()) {
      if (cell.text.length) this.requests.push({ insertText: { location: { index: cell.base }, text: cell.text } });
    }
    // 2) style runs + paragraph alignment using FINAL indices (batch order: after all inserts).
    for (const cell of sorted) {
      let ci = cell.final;
      for (const r of cell.list) {
        const s = ci, e = ci + r.text.length; ci = e;
        if (e <= s) continue;
        const style = {
          foregroundColor: rgb(r.color || cell.cell.color || B.INK),
          weightedFontFamily: { fontFamily: r.font || cell.cell.font || B.SANS },
          fontSize: PT(r.size || cell.cell.size || 10.5),
          bold: r.bold != null ? !!r.bold : !!cell.cell.bold,
        };
        this.requests.push({ updateTextStyle: { range: { startIndex: s, endIndex: e }, textStyle: style, fields: "foregroundColor,weightedFontFamily,fontSize,bold" } });
      }
      if (cell.cell.align) {
        this.requests.push({ updateParagraphStyle: { range: { startIndex: cell.final, endIndex: cell.final + Math.max(cell.text.length, 1) }, paragraphStyle: { alignment: { left: "START", center: "CENTER", right: "END" }[cell.cell.align] || "START" }, fields: "alignment" } });
      }
    }
    // 3) cell background fills (table start index is fixed — before all cell content).
    for (const cell of cells) {
      if (!cell.cell.fill) continue;
      this.requests.push({
        // tableRange and top-level tableStartLocation are a oneof — set only tableRange.
        updateTableCellStyle: {
          tableRange: { tableCellLocation: { tableStartLocation: { index: tableStart }, rowIndex: cell.r, columnIndex: cell.c }, rowSpan: 1, columnSpan: 1 },
          tableCellStyle: { backgroundColor: rgb(cell.cell.fill) },
          fields: "backgroundColor",
        },
      });
    }
    // advance cursor past the filled table (tableStart already covers the pre-table newline).
    const emptySpan = TABLE.START_PAD + R * (TABLE.ROW_PAD + C * TABLE.CELL_STRIDE);
    this.cursor = tableStart + emptySpan + acc;
    return tableStart;
  }

  payload() {
    return { title: this.title, requests: this.requests };
  }
}

module.exports = { Doc, TABLE, hexToRgb, brand: B };

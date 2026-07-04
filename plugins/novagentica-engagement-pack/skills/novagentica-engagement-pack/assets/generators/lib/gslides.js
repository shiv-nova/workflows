// lib/gslides.js — build Google Slides API `presentations.batchUpdate` requests[] in brand.
//
// This is the native-Google counterpart to the pptxgenjs renderers. A generator builds a Deck
// with the same primitives it used with pptxgenjs (slide / textBox / rect / line), and the Deck
// emits a payload that n8n executes:
//
//   1. presentations.create { title }                       -> presentationId
//   2. presentations.batchUpdate { requests: deck.requests } -> the branded slides
//
// genservice returns { title, slideCount, requests } as JSON; it never calls Google itself
// (stays stateless / auth-free). n8n owns the Google credentials and the two API calls.
//
// Units: Slides uses EMU. Positions/sizes here are given in INCHES (as the pptx renderers use)
// and converted. Brand tokens come from ./brand — never hard-code a colour here.
const B = require("./brand");

const EMU = 914400; // per inch
const SLIDE_W_IN = 13.333;
const SLIDE_H_IN = 7.5;

function hexToRgb(hex) {
  const h = String(hex).replace("#", "");
  return {
    red: parseInt(h.slice(0, 2), 16) / 255,
    green: parseInt(h.slice(2, 4), 16) / 255,
    blue: parseInt(h.slice(4, 6), 16) / 255,
  };
}
const color = (hex) => ({ opaqueColor: { rgbColor: hexToRgb(hex) } });
const inEmu = (v) => Math.round(v * EMU);

class Deck {
  constructor(title) {
    this.title = title;
    this.requests = [];
    this._n = 0;
    this.slideW = SLIDE_W_IN;
    this.slideH = SLIDE_H_IN;
  }
  _id(prefix) {
    this._n += 1;
    return `${prefix}_${this._n}`;
  }

  // Blank slide with a solid background. Returns the slide objectId.
  slide(bg = B.BG) {
    const id = this._id("slide");
    this.requests.push({
      createSlide: { objectId: id, slideLayoutReference: { predefinedLayout: "BLANK" } },
    });
    this.requests.push({
      updatePageProperties: {
        objectId: id,
        fields: "pageBackgroundFill.solidFill.color",
        pageProperties: { pageBackgroundFill: { solidFill: { color: color(bg) } } },
      },
    });
    return id;
  }

  // A positioned text box. `runs` is a string or [{text, options}] where options may set
  // {bold, italic, color, fontSize, fontFace}. `o` sets box-level defaults + alignment.
  textBox(slideId, runs, o = {}) {
    const id = this._id("txt");
    const list = typeof runs === "string" ? [{ text: runs, options: {} }] : runs;
    const full = list.map((r) => r.text).join("");

    this.requests.push({
      createShape: {
        objectId: id,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: { width: { magnitude: inEmu(o.w), unit: "EMU" }, height: { magnitude: inEmu(o.h), unit: "EMU" } },
          transform: { scaleX: 1, scaleY: 1, translateX: inEmu(o.x), translateY: inEmu(o.y), unit: "EMU" },
        },
      },
    });
    if (full.length) this.requests.push({ insertText: { objectId: id, text: full, insertionIndex: 0 } });

    // Base style over the whole range, then per-run overrides.
    const baseStyle = {
      foregroundColor: { opaqueColor: { rgbColor: hexToRgb(o.color || B.INK) } },
      fontFamily: o.font || B.SANS,
      bold: !!o.bold,
      italic: !!o.italic,
      fontSize: { magnitude: o.size || 14, unit: "PT" },
    };
    if (full.length) {
      this.requests.push({
        updateTextStyle: {
          objectId: id,
          textRange: { type: "ALL" },
          style: baseStyle,
          fields: "foregroundColor,fontFamily,bold,italic,fontSize",
        },
      });
    }
    let cursor = 0;
    for (const r of list) {
      const start = cursor;
      const end = cursor + r.text.length;
      cursor = end;
      const op = r.options || {};
      if (!op.bold && !op.italic && !op.color && !op.fontSize && !op.fontFace) continue;
      const style = {};
      const fields = [];
      if (op.color) { style.foregroundColor = { opaqueColor: { rgbColor: hexToRgb(op.color) } }; fields.push("foregroundColor"); }
      if (op.fontFace) { style.fontFamily = op.fontFace; fields.push("fontFamily"); }
      if (op.bold != null) { style.bold = !!op.bold; fields.push("bold"); }
      if (op.italic != null) { style.italic = !!op.italic; fields.push("italic"); }
      if (op.fontSize) { style.fontSize = { magnitude: op.fontSize, unit: "PT" }; fields.push("fontSize"); }
      if (end > start) {
        this.requests.push({
          updateTextStyle: { objectId: id, textRange: { type: "FIXED_RANGE", startIndex: start, endIndex: end }, style, fields: fields.join(",") },
        });
      }
    }
    // Paragraph alignment + vertical content alignment.
    if (o.align && full.length) {
      this.requests.push({
        updateParagraphStyle: {
          objectId: id,
          textRange: { type: "ALL" },
          style: { alignment: { left: "START", center: "CENTER", right: "END" }[o.align] || "START" },
          fields: "alignment",
        },
      });
    }
    if (o.valign) {
      this.requests.push({
        updateShapeProperties: {
          objectId: id,
          fields: "contentAlignment",
          shapeProperties: { contentAlignment: { top: "TOP", middle: "MIDDLE", bottom: "BOTTOM" }[o.valign] || "TOP" },
        },
      });
    }
    return id;
  }

  // Affine transform for a box (w,h in inches) at top-left (x,y), optionally rotated
  // `rotate` degrees about its own centre (pptxgenjs semantics).
  _transform(o) {
    if (!o.rotate) {
      return { scaleX: 1, scaleY: 1, translateX: inEmu(o.x), translateY: inEmu(o.y), unit: "EMU" };
    }
    const th = (o.rotate * Math.PI) / 180, c = Math.cos(th), s = Math.sin(th);
    const w = o.w * EMU, h = o.h * EMU, cx = o.x * EMU + w / 2, cy = o.y * EMU + h / 2;
    return {
      scaleX: c, scaleY: c, shearX: -s, shearY: s,
      translateX: Math.round(cx - (c * w) / 2 + (s * h) / 2),
      translateY: Math.round(cy - (s * w) / 2 - (c * h) / 2),
      unit: "EMU",
    };
  }

  // Filled rectangle (optionally outlined / rotated / rounded).
  rect(slideId, o, shapeType = "RECTANGLE") {
    const id = this._id("rect");
    this.requests.push({
      createShape: {
        objectId: id,
        shapeType,
        elementProperties: {
          pageObjectId: slideId,
          size: { width: { magnitude: inEmu(o.w), unit: "EMU" }, height: { magnitude: inEmu(o.h), unit: "EMU" } },
          transform: this._transform(o),
        },
      },
    });
    const fields = ["shapeBackgroundFill.solidFill.color"];
    const shapeProperties = { shapeBackgroundFill: { solidFill: { color: color(o.fill || B.BG) } } };
    if (o.line) {
      shapeProperties.outline = { weight: { magnitude: (o.line.width || 0.75) * 12700, unit: "EMU" }, outlineFill: { solidFill: { color: color(o.line.color || B.RULE) } } };
      fields.push("outline.weight", "outline.outlineFill.solidFill.color");
    } else {
      shapeProperties.outline = { propertyState: "NOT_RENDERED" };
      fields.push("outline.propertyState");
    }
    this.requests.push({ updateShapeProperties: { objectId: id, fields: fields.join(","), shapeProperties } });
    return id;
  }

  // Horizontal hairline rule of width `w` inches at (x,y).
  line(slideId, o) {
    const id = this._id("line");
    this.requests.push({
      createLine: {
        objectId: id,
        lineCategory: "STRAIGHT",
        elementProperties: {
          pageObjectId: slideId,
          size: { width: { magnitude: inEmu(o.w), unit: "EMU" }, height: { magnitude: 0, unit: "EMU" } },
          transform: { scaleX: 1, scaleY: 1, translateX: inEmu(o.x), translateY: inEmu(o.y), unit: "EMU" },
        },
      },
    });
    this.requests.push({
      updateLineProperties: {
        objectId: id,
        fields: "lineFill.solidFill.color,weight",
        lineProperties: { lineFill: { solidFill: { color: color(o.color || B.RULE) } }, weight: { magnitude: (o.weight || 0.75) * 12700, unit: "EMU" } },
      },
    });
    return id;
  }

  // Rounded rectangle. `o.line` may be {type:"none"} for no outline.
  roundRect(slideId, o) {
    const line = o.line && o.line.type === "none" ? null : o.line;
    return this.rect(slideId, { ...o, line }, "ROUND_RECTANGLE");
  }

  // A table. `rows` is [[cell,…],…] where cell is {text, options}; options may set
  // {fontFace, fontSize, align, bold, color, fill, valign}. `o`: {x, y, w, colW[], rowH, border}.
  table(slideId, rows, o) {
    const id = this._id("tbl");
    const nRows = rows.length, nCols = Math.max(...rows.map((r) => r.length));
    this.requests.push({
      createTable: {
        objectId: id,
        rows: nRows,
        columns: nCols,
        elementProperties: {
          pageObjectId: slideId,
          size: { width: { magnitude: inEmu(o.w), unit: "EMU" }, height: { magnitude: inEmu((o.rowH || 0.4) * nRows), unit: "EMU" } },
          transform: { scaleX: 1, scaleY: 1, translateX: inEmu(o.x), translateY: inEmu(o.y), unit: "EMU" },
        },
      },
    });
    // Column widths.
    if (Array.isArray(o.colW)) {
      o.colW.forEach((w, ci) => {
        this.requests.push({
          updateTableColumnProperties: {
            objectId: id, columnIndices: [ci], fields: "columnWidth",
            tableColumnProperties: { columnWidth: { magnitude: inEmu(w), unit: "EMU" } },
          },
        });
      });
    }
    // Uniform hairline border.
    const bcol = (o.border && o.border.color) || B.RULE;
    const bpt = (o.border && o.border.pt) || 0.5;
    this.requests.push({
      updateTableBorderProperties: {
        objectId: id,
        borderPosition: "ALL",
        fields: "weight,tableBorderFill.solidFill.color",
        tableBorderProperties: { weight: { magnitude: bpt * 12700, unit: "EMU" }, tableBorderFill: { solidFill: { color: color(bcol) } } },
      },
    });
    // Cells: fill, text, style, alignment.
    rows.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        const op = (cell && cell.options) || {};
        const loc = { rowIndex: ri, columnIndex: ci };
        if (op.fill) {
          this.requests.push({
            updateTableCellProperties: {
              objectId: id, tableRange: { location: loc, rowSpan: 1, columnSpan: 1 },
              fields: "tableCellBackgroundFill.solidFill.color",
              tableCellProperties: { tableCellBackgroundFill: { solidFill: { color: color(op.fill) } } },
            },
          });
        }
        const text = (cell && cell.text) || "";
        if (!text) return;
        this.requests.push({ insertText: { objectId: id, cellLocation: loc, text, insertionIndex: 0 } });
        this.requests.push({
          updateTextStyle: {
            objectId: id, cellLocation: loc, textRange: { type: "ALL" },
            style: {
              foregroundColor: { opaqueColor: { rgbColor: hexToRgb(op.color || B.INK) } },
              fontFamily: op.fontFace || B.SANS,
              bold: !!op.bold,
              fontSize: { magnitude: op.fontSize || 11.5, unit: "PT" },
            },
            fields: "foregroundColor,fontFamily,bold,fontSize",
          },
        });
        if (op.align) {
          this.requests.push({
            updateParagraphStyle: {
              objectId: id, cellLocation: loc, textRange: { type: "ALL" },
              style: { alignment: { left: "START", center: "CENTER", right: "END" }[op.align] || "START" },
              fields: "alignment",
            },
          });
        }
      });
    });
    return id;
  }

  // The two-call payload genservice returns and n8n executes.
  payload() {
    return { title: this.title, slideCount: this.requests.filter((r) => r.createSlide).length, requests: this.requests };
  }
}

module.exports = { Deck, EMU, SLIDE_W_IN, SLIDE_H_IN, hexToRgb, brand: B };

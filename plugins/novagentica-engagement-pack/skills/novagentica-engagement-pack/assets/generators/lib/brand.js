// Novagentica brand tokens — the ONE source. Every generator imports from here;
// no generator redefines colours or fonts. Canonical source: Design System
// (styles.css + tokens/). Keep in sync; do not invent a new look.
module.exports = {
  // Colours (hex, no #) — used by both pptxgenjs and docx
  BG: "FAFBF6",            // cream — the only page background
  INK: "0E0E0C",           // primary text; ink section panels
  DARK: "5C5C58",          // = INK_SOFT — secondary / body-on-cream prose
  ACCENT: "CC0D2C",        // crimson — headings, accents, table header rows
  ACCENT_INK: "A60B24",    // darker crimson — hover/pressed on crimson
  MUTED: "8A8A86",         // captions / eyebrows / footer meta
  RULE: "D9D9D2",          // hairline rules, borders, dividers
  LINE_SOFT: "E7E6DF",     // fainter hairline — inset dividers
  PAPER_2: "F2F2EC",       // slightly deeper cream — inset surfaces
  WHITE: "FFFFFF",
  CRIMSON_LIGHT: "F5C6CE", // gantt bars, subtle data fills
  DOM_TINT: "FBE3E7",      // = TINT — highlighted-tier / selected column fill
  LABEL_TINT: "FBE3E7",    // key/label column fill (docx) — maps to TINT
  RISK_WASH: "FBE9EC",     // faint risk / alert surface wash
  PASS: "2E6B4F",          // status pass / in-policy / live
  PASS_WASH: "E9F1EC",
  WARN: "9A6B12",          // status borderline / caution
  WARN_WASH: "F6EFE0",
  GREY: "D9D9D2",          // docx table borders — same hairline as RULE

  // Type
  SANS: "Inter",           // structure / labels
  SERIF: "Gelasio",        // prose / emphasis

  // Wordmark: "nova" in INK + "gentica" in ACCENT, lowercase, bold.
  wordmarkRuns(InkColor, AccentColor) {
    return [
      { text: "nova", color: InkColor || "0E0E0C" },
      { text: "gentica", color: AccentColor || "CC0D2C" },
    ];
  },
};

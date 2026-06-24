// Novagentica brand tokens — the ONE source. Every generator imports from here;
// no generator redefines colours or fonts. Canonical source: Design System
// (styles.css + tokens/). Keep in sync; do not invent a new look.
module.exports = {
  // Colours (hex, no #) — used by both pptxgenjs and docx
  BG: "FAFBF6",            // cream page / slide background
  INK: "0E0E0C",           // primary text
  DARK: "2B2B2B",          // secondary text
  ACCENT: "CC0D2C",        // crimson — headings, accents, table header rows
  MUTED: "8A8A86",         // captions / eyebrows
  RULE: "D9D9D2",          // hairline rules
  WHITE: "FFFFFF",
  CRIMSON_LIGHT: "F5C6CE", // gantt bars
  DOM_TINT: "FBE3E7",      // highlighted-tier column fill
  LABEL_TINT: "F7E7EA",    // key/label column fill (docx)
  GREY: "CCCCCC",          // docx table borders

  // Type
  SANS: "Inter",           // structure / labels
  SERIF: "Georgia",        // prose / emphasis

  // Wordmark: "nova" in INK + "gentica" in ACCENT, lowercase, bold.
  wordmarkRuns(InkColor, AccentColor) {
    return [
      { text: "nova", color: InkColor || "0E0E0C" },
      { text: "gentica", color: AccentColor || "CC0D2C" },
    ];
  },
};

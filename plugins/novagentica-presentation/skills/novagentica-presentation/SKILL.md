---
name: novagentica-presentation
description: Use this skill any time Martin (founder of Novagentica) asks for a presentation, deck, slides, keynote, or .pptx — for client meetings, investor pitches, conference keynotes, internal updates, or anything Novagentica-branded. ALWAYS use this skill when the user mentions "deck", "slides", "presentation", "keynote", "pitch", or refers to the Novagentica style/template, even if they don't say "Novagentica" explicitly. The skill produces .pptx files in the canonical Novagentica visual identity (cream background, deep crimson accent, serif/sans typographic mix, novagentica wordmark on every slide) modeled on the canonical Novagentica keynote template.
license: Proprietary — Novagentica AG, 2026
---

# Novagentica Presentation Skill

Build presentations in the canonical Novagentica visual identity. The reference is the canonical Novagentica keynote template — restrained, editorial, executive. Every slide uses the cream/white background with the **novagentica wordmark in the bottom-left footer**. This skill covers everything from a single-slide insight card to a full keynote deck.

## When to use this skill

Trigger immediately when the conversation involves:
- Any request for slides, decks, keynote, pitch, presentation, or .pptx
- Conference talks, board updates, investor materials, client workshops
- Anything that should look "Novagentica-branded"

When NOT to use: editing an existing third-party deck the user uploaded (use the generic `pptx` skill instead).

## Quick reference — design tokens

These are non-negotiable. Use them exactly.

| Token | Value | Use |
|---|---|---|
| `BG_LIGHT` | `#FAFBF6` | Slide background (warm off-white). The ONLY background — every slide. |
| `INK` | `#0E0E0C` | Primary text |
| `ACCENT` | `#CC0D2C` | Novagentica crimson — accents, italics, marks, the crimson half of the wordmark |
| `MUTED` | `#8A8A86` | Eyebrow labels, page numbers, footer meta |
| `RULE` | `#D9D9D2` | Hairline horizontal rules |

| Element | Font | Weight | Size |
|---|---|---|---|
| Headline (the big sentence) | Inter (sans, fallback Arial Black) | 800 | 44–72pt |
| Headline italic accent | Inter Italic / Georgia Italic | 800/Bold Italic | matches headline |
| Subhead (often crimson italic) | Georgia Italic / Inter Italic | Bold Italic | 22–32pt |
| Eyebrow label (e.g. "OUTLINE", "NEW REALITY") | Inter | Bold, ALL CAPS, 1.5px tracking | 11–12pt |
| Body / row text | Georgia (serif) | Regular | 14–20pt |
| Row label (e.g. "TARIFF", "DEMAND") | Inter | Bold, ALL CAPS | 11–13pt |
| Italic emphasis lines | Georgia Italic | Bold Italic | matches body |
| Footer wordmark "novagentica" | Inter | Bold (Black) | 14pt — "nova" in INK, "gentica" in ACCENT |
| Footer page number | Inter | Regular | 9–10pt |
| Section roman numeral (header) | Georgia Italic | Bold Italic | 14pt, crimson |

> **The "feel"**: editorial print magazine meets Swiss design. Lots of whitespace. Hairline rules. Two type families doing two jobs (Inter for structure/labels, Georgia for prose/emphasis). Crimson appears sparingly and deliberately — never as a fill block other than the small logo mark, the wordmark's crimson half, and the vertical divider in two-column layouts.

---

## Slide anatomy

Every slide follows this skeleton (slide is 13.333" × 7.5" widescreen):

```
┌────────────────────────────────────────────────────────────┐
│  [logo mark or roman]              [PRESENTER · TITLE]    │ ← header band, ~0.55" tall
│  ────                              AGENTIC ENTERPRISE ·   │   crimson short underline
│                                    [EVENT NAME]            │
│  ────────────────────────────────────────────────────────  │ ← top hairline rule
│                                                            │
│  EYEBROW LABEL                                             │ ← 12pt bold caps muted
│                                                            │
│  Big headline sentence.                                    │ ← 44–72pt Inter Black
│  Italic crimson subhead.                                   │ ← 22–28pt Georgia Italic
│                                                            │
│  ────────────────────────────────────────────────────────  │ ← mid hairline rule
│                                                            │
│   [content rows, columns, or quote]                        │
│                                                            │
│  ────────────────────────────────────────────────────────  │ ← bottom hairline rule
│  Closing italic tagline. **Bold ending.**                  │
│  novagentica                              NN / NN          │ ← wordmark left, page number right
└────────────────────────────────────────────────────────────┘
```

**Constants across every slide:**
- Background is always `BG_LIGHT` (cream). There is no dark variant.
- 0.6" margins all around
- Header band at the top with logo mark (or section roman like "I.", "II.") on the far left, crimson short underline beneath it (~50px wide × 2px), and footer-meta text on the far right
- Three hairline rules separate the four bands: header / hero / body / closer
- **Wordmark "novagentica" in the bottom-left** below the bottom hairline rule (rendered as text, "nova" in INK + "gentica" in ACCENT, 14pt Inter Black)
- Page number bottom-right in muted small caps (e.g. "01 / 08")

The wordmark on every slide is non-negotiable and is drawn automatically by the `drawFooterRule()` helper. Do not omit it.

---

## The 7 canonical slide layouts

Use these as your menu. Pick the one that fits the content; don't invent new layouts unless the user asks.

| # | Name | When to use | Reference |
|---|------|-------------|-----------|
| 1 | **Outline / TOC** | Opening slide listing the deck's chapters with roman numerals | Reference deck slide 1 |
| 2 | **Themed rows** | A few labeled rows (TARIFF / DEMAND / REGULATORY style), each with a fact and a bold action italic | Reference deck slide 2 |
| 3 | **Two-column contrast** | Old vs new, before vs after, problem vs solution, with a vertical crimson divider bar | Reference deck slides 3, 4 |
| 4 | **Numbered stack** | 01 / 02 / 03 numbered rows with a label, sometimes one row highlighted in crimson | Reference deck slide 5 |
| 5 | **Hero word + caption** | One enormous italic word (e.g. "Sovereignty.") with framed callout below | Reference deck slide 6 |
| 6 | **Pull quote** | Big quote with crimson opening curly mark, attribution beneath a short rule | Reference deck slide 7 |
| 7 | **Architecture flow** | Horizontal numbered tile grid for governance loops, system maps, process visuals (cream background, crimson number tiles, hairline tile borders) | replaces former dark variant |
| 8 | **Closing CTA** | Book/QR/contact card with a two-column image-left, content-right layout | Reference deck slide 8 |

Detailed code patterns for each layout live in `references/layouts.md`. **Read that file before generating slides.**

---

## Tone of voice (for headlines and copy)

The reference keynote deck is the gold standard. Notice the cadence:

- **Short, declarative, terminal punctuation.** "Every day, a new exception." "Sovereignty." "The Trust Stack."
- **Italic crimson subheads contradict or sharpen the headline.** "Not the exception — the operating condition."
- **Antithesis as a structural device.** "Not prompt engineering. Enterprise design around outcomes." "Not anti-platform. Anti lock-in of the enterprise architecture."
- **Bold + italic combo for the closing line of a slide.** "*The process enterprise treats this as a business anomaly.* **The autonomous enterprise treats it as an input.**"
- **Periods at the end of phrase fragments.** "Authority. Boundaries. *Evidence.*" The final word is often italicized in crimson.

When Martin gives you content as bullet points, **rewrite into this voice**. Don't keep his bullets verbatim unless he says so.

---

## Build process

1. **Read `references/layouts.md`** for the exact pptxgenjs code for each layout.
2. **Confirm the deck spec with Martin first** if anything is ambiguous — number of slides, the headline/subhead per slide, whether to include the standard footer meta band (Martin does NOT want this auto-included; ask), and the event name to put in the header.
3. **Use `pptxgenjs`** (Node) to build the .pptx. Emit a single `build.js` file in `/home/claude` and run it. The `pptx` skill's `pptxgenjs.md` reference covers the API basics if you need them; this skill assumes you've used pptxgenjs before.
4. **Save the output to `/mnt/user-data/outputs/`** with a descriptive name like `[Presenter]-[Topic]-Keynote.pptx`.
5. **QA visually**: Convert the deck to images using the recipe in the `pptx` skill's QA section. Inspect for overlaps, overflow, alignment. Fix once. Don't loop.
6. **Present the file** with `present_files`. Keep the chat-side commentary minimal — the file is the deliverable.

### Footer/header convention

Martin does not want auto-inserted boilerplate in the **header**. **Always ask** at the start of a deck:
- Should the header band include the standard "[PRESENTER] · [DECK TITLE] · [EVENT]" line, and if so: presenter, title, event?
- Page numbers on every slide?

If he says yes, apply consistently. If he says no, drop the header meta entirely — just the logo mark and the rules.

The **wordmark in the bottom-left footer is mandatory on every slide** and is not optional. It does not require asking.

---

## What to avoid

- **No dark slides.** Every slide is cream/white. The previously-canonical dark architecture variant has been replaced by the light architecture flow (layout #7).
- **No accent lines under titles** — the Novagentica style uses hairline rules between bands, not decorative underlines under headlines.
- **No filled colored bars or ribbons** other than the small crimson logo block, the vertical crimson divider in two-column layouts, and the crimson number tiles in the architecture flow.
- **No emojis or stock-illustration icons.** The mark, the rules, and the typography do all the work.
- **No gradient backgrounds.** Cream, full stop.
- **No drop shadows on text or cards.**
- **Do not pile every slide with content.** The reference deck's slides typically have one headline, one subhead, and 3–5 supporting items — that's it.
- **Crimson is an accent, never a fill area.** Largest crimson elements: the crimson half of the wordmark, the vertical divider in two-column, the number tiles in the architecture flow.
- **Do not omit the footer wordmark.** It's drawn by `drawFooterRule()`. Every layout function calls `drawFooterRule(s, pageNum, total)` as its last step before returning the slide.

---

## Pitfalls and recovery

- **pptxgenjs uses inches, not points, for positioning.** Convert: 1in = 96px @ 96dpi. The slide is 13.333" × 7.5".
- **Georgia and Inter must be referenced by exact PowerPoint name** (`Georgia`, `Inter`). If Inter isn't available on the target machine, fall back: `Helvetica` → `Arial`. Set both in pptxgenjs as comma-separated.
- **Italic crimson subhead is a single text frame**, not two. Use a `text:` array with mixed `options` for bold/italic toggles within one paragraph. Pattern is in `references/layouts.md`.
- **Roman numerals for sections** (I., II., III., IV., V.) live in the header band's left position, replacing the logo mark on body slides. Slide 1 (outline) and the final slide (CTA) keep the logo mark.
- **Headline sizing**: pptxgenjs renders Inter Black slightly wider than Keynote does. Use 44pt for long headlines (e.g. "Authority. Boundaries. Evidence."), 48pt for medium (e.g. "Every day, a new exception."), 56pt for short, and 96pt for one-word heroes (e.g. "Sovereignty."). When in doubt, set `fit: "shrink"` on the headline text frame.
- **Wordmark rendering**: The wordmark is rendered as text (not as an image) because the cream-background PNG version is not available as a clean asset. The text rendering uses Inter Black 14pt with "nova" in INK and "gentica" in ACCENT — visually faithful to the brand wordmark and scales perfectly. If a vector source becomes available later, swap `drawFooterRule()` to use `s.addImage()` instead.

---

## Files in this skill

- `SKILL.md` — this file
- `references/layouts.md` — exact pptxgenjs code patterns for each of the 7 layouts (including the architecture flow)
- `references/voice.md` — extended tone-of-voice guide with more worked examples
- `assets/starter-build.js` — a runnable build script template with the 4 most common layouts pre-wired. **Copy this as the starting point** for a new deck — edit the SLIDES section at the bottom and run with `node`. For layouts not in the starter (two-column, numbered stack, architecture flow, closing CTA), copy the pattern from `references/layouts.md`.
- `assets/logo-mark.png` — small crimson logo placeholder (the layouts draw the mark with shapes, so this is rarely needed)
- `assets/novagentica-wordmark.png` — the full wordmark with black background. NOT used by the current build (the wordmark is rendered as text in `drawFooterRule`). Kept on file as a reference asset.

When you start a deck, **read `references/layouts.md` first** before writing any code, then copy `assets/starter-build.js` as your scaffold.

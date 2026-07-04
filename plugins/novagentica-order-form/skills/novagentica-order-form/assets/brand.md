# Novagentica brand reference (canonical — fixed, never an input)

> Single source of truth: the **Novagentica Design System** project
> (`styles.css` + `tokens/` + `guidelines/`). This file is the skill-ready
> digest; drop it into any skill's `assets/` and render against these values.
> Do not invent a new look.

## Colour
| Token | Hex | Use |
|---|---|---|
| BG_LIGHT | `#FAFBF6` | Cream — the only page background |
| INK | `#0E0E0C` | Primary text; ink section panels |
| INK_SOFT | `#5C5C58` | Secondary / body-on-cream prose |
| MUTED | `#8A8A86` | Eyebrow labels, page numbers, footer meta |
| RULE | `#D9D9D2` | Hairline rules, borders, dividers |
| ACCENT | `#CC0D2C` | Crimson — accents, the `gentica` half of the wordmark, highlighted tier, milestone diamonds, table-header rows, number badges, two-column divider |
| ACCENT_INK | `#A60B24` | Darker crimson — hover / pressed on crimson |
| CRIMSON_LIGHT | `#F5C6CE` | ~20% crimson — Gantt active-week bars, subtle data fills |
| TINT | `#FBE3E7` | Highlighted licence-tier column fill |
| RISK_WASH | `#FBE9EC` | Faint risk / alert surface wash |

Status (muted, editorial — never bright UI candy): pass `#2E6B4F`, caution `#9A6B12`, risk reuses ACCENT.

## Type
- **Inter** — headlines (semibold/bold), eyebrow labels (ALL CAPS, tracked `0.16em`), row labels, UI, data.
- **Gelasio** (Georgia-metric serif; the one serif on every surface incl. Google) — display / section titles, body prose, italic emphasis, crimson Gelasio-italic subheads, numerals.
- Scale: 64 display · 44 section title · 34 sub-head · 28/22/18 heads · 15 body · 13 dense · 10 eyebrow.
- **Wordmark**: `novagentica` — Inter semibold, tight tracking, lowercase, **two-tone: `nova` in INK + `gentica` in ACCENT**, no trailing mark. On ink grounds `nova` flips to BG_LIGHT; `gentica` stays crimson. Sits bottom-left of every slide.

## Motion & surfaces
- Quiet motion: 120–320ms, eased (`cubic-bezier(0.2,0,0,1)`), no bounce/spring. Fades + small translates only.
- Mostly square: radii 0 (rules/tables) · 3px inputs · 6px buttons/cards · pill only for status.
- Depth = hairlines on cream, not blur. Shadows near-absent, warm-tinted when used. No gradients, photography, textures, or illustration. No emoji.

## DOCX conventions
- A4. Proposal / SoW portrait; Delivery Timeline landscape.
- H1 Inter bold crimson; H2 Inter bold ink; body Gelasio 11pt.
- Table header rows: crimson fill, white bold text. Highlighted/total rows: CRIMSON_LIGHT / TINT fill.
- Footer: `novagentica` wordmark (two-tone) left, confidential strapline, page number right, crimson top rule.

## PPTX conventions (16:9, 13.333 × 7.5")
- Header band: roman numeral or logo mark top-left, short crimson underline, meta text top-right, top hairline rule.
- Hero: eyebrow → big Inter headline → crimson Gelasio-italic subhead.
- Body patterns: themed rows · numbered stack · two-column (crimson divider) · architecture-flow tiles (crimson number badges) · comparison table (highlighted column in TINT).
- Closer: hairline rule + italic Gelasio tagline; bold crimson ending optional.
- Crimson is an accent, never a fill area except: the wordmark, two-column divider, number badges, milestone diamonds, the highlighted tier column, and table-header rows.

## Voice
Declarative fragments ending in periods. Two-beat headlines (statement + quieter second line). Antithesis/parallelism ("Not the agent. The governance."). "We/your", never hype, no exclamation marks, no emoji. Numbers are concrete claims tied to outcomes. Eyebrows ALL CAPS dot-separated (`NOVAGENTICA · USE CASE FIT`). `™` on module names (Architect™, Control™, CDAP™).

# Generators (v2 — actually parameter-driven)

In v1 the README claimed a single source of truth, but no generator read
`engagement.json` — each hardcoded the client and figures, so the same number lived
in six files and the intro-offer sentence was hand-typed in four. v2 fixes that for real.

## How it works now
- `lib/brand.js` — the one set of colours + fonts. No generator redefines brand.
- `lib/format.js` — money / currency / term formatting. One implementation.
- `lib/commercials.js` — `reconcile(brief)` → a fully-derived commercial view
  (per-line payable, scenarios, licence, variable tiers, intro-offer sentence, warnings).
  Totals are computed, never read from the brief.

Each generator: `const E = require(briefPath); const R = reconcile(E);` then renders
from `R` and `E`. Nothing commercial is hardcoded. Product narrative that is the same for
every customer (NO PASSPORT = NO EXECUTION, AQVP, Architect→Authority→Control) stays as
fixed copy — it belongs to the product, not the deal.

## Run
```
npm install pptxgenjs docx
node build_summary6.js [path/to/engagement.json]   # default: ../engagement.example.json
```
Output filename comes from `output.fileStem` + `output.version`.

## Status
- [x] `build_summary6.js` — converted + render-QA'd (licence table, intro-offer, services, Gantt all derived).
- [ ] `build_execsummary.js`, `build_proposaldeck.js`, `build_proposal.js`, `build_sow.js`, `build_gantt.js`
      — mechanical conversion to the same pattern (read brief + lib; delete hardcoded values).
- [ ] order form (Python) — mirror `reconcile()`'s rules so the binding doc reconciles to the same numbers.

## Always
- Up-version before generating (bump `output.version`; never overwrite).
- Deliver finals to `output.gdriveFolder`.
- Run reconcile warnings + the SKILL.md QA checklist before delivery. Convert to images and eyeball.
- Brand tokens are fixed (`lib/brand.js`); do not invent a new look.

## Ask before generating — external dependencies
Works-council (Betriebsrat) approval and other external gates are engagement-specific and are
**never assumed**. Before generating, ask:

> "Does any external approval gate this engagement — works council / Betriebsrat, security
> review, regulator, or customer board? If yes: which stage, and what date?"

Record the answer in the brief:
- `dates.gate: { name, date }` — a confirmed dependency (renders under "DEPENDENCY").
- `dates.gate: null` — asked, none.

If neither is present the generator prints a warning, because the question wasn't answered.
Betriebsrat is one example only — it applies to high-risk HR cases (e.g. candidate screening),
not to most engagements.

## Ask before generating — start mechanism
How the engagement starts is engagement-specific and is **never assumed** (it was hardcoded to
LOI before). On generation, ask:

> "How does this engagement start — Letter of Intent (LOI), purchase order (PO), or signed contract?"

Record it in the brief:
```
procurement.start = { type: "loi" | "po" | "contract", label?, note? }
```
- **loi** → "without commitment or prejudice" wording (use only when genuinely an LOI).
- **po** → purchase-order wording; no "prejudice" language.
- **contract** → signature authorises start.
A legacy `procurement.loi` string is still honoured as an LOI. The same `timeline.start` field
works for `build_timeline.js`.

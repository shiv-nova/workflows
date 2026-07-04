# Novagentica skills — Consistency Standard (v1)

The single source of truth for how **every** Novagentica document/skill behaves. Any skill that
produces a client- or investor-facing artefact (engagement-pack, order-form, delivery, presentation,
presales/solution-design, use-case-library, decision) must conform to this. When a skill and this
doc disagree, this doc wins.

---

## 1. Prompt, don't fabricate  (the prime rule)
Never invent use cases, figures, names, dates, runtimes or commercials to fill a gap. If a critical
input is missing or ambiguous, **ask the user a specific question and stop** — do not emit a
placeholder-stuffed "draft".

- Mechanism: `lib/preflight.js` → `preflight(engagement, R)` returns `{ questions, confirmations }`.
  `questions` are blockers; the generator prints them and **exits without writing** (override only
  with `NVG_FORCE=1` for a deliberate gap-draft). `confirmations` are soft `[TBC]`s — fine to proceed,
  but surfaced.
- Blockers today: missing client name, currency, commercial model, slate; start mechanism not set;
  external-dependency decision not recorded; an undefined MVP with no kickoff to anchor its deadline;
  a "defined" MVP with no day estimate.
- Skills must call preflight (or its language-equivalent) before rendering, and the SKILL.md must
  instruct Claude to put the questions to the user rather than guess.

## 2. One commercial source of truth
All money is **derived**, never copied from the brief. `lib/commercials.js` → `reconcile(engagement)`
owns it. Day rate CHF 2,500 default. Two models, auto-detected:
- **ladder** — `commercials.tiers[]` + `commercials.licence` (optional `introOffer`). Services priced
  per MVP; scenarios derived from stage status.
- **options** — `commercials.options[]`. Whole-offer comparison (customer pays / term / days /
  co-investment / total value); services decoupled from per-MVP pricing.
Discount/co-investment (incl. `free-partnership`) is shown as value → co-investment → net; never bill
co-invested work. Licence is "blended" only in options mode; in ladder mode it is separate/full.

## 3. Ask, never assume — three per-engagement decisions
| Decision | Field | Default | Rule |
|---|---|---|---|
| External dependency (works council/Betriebsrat, security, regulator) | `dates.gate` = `{name,date}` or `null` | none assumed | Confirm per deal. Betriebsrat applies to high-risk HR cases only, not by default. |
| Start mechanism | `procurement.start.type` = `loi`/`po`/`contract` | none assumed | "Without commitment or prejudice" is LOI-only. Legacy `procurement.loi` honoured. |
| Undefined MVP definition | stage `defined:false` (+ `timeline.startWeek`; `dates.kickoff` gives a date) | — | **Definition due 2 weeks before that MVP's own start** (`DEFINITION_LEAD_WEEKS = 2`). Shown as a ◇ milestone on the Gantt and a row on the ask slide. |

## 4. Voice & brand (always)
- Never "governance" as bureaucracy → control / enforcement / authority / certification / evidence.
- Never "pilot" → MVP1 → MVPx. Never "Supabase" → "the platform".
- Salesforce Agentforce belongs in *positioning/capability* runtime lists; do **not** inject it into a
  deal's in-scope runtimes (respect the explicit list).
- Brand tokens live in `lib/brand.js` only: cream `#FAFBF6`, crimson `#CC0D2C`, ink `#0E0E0C`,
  Inter + Georgia, lowercase `novagentica` wordmark. Product narrative fixed: NO PASSPORT = NO
  EXECUTION, AQVP, CDAP™, Crypto Passport.

## 5. Shared libraries (no per-skill copies)
`lib/brand.js` · `lib/format.js` · `lib/commercials.js` · `lib/timelines.js` · `lib/preflight.js`.
Skills import these; they do not re-implement money, dates, brand or preflight. The order-form
skill (`build_of_subscription.js` + `build_of_ps.js`) shares its own `nvg_helpers.js` and
**inlines** the brand tokens (so it installs standalone), but those values MUST match
`lib/brand.js` — treat `lib/brand.js` as canonical and mirror any change. It follows the same
commercial contract (fields, derivations, preflight questions).

## 6. Output & versioning
`{Stem}-{Artefact}-v{version}.pptx|docx`. TRIAL/DRAFT artefacts carry the suffix and are never
sent to a client. WeasyPrint for PDF. Brand canonical at `brand.md`.

## 7. Generic timelines (no use case yet)
For prospects without defined use cases, use `build_timeline.js` + archetypes in `lib/timelines.js`
(ingestion / greenfield / govern-in-place / hybrid). No fabricated use cases; discovery names them.
Same `start` mechanism applies.

---

### Conformance checklist (per skill)
- [ ] Imports the shared libs; no local brand/money/date code.
- [ ] Runs preflight and refuses to fabricate; SKILL.md tells Claude to ask the questions.
- [ ] Reads commercials via `reconcile`; nothing priced by hand.
- [ ] Treats gate, start mechanism and undefined-MVP definition as explicit decisions.
- [ ] Voice & brand rules applied; Agentforce not injected into deal scope.
- [ ] Versioned output; TRIAL/DRAFT suffix respected.

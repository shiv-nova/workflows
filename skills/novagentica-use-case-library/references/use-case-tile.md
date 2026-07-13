# Use Case Tile — Spec, Schema & Worked Example

The detailed specification for a single library tile. Read this before populating one.

## Contents
1. The three slides (Spine C), slide by slide
2. Brand-layout mapping
3. Metadata schema + library index format
4. The maturity ladder, applied
5. Worked example — Financial Services / Finance Ops

---

## 1. The three slides (Spine C)

Each slide carries one job. Resist cramming — the brand allows one headline, one subhead, and 3–5 supporting items per slide.

### Slide 1 — THE OPPORTUNITY
*Answers: is this worth our attention?*

- **Eyebrow:** `VERTICAL · FUNCTION` (e.g. `FINANCIAL SERVICES · FINANCE OPERATIONS`).
- **Headline:** the opportunity as one sharp sentence — reframe a cost/risk as trapped value. Voice: declarative, terminal punctuation.
- **Subhead (crimson italic):** sharpen or contradict the headline (antithesis).
- **3–5 themed rows** quantifying the value pool *and the "why now"*: cost pool · volume/throughput · cycle time · risk/error exposure · regulatory pressure. Each row = a label + a fact, every figure maturity-stamped.
- **Anchor line:** `Value at stake: £X–£Y per portco, per year.` This is the slide's punchline and the tile's headline ranking signal.

### Slide 2 — THE AGENT & THE MOAT
*Answers: can we do this, and is it hard to copy?*

- **Headline:** what the agent does, one line.
- **The flow** (Domain→Outcome→Agent made concrete): `trigger → agent step(s) → systems touched → passport / enforcement gate → outcome`. Name the **runtime(s)** (from the 9) and the **target systems** (e.g. SAP S/4HANA, ServiceNow, Salesforce). The enforcement gate is where **NO PASSPORT = NO EXECUTION** is shown — it is the reason this is defensible, not a footnote.
- **The moat (2–3 items):** why this is hard to copy — the certified, enforced, auditable nature (EU AI Act Art. 43/47 where relevant); integration depth; the trust layer. Voice: *"Not a prompt. A certified, enforced workflow."*
- **Boundary note:** blast radius (Low/Med/High) and the human-in-the-loop point.

### Slide 3 — THE ECONOMICS
*Answers: what's the return, and how many portcos does this apply to?*

- **Headline:** the result, one line.
- **Numbered stack (01–04):**
  - `01 Value created` — the KPI delta tied to the Outcome. Maturity-stamped.
  - `02 Deployment effort` — MVP1 services-days (CHF 2,500/day), runtime, integration surface. **MVP1 → MVPx; never a pilot.**
  - `03 Time to value` — MVP1 live in N weeks.
  - `04 Portfolio replicability` — how many portcos in this vertical this applies to (the investor-lens signal).
- **Closing italic line** in voice — the portfolio thesis in one sentence.

---

## 2. Brand-layout mapping (handoff to `novagentica-presentation`)

| Slide | Default brand layout | Alternate |
|---|---|---|
| 1 — Opportunity | #2 Themed rows | — |
| 2 — Agent & Moat | #7 Architecture flow | #3 Two-column contrast (when the use case is a before/after process story) |
| 3 — Economics | #4 Numbered stack | — |

All other brand constants (cream background, crimson accent only, Inter+Gelasio, wordmark bottom-left every slide, hairline rules) are owned by the presentation skill. Do not restate or override them.

---

## 3. Metadata schema + library index

Capture this **before** drafting slides. Store one row per tile in `library/index.csv` with this header:

```
slug,vertical,function,domain,outcome_kpi,agents,runtimes,target_systems,blast_radius,differentiation_fit,value_at_stake,portfolio_replicability,maturity,evidence_source,deck_path
```

Field notes:
- `domain`, `outcome_kpi`, `agents` — the canonical Domain→Outcome→Agent taxonomy (shared with solution-design).
- `blast_radius` — Low / Med / High (operational risk if the agent errs).
- `differentiation_fit` — H / M / L: does enforcement/trust actually matter here? Low-fit use cases are weak library entries even if valuable — flag them.
- `value_at_stake`, `portfolio_replicability`, `maturity` — the three investor-lens ranking signals.
- `evidence_source` — citation or deployment reference backing the numbers (empty only if maturity = Concept).

The index, not the decks, is how the library is filtered ("show me Live, high-replicability tiles in manufacturing") and how solution-design finds candidates.

---

## 4. The maturity ladder, applied

| Stamp | Means | How figures may be stated |
|---|---|---|
| Concept | Hypothesis only | No figures asserted as fact; describe the opportunity qualitatively |
| Modelled | Estimated / benchmarked, not from a live run | Every figure visibly labelled *modelled* |
| Reference | From a comparable named deployment | Cite the source in `evidence_source` |
| Live | Running in production at a (named/anonymised) portco | Strongest claim; still cite |

If you cannot defensibly source a number, drop to Concept and omit it. Never dress a Modelled figure as Live.

---

## 5. Worked example — Financial Services / Finance Ops

**Metadata row:**
```
intercompany-recon, Financial Services, Finance Operations,
Record-to-Report, Days-to-close + unreconciled-balance £,
[Reconciliation Agent; Exception-Resolution Agent],
[SAP Joule; BYO SDK], [SAP S/4HANA; group consolidation],
Med, H, "£1.5–4m per portco/yr (working capital + FTE)", "H — most portcos run multi-entity S/4HANA", Modelled, "internal benchmark model v2"
```

**Slide 1 — THE OPPORTUNITY**
- Eyebrow: `FINANCIAL SERVICES · FINANCE OPERATIONS`
- Headline: *Reconciliation isn't a back-office chore. It's working capital held hostage.*
- Subhead (crimson italic): *Every open break is cash you can't see and can't move.*
- Rows: VOLUME — tens of thousands of intercompany lines per close *(modelled)* · CYCLE — 6–9 day close, ~40% spent investigating breaks *(modelled)* · RISK — unreconciled balances inflate audit scope and restatement risk · WHY NOW — multi-entity S/4HANA estates + tightening audit expectations make this acute.
- Anchor: *Value at stake: £1.5–4m per portco, per year. (modelled)*

**Slide 2 — THE AGENT & THE MOAT**
- Headline: *An agent that clears the break before a human ever sees it.*
- Flow: `new break in S/4HANA → Reconciliation Agent matches & proposes → Exception-Resolution Agent drafts the journal → passport gate: no signed authority, no posting → posted with full evidence trail`. Runtime: SAP Joule (+ BYO SDK). Systems: SAP S/4HANA, group consolidation.
- Moat: certified + enforced — every posting carries a passport and an audit trail (Art. 43/47-ready); deep S/4HANA integration; *not a prompt — a certified, enforced workflow.*
- Boundary: blast radius Med; human approves anything above a materiality threshold.

**Slide 3 — THE ECONOMICS**
- Headline: *Close faster, with less cash trapped — and roll it across the portfolio.*
- 01 Value created — 30–40% reduction in close effort; material working-capital release *(modelled)*.
- 02 Deployment effort — MVP1 ≈ 20–30 services-days on SAP Joule; integration to S/4HANA + consolidation. MVP1 → MVPx, no pilot.
- 03 Time to value — MVP1 live in ~6–8 weeks.
- 04 Portfolio replicability — High: most multi-entity portcos run S/4HANA; one certified pattern redeploys.
- Closing italic: *Build the recon agent once. Earn it back in every portfolio company that closes a multi-entity ledger.*

# Decision Frame + Reversibility Calibration + Grounding

This is the front of the pipeline. Get it right and the rest is downhill; get it wrong and a
flawless board meeting answers the wrong question. Produce the frame, show it inline, and get
the user to confirm it **before** grounding or deliberating.

## The one-screen frame

Fill every field. If a field can't be filled, that gap is itself a finding.

| Field | What it captures | Bad answer → push back |
|---|---|---|
| **Decision** | The fork in one sentence, phrased as a choice. | "Think about pricing" → not a decision. Force: "Should we raise Enterprise from CHF 600k to CHF X from [date]?" |
| **Owner** | The single person who makes the call. | "The team" → no owner = no decision. |
| **Deadline** | When the call must be made (and why then). | "Soon" → pin a date; name the forcing event. |
| **Success looks like** | The observable outcome that means this was right, by when. | "Growth" → name a metric, threshold, and date. |
| **Null option** | What happens if we do nothing / keep current. Always a real option with a cost. | Never omit. The status quo has a cost too. |
| **Reversibility** | Type-1 or type-2 + cost-to-reverse (money, time, reputation, relationships). | See below. |

## Reversibility calibration (the core mechanism)

Classify the decision, then match the rigour. Borrowed from the Bezos type-1/type-2 framing.

**Type-2 — reversible, cheap to undo.** A "two-way door": if it's wrong, we walk back through it
at low cost. Examples: a marketing channel test, a reversible pricing experiment with a defined
window, a tooling choice, a trial hire on a contract. → **Lightweight path.** Inline multi-perspective
pass, short memo, a review date. Decide fast; do not convene a full board. Over-processing a type-2
decision is its own failure mode — it burns time and trains the org to be slow.

**Type-1 — irreversible or expensive/painful to reverse.** A "one-way door": unwinding it costs
real money, time, reputation, or relationships. Examples: a senior permanent hire, a public pricing
re-anchor, a fundraise / equity event, a long-term partnership or exclusivity, sunsetting a product
line, a large multi-quarter spend commitment. → **Full path.** Ground in numbers → `/cs:boardroom`
→ Decision Memo → `/cs:decide` → offer `/cs:freeze`.

When genuinely unsure, treat it as type-1. The asymmetry favours caution: the cost of over-deliberating
a type-2 is a few wasted hours; the cost of under-deliberating a type-1 is the decision itself.

State the class **and** the cost-to-reverse explicitly in the frame and the memo — "Type-1; reversing
after announcement costs ~2 quarters of customer trust and re-papered contracts" is far more useful
than the label alone.

## Grounding sources (Novagentica)

Pull the figures the decision actually turns on and carry each one with its **source + as-of date**.
Put them into the brief the board reads — do not rely on the generic `company-context.md`.

| Source | Where | What it gives |
|---|---|---|
| **Master financial model** | Novagentica workspace (rebuilt go-forward SaaS master; capacity-driven revenue, locked ACVs/assumptions). See memory `project_master_model`. | Runway, monthly burn, capacity/headcount limits, ACVs, revenue ramp. |
| **Licence pricing** | Canonical: Domain CHF 150k / Enterprise CHF 600k / Global CHF 1.2M per year, 3-year term. See memory `reference_novagentica_licence_pricing`. | Price points for any pricing / packaging / discount decision. |
| **Pipeline / CRM** | Notion "Client List (CRM)" — Clients + Deals are canonical (Pipeline DB retired); MEDDIC fields present. See memory `reference_notion_crm`. | Live pipeline, deal stages, expected close, coverage vs target. |
| **Prior decisions** | `/cs:decide` log (`~/.claude/decisions/approved/`) or the local `decisions/` fallback folder. | What was already decided, its kill-criteria, and any preserved dissent that bears on this call. |
| **CS / capacity** | CS strategy deck + master model (headcount now resolved). See memory `project_cs_strategy`. | Delivery capacity constraints for any growth/commitment decision. |

Rules:
- **Unknown ≠ zero.** If a load-bearing number isn't available, say so and convert it into a named,
  falsifiable assumption. Do not fabricate.
- **Cite as-of.** "Runway 14 months (master model, 2026-06)". A number with no date is a rumour.
- **Only pull what the decision turns on.** Don't dump the whole model; ground the specific levers.

## Affected roles (for scoping the board)

Map the decision to the C-roles whose domain it touches, so the board (or inline pass) convenes the
right voices and not all ten:

- Money / runway / dilution → CFO.
- Revenue / pipeline / NRR → CRO.
- Pricing / positioning / ICP → CMO.
- Product / roadmap / PMF → CPO.
- Delivery / ops cadence / capacity → COO.
- Hiring / comp / org → CHRO.
- Security / compliance / data → CISO.
- AI model / risk-class / cost → CAIO.
- Contracts / IP / regulatory → General Counsel.

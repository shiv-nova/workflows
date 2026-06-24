# Board Review — Deel back-office consolidation (final decision)

**Method note.** Requested via **c-level-agents / boardreview**. That plugin is **not installed in this cloud container** — verified across local disk, `~/.claude`, MCP providers, and `origin/main` (latest `c27b5c7`). It lives on your Mac / personal Claude config, which this isolated remote session can't reach, and it isn't committed to the repo. **To run the real plugin here:** commit `c-level-agents` into `shiv-nova/workflows` and I'll pull and run `/cs:boardroom` + `/cs:cross-eval` for real. In the meantime this is the novagentica-decision skill's **sanctioned inline-board fallback** — the same protocol `/cs:boardroom` runs (Phase-2 isolation → cross-examination → devil's advocate → synthesis), chaired by the CEO.

**Board convened:** CEO (chair), CFO, COO (Felix's seat), CISO, General Counsel.
**Decision under review:** Sign **Deel** as the single managed back-office vendor — HR·IT·EOR·Payroll·Recruiting·managed-endpoint, 2-yr term, 3→30 ramp.
**Date:** 2026-06-24

## Phase 2 — Independent positions (isolation)
*Each role's position written before seeing the others.*
- **CEO (chair):** *Ratify Deel.* Support — on an all-eggs bet, optionality (no auto-renew) is worth more than a 0.2 scorecard point. Concern — the prior failed Deel go-live means execution risk must be owned contractually, not verbally.
- **CFO:** *Ratify Deel.* Support — price is a genuine tie; ~€97k/2yr is immaterial vs runway. Concern — USD/FX exposure and the unconfirmed DE country fee; lock both before signing.
- **COO (Felix):** *Ratify, conditional.* Support — device leasing removes an internal IT hire. Concern — I lived the failed Deel HRIS go-live; a parallel payroll run and a named, proven implementation lead are non-negotiable.
- **CISO:** *Ratify, conditional.* Support — one managed fleet can be patched more consistently than ad-hoc BYO. Concern — blast radius; confirm a 24/7 security-ops layer + ISO 27001 evidence before cutover.
- **General Counsel:** *Ratify Deel.* Support — Deel's no-auto-renew + locked rate is exactly the leverage an all-eggs bet needs; my earlier dissent is now satisfied. Concern — get data-export/exit-assistance + SLAs-with-credits in writing now.

## Phase 3 — Cross-examination
- **CFO ↔ CEO:** FX is the one place the "tie" can break against us. CEO accepts → a fixed-FX clause (or hedge) becomes a signing condition.
- **COO ↔ board:** the n=1 failed go-live can't be hand-waved. Board agrees: reference calls (incl. a *recovered* failure) + a named lead are conditions, not hopes.
- **GC ↔ CISO:** the pre-signature window is our leverage for *both* contract terms and security commitments — bundle them into one redline so neither slips.

## Phase 4 — Devil's advocate (against ratifying Deel)
- **HIGH:** re-hiring the vendor that failed your ops lead — "no auto-renewal" does not stop a botched go-live locking payroll/identity/devices on day one. *Mitigation:* named proven implementation lead + recovered-failure reference + a hard parallel-payroll gate; if Deel can't field a credible lead, reconsider.
- **MEDIUM:** was Rippling's auto-renewal "no" tested at a senior level? Confirm before closing, so the flip rests on a real refusal.
- **LOW:** lease-vs-buy on devices — quick TCO sanity check; don't pay a convenience premium by default.

## Phase 5 — Synthesis, vote, CEO sign-off
- **Board vote:** 5 / 5 ratify **Deel — conditional.**
- **Binding pre-signature conditions:** (1) confirm Rippling's refusal is final and senior; (2) confirm the DE country/entity fee; (3) lock FX; (4) named proven implementation lead + recovered-failure reference; (5) parallel payroll to two consecutive clean cycles; (6) no-auto-renewal + data-export/exit-assistance + SLAs-with-credits + security-ops evidence + device-lease scope — all in writing.
- **Preserved dissent:** none blocking. GC's original objection (auto-renewal) is now the basis *for* Deel; COO's execution caution is carried as binding conditions, not as dissent.
- **CEO sign-off:** **APPROVED — conditional**, as above. Shiv owns the decision; Felix owns the payroll go-live gate. Review at end of Stage 1 (2026-12-31).

> This inline board corroborates the CEO-Review and CrossEval-v2 verdicts. It is *not* a substitute for the genuine second-model cross-eval (still pending a Gemini key in-sandbox) — that remains the one open safeguard before a 2-year signature.

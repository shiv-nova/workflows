# Cross-Eval — Deel vs Rippling back-office vendor memo (v1.0)

**Memo reviewed:** 2026-06-24-deel-vs-rippling-backoffice-DecisionMemo-v1.0
**Models used:** Claude only (single-model adversarial mode). **No Gemini key was available in this environment**, so the stronger two-model path (`scripts/gemini_review.py`) could not run. Per the skill, this is the *weaker* cross-eval — treat it as one model arguing against itself, not as independent corroboration.
**Date:** 2026-06-24

## Three adversarial passes

### Pass 1 — Standard reviewer (does it hold together?)
**APPROVE.** Every forcing function is present and substantive: the null option is real and costed; assumptions are falsifiable; kill-criteria are observable and binding; dissent is verbatim from two roles; every figure carries the comparison-model source; one clear recommendation. The conditional structure (Rippling *if* auto-renewal struck, else Deel) is the right shape for a type-1 all-eggs bet.
**Catch (MEDIUM):** the **"Decide by 2026-07-03" deadline is in tension with the memo's own conditions.** Striking auto-renewal, getting written full-scope quotes from both vendors, and completing reference calls (incl. a recovered failed go-live) cannot realistically all close in nine days. The memo risks forcing a signature to hit a date — the exact behaviour its lock-in section warns against.

### Pass 2 — Devil's advocate (argue the recommendation is wrong)
**Objection A (HIGH):** the memo leans on *"Felix lived a failed Deel go-live"* as a load-bearing reason for Rippling, while also listing (in §7) that this might be n=1 and needs reference checks. It cannot be both proof and unverified assumption. Until the reference calls happen, the delivery-confidence edge — one of only two things separating a genuine price tie — is **assumed, not established**. The honest status of the recommendation is "Rippling *pending* evidence," which sits closer to a staged/defer posture than the memo's confident §5 implies.
**Objection B (MEDIUM):** the null option is enumerated but lightly engaged. For a 3→30 team, a best-of-breed split (light HRIS + separate EOR) would cut the correlated-failure blast radius and preserve renewal leverage *by construction*. (Counter: the single-vendor scope is one of the 7 already-locked upstream decisions, so re-opening it is out of scope for this memo — fair, but worth naming.)

### Pass 3 — Steelman (argue the recommendation is right)
**APPROVE (strong).** On a real price tie, deciding on FX-nativeness, delivery confidence, and *contractual protection* is exactly the right basis. The conditionality is the memo's best feature: it turns Rippling's single structural weakness (auto-renewal) into a binding pre-condition with a clean, pre-decided fallback to Deel — so the decision is robust to its own biggest risk. Kill-criteria are observable; dissent is preserved; the parallel-payroll discipline is non-negotiable and correctly stated.

## Reconciliation & verdict

**Verdict: 🟡 PAUSE → GO.** APPROVE the recommendation (conditional Rippling, fallback Deel). No CRITICAL flaw blocks it. Two refinements should be folded in **before the owner commits**, both surfaced by the adversarial passes:

1. **Timeline realism (Pass 1).** Decouple the *commercial decision* from the *2-year signature*. If the conditions (written quotes, reference calls, redlined auto-renewal) cannot close by 2026-07-03, start Stage-1 onboarding on a **short month-to-month bridge** and sign the 2-year only once terms are met. Never sign the 2-yr to hit the ramp date.
2. **Provisional delivery edge (Pass 2A).** State explicitly that the delivery-confidence advantage is **provisional, subject to reference checks on both vendors** — so an anecdote isn't doing the work of evidence.

Both have been folded into memo v1.0 (§2/§5/§6). Objection B (null option) is noted but out of scope (single-vendor scope is an upstream locked decision).

**Caveat:** this verdict is single-model. The skill's two-model path exists precisely to catch errors one model's three passes share. If a second opinion matters before a 2-year signature, run `GEMINI_API_KEY=<key> python3 scripts/gemini_review.py <memo>` (rotate the key afterwards) or a model CLI on the Mac, and supersede this with the two-model result.

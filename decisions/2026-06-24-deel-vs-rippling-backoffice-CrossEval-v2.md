# Cross-Eval v2 — Deel vs Rippling, FINAL DECISION (Deel)

**Reviews:** the decided memo (Status: DECIDED — Deel), superseding CrossEval v1 (which reviewed the pre-decision "Rippling-conditional" recommendation).
**Models used:** **Claude only (single-model adversarial mode).** No Gemini/second-model key or CLI is present in this sandbox, so the skill's stronger two-model path could not run. Treat this as one model arguing against itself — *not* independent corroboration. To run the genuine cross-model pass the user asked for: `GEMINI_API_KEY=<key> python3 scripts/gemini_review.py <memo>` (rotate the key after).
**Date:** 2026-06-24

## Three adversarial passes on the Deel decision

### Pass 1 — Standard reviewer
**APPROVE.** The decision is internally consistent with the memo's own machinery: §5 said "Rippling *conditional*, else Deel"; the condition (strike auto-renewal) failed, the §9 tripwire fired, and the call flipped to Deel exactly as pre-registered. The device-leasing fact adds an *independent* second reason, so the decision does not hang on the tripwire alone. Forcing functions remain intact (null option, falsifiable assumptions, binding kill-criteria, verbatim dissent — and the GC dissent has now become the operative position, which is the system working as designed).
**Catch (MEDIUM):** the decision now rests on *accepting* Deel's implementation risk (Felix's prior failed go-live). The §12 mitigations (reference calls, parallel payroll) must be **contractual pre-conditions**, not good intentions, or the accepted risk is unmanaged.

### Pass 2 — Devil's advocate (argue Deel is wrong)
- **Objection A (HIGH):** you are signing your entire back office with the one vendor that already failed your ops lead once. "No auto-renewal" protects renewal pricing — it does **not** protect against a botched go-live that locks payroll, identity and devices on day one, which is the worst-case for an all-eggs bet. You may have optimised renewal leverage while choosing the *worse execution track record for you*. **Mitigation:** demand a named, proven implementation lead (explicitly not the team/config that failed before), a recovered-failed-implementation reference, and a hard parallel-payroll gate; if Deel cannot field a credible implementation lead, reconsider.
- **Objection B (MEDIUM):** "Rippling won't remove auto-renewal" — was that tested hard, at the right level? Auto-renewal removal is a common concession; flipping a type-1 decision on a soft or junior "no" would be a mistake. **Mitigation:** confirm the refusal was final and senior before counter-signing Deel.
- **Objection C (LOW):** is device *leasing* actually better than buy/BYO+MDM for 30 people, or a convenience premium? **Mitigation:** a quick lease-vs-buy TCO sanity check; don't let "they offer it" substitute for "it's the right call."

### Pass 3 — Steelman (argue Deel is right)
**APPROVE (strong).** On an all-eggs single-vendor bet the dominant long-run variables are optionality and renewal leverage — and Deel wins both decisively (no auto-renew + locked rate). Because price is a genuine tie, that optionality is bought *for free*, and device leasing closes the no-internal-IT gap that Rippling leaves open. Decision quality is high: a pre-registered tripwire fired and was honoured — textbook type-1 resolution.

## Verdict

**🟢 GO — Deel, conditional.** No CRITICAL flaw. Approve provided the §12 items are contractual pre-conditions, with special weight on:
1. **Implementation de-risk (Pass 2A)** — named proven implementation lead + recovered-failure reference + parallel-payroll gate, given the prior Deel failure.
2. **Confirm Rippling's "no" was final (Pass 2B)** — a quick senior-level check before closing, so the flip rests on a real refusal.
3. **Confirm the DE country fee and lock the FX** before signature (carried from the memo).

**Caveat (unchanged from v1):** single-model only. The two-model path exists precisely to catch errors three Claude passes share. Before a 2-year signature, run the genuine second model and supersede this with the two-model result.

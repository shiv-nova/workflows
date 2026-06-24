# Decision Memo: Choose Deel or Rippling as the single managed vendor for Novagentica's HR·IT·EOR·Payroll stack (3→30 ramp, 2-yr term)

**Status:** DECIDED — Deel selected (2026-06-24); counter-signature gated on §12 diligence. Two-model cross-eval (CrossEval v3 — Claude + Gemini): 🟡 PAUSE — vendor confirmed by both models; clear the four diligence items (security-ops, implementation references, DE country fee, device-lease terms) before signing.
**Owner:** Shiv Tailor      **Date:** 2026-06-24      **Decide by:** 2026-07-03 (before Stage-1 onboarding, Jul–Dec 26; pre-signature is peak leverage)
**Reversibility:** Type-1 (expensive/painful to reverse) — cost-to-reverse: re-migrating HR + identity + payroll + device fleet off one platform mid-contract; the risk model rates switching cost "huge" once all four pillars + data + devices are live; Rippling auto-renews (worst case for exit); plus a 2-year commitment.
**Depends on / relates to:** The 7 modelling decisions already locked (ramp 3→30; ~50% EOR; single-vendor scope, no internal IT; Rippling EOR discount locked full term; 2-yr term; model both FX). This memo decides the vendor *within* that locked scope; it does not re-open the consolidation scope except via the null option.
**Deliberation:** Inline board (fallback) — the `c-level-agents` plugin (`/cs:boardroom`) is not installed in this environment, so the self-contained multi-perspective pass was used (independent positions → cross-examination → devil's advocate). Stated explicitly per skill protocol.

## 1. The decision
Should Novagentica sign **Rippling** or **Deel** (or **neither, for now**) as the single all-in-one managed vendor for HR · IT · EOR · Payroll · Recruiting · managed endpoint, on a 2-year term, across the 3→30 headcount ramp (Jul 2026 → Jun 2028)?

## 2. Why now
Stage-1 onboarding starts Jul 2026 (the model's first ramp stage). The company has **maximum leverage now, before signature** — auto-renewal, price caps, exit-assistance and SLA terms are negotiable today and far harder to claw back later. The forcing event is the Stage-1 go-live; the deadline is set by the leverage window, not by the platforms.

**Decouple the commercial choice from the 2-year signature.** If the conditions in §5 (written full-scope quotes, reference calls, redlined auto-renewal) cannot all close by the decide-by date, run Stage-1 onboarding on a **short month-to-month bridge** and sign the 2-year term only once the terms are met. Never sign the 2-year deal to hit the ramp date — that is precisely the lock-in trap §8 warns against.

## 3. Context & numbers (grounded)
All figures from the **Deel-vs-Rippling Normalised Comparison model** (the uploaded workbook), base FX **1.142 USD/EUR (ECB/TE, 23-Jun-26)**, unless noted. Both quotes are scoped like-for-like: full HR + IT + EOR + Payroll + Recruiting + managed endpoint.

- **2-yr total, base FX:** Deel **€97,219** vs Rippling **€96,356** — difference **€863 (0.9%)**. The model's own verdict: *"within model noise — treat price as a TIE."* (comparison model, base FX)
- **FX sensitivity (Deel is USD-billed; Rippling is EUR-native):** strong-EUR (1.20) → **Deel cheaper** (€92,520 vs €95,578); weak-EUR (1.05) → **Rippling cheaper** (€105,737 vs €97,764). (comparison model, FX scenarios)
- **Weighted scorecard (draft, for Shiv/Felix to own):** Deel **3.85** vs Rippling **4.05** → Rippling leads, but the model flags it *"close & flips on small changes."* (comparison model, Decision scorecard)
- **Delivery confidence:** Deel **3** / Rippling **4** — *Felix lived a FAILED Deel HRIS go-live*; the model says to weight this heavily and check references. (comparison model)
- **Contract terms & lock-in:** Deel **4** / Rippling **3** — Deel has *no auto-renew + locked rate*; **Rippling AUTO-RENEWS** (the model flags: negotiate out). (comparison model)
- **Run-rate & one-time:** peak ~€7,011/mo at 30 users (Stage 4); one-time setup Deel €2,364 vs Rippling €1,000. (comparison model)
- **Open scope items (unpriced — could move the "tie"):** Deel **Country Fee / GP DE entity** ("may be MANDATORY for EOR — would raise Deel total"); Rippling recruiting quote (~$3–6 + performance, unconfirmed); 24/7 security-ops layer on both; named OBM/CSM + SLA response times. (comparison model, CONFIRM flags)
- **Not loaded in this environment (assumption):** Novagentica runway/burn from the master model is not reachable in this sandbox. The ~€97k/2-yr commitment is treated as modest relative to runway; **this is an assumption to verify** (§7). The dominant risk here is switching/lock-in, not cash.

## 4. Options considered

| Option | What it means | Cost / impact (vs the numbers above) |
|---|---|---|
| **A — Rippling** | Single EUR-native managed stack; leads draft scorecard (4.05); higher delivery-confidence score. | Price tie at base FX; removes FX risk; **but auto-renews** and recruiting/managed-security scope is unconfirmed. |
| **B — Deel** | Single managed stack with no auto-renew + locked rate → best renewal leverage for an all-eggs bet. | Price tie at base FX; **USD-billed → FX-exposed**; Felix's failed go-live; possible mandatory DE country fee could break the tie against it. |
| **Null — don't consolidate / don't sign now** | Keep current/best-of-breed point tools; defer the all-eggs bet. | Forfeits pre-signature leverage; continued admin overhead + fragmented data; no managed endpoint → likely forces an internal IT hire; HR/IT/payroll stay un-unified through the ramp. |

## 5. Recommendation
**Option A — Rippling, conditional on contract terms that neutralise its one structural weakness.** On a genuine price tie, Rippling wins on the two things that aren't tied: it is **EUR-native** (removes the FX volatility that Deel's USD billing carries — material in the weak-EUR scenario) and it scores higher on **delivery confidence** — a *provisional* edge, reinforced by Felix's first-hand failed-Deel go-live but to be confirmed by reference calls on both vendors, not treated as proven. It is one clean system right-sized for a no-IT team scaling 3→30. **But the recommendation is conditional:** Rippling's auto-renewal is the worst structural position for an all-eggs bet, so signature is contingent on **(a) auto-renewal struck out + a capped renewal increase, (b) contractual data-export + exit-assistance, (c) SLAs with service credits + documented incident response, (d) a parallel payroll run before any cutover, and (e) written full-scope quotes** (Rippling recruiting + managed security; Deel's DE country fee) confirming the tie holds. **If Rippling refuses to remove auto-renewal, the lock-in advantage flips the call to Deel (Option B).** One clear call — but the terms are part of the call, not an afterthought.

## 6. Success criteria (binding)
- Vendor chosen by **2026-07-03**; the **2-year term signed only once** these terms are met (a month-to-month bridge covers Stage-1 if they are not): no auto-renewal + renewal increase capped at ≤ a single-digit %; data-export + exit-assistance clause; SLA with service credits + documented incident response.
- **A parallel payroll run completed with two consecutive clean cycles** before first production payroll — zero missed or incorrect pay events through cutover.
- By Stage-2 (Jan 2027) the consolidated stack supports 11 users on one contract/one invoice with **no internal IT hire required.**
- Reference calls completed on the chosen vendor's managed-service responsiveness, including one recovered failed implementation.

## 7. Key assumptions (falsifiable)
- The 2-yr ~€97k commitment is small relative to Novagentica's runway at current burn. *(Verify against the master model — not loaded here.)*
- The current totals are a true like-for-like tie: i.e. Rippling's recruiting + managed-security adds and Deel's DE country fee, once quoted in writing, keep the 2-yr delta within ~10%.
- Rippling's delivery/managed-service is genuinely stronger than Deel's *for our scope* — i.e. Felix's failed go-live reflects the platform/partner, not a one-off, and survives reference checks on both vendors.
- Rippling will agree to strike auto-renewal and cap renewal increases in writing.
- Both vendors can evidence ISO 27001 and a 24/7 security-ops layer for the consolidated scope.

## 8. Risks & mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Lock-in / weak renewal leverage (Rippling auto-renews; switching cost "huge" once all-eggs) | **CRITICAL** | Strike auto-renewal + cap renewal increase + exit-assistance & data-portability **in writing now**, pre-signature. If refused → Deel. |
| Correlated failure — one outage/breach/billing dispute hits pay + identity + devices + hiring at once | **HIGH** | Phased rollout; parallel payroll run; SLAs with service credits; documented incident response. |
| Concentrated execution risk — a single botched migration takes down everything (Felix lived a failed Deel go-live) | **HIGH** | Reference calls incl. a recovered failed implementation; never single-cut payroll; staged cutover. |
| Security blast radius — one breach exposes payroll + identity + device fleet together | **HIGH** | Confirm ISO 27001 evidence + 24/7 security-ops layer on the chosen vendor; one-IdP hygiene; least-privilege. |
| Unconfirmed scope (Rippling recruiting/managed-security; Deel DE country fee) moves the tie | **MEDIUM** | Written full-scope quotes from both before signing; treat current totals as provisional. |
| FX exposure (Deel USD-billed) | **MEDIUM** | Rippling EUR-native neutralises it; if Deel chosen, budget/hedge USD and price the weak-EUR case. |
| Vendor dependency — roadmap/pricing/viability of one vendor gates the whole back office | **MEDIUM** | Keep EOR/payroll data standardised so EOR↔local-entity migration stays feasible. |

## 9. Kill criteria / tripwires (binding)
- **IF** Rippling will not remove auto-renewal (or cap renewal increases) in writing **THEN** switch to Deel before signing.
- **IF** Deel's DE country fee is confirmed mandatory **AND** it moves the 2-yr total materially against Deel **THEN** Deel's commercial tie is void (reinforces Rippling — provided auto-renewal is handled).
- **IF** reference calls reveal poor managed-service responsiveness on the chosen vendor **THEN** pause and re-open the comparison.
- **IF** the parallel payroll run produces any pay error **THEN** do not cut over; extend the parallel run until two consecutive clean cycles.
- **IF** written full-scope quotes move the 2-yr delta beyond ~10% **THEN** re-run the scorecard before signing.

## 10. Dissent (verbatim)
- **General Counsel (inline board):** "In an all-eggs single-vendor bet, the contract is the only thing protecting you at renewal. Rippling auto-renews and Deel does not. A 0.2-point scorecard edge does not outweigh handing one vendor multi-year pricing power over your entire back office. Unless auto-renewal is struck out in writing, Deel is the safer all-eggs partner."
- **CISO (inline board):** "Both vendors' 24/7 security-ops layer is still a CONFIRM flag. We are choosing the vendor before we have evidence that either can actually run the security operations for a consolidated payroll-plus-identity-plus-device estate. Confirm the security-ops layer before signature, not after."

## 11. Decision
**Chose:** **Deel.**
**Rejected:** *Rippling* — refused to remove the auto-renewal clause (the §9 tripwire), making the lock-in risk on an all-eggs single-vendor bet unacceptable; and Rippling does not lease IT devices, so a no-internal-IT team would still have to procure hardware separately. *Null (don't consolidate)* — forfeits the pre-signature leverage window and leaves HR/IT/payroll fragmented through the ramp, likely forcing an internal IT hire.
**Why this is consistent with the memo:** §5 recommended "Rippling *conditional*, else Deel"; the condition failed — Rippling held the auto-renewal — so the §9 kill-criterion fired exactly as pre-registered, and the §10 General Counsel dissent ("unless auto-renewal is struck out in writing, Deel is the safer all-eggs partner") becomes the operative position. The new fact that Deel leases IT devices and Rippling does not reinforces the choice on the "no internal IT" goal.
**Decided by:** Shiv Tailor   **On:** 2026-06-24
**Review checkpoint:** 2026-12-31 (end of Stage 1, after first production payroll cycles)
**Freeze:** 14-day cooldown recommended before counter-signature (`/cs:freeze` not installed — recorded here). Given the decision rests on two firm facts (auto-renewal refused; no device leasing), the cooldown is a formality, not a reconsideration window.

## 12. What changes now — Deel-specific actions
Choosing Deel accepts two known weaknesses (USD/FX exposure; Felix's prior failed Deel go-live) for two firm advantages (no auto-renew + locked rate; IT device leasing). The mitigations that were optional for Rippling are now mandatory:
- **Confirm the DE country fee / GP entity cost before counter-signing** — the workbook flags it "may be MANDATORY for EOR." We are not choosing Deel on price, so a modest increase is acceptable, but it must be known and budgeted (§9 kill-criterion still applies if it is large).
- **Manage USD/FX exposure** — Deel is USD-billed. Budget at the weak-EUR case (~€105.7k over 2 yrs vs €97.2k base) and seek a fixed-FX clause or a simple USD hedge.
- **De-risk the implementation Felix got burned by** — the headline accepted risk. Reference calls including a *recovered* failed Deel go-live; a parallel payroll run to two consecutive clean cycles before cutover; named OBM/CSM + SLA response times in writing.
- **Lock Deel's strengths in writing** — no auto-renewal + the locked rate, plus data-export / exit-assistance and SLAs with service credits.
- **Confirm device-leasing scope in the order** — procure → deploy → manage → return terms, since device leasing is a stated reason for the choice.

---
*novagentica*

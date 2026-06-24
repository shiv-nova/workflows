# Inline Board — Fallback Deliberation

Use this when `/cs:boardroom` can't run — the c-level plugin isn't installed, `company-context.md`
isn't populated, or the decision is type-2 and doesn't warrant the full protocol. It reproduces the
parts of the boardroom protocol that actually create the value, self-contained. Always tell the user
you used the fallback and why.

The one rule that matters most is **Phase 2 isolation**: form each perspective independently before
any of them see the others. Anchoring is what sycophancy looks like inside a single model — writing
the positions separately is what surfaces real dissent.

## Procedure

1. **Convene the right voices only.** From the frame's "affected roles" (see `decision-frame.md`),
   pick the 3–5 C-roles whose domain the decision actually touches. Don't run all ten.

2. **Phase 2 — independent positions (isolation).** For each role, *before considering any other
   role*, write:
   - recommended option (from the options list),
   - top 3 concerns,
   - top 3 supports.
   Write them one role at a time without back-referencing. This is the anti-groupthink step; do
   not shortcut it into a single blended paragraph.

3. **Phase 3 — cross-examination.** Now reveal all positions together. Each role critiques the
   others on the dimension it owns:
   - CFO critiques the math and the runway impact.
   - CRO critiques the revenue / pipeline assumptions.
   - CMO critiques positioning / ICP / message.
   - CPO critiques the product / JTBD logic.
   - COO critiques delivery feasibility / capacity.
   - CHRO critiques the people / org implications.
   - CISO / CAIO / GC critique risk, AI-class, and legal surface as relevant.

4. **Phase 4 — devil's advocate.** Against the leading option, surface the three strongest
   objections with severity (CRITICAL / HIGH / MEDIUM) and a mitigation for each. Argue the
   leading option is wrong as hard as you can; weak devil's-advocacy is the most common way a
   memo becomes a rubber stamp.

5. **Phase 5 — synthesis.** State which option holds up, the unresolved dissents, and carry them
   into the memo: leading concerns → section 8 (Risks), devil's-advocate items → sections 8/9,
   and the single strongest unresolved objection → section 10 (Dissent, verbatim).

## Output

A short synthesis block that feeds straight into the Decision Memo:
- recommended option + one-paragraph why,
- vote-style summary (role → option → one-line reason),
- preserved dissent (verbatim),
- devil's-advocate concerns with severity + mitigations.

## When to upgrade to the real board

If a type-2 decision turns out, during this pass, to be type-1 (e.g. the cost-to-reverse is larger
than first thought, or it commits the company publicly), stop and route to `/cs:boardroom` instead —
and offer a freeze. Re-classification mid-analysis is a feature, not a failure.

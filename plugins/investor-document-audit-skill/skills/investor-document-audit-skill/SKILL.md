---
name: investor-document-audit-skill
description: Use when reviewing any investor document, email, pitch deck, or memo. Audits against Pyramid Principle structure and Series A investor criteria, and — for Novagentica-authored materials — against the Novagentica brand system. Not for internal documents or creative writing.
license: LicenseRef-Proprietary-Novagentica
---

# Investor Document Audit

## Check 1: Governing Thought
- Is there one sentence that answers what the investor is asking?
- Is it in the first paragraph or slide?
- If not: write the governing thought and identify where it should go.

## Check 2: Support Structure
- Does every section directly prove the governing thought?
- Are there sections that exist for context rather than argument?
- Flag every section that does not prove the governing thought.

## Check 3: Headline Quality
- Are headlines assertions or labels?
- Rewrite every label headline as an assertion.

## Check 4: Logic Gaps
- Where would an investor ask "so what?"
- At every transition, is it clear why we are moving from this point to the next?
- Flag every logic gap and supply the missing argument.

## Check 5: Series A Investor Score
Rate each of the following 1 to 5:
- Clarity of governing thought
- Quality of market argument
- Strength of traction evidence
- Team differentiation
- Logical flow from claim to evidence
- Specificity of the ask
- Economy of language (no wasted words)
- Assertion density (headlines as assertions)
- Evidence quality (specific vs. vague)
- Reader friction (how hard the investor has to work)
- Competitive differentiation clarity
- Overall persuasiveness

Total score out of 60.
Verdict: publish-ready (50+) / needs one pass (35-49) / needs restructure (under 35)

## Check 6: Brand adherence (Novagentica documents only)
Apply this check **only when the document is a Novagentica-authored artefact** (deck, memo,
proposal, order form). Skip it for third-party documents you are auditing on their behalf.
The brand is fixed — canonical source: the **Novagentica Design System** (`styles.css` +
`tokens/` + `guidelines/brand.md`); the skill-ready digest is `assets/brand.md`. Read it if
present. Flag any of the following as a defect:

- **Colour.** Cream `#FAFBF6` is the only background. Ink `#0E0E0C` for primary text (NOT a
  lighter near-black like `#1A1A1A` or `#000`). Crimson `#CC0D2C` is an accent only — never a
  large fill. Warm greys (`#5C5C58`, `#8A8A86`, `#D9D9D2`); never blue-grey. No gradients,
  photography-as-background, textures, or illustration.
- **Type.** Inter for structure (headlines, ALL-CAPS tracked eyebrows, labels, data); Gelasio
  for prose, section titles, and crimson italic subheads. No third display face.
- **Wordmark.** `novagentica`, lowercase, two-tone — `nova` in ink, `gentica` in crimson;
  present and correct (bottom-left on slides; masthead + footer on documents).
- **Voice.** Declarative fragments ending in periods; two-beat headlines (statement + quieter
  second line); antithesis/parallelism ("Not the agent. The governance."); "we / your"; no
  hype words, no exclamation marks, no emoji; numbers are concrete claims tied to outcomes;
  `™` on module names (Architect™, Control™, CDAP™).

Report brand defects in the same flag-and-fix form as the other checks: name the element,
the wrong value, and the correct token. Brand adherence does **not** enter the /60 score —
report it as a separate PASS / DEFECTS list.

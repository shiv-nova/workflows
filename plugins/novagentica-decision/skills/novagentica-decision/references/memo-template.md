# Decision Memo Template

Two formats. **Match the artefact's weight to the decision's reversibility:**
- **Decision Note** (below) — one screen, for low-stakes **type-2** calls. The default for reversible
  experiments. Render DOCX only if it will be circulated.
- **Full Decision Memo** (further down) — ~2 pages, for **type-1** and high-stakes type-2 calls.

Both keep the same forcing functions; the note just compresses them. A memo that needs scrolling
has usually failed to decide. Every section is required; "none" is an acceptable value, omission is not.

---

## A. Decision Note (type-2, low-stakes)

```markdown
# Decision Note: <decision in one sentence>
**Owner:** <name>   **Date:** YYYY-MM-DD   **Reversibility:** Type-2 — undo cost: <low/…>
**Review:** YYYY-MM-DD

**Decision & recommendation:** <the call, one or two sentences, tied to one grounded number.>
**Options (incl. null):** A <…> · B <…> · Null = do nothing <its cost>.
**Key assumption (falsifiable):** <the one thing that must be true — testable.>
**Kill criterion:** IF <observable> THEN <reverse/stop> by <date>.
**Dissent:** <strongest objection, verbatim — or "none raised">.
```

That is the whole artefact for a reversible call. If filling it reveals the decision is actually
type-1 (undo cost is high), stop and switch to the full memo + `/cs:boardroom`.

---

## B. Full Decision Memo (type-1, high-stakes)

---

```markdown
# Decision Memo: <decision in one sentence>

**Status:** DRAFT | AWAITING OWNER DECISION | APPROVED | REJECTED
**Owner:** <name>      **Date:** YYYY-MM-DD      **Decide by:** YYYY-MM-DD
**Reversibility:** Type-1 (irreversible) | Type-2 (reversible) — cost-to-reverse: <money/time/trust>
**Depends on / relates to:** <prior or interdependent decisions, or "none"> 
**Deliberation:** /cs:boardroom <date> | inline fallback (<why>)

## 1. The decision
<One sentence, phrased as a choice. The same sentence as the title — restated so the memo
stands alone.>

## 2. Why now
<The forcing event and the deadline. Why this can't wait, or why it shouldn't be rushed.>

## 3. Context & numbers (grounded)
<The 3–6 figures this decision turns on, each with source + as-of date. Unknowns marked as
assumptions, not zeros.>
- <metric>: <value> (<source>, <as-of>)
- ...

## 4. Options considered
<2–4 genuine, mutually exclusive options. The null option is always listed.>

| Option | What it means | Cost / impact (vs the numbers above) |
|---|---|---|
| **A — <name>** | <one line> | <one line tied to a real figure> |
| **B — <name>** | <one line> | <one line> |
| **Null — do nothing / keep current** | <one line> | <the real cost of inaction> |

## 5. Recommendation
**<Option X>.** <2–4 sentences: why this option, tied explicitly to the numbers and to success
criteria. One clear call — not a menu.>

## 6. Success criteria (binding)
<The observable outcome, threshold, and date that means this was right.>
- <metric, threshold, by when>

## 7. Key assumptions (falsifiable)
<The things that must be true for the recommendation to hold. Written as testable statements.>
- <"X will be true by Y" — checkable, not a hope>
- ...

## 8. Risks & mitigations
| Risk | Severity | Mitigation |
|---|---|---|
| <risk> | CRITICAL / HIGH / MEDIUM | <plan> |

## 9. Kill criteria / tripwires (binding)
<Observable conditions, set in advance, under which this decision is reversed or revisited.
These let the decision be shown to be wrong.>
- IF <observable condition> THEN <reverse / revisit / escalate> by <date>.

## 10. Dissent (verbatim)
<The strongest objection raised, in the dissenter's own words, never summarised. Or "None raised"
stated explicitly — silence is recorded, not assumed.>
- **<role/name>:** "<verbatim objection>"

## 11. Decision
**Chose:** <option>   |   **Rejected:** <others + one-line why each>
**Decided by:** <owner>   **On:** YYYY-MM-DD
**Review checkpoint:** YYYY-MM-DD (90d default; sooner for type-2 experiments)
**Freeze:** <none | frozen N days via /cs:freeze — for type-1>

---
*novagentica*
```

---

## Notes for whoever fills this in

- Sections 4 (null option), 7 (falsifiable assumptions), 9 (kill-criteria), and 10 (verbatim
  dissent) are the forcing functions. If any is empty or hand-waved, the memo is not done.
- Keep prose tight and in Georgia for the rendered DOCX; labels and tables in Inter.
- The `.md` copy feeds `/cs:decide` directly — its sections 6, 9, 10, 11 map onto the decision
  record's Success criteria, Kill criteria, Preserved dissent, and Decision fields.
- If grounding turned up an unknown that the recommendation depends on, that unknown belongs in
  section 7 as an assumption AND in section 9 as a tripwire ("IF assumption proves false THEN…").

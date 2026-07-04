---
name: novagentica-decision
description: >
  Use whenever Shiv or a Novagentica leader needs to make an INTERNAL strategic decision —
  pricing, hiring, capital allocation, build-vs-buy, go-to-market, partnership, or any
  "should we do X" call about Novagentica itself. ALWAYS trigger on "should we", "decision",
  "decide whether", "make the call on", "I'm torn between", "go/no-go", "pricing decision",
  "hiring decision", "decision memo", or any internal strategic fork. Frames the decision,
  calibrates rigour by reversibility (type-1 vs type-2), grounds it in Novagentica's real
  numbers (master model, licence pricing, pipeline), deliberates via /cs:boardroom (inline
  fallback only when context isn't populated), and produces a branded Decision Memo (DOCX + MD);
  then routes to /cs:decide, runs /cs:cross-eval and offers /cs:freeze for irreversible calls. Do NOT
  use for client pre-sales (novagentica-presales-solution-design), commercial artefacts
  (novagentica-engagement-pack), or the order form (novagentica-order-form).
license: Proprietary — Novagentica AG, 2026
---

> **Output surface (decision 2026-07-04): Google only.** The Decision Memo is produced as a **Google Doc** (duplicate the master via `BuildBrandedDoc.gs → buildMasterDoc`) plus the MD version. DOCX output is the rollback path (`File → Download`).

# Novagentica Decision

Turns an internal strategic question into a recorded, defensible decision: framed → grounded
in real numbers → deliberated by a multi-role board → written up as a branded Decision Memo →
logged to durable memory. Built around forcing functions that stop a decision memo from
becoming a rubber stamp.

## Why this skill exists

`/cs:boardroom` runs an excellent multi-role deliberation, but it (a) assumes a brief already
exists, (b) treats every decision with the same heavy ceremony, and (c) reads a generic
`company-context.md` rather than Novagentica's actual financials. Most bad strategic decisions
are not bad deliberations — they are well-deliberated answers to a badly-framed question, or
heavy process spent on a cheaply-reversible call, or confident memos built on numbers nobody
checked. This skill fixes the front and back of that pipeline and reuses boardroom for the middle.

The single most important idea: **calibrate rigour to reversibility.** A type-2 (easily reversed)
decision gets a fast inline pass; a type-1 (irreversible or expensive-to-reverse) decision gets
the full board plus a freeze. Spending a six-phase board meeting on a reversible call is waste;
shipping a one-line gut call on an irreversible one is negligence.

## When to use / not use

Use for **internal** Novagentica strategic decisions: pricing changes, a hire or a role, capital
allocation, build-vs-buy, GTM motion, partnership/channel, raising or not raising, spend commitments.

Do not use for:
- Client-facing pre-sales / RFP / "what can we do for [customer]" → `novagentica-presales-solution-design`.
- Commercial artefact suite from a transcript → `novagentica-engagement-pack`.
- Licence offer / Order Form → `novagentica-order-form`. (NDAs/DPAs: handled by legal, not a skill.)
- Slides only → `novagentica-presentation`.

## The pipeline

1. **Frame & calibrate.** Produce the one-screen decision frame (see `references/decision-frame.md`):
   the decision in a single sentence, the owner, the deadline, the definition of success, the
   **null/do-nothing option**, and the **reversibility class** (type-1 vs type-2) with cost-to-reverse.
   Show the frame inline and get the user to confirm it before going further — most of the value is here.
   The reversibility class sets the path:
   - **Type-2 (reversible, cheap to undo):** lightweight path. Skip the full board; run the inline
     multi-perspective pass, write a short memo, suggest a review date. Do not over-ceremony it.
   - **Type-1 (irreversible / expensive / hard to undo):** full path. Ground → full board → memo →
     log → offer freeze.

2. **Ground in real numbers.** Pull the Novagentica facts the decision actually turns on, and put
   them *into the brief the board will read* — do not rely on `company-context.md` alone. State each
   grounding number with its **source + as-of date**; if a load-bearing number is unknown, say so and
   mark it an assumption — never invent it. Canonical sources (detail + paths in
   `references/decision-frame.md`):
   - **Master financial model** (`Novagentica_Financial_Model.xlsx`) — runway, burn/EBITDA, FTE &
     headcount plan, comp by role, capacity ratio, ARR, CAC/payback.
   - **Pipeline** (`Novagentica-Sales-Pipeline-...`, Notion CRM) — deal count, gross/weighted, stage mix.
   - **Licence pricing** — Domain / Enterprise / Global, 3-yr term. **Resolve the CHF-vs-US$ ambiguity
     before any decision that books spend or quotes a price.**
   - **Decisions log** (`Novagentica/decisions/`, `/cs:decide` memory) — prior + interdependent calls.

   **Related-decisions check (do this every run):** scan the decisions log for calls this one depends on
   or contradicts. If decision A's recommendation rests on decision B (e.g. "defer the AE *because* the
   SDR covers top-of-funnel"), name that dependency explicitly in §2 of the memo. Decisions made in
   isolation that silently rely on each other are how a coherent-looking set of memos becomes an
   incoherent strategy.

3. **Frame the options.** Enumerate 2–4 genuine, mutually exclusive options. The **null option
   ("do nothing / keep current") is mandatory and always listed**, with its own cost. Each option
   gets a one-line impact against the grounded numbers.

4. **Deliberate.** The `c-level-agents` plugin is installed — its commands are real, use them.
   - **Primary path (type-1, or type-2 by request):** write the frame + options + grounded numbers
     to a brief and invoke **`/cs:boardroom`** on it. Use its Phase 2 isolation, cross-examination,
     and devil's-advocate pass. Scope to the affected C-roles.
   - **Fallback path (only when `company-context.md` isn't populated, or a low-stakes type-2):**
     run the inline multi-perspective pass in `references/inline-board.md` — same spirit (independent
     positions first, then cross-exam, then a devil's-advocate challenge), self-contained. Tell the
     user you used the fallback and why. Do NOT use the fallback as a default just to save time on a
     type-1 decision — that defeats the point of the calibration.

5. **Synthesise → Decision Memo.** Build the memo per `references/memo-template.md`. Defer DOCX
   rendering to the `docx` skill in Novagentica brand (see Brand below); also keep a `.md` copy.
   The memo is the deliverable — its forcing functions are non-negotiable (see below).
   - **Low-stakes type-2:** use the one-screen **Decision Note** format (top of `references/memo-template.md`)
     instead of the full memo. It keeps the forcing functions (null option, falsifiable assumption,
     kill-criterion, dissent) but in a single screen — match the artefact's weight to the decision's.
     Render DOCX only if the note will be circulated; otherwise the `.md` is enough.

6. **Log & freeze.** Route the approved memo to **`/cs:decide`** (durable record + preserved
   dissent). For type-1 decisions, run a genuine **second-model cross-eval** on the memo *before* the
   owner commits — a single-model board can be confidently wrong in either a consensus or a contrarian
   direction. Choose the path that works in the current environment (full detail in
   `references/cross-eval-gemini.md`):
   - **Sandbox-native (preferred when a Gemini key is available):** run
     `GEMINI_API_KEY=<key> python3 scripts/gemini_review.py <memo>` for a real independent review with
     no CLI, then reconcile it with three Claude adversarial passes into a two-model verdict. The key is
     supplied inline at call time and **never** echoed, hardcoded, persisted to memory, or saved to the
     workspace; remind the user to rotate any key pasted into chat.
   - **CLI / fallback:** `/cs:cross-eval` (uses codex/gemini CLIs if present; otherwise Claude-only
     adversarial mode, clearly labelled as the weaker single-model run).

   Then offer **`/cs:freeze <days>`** to prevent impulse reversal during the cooldown. Always also save
   the memo (`.md` + `.docx`) and the cross-eval to the local `decisions/` folder, so there is a durable
   copy independent of the plugin's memory.

## Forcing functions (non-negotiable — these are the point of the skill)

A decision memo reads as authoritative whether or not its reasoning is sound. These checks are
what keep it honest; do not skip them to save time:

- **Null option always present.** "Do nothing" is a real option with a real cost. If it's not in
  the options list, the analysis is incomplete.
- **Assumptions stated as falsifiable.** Every recommendation rests on things that must be true.
  Write them as testable statements ("Pipeline converts ≥ X by Q3"), not vague hopes. If an
  assumption can't be falsified, it's not an assumption — it's a wish.
- **Kill-criteria / tripwires are binding.** State in advance the observable conditions under which
  this decision is reversed or revisited. A decision with no kill-criteria can never be shown to be wrong.
- **Dissent preserved verbatim.** Record the strongest objection in the dissenter's own words, never
  summarised away. When kill-criteria trigger, the dissent is usually where the truth was.
- **Numbers carry their source.** Every figure in the memo cites where it came from and as-of when.
  Unknown ≠ zero; mark unknowns as assumptions.
- **One clear recommendation.** The memo ends on a single recommended option and the owner's call —
  not a menu. Hedging is not analysis.

## Brand (fixed — never an input)

Cream `#FAFBF6` background, crimson `#CC0D2C` accent, ink `#0E0E0C`, muted `#8A8A86`, hairline
`#D9D9D2`. Inter for structure/labels, Gelasio for prose/emphasis. `novagentica` wordmark
(`nova` ink + `gentica` crimson). DOCX: crimson H1, table header rows crimson on white, wordmark
footer. These come from `novagentica-presentation`; do not invent a new look.

## Output

- `...-DecisionMemo-v1.0.docx` — branded, the artefact to circulate.
- `...-DecisionMemo-v1.0.md` — plain copy for the decision log / `/cs:decide`.
Output to the working folder, then copy finals to `/Users/shivtailor/Documents/Claude/Projects/Novagentica/`.

## QA checklist (before delivering)

- [ ] Decision stated in one sentence; reversibility class and cost-to-reverse explicit.
- [ ] Null/do-nothing option is present in the options list with its own cost.
- [ ] Every number cites a source and an as-of date; no invented figures.
- [ ] Assumptions are falsifiable statements, not hopes.
- [ ] Kill-criteria / tripwires are observable and binding.
- [ ] Dissent recorded verbatim (or "none raised" stated explicitly).
- [ ] Exactly one recommended option; owner, decided date, and review date present.
- [ ] Rigour matched reversibility (type-2 not over-processed; type-1 got the full board + freeze offer).
- [ ] Brand tokens correct; wordmark present.
- [ ] Routed to /cs:decide (or local decisions/ fallback) and freeze offered for type-1.

## Routing

- `/cs:boardroom` — multi-role deliberation (primary deliberation engine).
- `/cs:decide` — log the approved memo to durable memory.
- `scripts/gemini_review.py` — sandbox-native second-model cross-eval for type-1 (no CLI needed).
- `/cs:cross-eval` — CLI/fallback cross-eval (codex/gemini if present, else Claude-only).
- `/cs:freeze <days>` — cooldown lock for type-1 decisions.
- `/cs:post-mortem` — auto-scheduled review at the checkpoint date.
- `docx` skill — DOCX rendering in brand.

## Related

- `references/decision-frame.md` — framing template + reversibility calibration + grounding sources.
- `references/memo-template.md` — the Decision Memo (full) + Decision Note (type-2) formats.
- `references/inline-board.md` — the self-contained fallback deliberation.
- `references/cross-eval-gemini.md` — sandbox-native Gemini cross-eval path + key handling.
- `scripts/gemini_review.py` — the cross-eval reviewer script.

---

**Version:** 1.0.0


---

> **Canonical brand source:** the Novagentica Design System project (`styles.css` + `tokens/` + `guidelines/`). The vendored `assets/brand.md` in this skill is the skill-ready digest of it. Keep them in sync; do not invent a new look.

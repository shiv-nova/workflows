---
name: novagentica-presales-solution-design
description: Use this skill whenever Martin (founder of Novagentica) wants to turn a customer request, RFP, pain point, or opportunity into a worked solution — strawman use cases, a solution proposal, a project plan, and a customer-specific implementation plan. ALWAYS trigger on "use case", "strawman", "customer request", "RFP", "RFI", "solution design", "presales", "pre-sales", "what can we do for [customer]", "scope this opportunity", "project plan", "implementation plan", "rollout plan", "discovery", "how would we deliver this", "build a solution for", or any request that starts from a customer's need and should end in a Novagentica engagement. This skill runs the discovery → research → use cases → proposal → project plan → implementation plan pipeline. It does NOT replace the order-form skill (the licence offer / commercial document) or the presentation skill (decks) — it hands off to them. Defer to novagentica-order-form if the user only wants the commercial document, and to novagentica-presentation if they only want slides. (NDAs and DPAs are handled by legal, not by a skill.)
license: Proprietary — Novagentica AG, 2026
---

# Novagentica Pre-Sales Solution Design

> **Front-door router — read first.** `novagentica-presales-solution-design` and `novagentica-engagement-pack` are the two front doors and **must never both run on the same deal**. Decide by one question: *is the use-case slate already agreed?*
> - **No / starting cold** (raw signal, no agreed use cases, customer hasn't seen a strawman) → use **presales-solution-design**: discovery → research → strawman → checkpoint → proposal.
> - **Yes / thinking done** (you have a transcript + a Use-Case-Fit deck, slate is settled) → use **engagement-pack**: straight to the branded artefact suite.

Turns a raw customer signal into a sequenced, sellable, deliverable solution. This is the **pre-sales solution-engineering brain**: it takes whatever the customer gave us, researches the space, proposes use cases worth doing, then produces the proposal, the project plan, and the implementation plan that get the deal built.

This skill is a **workflow orchestrator**, not a product encyclopedia. All product facts, the platform philosophy, the runtime list, the value drivers, and the customer-facing voice rules live in the `novagentica-architect-control-authority` skill. **Read that skill first, every time** (its `SKILL.md`, then whichever reference file the task needs). This skill never restates product facts that could drift — it points to them.

---

## When to use / when not to use

Use this when the starting point is a **customer need** and the desired end is a **worked solution**: use cases, proposal, plans.

Hand off instead when the request is narrower:
- Only the licence offer / commercial document → `novagentica-order-form`. (NDAs/DPAs: handled by legal, not a skill.)
- Only a deck / slides / keynote → `novagentica-presentation`.
- Only an investor / fundraising doc → `novagentica-investor`.

This skill *calls* those three at the right moments (see Stage 4–6). It owns the thinking; they own the polished artifact.

---

## Grounding (do this before Stage 1)

1. Read `novagentica-architect-control-authority/SKILL.md`. Internalise: the three planes (Architect = design, Authority = govern, Control = operate), the **NO PASSPORT = NO EXECUTION** founding principle, the canonical data model (Tenant → Engagement → Domain → Outcomes/Functions/Teams/Agents), the **9 runtimes** (LangGraph, n8n, Microsoft Copilot Studio, Salesforce Agentforce, CrewAI, AutoGen, Haystack, SAP Joule, BYO SDK), and the **no-pilots / MVP1 → MVPx** engagement model.
2. Inherit its **Authoring rules** (its §10). The ones that bite most often: never write "Supabase" (say *Lovable Cloud* or *the platform*); always include *Salesforce Agentforce* in any runtime list; CDAP = *Continuous Dynamic Agent Prompting*; EU AI Act outputs are Articles **43 and 47**; revocation is *next-call enforcement*; the Decision Contract always wins over the playbook. In customer-facing prose, prefer **control, enforcement, trust engineering, certification, authority, boundaries, evidence** over the word "governance" wherever it would read as bureaucracy.
3. **Never propose a pilot.** The engagement model is MVP1 (production from day one) then incremental MVPx. "Pilot phase" is an explicit anti-pattern.

---

## The pipeline

Six stages, run in order. **Stage 3 is a hard checkpoint** — stop and get Martin's sign-off before spending effort on the proposal and plans.

### Stage 1 — Intake & Discovery

Goal: convert the customer signal into a tight **Discovery Brief**.

- If the customer request is an uploaded file (RFP, email export, notes) whose content isn't already in context, read it via the `file-reading` skill first.
- Extract: customer legal entity · industry · division/function · **systems environment** (named ERP/CRM/ITSM/etc. — e.g. SAP S/4HANA, ServiceNow, Salesforce) · any existing agent/runtime footprint · stated pains · desired outcomes & KPIs · constraints (compliance, data residency, EU AI Act risk class, security) · buying context (who's the buyer, timeline, budget signals).
- If any of {customer, industry, systems environment, desired outcomes, constraints} is **material and missing**, ask before continuing — use `ask_user_input_v0` (tappable options beat free text on mobile). Don't guess on these five.

Output: a short Discovery Brief, inline. No file yet.

### Stage 2 — Best-practice research

Goal: ground the use cases in what the market and the customer's own stack actually do.

- Use `web_search`. Run ~5–10 searches across these angles: `[industry] agentic AI use cases`; `[customer] digital / AI strategy`; `[named system] agent automation` (e.g. "SAP S/4HANA agent automation"); `[regulation] [industry]` (e.g. "EU AI Act high-risk [industry]"); peer/competitor moves.
- Filter every finding through the Novagentica lens: which of these are **high-stakes, multi-system, regulated, auditable** workflows? Those are the sweet spot — they're the ones where an enforcement layer (NO PASSPORT = NO EXECUTION) is the reason to buy, not a nice-to-have.
- Cite sources for anything specific. Keep it brief — this feeds the use cases, it isn't a report.

Output: a handful of research notes, inline.

### Stage 3 — Strawman use cases  ⛔ CHECKPOINT

Goal: 5–8 candidate use cases, scored, with a recommended MVP1 shortlist — for Martin to react to.

- Read `references/use-case-canvas.md`. Write each candidate on that canvas, on the canonical taxonomy **Domain → Outcome (KPI) → Agent(s)**.
- Score each on Value · Feasibility · Blast radius · **Differentiation fit** (does enforcement/trust actually matter here?). Recommend 2–3 for MVP1, lowest blast radius first.
- "Strawman" means provocative drafts meant to be torn apart — say so, and make them concrete enough to argue with.
- **Present the shortlist inline as markdown** for fast review. Then **stop** and ask Martin (via `ask_user_input_v0`) which to take forward / cut / merge. Do not start the proposal until he answers.
- If he wants to send the strawman to the customer, offer to render it as a branded PDF (see Output routing).

### Stage 4 — Proposal  (only after the checkpoint)

Goal: a proposal that frames the approved use cases as a Novagentica engagement.

- Read `references/deliverables.md` (Proposal section). Build the narrative on the platform value drivers (from the knowledge skill §9.3) and the differentiation hooks from the chosen use cases.
- **Decide the delivery model** (see below) — it changes scope, price, and plan.
- Route the artifacts (mix of both — see Output routing): the proposal narrative → branded PDF here; the **commercial order form** → `novagentica-order-form` (pick the tier: Domain / Enterprise / Global); the **pitch deck**, if wanted → `novagentica-presentation`.

### Stage 5 — Project plan  ⟶ HANDOFF to `novagentica-delivery`

Goal: produce the Gantt, SoW, and RACI for the approved engagement.

**Do not build a project plan here.** This stage is owned by the `novagentica-delivery` skill. Your job is to package the approved context and pass it cleanly so the delivery skill can skip its intake interview entirely.

**Build the context package from the approved Stage 3–4 outputs:**

```
NOVAGENTICA DELIVERY CONTEXT — passed from presales skill, skip intake interview

Client name:              [from Stage 1 Discovery Brief]
Engagement type:          [Ingestion / Build / Hybrid — from Stage 4 delivery model decision]
Delivery model:           [Novagentica-built / Co-build / Customer-built]
Agent count:              [from Stage 3 use case shortlist]
Ingestion method:         [bulk API / gap analysis — include mins/agent if gap analysis]
Source platform:          [from Stage 1 systems environment]
Integrations:             [named systems + modules from Stage 1 — e.g. SAP FICO, Salesforce]
Wave count:               [proposed in Stage 3 or leave blank for delivery skill to calculate]
Target go-live:           [from Stage 4 proposal timeline]
Novagentica Lead (DRI):   [if known]
Artefacts needed:         SoW, Gantt, RACI [add Governance Pack if >4 weeks engagement]
Output format:            DOCX and PPTX
```

Invoke `novagentica-delivery` with this package. The delivery skill will confirm sizing, then generate the artefacts.

**What stays in this skill (do not delegate to delivery):**
- The three-planes workstream narrative (Architect / Authority / Control) — this is Novagentica-specific delivery context that belongs in the proposal, not the SoW
- AQVP certification gates — these are platform-specific milestones; include them in the proposal narrative
- Professional-services days costing (CHF 2,500/day) — this feeds into the commercial order form handled by `novagentica-order-form`

Output: the context package above (inline), then the `novagentica-delivery` skill takes over and produces the DOCX/PPTX artefacts.

### Stage 6 — Implementation plan

Goal: how it actually lands in *this customer's* systems.

- Read `references/deliverables.md` (Implementation Plan section). Produce the systems-mapping table: each agent → target runtime (one of the 9, or BYO SDK) → target systems (SAP/ServiceNow/Salesforce/…) → data readiness (sources, quality, credential vault) → execution-gateway integration → SAA + passport/signing → telemetry to the Flight Recorder → EU AI Act docs (Art. 43/47).
- If the customer already runs agents, include a **Reverse Engineer** step to import their existing manifests and reconstruct charters.
- Sequence by **blast radius** (lowest first). Include the security tasks explicitly: credentials live in the vault, **never in Architect**; Architect is never in the execution path.

Output: editable working DOCX (use the `docx` skill).

---

## The delivery-model fork (set this in Stage 4, carry it through 5–6)

Every engagement is one of three models. State which one, and let it drive the plan, the RACI, and the services days:

1. **Novagentica-built** — we design, certify, and deploy the agents for the customer. Most services days. Fastest to value.
2. **Co-build** — we and the customer's team build together on the platform (the Agentic Atelier workshop format fits here). Medium services days. Best for capability transfer.
3. **Customer-built, Novagentica-supported** — the customer builds on the platform; we supply the platform, certification, and support. Fewest services days. Best for self-sufficient teams.

If Martin hasn't said which, ask at the start of Stage 4.

---

## Output routing (the "mix of both" model)

This skill produces some artifacts itself and hands the rest to sibling skills:

| Artifact | Owned by | Format |
|---|---|---|
| Discovery Brief, research notes | this skill | inline |
| Strawman use case shortlist | this skill | inline markdown (→ branded PDF on request) |
| Solution proposal narrative | this skill | branded PDF |
| Three-planes workstream narrative | this skill | inline / proposal section |
| AQVP certification gates | this skill | inline / proposal section |
| Professional-services days sizing | this skill → `novagentica-order-form` | inline costing |
| Project plan (Gantt + SoW + RACI) | → `novagentica-delivery` | DOCX + PPTX |
| Implementation plan | this skill | DOCX (editable) |
| Commercial order form | → `novagentica-order-form` | DOCX |
| Pitch deck | → `novagentica-presentation` | PPTX |

**Handoff sequence:** this skill → `novagentica-delivery` (Stage 5) → `novagentica-order-form` (Stage 4 commercial) → `novagentica-presentation` (if deck needed).

For branded PDFs and the brand tokens (cream `#FAFBF6`, crimson `#CC0D2C`, Inter+Gelasio, novagentica wordmark), follow the same approach the contracts/presentation skills use — don't invent a new look.

---

## Reference index

| File | Read when |
|---|---|
| `references/use-case-canvas.md` | Stage 3 — the strawman canvas, the scoring rubric, the differentiation-fit test, a worked example. |
| `references/deliverables.md` | Stages 4–6 — proposal structure, project-plan structure (MVP1→MVPx, RACI, milestones), implementation-plan structure (systems mapping, runtime mapping, data readiness, security, EU AI Act), and the exact handoffs to the contracts and presentation skills. |

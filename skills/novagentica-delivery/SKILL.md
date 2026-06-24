---
name: novagentica-delivery
description: >
  Use this skill whenever Shiv or a Novagentica sales team member needs to produce client-facing delivery artefacts: Gantt charts, deployment timelines, Statements of Work (SoW), RACI matrices, or governance documents for Novagentica platform engagements. ALWAYS trigger when the user mentions "timeline", "Gantt", "SoW", "statement of work", "deployment plan", "governance", "RACI", "delivery document", "engagement scope", "agent ingestion", "agent build", or "client artefact" in a Novagentica context. Also trigger when the user says things like "scope this engagement", "how long will this take", "draft the SoW", or "what does the delivery look like". This skill handles both agent ingestion engagements (fast, hours-to-days) and agent build-from-scratch engagements (weeks), producing either .docx or .pptx outputs in Novagentica brand.
license: Proprietary — Novagentica AG, 2026
---

# Novagentica Delivery Artefacts Skill

Produce client-ready delivery artefacts for Novagentica platform engagements. Outputs include Gantt/timeline tables, Statements of Work, RACI matrices, and governance documents — in either `.docx` (Word) or `.pptx` (Novagentica-branded slides) format, or both.

---

## Invocation modes

This skill operates in two modes. Detect which applies before proceeding.

### Mode A — Direct invocation (default)
Triggered directly by Shiv, sales, or Zapier without prior presales context. Run the full intake interview in Step 1.

### Mode B — Called from `novagentica-presales-solution-design`
Triggered when the presales skill passes a structured context package at its Stage 5 handoff. The package is identifiable by the header line: `NOVAGENTICA DELIVERY CONTEXT — passed from presales skill, skip intake interview`.

**In Mode B: skip the intake interview entirely.** Parse the context package directly into the sizing model. Confirm sizing with the user in one line — *"Based on the presales handoff, I'm sizing this as a [X-week] engagement across [N] waves. Confirm to generate artefacts?"* — then proceed to Step 3 on approval.

**Context package field mapping:**

| Context package field | Maps to intake question |
|---|---|
| Client name | Q1 |
| Engagement type | Q2 |
| Agent count | Q3 |
| Ingestion method + mins/agent | Q4 |
| Integrations | Q5 |
| Target go-live | Q6 |
| Output format | Q7 (default: DOCX + PPTX if not specified) |
| Artefacts needed | Q8 |

If any field is missing from the context package, ask only for the missing fields — do not re-run the full interview.

---



**Always ask these questions first.** Do not produce any artefact until you have answers to all of them. Present them as a short numbered list to the user.

1. **Client name / project codename** — Required for all document headers and file names. **Do not generate any document without this. If not provided, ask before proceeding.**
2. **Engagement type** — Ingestion, Build from Scratch, or Hybrid (some agents ingested, some built)?
3. **Number of agents** — How many agents are being ingested and/or built?
4. **Ingestion method** (if ingestion or hybrid) — Is this bulk/automated (batch API import) or does each agent require individual configuration/gap analysis? If gap analysis: how long per agent?
5. **Integrations / data sources** — Are there existing systems (CRM, ERP, data lakes, APIs) that need wiring? If yes: which systems and which modules?
6. **Target go-live date** — Or confirm the timeline the skill proposes.
7. **Output format(s)** — Word doc (.docx), PowerPoint (.pptx), or both?
8. **Artefacts needed** — Gantt timeline, SoW, RACI, Governance pack, or all?

Once you have these answers, proceed to Step 2.

---

## Step 2 — Engagement Sizing

Use the intake answers to classify the engagement before generating any document.

### Engagement Type Profiles

| Type | Typical Duration | Key Phases |
|---|---|---|
| **Ingestion — small (1–10 agents, no gap analysis)** | 0.5–3 days | Platform Access → Agent Config → Testing → Sign-off |
| **Ingestion — small (1–10 agents, with gap analysis)** | 1–5 days | Platform Access → Gap Analysis → Config → Testing → Sign-off |
| **Ingestion — bulk (11–500+ agents, with gap analysis)** | Wave-based — see bulk sizing below | SAP/Integration Setup → Wave 1–N (Gap Analysis → Config → Test → Sign-off) → Final Acceptance |
| **Build (single agent)** | 2–4 weeks | Discovery → Design → Build → UAT → Go-Live → Hypercare |
| **Build (2–5 agents)** | 4–8 weeks | Discovery → Design → Build (parallel) → Integration → UAT → Go-Live → Hypercare |
| **Build (5+ agents)** | 8–16 weeks | As above, with formal wave planning |
| **Hybrid** | Combine tracks: ingestion waves run in parallel to build track |

### Bulk Ingestion Wave Sizing (11+ agents with gap analysis)

Use this model whenever agent count exceeds 10 and each agent requires individual gap analysis or configuration review.

**Wave sizing:**
- Default wave size: 100 agents per wave
- Gap analysis per agent: use the time provided in intake (default 10 minutes if not specified)
- Gap analysis per wave: (agents × minutes) ÷ 480 = working days, rounded up
- Configuration & ingestion per wave: 1 day (assume some parallelism)
- Testing per wave: 0.5 day
- Sign-off per wave: 0.5 day
- **Total per wave: gap analysis days + 2 days**

**Example: 500 agents, 10 min each → 5 waves × ~5 days = 5 weeks of wave delivery**

**Integration setup (if applicable):** Run before Wave 1 — add 1 week for API integrations.

**Non-viable agent contingency:** Always include this assumption in the SoW — if >10% of agents in Wave 1 are non-viable, re-plan before proceeding to Wave 2.

**Wave structure recommendation:**
- Up to 200 agents: 2 waves
- 201–500 agents: 5 waves of 100
- 500+ agents: discuss with user — may warrant a separate programme structure

### Integration Complexity Uplift

Apply these additions if integrations are present:

- Simple API connection (documented, accessible): +1 week setup before Wave 1 / before Build
- Complex data pipeline / ETL: +1 week per source
- Legacy system with no API: +2 weeks, flag as dependency risk in SoW
- Multiple modules from same vendor (e.g. SAP FICO + Ariba): treat as two separate integrations but allow 20% efficiency on the second

Confirm sizing with the user before generating documents: *"Based on what you've told me, I'm sizing this as a [X-week] engagement across [N] waves. Does that match your expectation?"*

---

## Step 3 — Generate Artefacts

Read the relevant reference file(s) before generating output:

| Artefact | Reference file |
|---|---|
| Gantt / Timeline | `references/gantt.md` |
| Statement of Work | `references/sow.md` |
| RACI | `references/raci.md` |
| Governance Pack | `references/governance.md` |

### Output format rules

- **DOCX** — Use the `docx` skill. Apply Novagentica document styling (see Brand section below).
- **PPTX** — Use the `novagentica-presentation` skill. Timeline slides use Layout #7 (Architecture Flow) or Layout #4 (Numbered Stack) for milestone views.
- **Both** — Produce the `.docx` first (source of truth), then adapt key content into slides.

### File naming convention

```
Novagentica-[ClientName]-[ArtefactType]-v1.0.[ext]
```
Example: `Novagentica-AcmeCorp-SoW-v1.0.docx`

---

## Brand — DOCX Style

Novagentica Word documents follow these conventions:

| Element | Style |
|---|---|
| Primary font | Inter (body), Georgia (quotes/callouts) |
| Accent colour | `#CC0D2C` (crimson) — headings, table header rows |
| Background | White (`#FFFFFF`) |
| Table header fill | `#CC0D2C` with white text |
| Heading 1 | Inter Bold 16pt, crimson |
| Heading 2 | Inter SemiBold 13pt, dark ink `#0E0E0C` |
| Body text | Georgia 11pt, `#0E0E0C` |
| Footer | "novagentica" wordmark left, page number right, Inter 9pt |

Apply these consistently across all `.docx` outputs. If Inter is unavailable in the docx build environment, fall back to Arial.

---

## Quality checks before presenting output

- [ ] Engagement type correctly reflected (ingestion vs build timelines look very different — do not conflate)
- [ ] Client name and project codename in all headers/footers
- [ ] All phases have named owners (use "[Client Lead]" and "[Novagentica Lead]" as placeholders if not provided)
- [ ] SoW includes explicit In-Scope / Out-of-Scope table
- [ ] SoW includes Assumptions & Dependencies — flag integration risks explicitly
- [ ] Gantt dates are coherent (no phase ending before it starts)
- [ ] File named per convention and saved to `/mnt/user-data/outputs/`

---

## What NOT to do

- Do not produce a multi-week Gantt for a pure ingestion engagement. Ingestion timelines are measured in hours or days — a week-long Gantt implies a misunderstanding of the product and undermines credibility with clients.
- Do not skip the intake interview. A generic timeline with assumed inputs will require rework and may create commercial risk.
- Do not omit the Out-of-Scope section from the SoW. Undefined scope is the primary source of delivery disputes.
- Do not produce slides without reading `references/layouts.md` in the `novagentica-presentation` skill first.

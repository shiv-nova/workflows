# Gantt / Timeline Reference

## Ingestion Engagement Timeline — Small (1–10 Agents)

Use this for small ingestion engagements where each agent takes minutes and no structured gap analysis is needed.

### Standard Phases

| Phase | Duration | Owner | Notes |
|---|---|---|---|
| Platform Access & Credentialling | 0.5 days | Novagentica Lead | Client IT must provide access |
| Agent Configuration | 0.5–1 day per agent | Novagentica Lead | Config, parameter mapping |
| Integration Wiring (if applicable) | 1–2 days per integration | Novagentica Lead + Client IT | API keys, data sources |
| Functional Testing | 0.5 days | Novagentica Lead + Client Lead | Sign-off checklist |
| Client Acceptance / Go-Live | 0.5 days | Client Lead | Formal sign-off |

**Total (no integrations, 1–3 agents):** 1–3 days
**Total (with integrations):** 3–7 days

### Gantt table format (DOCX) — Day-level

Render as a Word table with these columns:

| Phase | Owner | Day 1 | Day 2 | Day 3 | Day N |

Shade active cells using crimson at 20% opacity (`#F5C6CE`). Use solid crimson (`#CC0D2C`) for milestones.

---

## Ingestion Engagement Timeline — Bulk (11+ Agents with Gap Analysis)

Use this for bulk migrations where each agent requires individual gap analysis, configuration review, or structured testing before ingestion. This is not a simple ingestion — it is a managed delivery programme and must be treated as such.

### Sizing formula

```
Gap analysis days per wave = (agents_per_wave × gap_analysis_minutes) ÷ 480
Config & ingestion per wave = 1 day
Testing per wave = 0.5 day
Sign-off per wave = 0.5 day
Total days per wave = gap_analysis_days + 2
```

### Wave structure

Default wave size is 100 agents. Adjust if the user specifies otherwise.

| Agents | Recommended waves |
|---|---|
| 11–100 | 1 wave |
| 101–200 | 2 waves |
| 201–300 | 3 waves |
| 301–400 | 4 waves |
| 401–500 | 5 waves |
| 500+ | Discuss with user — may warrant a programme-level structure |

### Standard phases per wave

| Phase | Duration | Owner | Notes |
|---|---|---|---|
| Gap analysis | (agents × mins) ÷ 480, rounded up | Nova Lead + Client SMEs | Structured review of each agent; outputs gap report |
| Configuration & ingestion | 1 day | Novagentica Lead | Based on gap analysis findings |
| Functional testing | 0.5 days | Nova Lead + Client Lead | Against wave acceptance checklist |
| ▶ Wave sign-off | 0.5 days | Client Lead | Formal milestone; triggers next wave |

### Pre-wave integration setup (if integrations in scope)

Run before Wave 1. Do not start Wave 1 until integration sign-off is complete.

| Phase | Duration | Owner | Notes |
|---|---|---|---|
| Platform access & credentialling | 0.5 days | Novagentica Lead | |
| Integration API connection & config | 1–2 days per integration | Nova Lead + Client IT | |
| End-to-end integration test | 1 day | Nova Lead + Client IT | |
| ▶ Integration sign-off | 0.5 days | Client Lead | Hard dependency before Wave 1 |

### Gantt table format (DOCX) — Week-level

For bulk engagements use a week-level Gantt (not day-level). Columns:

| Phase / Activity | Owner | W1 | W2 | W3 | W4 | W5 | W6 | ... |

- Use ink section header rows (fill `#0E0E0C`, white text) to separate: Integration Setup, Wave 1, Wave 2, etc.
- Shade active week cells using crimson at 20% opacity (`#F5C6CE`)
- Milestone rows (wave sign-off, final acceptance) use crimson fill (`#CC0D2C`) with white text
- Document orientation: **landscape** for 6+ week engagements

### Non-viable agent contingency — always include

Add to SoW Assumptions: *If gap analysis in Wave 1 identifies >10% of agents as non-viable, Novagentica will flag this at wave close and propose a revised delivery plan within 2 business days before proceeding to Wave 2.*

---

## Build Engagement Timeline

Use for build-from-scratch engagements (one or more agents being designed and built).

### Standard Phases

| Phase | Duration | Owner | Notes |
|---|---|---|---|
| Discovery & Requirements | 1 week | Novagentica Lead + Client Lead | Workshops, use case confirmation |
| Agent Design | 1 week | Novagentica Lead | Architecture, data flow, approval |
| Build — Core Agent(s) | 1–3 weeks | Novagentica Dev | Scales with agent count |
| Integration Development | 1–2 weeks | Novagentica Dev + Client IT | If integrations required |
| Internal QA | 3–5 days | Novagentica Lead | Pre-UAT quality gate |
| UAT | 1 week | Client Lead | Client-side testing, defect log |
| Defect Resolution | 3–5 days | Novagentica Dev | Severity 1/2 fixes only |
| Go-Live | 1 day | Novagentica Lead + Client Lead | Deployment + monitoring start |
| Hypercare | 2 weeks | Novagentica Lead | Elevated support post-go-live |

### Build duration by agent count

| Agents | Build Phase Duration |
|---|---|
| 1 | 1 week |
| 2–3 | 2 weeks (some parallelism) |
| 4–5 | 3 weeks |
| 6–10 | Consider wave planning — see below |

### Wave Planning (6+ agents)

For 6+ agents, propose wave structure to the user:
- **Wave 1:** Highest-priority / lowest-complexity agents (prove the model)
- **Wave 2:** Remaining agents, benefiting from Wave 1 learnings
- Each wave follows the full build lifecycle
- Waves can overlap by 1–2 weeks at Discovery/Design stage

---

## Hybrid Engagement

Run ingestion track in parallel to build track. Ingestion agents can typically go live in Week 1–2 while the build track continues. Show as parallel swimlanes in the Gantt.

---

## Gantt rendering — PPTX

Use Layout #7 (Architecture Flow) from the `novagentica-presentation` skill for timeline slides. Represent phases as numbered tiles. Use a simplified 4–6 tile view for executive slides — do not reproduce every row of the detailed Gantt in a slide.

For a detailed Gantt in PPTX, use a table object on a clean Layout slide with the same column structure as the DOCX version.

---

## Key milestones to always call out

These appear as named markers regardless of engagement type:

1. **Kickoff** — Day 1 of engagement
2. **Design Sign-off** — End of Design phase (build only)
3. **UAT Start** — Handover to client testing
4. **Go-Live** — Production deployment
5. **Hypercare End / Project Close** — Final milestone, triggers SoW completion

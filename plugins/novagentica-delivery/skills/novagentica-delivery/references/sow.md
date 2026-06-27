# Statement of Work — Reference Template

## Document structure

Every Novagentica SoW contains these sections in this order. Do not omit any section.

---

### 1. Cover / Header Block

```
STATEMENT OF WORK

Client:           [Client Legal Name]
Project:          [Project Name / Codename]
Prepared by:      Novagentica AG
Version:          1.0 — DRAFT
Date:             [Date]
Novagentica Lead: [Name]
Client Lead:      [Name]
```

---

### 2. Executive Summary (1 paragraph)

One short paragraph describing what this engagement delivers and why. Written for a non-technical executive. Mention the platform (Novagentica Apollo Agent Exchange), the engagement type (ingestion / build), and the headline outcome.

---

### 3. Objectives

Bullet list, 3–5 items. Each objective is outcome-oriented (what the client will be able to do after this engagement), not activity-oriented (not "we will hold workshops").

---

### 4. Scope

#### 4a. In Scope

Table format:

| # | Deliverable | Description |
|---|---|---|
| 1 | | |

Include: agent configurations, integrations, testing, training, documentation.

#### 4b. Out of Scope

Explicit list. Common out-of-scope items for Novagentica engagements:

- Custom model training or fine-tuning (unless separately contracted)
- Client-side infrastructure provisioning
- Data cleansing or ETL beyond agreed integration points
- Ongoing managed service / support post-Hypercare (unless Model C contracted)
- Change requests raised after SoW sign-off (subject to change control)

---

### 5. Deliverables

Table listing each named deliverable, format, and acceptance criteria:

| Deliverable | Format | Acceptance Criteria |
|---|---|---|
| Configured agent(s) on Apollo | Live in platform | Client sign-off on UAT checklist |
| Integration(s) operational | API connection | End-to-end data flow verified |
| Deployment timeline | PPTX / DOCX | Approved at kickoff |
| Test evidence pack | DOCX | Provided at go-live |
| Handover documentation | DOCX | Provided at Hypercare close |

---

### 6. Timeline & Milestones

Reference the Gantt (attach as Appendix A or embed as table). List key milestones with target dates:

| Milestone | Target Date |
|---|---|
| Kickoff | |
| Design Sign-off | |
| UAT Start | |
| Go-Live | |
| Hypercare End | |

---

### 7. Assumptions & Dependencies

This section is **mandatory and must be specific**. Generic assumptions undermine the SoW's commercial protection.

Standard assumptions for all engagements:
- Client will provide named technical and business leads with decision-making authority
- Client IT will provision required platform access within [X] business days of SoW signature
- Client will make relevant subject matter experts available for workshops during Discovery
- Third-party systems identified in scope have accessible, documented APIs
- Any delay caused by client-side dependencies will extend the timeline by an equivalent period

Integration-specific (add if integrations are in scope):
- API credentials and documentation will be provided by [date]
- Client's [System Name] API is stable and not subject to planned changes during the engagement
- Data volumes are within agreed parameters ([X] records/day)

Flag risks explicitly using this format:
> ⚠️ **Dependency Risk:** [description]. If this is not resolved by [date], go-live will be at risk. Novagentica will escalate via the governance process.

---

### 8. Governance

| Role | Responsibility | Name |
|---|---|---|
| Novagentica Engagement Lead | Day-to-day delivery, escalation point | [Name] |
| Client Project Lead | Client decisions, UAT coordination | [Name] |
| Executive Sponsor (Client) | SoW sign-off, commercial decisions | [Name] |
| Executive Sponsor (Novagentica) | Escalation above engagement lead | [Name] |

Progress cadence:
- Weekly status update (email or short call) — Novagentica Lead to Client Lead
- Milestone reviews at Design Sign-off, UAT Start, Go-Live
- Escalation: any issue not resolved within 48h escalates to Executive Sponsors

---

### 9. Change Control

Any change to scope, timeline, or commercials requires a written Change Request signed by both parties. Changes are not in effect until signed. Novagentica will provide an impact assessment within [3] business days of a change request being raised.

---

### 10. Commercials

| Item | Detail |
|---|---|
| Engagement type | [Fixed price / T&M] |
| Total value | £[X] |
| Payment terms | [e.g. 50% on signature, 50% on go-live] |
| Expenses | [Included / charged at cost] |
| Currency | GBP / EUR / USD |

> Note: Do not populate commercials without confirmation from the account lead. Leave as `[TBC — to be confirmed by Novagentica account lead]` if values are not provided.

---

### 11. Sign-off Block

```
On behalf of [Client Legal Name]:

Signature: ____________________   Date: ____________
Name:      ____________________
Title:     ____________________


On behalf of Novagentica AG:

Signature: ____________________   Date: ____________
Name:      ____________________
Title:     ____________________
```

---

### Appendix A — Deployment Timeline (Gantt)

Attach or embed the Gantt table here.

---

## SoW tone of voice

- Direct and commercial, not academic
- Every clause should be defensible if disputed
- Avoid weasel phrases like "endeavour to" or "aim to" — either it's in scope or it isn't
- Assumptions should name specific parties and specific dates, not vague conditions

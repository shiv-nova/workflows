# RACI Reference

## Note on delivery model

When this skill is invoked via the `novagentica-presales-solution-design` handoff (Mode B), the delivery model will already be set as one of:
- **Novagentica-built** — Novagentica Lead owns most R entries; client owns A entries and UAT
- **Co-build** — R entries shared between Novagentica and Client teams throughout
- **Customer-built, Novagentica-supported** — Client owns most R entries; Novagentica Lead is C/I except on certification and go-live gates

Apply the appropriate RACI variant below. If delivery model is not specified, default to Novagentica-built and flag the assumption.

---


## Standard RACI for Novagentica Engagements

RACI key: **R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed

### Roles

| Code | Role |
|---|---|
| NL | Novagentica Engagement Lead |
| ND | Novagentica Developer |
| CL | Client Project Lead |
| CI | Client IT / Technical Lead |
| CS | Client Executive Sponsor |
| NS | Novagentica Executive Sponsor |

---

### Ingestion Engagement RACI

| Activity | NL | ND | CL | CI | CS | NS |
|---|---|---|---|---|---|---|
| Platform access provisioning | C | I | A | R | I | I |
| Agent configuration | R/A | R | C | C | I | I |
| Integration wiring | C | R/A | C | R | I | I |
| Functional testing | R/A | C | R | C | I | I |
| Client acceptance sign-off | C | I | R | I | A | I |
| Go-live deployment | R/A | R | I | C | I | I |
| Issue escalation | R | I | R | I | A | A |

---

### Build Engagement RACI

| Activity | NL | ND | CL | CI | CS | NS |
|---|---|---|---|---|---|---|
| Kickoff facilitation | R/A | I | R | I | I | I |
| Requirements workshops | R/A | C | R | C | I | I |
| Agent design sign-off | A | R | C | C | I | I |
| Build delivery | C | R/A | I | I | I | I |
| Integration development | C | R/A | I | R | I | I |
| Internal QA | R/A | R | I | I | I | I |
| UAT coordination | C | I | R/A | C | I | I |
| UAT defect triage | R | R | C | C | I | I |
| Go-live decision | A | C | A | C | I | I |
| Go-live deployment | R | R/A | I | C | I | I |
| Hypercare monitoring | R/A | R | C | I | I | I |
| Project closure sign-off | C | I | R | I | A | I |
| Commercial/change decisions | C | I | C | I | A | A |

---

## Notes on RACI generation

- If the user provides actual names, populate the role column header with the name (e.g. "NL — Shiv Tailor")
- Never leave an activity without exactly one **A** (accountable party)
- Flag to the user if client-side roles are unnamed — unnamed accountability is a delivery risk
- For hybrid engagements, combine both tables and mark the track (Ingestion / Build) in a Track column

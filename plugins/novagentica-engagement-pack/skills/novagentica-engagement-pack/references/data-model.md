# Novagentica engagement data model — the shared spine

**Status:** the contract that `novagentica-engagement-pack` and `novagentica-order-form` both build on. One spine per deal; every artefact reads it. Nothing client-specific is hardcoded in any generator — a new deal is a new spine, not a code edit.

**Implemented by:** all six pack generators read this spine. `build_gantt.js`, `build_sow.js` and the three decks (`build_execsummary.js`, `build_proposaldeck.js`, `build_summary6.js`) are fully parameter-driven and were proven byte-identical against the reference engagement; the decks read the shared `decks` block (`planTiles`, the ask, `preparedFor`) plus a per-deck sub-block, and derive numbers, the licence ladder and cost rows from `commercials`. `order-form/scripts/build_orderform.py` inherits the numeric commercials via `engagementRef` (byte-identical against a second reference engagement). `build_proposal.js` is fully parameter-driven: identity + all nine narrative sections live in the spine `proposalDoc` block; the cost table, CLIENT identity and footer derive. Proven byte-identical (document.xml) against the reference engagement.

---

## The principle

Everything that **can** be derived **is** derived — never stored, so it can't drift. Only three kinds of thing are ever entered by hand, and each lives in exactly one place:

1. **The MVP slate** — the spine. Drives every scoped, sized, dated, or priced line across every artefact.
2. **The engagement header** — the handful of commercial decisions no MVP can compute (currency, day rate, term, partnership discount) plus the *quoted* tier.
3. **The order-form legal wrapper** — the only facts that are genuinely new at order-form time (legal entity, signatory, MSA, governing law, etc.).

If a value is none of these three, it is **computed** at render time.

---

## 1 · The MVP (the atom)

The slate is the ordered set of MVPs. Each MVP:

```
identity     id · title · oneLiner
behaviour    agentDoes · gatedAction · kpis
classify     aiActClass · runtimeSystems · blastRadius
status       confirmed | conditional (+ conditionNote) | backup (isBackup + backupNote)
sizing       consultantDays            ← the only number that matters; fee is derived
timeline     startWeek · endWeek · liveWeek · gate

delivery     (Gantt rendering data, authored per MVP — see §4)
```

`isBackup` MVPs are not rendered as their own Gantt section; they contribute only to the backup-path total and any "backup ready" line.

## 2 · The engagement header (set once, not derivable)

```
client        name · legalEntity · industry · sponsor · mainContact · domainLeads · systems
nova          deliveryLead · commercialLead · founder
deliveryModel Novagentica-built | Co-build | Customer-built-supported
commercials   currency · dayRate · term · partnership { enabled · discountPct · feeBasis }
              tierLadder[] (Domain / Enterprise / Global)
quotedTier    the tier actually sold (see tier rule below)
```

## 3 · The order-form legal wrapper (asked only at order-form time)

These — and only these — are the questions the order-form skill still needs to ask. Everything else is inherited from §1–§2.

1. Order-form number, date, version
2. MSA reference + date
3. Customer legal entity — legal name, registered address, reg number
4. Signatory — name, title, email
5. Governing law (default: Switzerland · Canton of Zurich)
6. Overage rate (per *n* runs above allowance)
7. Expenses basis (at cost / capped / TBC)
8. Effective date (date of last signature)

---

## Derivation rules (computed, never stored)

| Output | Rule |
|---|---|
| stage fee (`chf`) | `consultantDays × dayRate` |
| `annualFee` | `tierLadder[quotedTier].annualFee` |
| `agents` in scope | count of in-scope (non-backup) MVPs |
| `runtimes[]` selected | distinct `mvp.runtimeSystems` across the slate; the rest of the 9 listed unselected |
| runtime footnote | client systems that are integration *targets*, not platform runtimes |
| **totals** | status-filtered sums over the slate — `fullSlate` = all non-backup; `confirmedOnly` = `status==confirmed && !isBackup`; `backupPath` = confirmedOnly + backups |
| Gantt week axis | `gantt.weekAxis`; milestone column = `mvp.timeline.liveWeek` |
| key-milestones line | `Kickoff (W0) · MVP n live (liveWeek[, gated if gate]) · Scale (lastWeek)` |
| title strap / footer | `client.name` (+ slate count as a word) |
| day-rate strings | `commercials.currency` + `dayRate` |

Any `commercials.totals` block still present in a spine is **deprecated** — totals are derived. Leave it only for generators not yet migrated; delete once all read this contract.

## The tier rule — recommended floor, overridable

Agent count and runtime breadth imply a **recommended tier floor** (e.g. multi-domain / >20 agents → Enterprise). The slate computes that floor and surfaces it. But `quotedTier` is a deliberate commercial decision: the header **may quote below the floor** as a land-and-expand play (Domain pricing for Enterprise-shaped scope). When it does, the expansion path is stated explicitly in the proposal/order form rather than implying the entry tier covers the full scope. Tier is therefore header-set with a slate-derived recommendation — never silently auto-set from agent count, and never buried when undersold.

---

## 4 · The `delivery` block (Gantt rendering data, per MVP)

Authored per MVP; lives in the deal spine, not in the generator. Section header has a derived default but may be overridden for bespoke typography.

```
delivery
  sectionHeader   "MVP n — TITLE (id)  ·  Ingestion|Build  ·  EU AI Act: <class>  ·  <weeks> week(s)"
  effortLabel     row label in the indicative-effort table (default: "id — title")
  tasks[]         { label · owner · weeks[] }   weeks as axis labels (e.g. ["W3","W4"])
  milestone       { label · week }              week as an axis label
```

Non-MVP bands (pre-contract / foundation / scale) live at `gantt.frameSections[]` with `position: "before" | "after"`; authored gate prose lives at `gantt.dependencies[]` (the key-milestones bullet is appended automatically). `gantt.effortNote` interpolates `{dayRate}`.

## 5 · The `sow` block (Statement of Work, per deal)

The SoW is mostly **authored prose** — genuinely bespoke per engagement, not computable from the slate. It lives at `engagement.json → sow`. The generator renders this prose verbatim and **derives** everything structural and numeric: cover people (from `client` / `nova`, `client.sponsor` split on `" — "`), the consultant-days table and status-filtered totals (from `mvps[].sizing` + `commercials`, same rules as the Gantt), the terms table (placeholders `{dayRate} {fullDays} {fullFee} {confDays} {confFee} {tier} {annualPrice} {term} {cur}` interpolated so the terms never drift from the days table), the footer (`client.name` + `sow.footerVersion`), and the Appendix-A Gantt filename (`output.fileStem` + version).

```
sow
  cover           projectName · platform · version · date · status · footerVersion
  execSummary[]   { t · b? }   (authored rich-text runs)
  objectives[] · scopeIn[] {n,deliverable,description} · scopeOut[]
  deliverables[] {deliverable,format,acceptance} · milestones[] {m,d,bold?,fill?}
  assumptions[] · riskFlags[] · govRows[] {role,resp,name} · cadence
  raciCols[] · raci[] {activity,v[]} · raciNote · changeControl
  commercialsNote · commercialsDayLabels[] · commercialsTotalsLabels · termsRows[] {item,detail,bold?} · commercialsFootnote
  signoffEntities[] · appendixIntro · appendixPhases[] {m,d}
```

Authored labels (e.g. the per-MVP consultant-day row wording) live here because the SoW and Gantt word them differently; the **numbers** behind them are always derived, never stored.

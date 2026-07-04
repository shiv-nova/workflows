---
name: novagentica-engagement-pack
description: >
  Use this skill whenever Shiv or a Novagentica sales person needs to turn a customer signal (a call transcript plus a Use-Case-Fit deck) into the full set of client-facing engagement artefacts in one pass: the Solution Proposal (DOCX), the Delivery Timeline / Gantt (DOCX), the Statement of Work (DOCX), and the branded decks (Executive Summary, Solution Proposal deck, Summary deck with Gantt + Licence options). ALWAYS trigger on "engagement pack", "proposal pack", "build the [client] artefacts", "turn this transcript into a proposal", "create the SoW + Gantt + deck", "regenerate the pack", or any request that starts from a transcript + fit deck and ends in the branded commercial artefact suite. The skill enforces ONE commercial source of truth (engagement.json) so currency, day counts, tier names, prices, and dates stay consistent across every artefact. It defers rendering mechanics to novagentica-presentation (PPTX) and docx (DOCX) and product facts to novagentica-architect-control-authority.
license: Proprietary — Novagentica AG, 2026
---

# Novagentica Engagement Pack

> **Front-door router — read first.** `novagentica-presales-solution-design` and `novagentica-engagement-pack` are the two front doors and **must never both run on the same deal**. Decide by one question: *is the use-case slate already agreed?*
> - **No / starting cold** (raw signal, no agreed use cases, customer hasn't seen a strawman) → use **presales-solution-design**: discovery → research → strawman → checkpoint → proposal.
> - **Yes / thinking done** (you have a transcript + a Use-Case-Fit deck, slate is settled) → use **engagement-pack**: straight to the branded artefact suite.

Turns a customer transcript + Use-Case-Fit deck into the complete branded artefact suite, governed by a single parameter file so the commercials never drift between documents.

## Why this skill exists

Producing the proposal, the Gantt, the SoW and three decks by hand means the same numbers (currency, consultant-days, licence tier, term, dates) live in six places. One late change — "make it CHF", "MVP 1 is one week now", "Scale is now Enterprise" — forces six edits and risks inconsistency. This skill fixes that: **all variable values live in `engagement.json`; every generator reads from it.** Change the brief, regenerate the pack.

## When to use / not use

Use when the start is a customer signal (transcript + fit deck) and the end is the branded artefact suite.
- Only slides → `novagentica-presentation`.
- Only the delivery timeline/SoW/RACI in isolation → `novagentica-delivery`.
- Only the licence offer / commercial order form → `novagentica-order-form`. (NDAs/DPAs: handled by legal, not a skill.)
- Product facts, runtimes, NO PASSPORT = NO EXECUTION wording → read `novagentica-architect-control-authority` first.

## The pipeline

1. **Intake.** Read the transcript and the Use-Case-Fit deck (`file-reading` / pdf skills). Extract: client + contacts, systems environment, the candidate use cases (with AI-Act class and KPIs), which are confirmed vs conditional, a backup, the delivery model, procurement routes, and key dates/gates.
2. **Fill the brief.** Populate `engagement.json` (see `references/inputs.md` and `assets/engagement.example.json`). This is the single source of truth. Confirm the commercial block with the user before generating — currency, day rate, per-MVP days, licence tier/price/term.
3. **Checkpoint.** Show the filled brief (or at least the commercial + timeline block) inline and get sign-off. Do not generate six artefacts on unconfirmed numbers.
4. **Generate.** Run the generators in `assets/generators/`. All six generators read `engagement.json` directly — see Generator status below. **Always up-version first** (see Versioning & delivery) — never overwrite an existing version, and always bump the version on the decks/presentation. Output to the working/outputs folder.
5. **QA.** Convert each output to images and inspect (overlaps, overflow, dates coherent, currency consistent, tier names consistent). Use the checklist below.
6. **Deliver.** Save the finals to the **customer's Google Drive folder** (`output.gdriveFolder`) using the Google Drive connector, then present the files. Keep commentary short.

## Versioning & delivery (always)

Two rules apply on every run, without being asked:

1. **Always up-version the presentation (and the pack).** File names carry `v<MAJOR>.<MINOR>` (e.g. `v1.0`). Before generating, find the highest existing version in the customer's Google Drive folder (or `output.version`) and **increment the minor** (`v1.1`, `v1.2`, …); bump the **major** only on a material re-scope. **Never overwrite an existing version** — each delivery is a new file. The decks in particular are always up-versioned so the customer can see which is latest. Write the new version back to `engagement.json` (`output.version`).
2. **Always point to the customer's Google Drive folder.** Each engagement has a Google Drive folder (`output.gdriveFolder`). On Deliver, upload the finals there via the Google Drive connector (or, if it isn't connected, save locally and surface the folder link). New customer with no folder yet → create one named `Novagentica – <Client>` and record its URL in `output.gdriveFolder`. The folder is the single place the customer picks up artefacts.

File naming: `Novagentica-[ClientName]-[ArtefactType]-v[MAJOR.MINOR].[ext]` — e.g. `Novagentica-[Client]-Summary-v1.1.pptx`.

## Artefacts produced

| Artefact | File | Generator | Format |
|---|---|---|---|
| Solution Proposal (pre-read for sponsor) | `...-SolutionProposal-v1.0.docx` | `build_proposal.js` | DOCX (A4 portrait) |
| Delivery Timeline / Gantt | `...-DeliveryTimeline-v1.0.docx` | `build_gantt.js` | DOCX (A4 landscape) |
| Statement of Work | `...-SoW-v1.0.docx` | `build_sow.js` | DOCX (A4 portrait) |
| Executive Summary deck | `...-ExecutiveSummary-v1.0.pptx` | `build_execsummary.js` | PPTX (16:9) |
| Solution Proposal deck | `...-SolutionProposal-Deck-v1.0.pptx` | `build_proposaldeck.js` | PPTX (16:9) |
| Summary deck (slate · why · phases · Gantt · licence model · services · ask) | `...-Summary-v1.0.pptx` | `build_summary6.js` | PPTX (16:9) |

**Generator status — know which mode each is in:**
- `build_gantt.js` and `build_sow.js` are **fully parameter-driven**: they read the spine (`engagement.json` → `gantt` frame + per-MVP `delivery` blocks + `sow` block + `commercials`) and contain **no client, date, name, tier or price literals**. A new deal is a new spine, never a generator edit. They derive everything derivable (stage fees, status-filtered totals, milestone columns, cover people, footer) per `references/data-model.md`. Run: `node build_gantt.js engagement.json out.docx` / `node build_sow.js engagement.json out.docx`.
- The three decks (`build_execsummary`, `build_proposaldeck`, `build_summary6`) are **fully parameter-driven**: slide text lives in the spine under `decks` (shared fields — `planTiles`, the ask, `preparedFor` — plus a per-deck sub-block), and numbers, the licence ladder table and cost rows derive from `commercials`. Each was proven byte-identical to its prior reference-engagement output before being relied on.
- `build_proposal` is **fully parameter-driven**: identity and all nine sections of narrative live in the spine under `proposalDoc` (cover identity + ordered run-spec sections), and the commercial cost table, the CLIENT identity and the footer derive from `client` / `commercials` / `mvps`. Proven byte-identical (document.xml) to its prior reference-engagement output before being relied on. A new customer is a new `proposalDoc` block — never a generator edit. (Licence figures quoted *inside narrative prose* are authored per-deal; the cost table derives.)
- The shared `decks` block means the pack's common narrative (plan flow, the ask) is authored **once** and read by every deck.
- **All six generators are pure renderers** — a new deal is a new `engagement.json` (with `decks` + `proposalDoc` blocks), never a generator edit.
- When you migrate a generator, prove it the same way `build_gantt.js` was proven: render the current output for the reference engagement (assets/engagement.example.json) as a baseline, refactor to read the spine, and diff the rendered text to confirm it is identical before relying on it.

## The single source of truth

`engagement.json` is the contract. Anything that varies between customers or changes during negotiation lives there and nowhere else:
- client + contacts + systems
- the MVP slate (per-MVP: title, what the agent does, gated action, KPI, AI-Act class, status, sizing in weeks + days + cost, timeline weeks + live week + gate)
- delivery model
- commercials: currency, day rate, per-MVP costs, totals (full slate / confirmed-only / backup), licence tier + annual price + term + any intro offer (e.g. "6 months Enterprise at the Domain price, auto-renew to Enterprise unless N weeks' notice"), the tier ladder (Domain / Enterprise / Global). Keep the licence model and the services on separate slides.
- procurement routes
- dates: kickoff anchor, works-council/gate date, meeting dates, target first value
- output: file stem, current **version** (always up-versioned per run), and the **customer Google Drive folder** the finals are delivered to

Full schema and the worked example: `references/inputs.md`, `references/data-model.md` (the shared spine + derivation rules + per-MVP `delivery` block), and `assets/engagement.example.json`.

## Brand (fixed — never an input)

Cream `#FAFBF6` background, crimson `#CC0D2C` accent, ink `#0E0E0C`, muted `#8A8A86`, hairline `#D9D9D2`. Inter for structure/labels, Georgia for prose/emphasis. `novagentica` wordmark bottom-left on every slide ("nova" ink + "gentica" crimson). DOCX: crimson H1, table header rows crimson/white, wordmark footer. See `assets/brand.md`. These come from `novagentica-presentation`; do not invent a new look.

## QA checklist (before delivering)

- [ ] Currency consistent across all six artefacts (one currency unless a split is explicitly intended).
- [ ] Per-MVP days × day rate = per-MVP cost; per-MVP costs sum to the stated totals.
- [ ] A 1-week MVP for a single consultant ≤ 5 days; flag anything tighter as aggressive.
- [ ] Tier-ladder names identical everywhere (Domain / Enterprise / Global) and the highlighted tier matches the quoted licence.
- [ ] Licence term identical everywhere (e.g. 3-year).
- [ ] Gantt dates coherent; gated go-lives (works council) shown as gated, not free-running.
- [ ] Client name + sponsor in every header/footer; placeholders for unknown names.
- [ ] SoW has explicit In/Out-of-scope and Assumptions with named parties + dates.
- [ ] Conditional MVPs and the backup are clearly marked, not presented as firm.

## Honest-broker notes (carry these into the proposal/SoW, don't bury them)

- Aggressive per-MVP day counts are a sales signal but a delivery risk — state the assumption (e.g. "assumes a clean reverse-engineer; further gap remediation via change control").
- If the quoted licence tier is below what scope implies (e.g. Domain pricing for multi-domain scope), make the expansion path explicit rather than implying the entry tier covers everything.
- Production beyond PoC is gated by external approvals (works council, security) — show the gate; build runs ahead under the signed contract.


---

> **Canonical brand source:** the Novagentica Design System project (`styles.css` + `tokens/` + `guidelines/`). The vendored `assets/brand.md` in this skill is the skill-ready digest of it. Keep them in sync; do not invent a new look.

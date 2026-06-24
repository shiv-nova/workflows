---
name: novagentica-use-case-library
description: Use this skill to build and extend Novagentica's evergreen, by-vertical USE CASE LIBRARY — the reusable catalogue of agent use cases, one 3-slide tile each, organised by vertical (financial services, manufacturing, healthcare, etc.) and framed for investor / portfolio-selection audiences. ALWAYS trigger on "use case library", "use case catalogue", "use case tile", "add this to the library", "vertical use cases", "[vertical] use cases" (e.g. "manufacturing use cases"), "library tile", "portfolio use case", or "which agents are worth deploying across the portfolio". Do NOT use this for a per-customer strawman, RFP/RFI, or "what can we do for [named customer]" — that is bespoke pre-sales and belongs to novagentica-presales-solution-design. This skill owns the evergreen, reusable layer; solution-design owns the per-customer layer and may pull tiles from this library as candidates. Defer to novagentica-presentation for rendering and novagentica-architect-control-authority for product facts.
license: Proprietary — Novagentica AG, 2026
---

# Novagentica Use Case Library

Builds and maintains the **evergreen, by-vertical catalogue of agent use cases**. Each entry is one **3-slide tile** plus a row of structured metadata, framed through an **investor / portfolio-selection lens**: the implicit question every tile answers is *"is this agent worth deploying across our portfolio companies in this vertical?"*

This skill is a **standard + generator**, not a product encyclopedia and not a bespoke pre-sales engine:
- It defines the tile standard (the three slides, the metadata schema, the maturity discipline) and populates tiles.
- It does **not** restate product facts — runtimes, the platform philosophy, value drivers, voice rules all live in `novagentica-architect-control-authority`. **Read that skill first, every time** (its `SKILL.md`, then the reference the task needs). Never duplicate facts that could drift.
- It does **not** render brand slides itself — it hands the populated tile to `novagentica-presentation`, which owns the visual identity.

## When to use / when NOT to use — the boundary that matters

Use this when the goal is a **reusable library entry** for a vertical: add a use case, refresh a tile, generate a starter set of tiles for a new vertical, or pull library candidates for someone else.

**Do NOT use — hand to `novagentica-presales-solution-design` instead — when the starting point is a specific customer.** Strawman use cases for a named account, an RFP/RFI, "what can we do for [customer]", "scope this opportunity" → that is bespoke pre-sales. The two skills both involve "use cases"; the discriminator is **general/evergreen (here) vs. customer-specific (there)**. When in doubt, ask which one the user means rather than guessing — getting this wrong produces the wrong artifact.

The library *feeds* solution-design: its Stage 2/3 can lift a relevant tile as a candidate and then bespoke it. Keep the dependency one-directional (library → solution-design), not circular.

## Grounding (do this before building any tile)

1. Read `novagentica-architect-control-authority/SKILL.md`. Internalise the canonical taxonomy **Domain → Outcome (KPI) → Agent(s)**, the **9 runtimes** (LangGraph, n8n, Microsoft Copilot Studio, Salesforce Agentforce, CrewAI, AutoGen, Haystack, SAP Joule, BYO SDK), **NO PASSPORT = NO EXECUTION**, the **no-pilots / MVP1 → MVPx** model, and the value drivers.
2. Inherit its authoring rules. The ones that bite: never write "Supabase" (say *the platform* / *Lovable Cloud*); always include *Salesforce Agentforce* in any runtime list; EU AI Act outputs are Articles **43 and 47**; prefer **control, enforcement, trust engineering, certification, authority, boundaries, evidence** over the bureaucratic word "governance"; **never propose a pilot**.
3. A library tile reuses the **same taxonomy and scoring dimensions as solution-design** (Value · Feasibility · Blast radius · Differentiation-fit) so a tile can drop straight into the pre-sales pipeline without rework.

## The vertical taxonomy

The library is navigated **by vertical first, function second**. Keep verticals stable and coarse; keep functions consistent within a vertical so tiles are comparable side by side. Starting set (extend deliberately, don't sprawl):

| Vertical | Typical functions |
|---|---|
| Financial Services | Finance ops, risk & compliance, KYC/AML, treasury, collections |
| Manufacturing | Supply chain, quality, maintenance, procurement, production planning |
| Healthcare & Life Sciences | Clinical ops, regulatory affairs, pharmacovigilance, claims |
| Energy & Utilities | Asset ops, field service, regulatory reporting, trading ops |
| Public Sector | Casework, eligibility, compliance, citizen service |

Each tile lives at exactly one `vertical / function` coordinate. If a use case spans functions, file it under the function that owns the KPI.

## The tile: three slides (Spine C — investor / portfolio lens)

Every tile is exactly three slides. The spine is **fixed** — do not let individual tiles invent their own arc; the library's value is comparability. The only permitted variable is the slide-2 layout (architecture flow by default; before/after two-column when the workflow is process-heavy).

- **Slide 1 — THE OPPORTUNITY.** The value pool this agent attacks in the vertical, and why now. Answers *"is this worth our attention?"*
- **Slide 2 — THE AGENT & THE MOAT.** What the agent does, drawn as the Domain→Outcome→Agent flow, and why it is defensible/repeatable. Answers *"can we do this, and is it hard to copy?"*
- **Slide 3 — THE ECONOMICS.** Value created, deployment effort, time-to-value, and **portfolio replicability**. Answers *"what's the return, and how many portcos does this apply to?"*

The full slide-by-slide spec, the brand-layout mapping, and a worked example are in **`references/use-case-tile.md` — read it before populating a tile.**

## The metadata row (what makes it a library, not a pile of slides)

Every tile carries a structured metadata row, captured first and stored in the library index so tiles are filterable and comparable. **Populate metadata before writing slides** — it forces the thinking the slides then express.

`vertical · function · domain · outcome (KPI) · agent(s) · runtime(s) · target systems · blast_radius (Low/Med/High) · differentiation_fit (H/M/L — does enforcement actually matter here?) · value_at_stake (£ band per portco/yr) · portfolio_replicability (count of portcos in vertical, or H/M/L) · maturity (Concept/Modelled/Reference/Live) · evidence_source`

For the investor lens, **`value_at_stake`, `portfolio_replicability`, and `maturity` are first-class** — they are the ranking signal, not decoration. The schema and the index format are in `references/use-case-tile.md`.

## The maturity / evidence discipline (non-negotiable)

The fastest way to destroy a library's credibility with investors is an unattributable number. Every figure on every tile carries a maturity stamp, and the stamp governs how the figure may be stated:

- **Concept** — hypothesis only; no figures asserted as fact.
- **Modelled** — estimated/benchmarked, not from a live deployment. Every figure on the tile must be visibly labelled *modelled*.
- **Reference** — drawn from a comparable named deployment (ours or a credible third party); cite it.
- **Live** — running in production at a named or anonymised portco; strongest claim.

Never present a Modelled figure as if it were Live. If you don't have a defensible source for a number, mark the tile Concept and leave the number out rather than inventing one.

## Build & render workflow

1. **Ground** (read the knowledge skill; confirm vertical + function).
2. **Populate the metadata row** (above). If {vertical, function, domain, outcome, runtime} is materially missing and can't be inferred, ask via `ask_user_input_v0` before continuing.
3. **Draft the three slides** per `references/use-case-tile.md`, in Novagentica voice (short, declarative, antithesis subheads). Apply the maturity discipline to every figure.
4. **Render** by handing the populated tile to `novagentica-presentation`: Spine C maps to brand layouts **#2 (themed rows) → #7 (architecture flow) → #4 (numbered stack)**; cream `#FAFBF6`, crimson `#CC0D2C`, Inter + Georgia, wordmark on every slide. Do not invent a new look.
5. **File it**: save the deck to `library/<vertical>/<use-case-slug>.pptx` and **append the metadata row to the library index** (`library/index.csv`) so the catalogue stays filterable. The index — not the decks — is how the library is browsed and how solution-design finds candidates.
6. **QA** visually (the presentation skill's QA recipe). Fix once; don't loop.

## Reference index

| File | Read when |
|---|---|
| `references/use-case-tile.md` | Before populating any tile — the three-slide spec, the brand-layout mapping, the metadata schema, the library index format, the maturity ladder, and a worked financial-services example. |

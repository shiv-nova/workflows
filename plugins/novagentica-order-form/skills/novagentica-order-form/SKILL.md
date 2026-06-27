---
name: novagentica-order-form
description: >
  Use whenever Shiv or a Novagentica sales person needs to create, update, or re-issue a commercial ORDER FORM — the binding purchase document that sits under the Novagentica MSA. The skill produces TWO separate, brand-correct order forms: a SUBSCRIPTION order form (the Architect™ platform licence — Domain / Enterprise / Global tier, runs/month, over-consumption, marketing & reference rights) and a PROFESSIONAL SERVICES order form (MVP1→MVPx expert services on person-days at the CHF 2,500 day rate, delivery model, travel cap, change control). ALWAYS trigger on "order form", "OF", "NVG-OF", "subscription order", "services order form", "PS order form", "create/draft/update the order form", or any request turning agreed commercials (tier, annual fee, term, day rate, days) into a signable order form. NOT a proposal/SoW/deck (use novagentica-engagement-pack). NOT an MSA/NDA/DPA (those are legal documents, handled by counsel, not by a skill).
license: Proprietary — Novagentica AG, 2026
---

# Novagentica Order Forms (Subscription + Professional Services)

Produces the two signable, brand-correct **Order Forms** that sit under the Novagentica MSA. They are deliberately **separate documents** — different buyers, billing rhythms and approval paths:

- **Subscription** (`scripts/build_of_subscription.js`) — the Architect™ platform licence: Domain / Enterprise / Global tier table, runs/month committed volume, the over-consumption clause, a dated payment schedule, the 7-part marketing & reference rights clause, and the "Special provisions & relationship to the MSA" section.
- **Professional Services** (`scripts/build_of_ps.js`) — MVP1→MVPx expert services: the three delivery models, person-days at the CHF 2,500 day rate (T&M or fixed), MVP stages, a travel/expenses clause, change control (mirroring MSA 5.4), monthly-in-arrears payment.

Both share `scripts/nvg_helpers.js` (brand masthead, draft panel, address block, tables, signature block, document chrome).

> This skill **replaces the earlier single combined "Part A / Part B" order form** (`build_orderform.py`), which has been retired. Generate whichever of the two the deal needs — often both.

## What the generators produce

Each generator emits a **DRAFT template** — a fully-branded `.docx` with `[bracketed]` fields, selection boxes (☐), `‹drafting note›` callouts, and a "DRAFT TEMPLATE — COMPLETE & DELETE THIS PANEL BEFORE ISSUE" panel. The deal-specific values (customer entity, dates, selected tier, fees, PO) are completed in Word; the **commercials and legal scaffolding are baked in** so they don't drift between deals. Resolve every drafting note and delete the panel before the form is issued.

## How to generate

```bash
cd scripts
node build_of_subscription.js     # -> Novagentica_OF_Subscription_DRAFT.docx
node build_of_ps.js               # -> Novagentica_OF_Professional_Services_DRAFT.docx
```

(Requires the `docx` package on the Node path, as for the other Novagentica generators.)

## When to use / not use

Use when the deliverable is a **commercial order form** the customer signs to buy the subscription and/or the services. Triggers: "draft the subscription order form", "update the PS order form", "re-issue the OF with the new tier".

- Want the proposal, Gantt, SoW and decks → `novagentica-engagement-pack`.
- Want the MSA, an NDA or a DPA → those are legal documents (counsel), not a skill.
- Want slides → `novagentica-presentation`.

## Commercials — where the figures live (single source per figure)

The agreed commercial constants are set in the generator scripts, **in one place each**, so they don't drift between documents. Change a figure here and only here:

- **Tier pricing** (Subscription) — the tier table in `build_of_subscription.js`: **Domain CHF 150,000 / Enterprise CHF 600,000 / Global CHF 1,200,000**, agents governed, runs/month, runtimes, CDAP™ refresh, support.
- **Standard term** — **36 months** (Subscription → Order details).
- **Renewal / uplift** — auto-renews unless 90 days' notice; on renewal, the greater of 5% or the change in Swiss CPI.
- **Day rate** (PS) — **CHF 2,500 / person-day** in `build_of_ps.js`.
- **Travel** (PS) — expenses at cost; private car CHF 0.70/km (max 500 km/day) only where no reasonable train/flight exists; accommodation caps CHF 140 (CH) / CHF 190 (abroad).
- **Currency** — **CHF throughout**. Payment terms **Net 14**.

## Brand & structure (in `nvg_helpers.js`)

Cream `#FAFBF6`, crimson `#CC0D2C` accent, ink `#1A1A1A`, Inter (sans) + Georgia (serif), lowercase `novagentica` wordmark masthead, crimson section rules, A4 portrait, "Confidential" header, MSA/Swiss-law footer with page numbers. Keep master legal terms (liability, IP, warranties, confidentiality, data protection) **in the MSA/DPA** — the order forms point to them, they do not restate them.

## Guardrails baked in (do not silently undo)

- **No Salesforce OEM/ISV block.** Salesforce Agentforce is a runtime Novagentica *enforces over* — explicitly "not resold; no OEM/ISV relationship". Never reintroduce the Xotigo Salesforce Platform Provisions.
- **Real over-consumption clause** (not the legacy "xyz" placeholder): committed volume, overage rate, no-interruption, sustained over-use → tier conversation, minimum commitment.
- **Marketing & reference rights default ON** in the Subscription form (7 clauses). Defence/regulated customers (e.g. Hensoldt) routinely refuse logo use and press commitments — strike or negotiate before issue rather than deleting the default silently. Procurement-only signatories often can't bind the press/G2/reference commitments — expect routing through Customer Communications.

# Hensoldt order-form generators (deal NG-2026-HE-001)

Deal-specific instances of the [`novagentica-order-form`](../../SKILL.md) skill,
pre-filled from the Hensoldt deal record (Notion `💼 Hensoldt`) and the 24 Jun 2026
commercial update. They reuse the skill's brand helpers at `../../scripts/nvg_helpers.js`;
the skill's own template scripts are left untouched.

## What they produce

- **`build_of_subscription.hensoldt.js`** → `Novagentica_OF_Subscription_HENSOLDT_DRAFT.docx`
  - **Enterprise** tier, **CHF 600,000 ARR**, 36-month term (01.07.2026–30.06.2029)
  - Six-month **Enterprise-at-Domain-price** introduction (01.07–31.12.2026); 4-week
    opt-out to remain on Domain before 31.12.2026; full Enterprise pricing from 01.01.2027
  - Payment schedule **150k / 225k / 600k / 600k = CHF 1,575,000** (verbatim from the deal)
  - Auto-renewal: fixed 12-month periods, +12% uplift; overage clause removed from the form
  - Full **available-runtimes** overview (all 9, included under Enterprise)
  - Marketing & reference rights **retained as a negotiation route** (defence customer)

- **`build_of_ps.hensoldt.js`** → `Novagentica_OF_Professional_Services_HENSOLDT_DRAFT.docx`
  - **Fixed price CHF 67,500** (27 person-days @ CHF 2,500), **payable 100% upfront**
  - MVP1 RFI/RFQ governance (2d) · MVP2 SuccessFactors candidate screening (5d, Annex III
    high-risk, works-council gated) · MVP3 SAP source-to-PO (20d)

## Run

Requires the `docx` package on the Node path (as for the skill's own scripts).

```bash
cd skills/novagentica-order-form/deals/hensoldt
node build_of_subscription.hensoldt.js
node build_of_ps.hensoldt.js
```

## Before issue

Contracting entity (HENSOLDT AG) and signatory (André Scheidhammer, CIO) are baked in.
Still to complete: Hensoldt VAT no., accounts-payable billing e-mail, and the PO (if
required). The commercial-register entry (Amtsgericht München, HRB 234461) should be
spot-checked against current Handelsregister data before the form is issued.

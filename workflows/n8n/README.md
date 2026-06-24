# Novagentica n8n Workflows

Version-controlled backup of the Novagentica automation workflows running on
**[int-novagentica.app.n8n.cloud](https://int-novagentica.app.n8n.cloud)**.

Each file in [`workflows/`](workflows/) is a **slim, importable** export of one workflow
(the duplicated `activeVersion` block is stripped). **No secrets are stored** — n8n
credentials are referenced by ID only, never by value.

## Workflows

| File | Workflow | What it does | Trigger |
|---|---|---|---|
| [`meeting-router.json`](workflows/meeting-router.json) | **Meeting Router** | Classifies every Fireflies meeting (Sales / Vendor / Partner / Investor / Other) and routes it — sales → proposal flows, others → tagged Meetings record. See the [runbook](docs/meeting-router-runbook.md). | Schedule (15 min poll) |
| [`full-proposal-generation.json`](workflows/full-proposal-generation.json) | FULL: Proposal Generation | Qualified/Solution-Validation deals → Use Case Library + Claude Opus → Google Docs SoW + Slides deck + Notion Project + Slack approval. | Called by Meeting Router |
| [`expansion-addendum-generation.json`](workflows/expansion-addendum-generation.json) | EXPANSION: Addendum Generation | Signed/Expansion deals → looks up the Notion project → Claude drafts an expansion addendum in Google Docs → updates Notion + Slack. | Called by Meeting Router |
| [`light-meddpicc-writeback.json`](workflows/light-meddpicc-writeback.json) | LIGHT: MEDDPICC Writeback | Strategic-Conversation deals → Claude extracts MEDDPICC → writes back to the Deals DB + Slack. | Called by Meeting Router |
| [`use-case-deck-generator.json`](workflows/use-case-deck-generator.json) | Use Case Deck Generator | Generates a 3-slide deck via Claude when a Use Case Library entry changes; saves to Drive and links it back. | Notion trigger |
| [`use-case-batch-runner.json`](workflows/use-case-batch-runner.json) | Use Case Batch Runner | Nightly: generates a deck for every use case missing one. | Schedule (23:00) / manual |
| [`deal-solution-validation-setup.json`](workflows/deal-solution-validation-setup.json) | Deal → Solution Validation Setup | When a deal hits Solution Validation, creates the Slack channel, Drive folder, and Notion project, then writes them back to the Company. | Notion poll (5 min) |
| [`slack-documents-db-sync.json`](workflows/slack-documents-db-sync.json) | Slack → Documents DB Sync | When a file/Drive link is shared in a customer channel, logs a Documents DB entry in Notion. | Slack trigger |
| [`novagentica-board-pack.json`](workflows/novagentica-board-pack.json) | Novagentica Board Pack | Monthly: fetches the board-pack PDF, uploads to Drive, emails the link. | Schedule (1st, 09:00) / webhook |
| [`deck-generator-error-alerts.json`](workflows/deck-generator-error-alerts.json) | Deck Generator — Error Alerts | Catch-all error handler that DMs Shiv on Slack when a linked workflow fails. | Error trigger |

## Shared Notion data model

| Database | ID |
|---|---|
| Companies (has the `Type` field) | `19bba828-e94d-4d2f-919d-ddd2c6991302` |
| Contacts | `b8e23af0-9320-4d0b-95f4-2516be716df4` |
| Deals | `684b3c1e-f30e-4a67-99ea-03a32283f7d2` |
| 📝 Meetings | `be0a73a826854e5c827e15ba07dd315c` |
| Projects | `43233c61-f84e-4a55-b301-03d760d9259e` |
| Use Case Library | `67d44f8d-ca02-4178-8b9f-cecb2d4301c6` |
| Action Items | `ddee5caa4a064ec0b825a40dc662d04d` |
| Decisions | `834391f4091b4bf8b843e6339a4d95d6` |

## Restoring a workflow

1. In n8n: **Workflows → Import from File** and select the JSON.
2. Re-bind credentials (Anthropic, Notion, Slack, Google) on each node — they are not included in the export.
3. For HTTP Request nodes that call Notion/Anthropic, set the predefined credential in the node UI.

> Exported via the n8n API on **2026-06-19**. For a guaranteed-faithful restore of the
> proposal workflows (which contain large code nodes), re-export directly from the n8n UI
> (workflow **⋯ → Download**) — the live instance is the source of truth.

## Docs

- [Meeting Router — Call Classification runbook](docs/meeting-router-runbook.md)

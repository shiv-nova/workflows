# 🧭 Meeting Router (n8n) — Call Classification

How Fireflies meeting transcripts get classified (Sales / Vendor / Partner / Investor / Other)
and routed. This is the technical runbook for the n8n **Meeting Router** workflow
(`GXTUGhp5nzdgpsPW`). Last redesigned June 2026.

> **TL;DR:** Every external meeting is classified AI-first by Claude (Sonnet 4.6) using the
> transcript + CRM `Type` as a hint. Sales calls feed the proposal flow; vendor/partner/
> investor/other calls get a tagged record in the 📝 Meetings DB plus a Slack notice. The CRM
> `Type` field is a *hint*, not the decider.

## Flow (external meetings)

```
Fetch Fireflies Transcript
  → Extract External Attendees   (internal = @novagentica.com / .ai)
  → Lookup / Create Contact → Get Company → Classify Company Type
  → Build Classifier Prompt      (rubric + meeting context + CRM hint)
  → AI Classify Call Type        (Claude Sonnet 4.6, native Anthropic node, max_tokens 1024)
  → Parse Classification         (JSON parse + regex fallback + AI-vs-CRM disagreement flag)
  → Route by Call Type ─┬ SALES    → Get Open Deals → Route by Deal Stage → LIGHT/FULL/EXPANSION
                        └ VENDOR/PARTNER/INVESTOR/OTHER
                              → Check External Meeting Exists → External Meeting Exists?
                                   └ (not a dup) → Create External Meeting Record → Notify Classified Call
```

Meetings with **no external attendees** branch earlier into the internal-meeting path
(Classify Internal Meeting → Meetings DB).

## Category taxonomy & routing

| AI category | Meetings DB `Type` | What happens |
|---|---|---|
| **SALES** | Sales call | Existing deal flow (proposal generation) |
| **VENDOR** | Vendor | Tagged record in 📝 Meetings + Slack notice |
| **PARTNER** | Partner | Tagged record in 📝 Meetings + Slack notice |
| **INVESTOR** | Investor | Tagged record in 📝 Meetings + Slack notice |
| **OTHER** | Other | Tagged record + Slack notice (catches unknown/new companies — no silent drops) |

Maps to the Companies DB `Type` values: Client/Prospect → SALES, Vendor → VENDOR,
Partner → PARTNER, Investor → INVESTOR, none → OTHER.

## How classification works

- **AI-first.** `AI Classify Call Type` (Claude Sonnet 4.6) reads meeting title, Fireflies
  type, overview, gist, topics, and external email domains, and returns strict JSON
  `{category, confidence, reasoning}`.
- **CRM is a hint.** The company's CRM `Type` is passed into the prompt but the model can
  override it when the transcript clearly says otherwise. A "who is selling to whom" decision
  rule disambiguates: if the external party is pitching something Novagentica would buy (or
  Novagentica is reviewing their proposal/pricing) → VENDOR; if Novagentica is selling its own
  services → SALES.
- **Robust parsing.** `max_tokens` is 1024 (a smaller value truncates verbose reasoning into
  invalid JSON), and `Parse Classification` has a regex fallback that recovers
  `category`/`confidence` even from a truncated response.
- **Disagreement & low confidence are surfaced.** `Parse Classification` computes `agree`
  (AI vs CRM) and `needsReview` (disagreement OR confidence < 0.6) → a ⚠️ REVIEW prefix in the
  Slack notice and a yellow callout on the Notion record.
- **The rubric to tune** lives in the `Build Classifier Prompt` code node. To add or reword a
  category, edit it there + the `NOTION_TYPE`/`EMOJI` maps in `Parse Classification` + add a
  branch in `Route by Call Type`.

## Feeds into → Proposal workflows

The SALES branch is a **gate, not a generator** — it only forwards to proposal building when
the company has an open deal. `Get Open Deals` → `Find Best Deal` → `Has Open Deals?`:

- **No open deal** → `Alert No Open Deal` (Slack). A sales call with no CRM deal is flagged.
- **Has a deal** → `Route by Deal Stage` switches on the *matched deal's* `Stage`:

| Deal stage | Calls | Output |
|---|---|---|
| Strategic Conversation | LIGHT: MEDDPICC Writeback | MEDDPICC extracted → Deals DB + Slack |
| Qualified Opportunity / Solution Validation | FULL: Proposal Generation | SoW + Slides deck + Notion Project + Slack approval |
| Signed / Expansion | EXPANSION: Addendum Generation | Expansion addendum in Google Docs + Notion + Slack |
| Lead | — | STOP |
| Commercial / Procurement | — | STOP |

The `Execute Workflow` nodes pass the full `Find Best Deal` bundle (meeting + deal + company +
contact + `flowType`) to each sub-workflow.

## Records & de-duplication

- Non-sales calls create a 📝 Meetings page with `Type` = category, the company/contact
  relations, and a page body holding the classification callout + summary + transcript link.
- **Idempotency:** keyed on a `Fireflies ID` rich-text column. `Check External Meeting Exists`
  queries it before creating; duplicates are skipped.

## Gotchas

- **n8n MCP can't bind predefined credentials to HTTP Request nodes.** The two Notion HTTP
  nodes (`Create External Meeting Record`, `Check External Meeting Exists`) need their **Notion
  account** credential picked manually in the n8n UI. (The Anthropic call uses the native
  `@n8n/n8n-nodes-langchain.anthropic` node, which binds fine.)
- **`Deduplicate Transcripts`** node is disabled — the `Fireflies ID` guard is the dedup net.
- **Orphaned WIP:** `Claude Meeting Classifier` + `Parse Meeting Category` were an earlier
  half-built attempt; disconnected (won't run). Safe to delete.

## Change log

- **June 2026 — AI-first classification redesign.** Replaced binary `Is Customer?/Is Supplier?`
  substring logic (which merged Vendor+Investor+Partner) with the Claude classifier + 5-way
  router. Removed two silent dead-ends and the no-op `Is Sales Meeting Type?` node. Added the
  `Fireflies ID` dedup guard. Raised `max_tokens` to 1024 + regex parse fallback + a "who is
  selling to whom" decision rule (caught live: a vendor call was truncating to OTHER).

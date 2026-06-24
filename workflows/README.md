# n8n workflows

Workflows run live in n8n (`int-novagentica.app.n8n.cloud`) and are versioned there
(draft vs published — edits require an explicit **publish** to go live). This folder holds
design docs and point-in-time exports.

## State (2026-06-24)
| Workflow | State |
|---|---|
| FULL: Proposal Generation | Use Case Library repointed to canonical `3a0c6e0a-…` (published). Generation core still drifted — **FULL-v2 rewire** designed in `FULL-rewire/brief-builder.md`: brief-builder → `/sow` + `/summary` service render. Stage on the draft, validate with a real run, then publish. |
| LIGHT: MEDDPICC Writeback | Fixed + published — positioning corrected; confidence-flags bug fixed (writes Claude's parsed flags, not a hardcoded five). |
| EXPANSION: Addendum Generation | Positioning corrected + published. Full rewire pending `/addendum` (needs `build_addendum`). |
| Use Case Deck Generator | Clean. Reads canonical library `3a0c6e0a-…`. (Rotate the previously-hardcoded Anthropic key if not already done.) |

## Exporting a snapshot
n8n UI → open workflow → ⋯ menu → **Download** → save the JSON here as `<name>.json`.

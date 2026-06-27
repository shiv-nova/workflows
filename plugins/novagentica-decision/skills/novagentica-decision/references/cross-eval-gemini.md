# Cross-Eval — sandbox-native Gemini path

The type-1 safeguard is a genuine second-model review of the finished memo. The `c-level-agents`
`/cs:cross-eval` command assumes a model CLI (codex/gemini) lives where the agent runs — but in
the Cowork sandbox the agent is isolated from the user's Mac, so a Mac-installed CLI is unreachable.
This path gives a real second model **without any CLI**, via a direct Gemini API call.

## What works (and what doesn't) from the sandbox

- ✅ Direct HTTPS to `generativelanguage.googleapis.com` with the **`X-goog-api-key: <key>`** header.
- ❌ `?key=` query param and `Authorization: Bearer <token>` → both return 401 here.
- ❌ A Mac-installed `gemini` / `codex` CLI → not on the sandbox PATH.
- ❌ OpenAI/codex → reachable, but needs a valid `sk-…` key (a Gemini key 401s against OpenAI).
- ⚠️ A `503 UNAVAILABLE` is **not** an auth failure — it's transient model overload. Retry / fall
  to the next model. Only `401/403` means a bad key.

## How to run it

```bash
GEMINI_API_KEY=<AIza… or AQ.… key> python3 scripts/gemini_review.py <memo-path.md>
```

`scripts/gemini_review.py` sends the standard adversarial reviewer prompt + the memo, tries
`gemini-2.5-flash → gemini-flash-latest → gemini-2.0-flash` with short retries (stays inside a ~40s
tool budget), and prints the review. The key is read from the environment only.

## Key handling (non-negotiable)

- Supply the key **inline at call time** (`GEMINI_API_KEY=… python3 …`). Each sandbox shell starts
  clean, so there is no persistent env var to set — and that is the safer pattern anyway.
- **Never** hardcode the key in the script, echo it, write it to memory, or save it to the workspace
  folder (the workspace persists on the user's machine).
- A key pasted into chat is in the transcript — tell the user to **rotate it** afterwards.
- If no key is available, do not block: fall back to `/cs:cross-eval` (which still runs Claude-only
  adversarial mode) or ask the user to run a model CLI on their Mac and paste the output.

## Reconcile into a two-model verdict

After collecting the Gemini review, run the three Claude adversarial passes (standard / devil's
advocate / steelman from `inline-board.md` spirit) and reconcile:

- **Cross-model consensus** = concerns/supports flagged by *both* Claude and Gemini → the strong signal.
- **Divergent** = raised by one model only → note it; act on it if it's a genuine catch, flag as
  possible noise otherwise.
- **Vote tally** across all passes → 🟢 GO (2+ APPROVE, no CRITICAL) / 🟡 PAUSE (any DEFER or CRITICAL) /
  🔴 STOP (2+ REJECT).

Write the result to `decisions/<date>-<slug>-CrossEval-vN.md`. Label the models used; a two-model run
supersedes any single-model run on the same memo.

## Why bother

Single-model review has systematic blind spots. In live testing, adding Gemini caught a flaw all three
Claude passes missed — a memo calling a decision "type-1 irreversible" while offering "pilot one hire"
as mitigation (a pilot caps exposure; it does not make the choice reversible). That is exactly the
class of error a true second model exists to surface.

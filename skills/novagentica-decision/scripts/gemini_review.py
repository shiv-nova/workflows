#!/usr/bin/env python3
"""Sandbox-native Gemini cross-eval reviewer for the novagentica-decision skill.

Sends a decision memo to the Gemini API as an independent C-suite reviewer and prints
the review. No CLI required — uses a direct HTTPS call with the X-goog-api-key header,
which is what works from the sandbox (the `gemini` CLI and OAuth bearer tokens do not).

Usage:
    GEMINI_API_KEY=<key> python3 gemini_review.py <memo-path>

Security:
    - The key is read from the environment, never hardcoded and never written to disk.
    - Supply it inline at call time:  GEMINI_API_KEY=... python3 gemini_review.py memo.md
    - Do NOT echo the key, commit it, or save it to memory / the workspace.
    - Treat any key pasted into chat as compromised — tell the user to rotate it.

Exit codes: 0 = review printed; 1 = no key / no memo; 2 = all API attempts failed.
"""
import json, os, sys, time, urllib.request, urllib.error

REVIEWER_PROMPT = (
    "You are an independent C-suite reviewer. The following is a board memo from a "
    "company's boardroom. Identify the top 3 concerns, the top 3 supports, and your vote "
    "(APPROVE / REJECT / DEFER). Do not deferentially agree — assume the memo's reasoning "
    "is flawed until proven otherwise. Be concise and specific.\n\n---MEMO---\n"
)
# Newest-first; falls through on 503/429/500 (transient overload).
MODELS = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.0-flash"]
ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent"


def main():
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        sys.stderr.write("GEMINI_API_KEY not set. Run: GEMINI_API_KEY=<key> python3 gemini_review.py <memo>\n")
        return 1
    if len(sys.argv) < 2:
        sys.stderr.write("usage: GEMINI_API_KEY=<key> python3 gemini_review.py <memo-path>\n")
        return 1

    memo = open(sys.argv[1], encoding="utf-8").read()
    payload = json.dumps({"contents": [{"parts": [{"text": REVIEWER_PROMPT + memo}]}]}).encode()

    for model in MODELS:
        for attempt in range(2):  # keep total runtime within a ~40s tool budget
            try:
                req = urllib.request.Request(
                    ENDPOINT.format(model), data=payload, method="POST",
                    headers={"Content-Type": "application/json", "X-goog-api-key": key},
                )
                with urllib.request.urlopen(req, timeout=30) as r:
                    data = json.load(r)
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                print(f"=== Gemini review (model: {model}) ===\n")
                print(text)
                return 0
            except urllib.error.HTTPError as e:
                if e.code in (503, 429, 500):
                    time.sleep(2 * (attempt + 1)); continue   # transient — retry / next model
                sys.stderr.write(f"{model}: HTTP {e.code} (likely auth/quota) — {e.read().decode()[:160]}\n")
                break  # non-transient: try next model
            except Exception as e:
                sys.stderr.write(f"{model}: {e}\n"); break
    sys.stderr.write("All Gemini attempts failed (overload or invalid key). Fall back to /cs:cross-eval or a Mac CLI.\n")
    return 2


if __name__ == "__main__":
    sys.exit(main())

# Handoff — finishing the native Google Slides / Docs conversion locally

Everything up to here is committed on branch `claude/repo-structure-audit-6be4nj` (PR #11),
plugins at **v1.1.5**. This doc is the local finish plan: calibrate → convert the last 4 docs →
smoke-test → commit. It's written so you (or Claude Code CLI locally) can execute it end to end.

All generators + libs live in `skills/novagentica-engagement-pack/assets/generators/`
(the order-form scripts in `skills/novagentica-order-form/scripts/`). `genservice/` consumes
them; `.mjs` tools are in `scripts/`.

## Done already
| Area | Files |
|---|---|
| Slides lib | `lib/gslides.js` (slide, textBox, rect, roundRect, rotation, line, table) |
| Slide decks (native) | `build_execsummary_gslides.js`, `build_timeline_gslides.js`, `build_proposaldeck_gslides.js`, `build_summary6_gslides.js` |
| Slides validator | `_gslides_selftest.js` — 4 decks, all pass |
| Docs lib | `lib/gdocs.js` (heading, para w/ styled runs, bullet, pageBreak, table) |
| Doc (native) | `build_proposal_gdocs.js` |
| Docs validator | `_gdocs_selftest.js` — proposal passes (offline) |
| genservice | `/generate/gslides/{execsummary,timeline,proposaldeck,summary}`, `/generate/gdocs/proposal` |
| Tools | `scripts/gdocs-calibrate.mjs` (table-index calibration), `scripts/gapi-execute.mjs` (live render) |

## Remaining
1. **Calibrate the Docs table constant** (do first).
2. Convert **SoW**, **Gantt**, **order-form subscription**, **order-form PS** to `gdocs`.
3. Live smoke-test one deck + one doc, tweak fidelity.
4. Regenerate plugins, commit, push.

---

## 0. Setup
```bash
git fetch origin claude/repo-structure-audit-6be4nj && git checkout claude/repo-structure-audit-6be4nj
cd genservice && npm install        # docx / pptxgenjs / express (needed only to run the ORIGINAL generators)
# the *_gslides / *_gdocs generators are pure JS + the libs — they need only `node`.
```
Short-lived Google token (scopes cover slides+docs+drive so one token does everything):
```bash
export GOOGLE_ACCESS_TOKEN="$(gcloud auth print-access-token \
  --scopes=https://www.googleapis.com/auth/presentations,https://www.googleapis.com/auth/documents,https://www.googleapis.com/auth/drive.file)"
```
Use a throwaway/test Google account; the token dies in ~1h; revoke after. Ensure egress to
`*.googleapis.com` is allowed.

## 1. Calibrate the Docs table indices (the one unverified piece)
```bash
node scripts/gdocs-calibrate.mjs
```
If it prints **MISMATCH**, edit `TABLE` at the top of
`skills/novagentica-engagement-pack/assets/generators/lib/gdocs.js` to the derived values, then:
```bash
cd skills/novagentica-engagement-pack/assets/generators && node _gdocs_selftest.js
```
Re-run `gapi-execute` on the proposal (below) and confirm the tables are aligned.

## 2. Convert the remaining doc generators
For each original: `build_sow.js`, `build_gantt.js`,
`../../novagentica-order-form/scripts/build_of_subscription.js`, `.../build_of_ps.js` →
create `build_<name>_gdocs.js`. Use `build_proposal_gdocs.js` as the worked example.

**`docx` → `lib/gdocs` mapping** (sizes: docx half-points → points, i.e. `/2`):

| docx | `lib/gdocs` `Doc` |
|---|---|
| `new Document(...)` | `const doc = new Doc(title)` |
| `Paragraph({heading:HEADING_1, ...})` | `doc.heading(text, {level:1, size, color, spaceBefore, spaceAfter})` |
| `Paragraph({children:[TextRun...]})` | `doc.para(runs, {align, spaceAfter, indent})` where `runs=[{text,bold,italic,color,font,size}]` |
| `Paragraph({numbering:{...bullets}})` | `doc.para(runs, {bullet:true})` |
| `new PageBreak()` | `doc.pageBreak()` |
| `new Table({rows:[TableRow[TableCell...]]})` | `doc.table(rows, {border:{color,pt}})`, `rows=[[cell,…]]`, `cell={runs\|text, fill, align, bold, color, size, font}` |
| `TableCell({shading:{fill}})` | cell `{fill: "HEX"}` |
| `AlignmentType.CENTER/RIGHT` | cell/para `align:"center"\|"right"` |
| footer with `PageNumber.CURRENT` | **not API-insertable** — stamp a wordmark line; add page numbers in the Doc UI or via a Docs footer segment step (documented limitation) |

Keep each generator's spine parsing / `reconcile` / `preflight` **unchanged**; swap only the render
surface. Colours/fonts come from `lib/brand` — never hard-code hex (the validator rejects it).

**Order forms:** they render via `skills/novagentica-order-form/scripts/nvg_helpers.js` (docx). Port
the helpers you use (`head`, `body`, `clause`, table builders, `sigBlock`, `write`) onto `Doc`
primitives inside the new `*_gdocs.js`, or add a small `nvg_helpers_gdocs.js` next to it. The order
forms take **no brief** (they inline content), so the generator writes its payload straight out.

Register each new generator in `_gdocs_selftest.js` `REGISTRY` (with a spine that exercises it and a
couple of text probes) and make `node _gdocs_selftest.js` green.

## 3. Wire genservice endpoints
Add each to the `GDOCS` map in `genservice/server.js`:
```js
const GDOCS = { proposal: "build_proposal_gdocs.js", sow: "build_sow_gdocs.js",
  gantt: "build_gantt_gdocs.js", "orderform/subscription": "build_of_subscription_gdocs.js",
  "orderform/ps": "build_of_ps_gdocs.js" };
```
(For the order forms, note `generateJsonPayload` currently requires `body.brief`; give them a
no-brief variant or pass an empty brief, mirroring how the `.docx` order-form routes use
`briefRequired:false`.)

## 4. Live smoke test (the payoff)
```bash
cd skills/novagentica-engagement-pack/assets/generators
node build_proposal_gdocs.js ../engagement.legacy.example.json /tmp/doc.json
node /path/to/repo/scripts/gapi-execute.mjs /tmp/doc.json --type=docs      # prints a Google Doc URL
node build_execsummary_gslides.js ../engagement.legacy.example.json /tmp/deck.json
node /path/to/repo/scripts/gapi-execute.mjs /tmp/deck.json --type=slides   # prints a Slides URL
```
Open the URLs, compare against the `.pptx`/`.docx` the original generators produce (run those via
`genservice`), and adjust positions/sizes/fills where they drift. Known fidelity notes: fonts render
only if Inter/Georgia are available to the account; Slides `ROUND_RECTANGLE` corner radius is fixed;
Docs footers/page-numbers need a manual/UI step.

## 5. Finish
```bash
node scripts/build-plugins.mjs --version=1.1.6     # regenerate plugins with the new generators
node scripts/build-plugins.mjs --no-bump           # confirm idempotent
git add -A && git commit -m "Complete native Google Docs conversion (sow, gantt, order forms) + live-calibrated table indices"
git push origin claude/repo-structure-audit-6be4nj
```
Update `workflows/n8n/docs/gslides-execution-runbook.md` (endpoints list + the Docs execution steps)
and the README `genservice` table so the live surface matches.

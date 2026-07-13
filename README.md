# Novagentica — skills, plugin marketplace & generator service

The durable home for everything that previously lived only in the Claude.ai skills sandbox
or on a local disk. **If a version question ever arises, this repo wins.**

It is three things that share one source of truth:

1. **`skills/`** — the canonical Claude.ai skills. Every fact, script, and asset lives here once.
2. **A Claude Code / Cowork plugin marketplace** (`plugins/` + `.claude-plugin/marketplace.json`)
   — each skill published as an installable plugin. Everything under `plugins/` is **generated**
   from `skills/`; never hand-edit it.
3. **`genservice/`** — an Express service that renders the canonical generators over HTTP, used
   by n8n. It runs the *same* generator code the skills ship — no copies.

## Layout

| Path | What it is | Edited by hand? |
|---|---|---|
| `skills/<name>/` | Canonical skill: `SKILL.md`, scripts, `assets/`, `references/`. **Single source.** | ✅ yes |
| `.claude-plugin/marketplace.json` | Curated plugin catalog (display metadata per skill). | ✅ yes |
| `plugins/<name>/` | Generated marketplace wrapper (real skill copy + `plugin.json` + agent). | ❌ generated |
| `.claude/skills/<name>` | Symlink → `skills/<name>`, so the skills are active inside this repo. | ❌ generated |
| `genservice/` | `nvg-genservice` Express app. Generators are pulled from `skills/` at build. | ✅ `server.js` only |
| `scripts/` | Repo tooling (`build-plugins.mjs`, `sync-brand.mjs`). | ✅ yes |
| `workflows/` | n8n design docs + export notes (the workflows run live in n8n). | ✅ yes |

## Install as a Claude Code marketplace

```shell
# 1. Register the marketplace (must be a git/GitHub source so the plugin copies come along)
/plugin marketplace add shiv-nova/workflows

# 2. Install the skills you want (plugin@marketplace)
/plugin install novagentica-presentation@novagentica-skills
/plugin install novagentica-engagement-pack@novagentica-skills
/plugin install cfo-advisor@novagentica-skills

# Browse / manage
/plugin
/plugin marketplace update novagentica-skills
```

Installed skills are namespaced by plugin, e.g. `/novagentica-presentation:novagentica-presentation`,
and Claude also invokes them automatically when a task matches. Each plugin ships **both a skill
and a matching agent**, so it surfaces in skill-based clients *and* in **Cowork** (which lists
plugin *agents*).

### Available plugins (`@novagentica-skills`)
| Plugin | What it does |
|---|---|
| `cfo-advisor` | Startup-CFO frameworks: models, unit economics, fundraising, board packs. |
| `investor-document-audit-skill` | Red-team audit of investor decks, models, memos (+ brand check). |
| `novagentica-decision` | Internal strategic decisions → branded Decision Memo (DOCX + MD). |
| `novagentica-delivery` | Delivery artefacts: Gantt, timeline, SoW, RACI, governance. |
| `novagentica-engagement-pack` | Transcript + fit deck → full engagement artefact suite. |
| `novagentica-order-form` | Subscription + professional-services order forms under the MSA. |
| `novagentica-presales-solution-design` | Discovery → proposal → plan pipeline (order-form handoff). |
| `novagentica-presentation` | Novagentica-branded `.pptx` decks. |
| `novagentica-use-case-library` | By-vertical, reusable 3-slide use-case tiles. |

## How packaging works — and how to change it

`skills/` is the only place you edit. `plugins/` is a **build artifact** that is committed
(the git marketplace needs it present in the repo — a `.gitignore`'d `plugins/` would install
empty). One command regenerates it:

```bash
node scripts/build-plugins.mjs            # bump patch, regenerate plugins/, refresh symlinks
node scripts/build-plugins.mjs --version=1.2.0   # set an explicit version
node scripts/build-plugins.mjs --no-bump  # regenerate without touching versions
```

`build-plugins.mjs`, for every entry in `marketplace.json`:
- refreshes `plugins/<name>/skills/<name>/` as a **real (dereferenced) copy** of `skills/<name>` —
  never a symlink. (Cowork copies a plugin's `source` folder as-is and does not follow a symlink
  that escapes it, which used to leave installed skills empty.)
- writes `plugins/<name>/.claude-plugin/plugin.json` from the catalog fields,
- keeps a hand-tuned `agents/<name>.md` if present, generates a default if missing,
- **bumps the version** in the catalog and every `plugin.json` (kept in sync), so clients actually
  pull the change — a stale version string leaves installed users on their cached copy,
- prunes any `plugins/<name>` / `.claude/skills/<name>` not in the catalog.

**To add a skill:** create `skills/<name>/`, add a catalog entry to `marketplace.json`, run
`build-plugins.mjs`, commit. **To remove one:** delete its `skills/<name>/` and catalog entry, run
the script (it prunes the rest), commit.

> The nested `skills/<name>/SKILL.md` layout inside each plugin (rather than a bare `SKILL.md` at
> the plugin root) is used because a root `SKILL.md` is only recognised by Claude Code v2.1.142+.
> The nested layout works everywhere.

### Brand is one file, everywhere

Every skill's `assets/brand.md` is the same canonical digest (cream `#FAFBF6`, ink `#0E0E0C`,
crimson `#CC0D2C`, Inter + Georgia). Keep them identical with:

```bash
node scripts/sync-brand.mjs           # copy the canonical digest into every skill's brand.md
node scripts/sync-brand.mjs --check   # CI: exit 1 if any brand.md has drifted
```

Canonical source: `skills/novagentica-engagement-pack/assets/brand.md`. The order-form skill also
**inlines** these tokens in `nvg_helpers.js` (so it installs standalone); those values must mirror
`lib/brand.js` — treat `lib/brand.js` as canonical.

## Generator service (`genservice/`)

`nvg-genservice` is a thin HTTP wrapper: it writes the brief to a temp dir, runs the **canonical
generator script from `skills/`**, and streams the produced file back. It re-implements no
rendering — one source of truth; n8n orchestrates, this renders.

The generator scripts are **not copied** into `genservice/`. They are pulled straight from `skills/`:
- **Docker** COPYs them from `skills/` (so the image is built from the **repo root**).
- **Local dev** populates gitignored `genservice/generators` + `genservice/orderforms` from `skills/`
  via `genservice/sync.js`, run automatically by `npm start`'s `prestart` hook.

Live: `https://n5mf8kbiuj.eu-central-1.awsapprunner.com`

| Endpoint | Status |
|---|---|
| `GET /health` | live |
| `POST /generate/summary` | live (canonical) |
| `POST /generate/timeline` | live (canonical) |
| `POST /generate/sow` | live (canonical) |
| `POST /generate/orderform/subscription` | live |
| `POST /generate/orderform/ps` | live |
| `/generate/proposal`, `/addendum`, `/gantt`, `/execsummary`, `/proposaldeck` | pending |

Auth: `Authorization: Bearer $NVG_TOKEN` (App Runner env var; never commit it).

### Redeploy (build from the repo root — generators come from `skills/`)
```bash
docker build --platform linux/amd64 -f genservice/Dockerfile -t nvg-genservice .
ECR=845041270643.dkr.ecr.eu-central-1.amazonaws.com
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin $ECR
docker tag nvg-genservice:latest $ECR/nvg-genservice:latest
docker push $ECR/nvg-genservice:latest
ARN=$(aws apprunner list-services --region eu-central-1 \
  --query "ServiceSummaryList[?ServiceName=='nvg-genservice'].ServiceArn" --output text)
aws apprunner start-deployment --service-arn $ARN --region eu-central-1
```

## Skills — current state
| Skill | State |
|---|---|
| `novagentica-engagement-pack` | **v2 foundation** (shared `lib/` + `reconcile()`, selftest). `build_sow` on lib/preflight; `build_proposal`, `build_execsummary`, `build_proposaldeck`, `build_gantt` still inline — pending conversion. |
| `novagentica-order-form` | Two-form generators (`build_of_subscription.js` + `build_of_ps.js`). Brand tokens mirror `lib/brand.js`. |
| `novagentica-delivery` | SoW / Gantt / RACI / governance. |
| `novagentica-presentation` | Canonical PPTX brand layer (cream/crimson, Inter+Georgia). |
| `novagentica-use-case-library` | 3-slide tile generator. |
| `novagentica-presales-solution-design` | Discovery → proposal → plan pipeline (front door; hands off to order-form + delivery). |
| `novagentica-decision`, `cfo-advisor`, `investor-document-audit-skill` | Internal tooling. |

**Commercial source of truth:** `novagentica-engagement-pack/.../lib/commercials.js` `reconcile()`.
Every skill imports from `lib/`; nothing inlines commercials.

## Conventions
- Prompt, don't fabricate (preflight exits non-zero on missing critical inputs; gaps render `[TBC]`).
- Swiss law, CHF, Art. 100 CO carve-outs, EU AI Act + Swiss FADP dual-framework.
- Brand: cream `#FAFBF6`, ink `#0E0E0C`, crimson `#CC0D2C`, Inter (headings) + Georgia (body), lowercase wordmark.

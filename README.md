# Novagentica — skills + generator service (single source of truth)

This repo is the durable home for everything that previously lived only in the Claude.ai
skills sandbox or on a local disk. If a version question ever arises, **this repo wins.**

It is also a **Claude Code plugin marketplace**: every skill in `skills/` is published as an
installable plugin so anyone can pull just the skills they want. Each plugin ships **both a skill
and a matching agent**, so it surfaces in skill-based clients and in **Cowork** (which lists
plugin *agents*).

## Install as a Claude Code marketplace
Add the marketplace once, then install any skill as a plugin:

```shell
# 1. Register the marketplace (any Claude Code session)
/plugin marketplace add shiv-nova/workflows

# 2. Install the skills you want (plugin@marketplace)
/plugin install novagentica-presentation@novagentica-skills
/plugin install novagentica-engagement-pack@novagentica-skills
/plugin install cfo-advisor@novagentica-skills

# Browse / manage
/plugin                              # interactive browser
/plugin marketplace update novagentica-skills   # pull catalog changes
```

Installed skills are namespaced by plugin, e.g. `/novagentica-presentation:novagentica-presentation`,
and Claude also invokes them automatically when a task matches.

### Available plugins (`@novagentica-skills`)
| Plugin | What it does |
|---|---|
| `cfo-advisor` | Startup-CFO financial frameworks: models, unit economics, fundraising, board packs. |
| `investor-document-audit-skill` | Red-team audit of investor decks, models, and memos. |
| `novagentica-decision` | Internal strategic decisions → branded Decision Memo (DOCX + MD). |
| `novagentica-delivery` | Delivery artefacts: Gantt, timeline, SoW, RACI, governance. |
| `novagentica-engagement-pack` | Transcript + fit deck → full engagement artefact suite. |
| `novagentica-order-form` | Subscription + professional-services order forms under the MSA. |
| `novagentica-presales-solution-design` | Discovery → proposal → plan pipeline (order-form handoff). |
| `novagentica-presentation` | Novagentica-branded `.pptx` decks. |
| `novagentica-solution-design` | Discovery → proposal → plan pipeline (contracts handoff). |
| `novagentica-use-case-library` | By-vertical, reusable 3-slide use-case tiles. |

### How the packaging works
- `.claude-plugin/marketplace.json` (repo root) is the catalog; each entry's `source` points at
  `./plugins/<name>`.
- Each `plugins/<name>/` is a thin plugin wrapper: a `.claude-plugin/plugin.json` manifest, a
  `skills/<name>` **symlink back to the canonical `skills/<name>/`**, and an `agents/<name>.md`
  subagent. The symlink gives the universally-supported `skills/<name>/SKILL.md` layout while
  keeping `skills/` the single source of truth (no files duplicated or moved).
- The `agents/<name>.md` subagent **preloads its plugin's skill** (`skills:` frontmatter) and
  delegates to it, so the skill stays the single source of truth. Agents are what **Cowork** lists
  and runs — a skill-only plugin shows no agents there, which is why each plugin ships one.
- On a Git install, Claude Code copies each plugin into its cache and **dereferences** that symlink
  (its target is inside the marketplace), so the real skill content lands in the cache. This is why
  the marketplace must be added via GitHub / a git URL, not a raw link to `marketplace.json`.
- Each skill directory is self-contained (its scripts/assets live inside it).
- Plugins intentionally **omit** `version`, so each is versioned by its git commit SHA. Every
  push to `main` is a new version, and `Update` / `/plugin update` pulls it — no manual version
  bumping, and no risk of a frozen cache. (If you ever want pinned releases, add `version` back to
  the `plugin.json` files and bump it on every change.)

> Why the wrapper instead of a bare `SKILL.md` per skill: a single `SKILL.md` at a plugin root is
> only recognised by Claude Code **v2.1.142+**, so older clients (and some plugin browsers) show
> "no skills". The nested `skills/<name>/SKILL.md` layout works everywhere.

> The `.claude/skills/*` symlinks are unrelated to the marketplace — they make these skills active
> for anyone working *inside this repo*; the marketplace is for installing them *elsewhere*.

## Layout
- `skills/` — the Claude.ai skills (`/mnt/skills/user/...`), the canonical source for each skill.
  Each is a thin generator layer over a shared `lib/` with a `CONVENTIONS.md` standard.
- `plugins/<name>/` — marketplace plugin wrappers; each symlinks `skills/<name>` back to the
  canonical skill and ships an `agents/<name>.md` subagent. Nothing here is hand-edited —
  regenerate it if you add a skill.
- `.claude-plugin/marketplace.json` — the plugin marketplace catalog (lists all skills as plugins).
- `genservice/` — `nvg-genservice`, the Express service that wraps the canonical generator
  scripts as HTTP endpoints. Deployed to AWS App Runner (Frankfurt, eu-central-1).
- `workflows/` — n8n design docs + export notes. The workflows run live in n8n (which has its
  own versioning); see `workflows/README.md`.

## Generator service — current state
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

Auth: `Authorization: Bearer $NVG_TOKEN` (set as an App Runner env var; never commit it).

### Redeploy
```bash
cd genservice
docker build --platform linux/amd64 -t nvg-genservice .
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
| `novagentica-engagement-pack` | **v2 foundation** (shared `lib/` + `reconcile()`, selftest 19/19). `build_sow` converted to lib/preflight. `build_proposal`, `build_execsummary`, `build_proposaldeck`, `build_gantt` still inline — pending conversion (same 6-edit recipe). |
| `novagentica-order-form` | Done — two-form generators (`build_of_subscription.js` + `build_of_ps.js`). |
| `novagentica-delivery` | SoW/Gantt/RACI. Open: single-A on "Go-live decision". |
| `novagentica-presentation` | Canonical PPTX brand layer (cream/crimson, Inter+Georgia). |
| `novagentica-use-case-library` | 3-slide tile generator; library DB `3a0c6e0a-…` (canonical). |
| `novagentica-presales-solution-design` / `-solution-design` | discovery→proposal pipeline. |
| `novagentica-decision`, `cfo-advisor`, `investor-document-audit-skill` | internal tooling. |

**Commercial source of truth:** `engagement-pack/.../lib/commercials.js` `reconcile()` — 19 selftest
cases. Every skill imports from `lib/`; nothing inlines commercials.

## Conventions
- Prompt, don't fabricate (preflight exits 2 on missing critical inputs; gaps render `[TBC]`).
- Swiss law, CHF, Art. 100 CO carve-outs, EU AI Act + Swiss FADP dual-framework.
- Brand: cream `#FAFBF6`, crimson `#CC0D2C`, Inter (headings) + Georgia (body), lowercase wordmark.

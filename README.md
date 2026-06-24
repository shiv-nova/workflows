# Novagentica — skills + generator service (single source of truth)

This repo is the durable home for everything that previously lived only in the Claude.ai
skills sandbox or on a local disk. If a version question ever arises, **this repo wins.**

## Layout
- `skills/` — the Claude.ai skills (`/mnt/skills/user/...`). Each is a thin generator layer
  over a shared `lib/` with a `CONVENTIONS.md` conformance standard.
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

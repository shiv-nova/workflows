# Deployment Offerings — Novagentica Architect™

**Purpose.** Define the deployment models Novagentica sells, and state precisely what must be
true in the product before each one can be offered. Written against the `web-app-foundation`
codebase (Architect control plane, `runtime/`, `deploy/`, `sdk/`).

**Status: requirements document.** The target claim — *"Multi-tenant SaaS, Single-tenant SaaS,
BYOC and On-Premise/Kubernetes for ultimate infrastructure control"* — is **not yet fully
supportable**. One of the four models ships today, one is scaffolded and CI-proven for the
enforcement plane only, and two have no mechanism in the code at all. This document defines the
four SKUs, the gap register, and the release gates that make each claim safe to put in writing.

The existing whitepaper (`docs/Novagentica-Whitepaper-Enterprise-Autonomy-v2_5.md` §19) already
labels deployment topologies **Partial** and describes three topologies, not four. Any new
four-model claim must supersede §19 deliberately, not contradict it by accident.

---

## 1. Where we actually are

| SKU | Claimable today? | Evidence |
|---|---|---|
| **Multi-tenant SaaS** | **Yes — ship it.** | `tenants` / `tenant_members` with `architect`/`authority`/`control` capability flags; all access funnelled through `src/lib/supabaseQuery.ts`; `user_roles` + `has_role()` SECURITY DEFINER; RLS invariants enforced in CI by `scripts/security-scan-ci.ts` (RLS enabled, ≥1 policy, no unscoped tenant policy, no NULL-tenant bypass) with an **empty** allowlist. |
| **On-Premise — enforcement plane** | **Yes, with the boundary stated.** | `deploy/nemoclaw/policy-edge`: full Passport → SAA → Freshness → Decision Contract chain in one container, signed Ed25519 policy bundles, OpenBao Transit signing, Helm chart, and an **air-gap boot E2E test in CI** (`.github/workflows/policy-edge-tests.yml` → `tests/airgap_boot_e2e.test.ts`) proving deny-by-default with zero egress. |
| **On-Premise — full control plane** | **No — scaffold.** | `deploy/architect-onprem` ships self-hosted Supabase (Postgres, GoTrue, PostgREST, Kong, edge-runtime, Studio) + Helm chart + air-gap-friendly configMap migrations. Its own README: *"This bundle is a **scaffold**."* Blocked by G1–G4 below. |
| **BYOC** | **No.** | No customer-account deployment path, no image pipeline, no per-install config mechanism. Inherits every on-prem blocker plus cloud-account IAM/landing-zone work. |
| **Single-tenant SaaS** | **No.** | One Supabase project exists (`supabase/config.toml` → `project_id = umovzqomrmehmbnqvzmp`). Nothing in the codebase provisions a per-tenant stack; there is no tenancy-mode concept. |

**The strategic read.** Architecture is already plane-separated — Architect (design), Authority
(policy), Control (runtime ops) — and the platform *never executes agent logic*; it issues signed
governance artifacts that runtimes enforce. That separation is the asset. The plane a regulated
buyer actually cares about keeping inside its perimeter is **enforcement**, and that plane is the
one we can already prove offline. Lead with plane-level sovereignty; stage the four-model matrix
behind the gates below rather than claiming it whole.

---

## 2. The four SKUs

Each SKU is defined by **where the two planes run**, because that is the only distinction the
architecture actually enforces.

### SKU 1 — Architect Cloud (Multi-tenant SaaS)
*Available now.*

- Control plane: Novagentica-operated, shared, region-selectable.
- Enforcement: Novagentica-operated Execution Gateway (`execution-gateway-proxy`).
- Isolation: Postgres RLS, tenant-scoped by `supabaseQuery`, CI-verified.
- Buyer: first deployments, non-regulated divisions, speed-to-value.
- **Say:** row-level tenant isolation verified in CI on every schema change; per-tenant signing keys.
- **Don't say:** physical or infrastructure isolation.

### SKU 2 — Architect Private (Single-tenant SaaS)
*Requires G1, G2, G3, G6.*

- Control plane: dedicated stack (own database, own auth, own function runtime, own URL),
  Novagentica-operated in the customer's chosen region.
- Enforcement: dedicated gateway instance.
- Buyer: regulated buyer who accepts a managed service but refuses shared infrastructure.
- **Say:** dedicated database and dedicated encryption/signing keys; no shared data plane;
  independent upgrade window.
- **Don't say:** customer-controlled infrastructure — Novagentica still holds the keys to the estate.

### SKU 3 — Architect BYOC (Bring-Your-Own-Cloud)
*Requires G1–G4, G6, G7.*

- Control plane: deployed into the **customer's** AWS/Azure/GCP account/subscription.
- Data at rest: customer-owned storage, customer-owned KMS/CMK.
- Operations: Novagentica operates it under a delegated-access model; customer can revoke.
- Buyer: enterprise with a mandated landing zone, cloud-spend commitment, or an exit-risk clause.
- **Say:** your account, your KMS keys, your network perimeter, your audit trail; we operate.
- **Don't say:** air-gapped (BYOC still assumes egress for operations and updates).

### SKU 4 — Architect Sovereign (On-Premise / Kubernetes)
Sold in two tiers, because only one of them is real today.

**4a — Sovereign Enforcement** *(available now)*
- Enforcement plane in the customer's datacenter (`policy-edge` / NemoClaw, Docker or Helm).
- Design plane stays in Architect Cloud; policy reaches the edge as **signed bundles** pulled
  outbound-only every 30s. No inbound path into the customer network.
- Air-gapped variant: `AIRGAPPED=true`, bundles side-loaded, no cloud base URL — the boot,
  bundle-verify and fail-closed-deny path is proven in CI.
- **Say:** every runtime call is decided, signed and forwarded inside your perimeter; enforcement
  continues if the link to us is cut; evidence is signed locally and offline-verifiable via
  `GET /vault/public-key`.

**4b — Sovereign Full Stack** *(requires G1–G6)*
- Entire control plane on customer Kubernetes: SPA, Postgres (or external), GoTrue, PostgREST,
  Kong, edge-runtime, Studio, OpenBao.
- **Do not quote or demo this as GA until the gates close.** It is currently a scaffold.

---

## 3. What needs to be true — the gap register

Severity: **P0** blocks the claim outright · **P1** blocks GA but not a design-partner install ·
**P2** required for scale. Effort figures are engineering estimates, not commitments.

### G1 · P0 — Break the hardcoded LLM egress
**The single biggest blocker, and the one that most damages the sovereignty pitch.**

**76 of 349 edge functions hardcode `https://ai.gateway.lovable.dev/v1/chat/completions`.**
The on-prem bundle *declares* `LLM_GATEWAY_URL` (`deploy/architect-onprem/docker-compose.yml:86`,
`helm/architect/templates/configmap.yaml:15`, `.env.template:47`) but **no edge function reads
it** — the variable is inert. `_shared/modelRouter.ts` is the correct abstraction and only **2**
functions use it.

Consequence: an on-prem or BYOC install either loses ~76 AI features or ships prompts containing
customer governance data to a third-party endpoint the customer never approved. In an air-gapped
install it simply fails. This also contradicts the sovereignty claim in the most damaging possible
place — a customer network trace would find it.

**Must be true:** every model call resolves through one shared client that reads
`LLM_GATEWAY_URL` / `LLM_DEFAULT_MODEL` (OpenAI-compatible: Azure OpenAI, Bedrock proxy, NVIDIA
NIM, vLLM), with the tenant routing policy from `modelRouter.ts` applied and the decision logged.
Add a CI check in the style of `no-assistants-api.yml` that fails the build on any new hardcoded
provider URL. *Est. 3–5 eng-weeks (mechanical but wide; needs per-function prompt/response
regression).*

### G2 · P0 — Runtime configuration instead of build-time baking
`deploy/architect-onprem/Dockerfile.spa` takes `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`
as build ARGs, and Vite inlines them into the bundle. So every customer needs their **own image
build** — there is no single artifact to version, sign, scan or support. `helm/values.yaml`
already points at `registry.example.local/novagentica/architect-spa:2026.06`, an image nothing
produces. Separately, the project ref `umovzqomrmehmbnqvzmp` is hardcoded in **8 files under
`src/`** and **4 edge functions**, and Novagentica-operated hostnames
(`openbao.novagentica.com`, `pilot.novagentica.com`) appear as defaults in **13** places.

**Must be true:** one immutable SPA image per release, configured at container start (entrypoint
writes `/config.json`, or `window.__ARCHITECT_CONFIG__` injected by nginx). Zero hardcoded project
refs or Novagentica hostnames outside a defaults module. *Est. 1–2 eng-weeks.*

### G3 · P0 — A real release pipeline
**No CI workflow builds or publishes a container image** (8 workflows exist; none do). There is
no versioned bundle, no SBOM, no image signing, no upgrade path, and no defined supported-version
window. You cannot sell software that runs in someone else's datacenter without a release you can
name, sign and patch.

**Must be true:** tagged release → build + push all images to a public registry and an
air-gap tarball → SBOM + vulnerability scan → cosign signature → published Helm chart with
`appVersion` → documented N-1 support window and a tested upgrade (including the 550 migrations in
`supabase/migrations/`) path. *Est. 2–3 eng-weeks.*

### G4 · P1 — Close the functional holes in the on-prem bundle
The bundle ships **no Realtime service and no Storage service**, but **16 files** under `src/` use
`supabase.channel` / `postgres_changes` and **6** use Storage. `nginx/spa.conf` proxies
`/realtime/` and `/storage/` to Kong, and the Kong config defines only auth, rest and functions —
so those calls 404. Live operational views and file export/upload degrade silently.

Also verify: **14 edge functions call `auth.getClaims`**, which on hosted Supabase resolves via
JWKS. The bundle mints symmetric HS256 keys from `JWT_SECRET` against GoTrue `v2.158.1` — confirm
the fallback path works on the pinned version, or pin a version with asymmetric-key support.

**Must be true:** `realtime` and `storage-api` containers in compose and Helm with Kong routes; a
smoke suite that exercises one realtime subscription and one file round-trip per install; the
`getClaims` path verified on the pinned GoTrue version. *Est. 1–2 eng-weeks.*

### G5 · P1 — Honest per-tenant data-plane story (and fix the on-prem pointer collision)
The UI (`src/components/billing/DataResidencySettings.tsx`) offers regions **eu / us / apac /
on-prem** with a per-client on-prem DB URL and key. Underneath:

- `supabase/functions/data-router/index.ts` proxies **only 6 telemetry tables**
  (`ROUTABLE_TABLES`: flight events/logs, gateway execution logs, telemetry, evidence chain, cost
  events). All governance artifacts — packs, contracts, passports — stay in the central database.
- It is referenced from **2 places**, neither of which is the app's data path
  (`supabaseQuery`): one is a sample webhook URL string, one is a line of PDF copy.
- **Bug:** `onprem-config` writes the customer's DB pointer into the **shared** `data_regions` row
  for `region_code = 'on-prem'`, so a second on-prem customer silently overwrites the first. The
  function's own comments say *"For now"* / *"For MVP"*.
- **Over-claim:** `src/lib/securityDocumentExport.ts:962` tells CISOs *"data-router edge function
  enforces geo-fencing for tenant data flows."* That is not what the code does. **Fix this line
  before it reaches another security review** — a CISO who reads the code will find it.

**Must be true:** either (a) route per-tenant connections through a per-client mapping table with
credentials in the vault, and widen coverage to the tables residency actually applies to; or (b)
retire the on-prem zone from the UI and let SKU 4 carry residency. Correct the exported security
document either way. *Est. 2 eng-weeks for (a) as scoped; 2 days for (b) + the doc fix.*

### G6 · P1 — Enterprise identity
Today: email/password + Google OAuth. The Helm chart exposes `auth.external.azure` (OIDC) but it
is unwired, and defaults `mailerAutoconfirm: true` — wrong for a regulated on-prem install. No
SAML, no SCIM provisioning, no group-to-capability mapping.

Single-tenant, BYOC and Sovereign buyers will all require SSO in procurement, and most will
require SCIM. Note the platform already assumes an IdP elsewhere: `_shared/entitlementSource.ts`
treats the certified roster as *"tenants keep in sync with their IdP."*

**Must be true:** SAML 2.0 + OIDC against the customer IdP, SCIM 2.0 user/group provisioning,
IdP-group → capability-flag mapping, `mailerAutoconfirm: false` by default, enforced admin MFA.
*Est. 3–4 eng-weeks.*

### G7 · P1 — Offline entitlement and metering
Tiers sell committed volume — Domain 100k, Enterprise 500k, Global 20M runs/month — with an
overage clause and 80%/100% notifications. In a customer-run deployment **there is no mechanism to
see or enforce any of that.** `entitlementSource.ts` / `entitlementRevalidation.ts` govern *agent*
entitlements (SAA), not commercial licensing; `subscription_plans` / `client_subscriptions` live
only in the central database.

**Must be true:** a signed, time-bounded licence artifact the install validates offline (tier,
agent ceiling, run allowance, expiry) that **warns and never hard-stops execution** — a governance
product must not become an outage — plus a signed usage export the customer can transmit for
billing, and a documented reconciliation process. *Est. 2–3 eng-weeks.*

### G8 · P2 — Operability for software we don't run
No bundled dashboards (`monitoring.serviceMonitor.enabled: false`), no log-shipping contract, no
documented backup/restore, RTO/RPO, or patch SLA for a customer-run Postgres holding the evidence
chain. Support cannot diagnose an install it cannot see.

**Must be true:** Prometheus rules + Grafana dashboards in the chart, a documented
diagnostic-bundle command, backup/restore runbook with tested restore, and per-SKU SLA definitions
that distinguish what we control from what the customer controls. *Est. 2 eng-weeks.*

---

## 4. Release gates — what unlocks each claim

| Gate | Closes | Unlocks |
|---|---|---|
| **Now** | — | SKU 1 (Multi-tenant SaaS) · SKU 4a (Sovereign Enforcement, incl. air-gapped) |
| **Gate A** | G1, G2, G3 | Design-partner installs of SKU 4b; credible BYOC/on-prem roadmap in RFPs |
| **Gate B** | G4, G6 | SKU 2 (Single-tenant SaaS) GA; SKU 4b GA |
| **Gate C** | G5, G7 | SKU 3 (BYOC) GA; the full four-model claim becomes defensible |
| **Gate D** | G8 | Volume sales of customer-run SKUs without support blowing up |

Rough sequencing: Gate A ≈ 6–10 eng-weeks, Gate B ≈ +4–6, Gate C ≈ +4–5, Gate D ≈ +2. Under
~15–20 eng-weeks of focused work the whole claim is defensible — the work is broad, not deep, and
G1 dominates. **The claim is reachable; it is just not true yet.**

---

## 5. Commercial construction

Anchors (from `skills/novagentica-order-form`): Domain CHF 150,000 · Enterprise CHF 600,000 ·
Global CHF 1,200,000; 36-month standard term; renewal at the greater of 5% or Swiss CPI;
professional services CHF 2,500/person-day; CHF, Net 14.

Deployment model is a **second axis** on top of the tier, and it should be priced as one —
a subscription uplift for what we operate, plus a one-off services block for the install. Proposed
starting points, to be run through a pricing decision before they go into a quote:

| SKU | Subscription uplift | Install (professional services) | Rationale |
|---|---|---|---|
| Multi-tenant SaaS | baseline | standard MVP1 scope | — |
| Single-tenant SaaS | +25–35% | +10–15 days | Dedicated stack, independent upgrade window, own runbook |
| BYOC | +35–50% | +20–30 days | Customer landing zone, IAM/KMS integration, delegated-access model |
| Sovereign Enforcement (4a) | +10–15% | +5–10 days | Bundle signing/distribution, edge runbook — already built |
| Sovereign Full Stack (4b) | +50–75% | +30–45 days | Customer K8s, IdP, vault, LLM gateway, offline upgrades, N-1 support |

Order-form and MSA consequences (route through counsel; the order-form skill only carries what is
already agreed):

- **Deployment model as a named line item** on the subscription order form, with the tier —
  it changes what Novagentica is responsible for, so it cannot stay implicit.
- **Split responsibility matrix** per SKU (availability, patching, backup, incident response).
  Today's SLA language assumes we run the infrastructure; for BYOC and Sovereign we do not.
- **Metering clause for customer-run installs:** signed usage export, customer's obligation to
  transmit it, reconciliation cadence, and an explicit statement that exceeding committed volume
  does not interrupt enforcement (mirroring the existing no-interruption clause).
- **Supported-version window** (N-1) and a customer obligation to upgrade within a stated period —
  without it we are supporting every version ever shipped.
- **Air-gap variant:** no telemetry reaches Novagentica, so drop remote-monitoring commitments and
  price support on diagnostic bundles instead.
- **Egress and sub-processor disclosure per SKU.** Until G1 closes, any AI feature in a
  customer-run install calls a third-party gateway — that is a sub-processor disclosure, and it
  must not be discovered by the customer rather than declared by us.

---

## 6. Sales guardrails

**Approved today:**
- "Multi-tenant SaaS with row-level tenant isolation verified in CI on every schema change."
- "Enforcement runs inside your perimeter — including fully air-gapped, with signed policy
  bundles and no inbound path into your network. Proven by an automated air-gap boot test."
- "Enforcement continues when the link to us is cut. Evidence is signed locally and verifiable
  offline against a public key you hold."
- "Single-tenant, BYOC and full on-premise control plane are on the roadmap; we have the Helm
  chart and the self-hosted topology, and we will name the release with you."

**Not approved until the gates close:**
- Any unqualified "four deployment models" / "ultimate infrastructure control" claim.
- "Fully on-premise" or "air-gapped" for the **control plane** (4b) — G1 alone makes that false.
- "Your data never leaves your environment" for any customer-run install while 76 functions call
  a third-party AI gateway.
- Single-tenant SaaS or BYOC as available, quotable, or demonstrable.
- Data residency as a tenant-level guarantee — today it covers 6 telemetry tables, and the
  on-prem pointer collides between customers.

**Rule:** carry the whitepaper's maturity labels (Shipped / Partial / Roadmap) into every
deployment conversation. That discipline is why v2.5 is credible; a four-model claim without it
undoes the correction v2.5 made.

---

## 7. Immediate actions

1. **Fix the over-claim** in `src/lib/securityDocumentExport.ts:962` — it is in a document we hand
   to security teams (G5, 1 hour).
2. **Decide the SKU taxonomy** — four models, or plane-separated sovereignty. This document
   recommends the latter as the public story, with the four models as the staged roadmap.
3. **Fund G1** — it is the long pole, it blocks three of four SKUs, and it is the one gap that
   would embarrass us in a customer network trace.
4. **Write the missing product-facts source.** Three skills
   (`novagentica-presales-solution-design`, `novagentica-engagement-pack`,
   `novagentica-use-case-library`) instruct the reader to load
   `novagentica-architect-control-authority/SKILL.md` for canonical product facts. **That skill
   does not exist in this repo.** Until it does, every generated proposal is inventing deployment
   facts. This document should be its deployment chapter.
5. **Pick one design partner per unproven SKU** and close Gate A against a real install rather
   than in the abstract.

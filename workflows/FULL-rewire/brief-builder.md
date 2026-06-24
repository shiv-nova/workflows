# FULL: Proposal Generation — service-rendered rewire

Replaces the drifted generation core (generic Claude JSON → plain-text Google Doc + empty
Slides shell) with: **brief-builder → canonical generator service → branded `.docx`/`.pptx`**.

The Claude step no longer writes a finished proposal. It emits a **valid `engagement.json`
brief**; the service (`/sow`, `/summary`) renders it with the same code the skills use. One
source of truth for rendering; the prompt is the single source for *scoping*.

Design rule (discovery-stage honesty): FULL fires before commercials are agreed, so the
brief-builder fills only platform constants + a draft slate, and leaves everything else
`[TBC]`. Output is an **internal draft** gated by the existing Slack approval. No fabricated
client numbers.

---

## Node 1 — "Prepare Brief Prompt" (Code) — replaces "Prepare Claude Prompt"

Builds a skeleton with the **platform constants pre-filled** (so Claude can't vary them),
serialises the use cases, and asks Claude only for the deal-specific judgement.

```javascript
const t = $('Meeting Router Call').first().json;
const useCases = $('Query Use Case Library').all().map(i => {
  const j = i.json;
  return `- [${j['Slug']||j.slug||''}] ${j['Use case']||j.name||'Unknown'} (Vertical: ${j['Vertical']||''}, Function: ${j['Function']||''})\n  Value: ${j['CEO headline']||''} | Outcome: ${j['Outcome / KPI']||''}`;
}).join('\n');

let slackChannelId;
try { slackChannelId = $('Create Company Channel').first().json.id; }
catch(e){ slackChannelId = t.slackChannelId || ''; }

// Platform constants — fixed, not Claude's to invent.
const skeleton = {
  client: { name: t.companyName, industry: t.companyIndustry, legalEntity: "[TBC]", mainContact: t.contactName || "[TBC]", sponsor: "[TBC]" },
  nova: { deliveryLead: "[TBC]", commercialLead: "[TBC]" },
  commercials: {
    currency: "CHF", dayRate: 2500,
    services: [{ name: "Professional services — MVP delivery", pricingMode: "fixed-from-stages", stages: [] }],
    licence: { quotedTier: "Domain", term: { initialMonths: 36, renewal: "auto-renew unless 90 days notice; uplift greater of 5% or Swiss CPI" } },
    tiers: [
      { name: "Domain",     annualFee: 150000,  currency: "CHF" },
      { name: "Enterprise", annualFee: 600000,  currency: "CHF" },
      { name: "Global",     annualFee: 1200000, currency: "CHF" }
    ],
    runtimes: ["Salesforce Agentforce","Microsoft Copilot Studio","SAP Joule","n8n","LangGraph","Haystack","Dataiku","OpenClaw","NemoClaw"]
  },
  procurement: { start: { type: "po" } },          // draft default — human confirms at approval
  dates: { gate: null, kickoff: "[TBC]" },
  output: { fileStem: "Novagentica-" + String(t.companyName||"Client").replace(/[^A-Za-z0-9]+/g,""), version: "0.1" }
};

const userPrompt =
`CLIENT: ${t.companyName} (${t.companyIndustry})
DEAL: ${t.dealName} — ${t.dealStage}
CONTACT: ${t.contactName}, ${t.contactRole}
CALL SUMMARY: ${t.lastCallSummary}
GIST: ${t.gist}
TOPICS: ${Array.isArray(t.topicsDiscussed)?t.topicsDiscussed.join(', '):t.topicsDiscussed}
ACTION ITEMS: ${Array.isArray(t.actionItems)?t.actionItems.join('; '):t.actionItems}

AVAILABLE USE CASES:
${useCases}

Return ONLY a JSON object with the deal-specific content below. Do not include commercials,
tiers, runtimes or dates — those are fixed. Use "[TBC]" for anything the call does not support.

{
  "selectedUseCases": [{ "slug": "", "name": "", "relevanceReason": "" }],   // 2-4
  "stages": [   // one per selected use case, framed as an enforced MVP increment
    { "id": "MVP 1", "title": "", "oneLiner": "", "agentDoes": "",
      "gatedAction": "", "aiActClass": "", "runtimeSystems": "",
      "days": 0, "status": "conditional", "isBackup": false,
      "timeline": { "startWeek": "W0", "endWeek": "W2", "liveWeek": "W2", "gate": null } }
  ],
  "sow": {
    "projectName": "", "platform": "Novagentica Architect\u2122",
    "version": "0.1 DRAFT", "date": "${t.meetingDate||''}", "status": "DRAFT FOR INTERNAL REVIEW",
    "execSummary": [{ "t": "" }],
    "objectives": ["", ""],
    "scopeIn": [{ "n": "1", "deliverable": "", "description": "" }],
    "scopeOut": ["[TBC]"],
    "deliverables": [{ "deliverable": "", "format": "", "acceptance": "" }],
    "timelineIntro": "", "milestones": [{ "m": "", "d": "[TBC]" }],
    "assumptions": ["", ""], "riskFlags": [""],
    "govRows": [{ "role": "", "resp": "", "name": "[TBC]" }],
    "cadence": "", "raciCols": ["Nova","Client lead","SME","Sponsor"],
    "raci": [{ "activity": "", "v": ["R","C","C","A"] }],
    "raciNote": "", "changeControl": "Work outside agreed scope proceeds only under a written Change Order (MSA cl. 5.4).",
    "commercialsNote": "Professional services at {dayRate}/day. Licence quoted separately (tier: {tier}).",
    "termsRows": [
      { "item": "Day rate", "detail": "{dayRate} per consultant-day" },
      { "item": "Licence", "detail": "{tier} \u2014 {annualPrice}/year, {term}" },
      { "item": "Payment", "detail": "Net 14 days" }
    ],
    "commercialsFootnote": "All figures CHF, net of VAT. Draft \u2014 subject to confirmation.",
    "signoffEntities": ["${t.companyName||'Client'}", "Novagentica AG"],
    "appendixIntro": "Indicative delivery timeline; see ", "appendixPhases": [{ "m": "", "d": "" }]
  }
}`;

return [{ json: {
  userPrompt, skeleton: JSON.stringify(skeleton),
  meetingDate: t.meetingDate, companyId: t.companyId, companyName: t.companyName,
  dealId: t.dealId, dealStage: t.dealStage, contactName: t.contactName,
  contactEmail: t.contactEmail, transcriptUrl: t.transcriptUrl,
  slackChannelId, gDriveFolderUrl: t.gDriveFolderUrl
}}];
```

## Node 2 — "Generate Brief with Claude" (Anthropic) — system prompt (REPLACES the drifted one)

```
You are Novagentica's solution-scoping engine. Novagentica is the control, authority and
enforcement layer for enterprise AI agents — "no passport, no execution". It is NOT an "AI
automation consultancy" and does not "build automations"; it governs and enforces agentic AI
under the EU AI Act and Swiss FADP across runtimes (Salesforce Agentforce — enforced over, not
resold — Microsoft Copilot Studio, SAP Joule, n8n, LangGraph, Haystack, Dataiku, OpenClaw,
NemoClaw). Frame all work as MVP1→MVPx increments under enforced authority, each with an EU AI
Act class and a gated action — never generic "deliverables" or "12-week phases". This output is
an INTERNAL DRAFT: fill only what the call supports, use the literal "[TBC]" for anything
unconfirmed, and never invent client-specific commercials. Return ONLY valid JSON — no prose.
```

## Node 3 — "Parse Brief" (Code) — replaces "Parse Claude Response"

Merges Claude's deal-specific JSON into the constant skeleton → the full `brief`.

```javascript
const raw = ($('Generate Brief with Claude').first().json.text || $json.text || '').trim();
const skeleton = JSON.parse($('Prepare Brief Prompt').first().json.skeleton);
const p = $('Prepare Brief Prompt').first().json;
let deal;
try { deal = JSON.parse((raw.match(/\{[\s\S]*\}/)||[raw])[0]); }
catch(e){ throw new Error('Brief-builder did not return valid JSON: ' + e.message); }

const brief = { ...skeleton };
brief.commercials = { ...skeleton.commercials, services: [{ ...skeleton.commercials.services[0], stages: deal.stages || [] }] };
brief.sow = deal.sow || {};
if (deal.sow && deal.sow.projectName) brief.client.name = skeleton.client.name; // keep CRM name

return [{ json: {
  brief, engagementTitle: (deal.sow && deal.sow.projectName) || (skeleton.client.name + " — Architect engagement"),
  selectedUseCaseNames: (deal.selectedUseCases||[]).map(u=>u.name).join(', '),
  companyId: p.companyId, companyName: p.companyName, dealId: p.dealId, dealStage: p.dealStage,
  contactName: p.contactName, transcriptUrl: p.transcriptUrl, slackChannelId: p.slackChannelId,
  gDriveFolderUrl: p.gDriveFolderUrl, meetingDate: p.meetingDate
}}];
```

## Node 4 — "Render SoW (service)" (HTTP Request v4.4)

```
method: POST
url: https://n5mf8kbiuj.eu-central-1.awsapprunner.com/generate/sow
authentication: genericCredentialType
genericAuthType: httpHeaderAuth
credentials.httpHeaderAuth: NVG_TOKEN        ← the saved credential
sendBody: true, contentType: json, specifyBody: json
jsonBody: ={{ { brief: $json.brief } }}
options.response.response.responseFormat: file
options.response.response.outputPropertyName: data
```
→ "Upload SoW to Drive" (Google Drive, resource=file, operation=upload, inputDataFieldName=data,
name=`={{ "SoW — " + $('Parse Brief').first().json.engagementTitle + ".docx" }}`, folder = client folder).

## Node 5 — "Render Summary (service)" — identical but `/generate/summary`, `.pptx`, → "Upload Deck to Drive".

Then existing "Combine Document URLs" (point at the two Drive uploads' `webViewLink`) →
"Create Notion Project" → Slack approval, unchanged.

## Nodes removed
`Generate Proposal with Claude` · `Parse Claude Response` · `Create SoW Document` (GDoc) ·
`Create Pitch Deck` (GSlides).

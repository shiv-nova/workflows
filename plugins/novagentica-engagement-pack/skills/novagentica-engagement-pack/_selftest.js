// Regression + flexibility proof for lib/commercials.js. Run: node _selftest.js
const assert = require("assert");
const { reconcile } = require("./assets/generators/lib/commercials");
const { money, termLabel } = require("./assets/generators/lib/format");
const hensoldt = require("./assets/engagement.example.json");

let pass = 0;
const ok = (cond, msg) => { assert(cond, msg); console.log("  ✓ " + msg); pass++; };

console.log("\n[1] Reference spine — derived scenarios must reproduce the known-good hand-typed figures");
const r = reconcile(hensoldt);
ok(r.scenarios.confirmed.days === 22 && r.scenarios.confirmed.amount === 55000,
   `confirmed-only = ${r.scenarios.confirmed.days}d / ${money(r.scenarios.confirmed.amount, "CHF")} (expect 22 / CHF 55,000)`);
ok(r.scenarios.fullSlate.days === 27 && r.scenarios.fullSlate.amount === 67500,
   `full slate    = ${r.scenarios.fullSlate.days}d / ${money(r.scenarios.fullSlate.amount, "CHF")} (expect 27 / CHF 67,500)`);
ok(r.scenarios.backupPath.days === 26 && r.scenarios.backupPath.amount === 65000,
   `backup path   = ${r.scenarios.backupPath.days}d / ${money(r.scenarios.backupPath.amount, "CHF")} (expect 26 / CHF 65,000)`);
ok(r.tiers.find((t) => t.name === "Domain").highlight === true, "quoted tier (Domain) auto-highlighted");
ok(r.licence.term.label === "3-year", `term label derived = "${r.licence.term.label}"`);
ok(/six|6 months/i.test(r.licence.introOffer.sentence) || /first 6 months/i.test(r.licence.introOffer.sentence),
   `intro-offer sentence generated: "${r.licence.introOffer.sentence}"`);
ok(r.runtimes.some((x) => /agentforce/i.test(x)), "Salesforce Agentforce present in runtimes (voice rule)");
ok(r.warnings.length === 0, `no warnings on clean brief (${r.warnings.length})`);

console.log("\n[2] CONTRACT LENGTH — 1-year term, no intro offer");
const oneYear = JSON.parse(JSON.stringify(hensoldt));
oneYear.commercials.licence.term.initialMonths = 12;
oneYear.commercials.licence.introOffer = { enabled: false };
const r2 = reconcile(oneYear);
ok(r2.licence.term.label === "1-year", `term label = "${r2.licence.term.label}"`);
ok(r2.licence.introOffer === null, "no intro-offer sentence when disabled");

console.log("\n[3] SERVICES — retainer-plus-call-off + managed-runtime + free-partnership");
const flex = JSON.parse(JSON.stringify(hensoldt));
flex.commercials.services = [
  { id: "ret", name: "Solutions delivery retainer", pricingMode: "retainer", monthlyFee: 8000, months: 6,
    callOff: { dayRate: 2500, estimatedDays: 20 } },
  { id: "mrs", name: "Managed runtime", pricingMode: "managed-runtime", monthlyFee: 12000, months: 12 },
  { id: "free", name: "Launch-partnership delivery", pricingMode: "free-partnership", dayRate: 2500,
    stages: [{ id: "P1", title: "Ingest & certify", days: 10, status: "confirmed" }] },
];
const r3 = reconcile(flex);
const ret = r3.services.lines.find((l) => l.id === "ret");
ok(ret.payable === 8000 * 6 + 2500 * 20, `retainer+call-off payable = ${money(ret.payable, "CHF")} (expect CHF 98,000)`);
const mrs = r3.services.lines.find((l) => l.id === "mrs");
ok(mrs.payable === 12000 * 12, `managed-runtime payable = ${money(mrs.payable, "CHF")} (expect CHF 144,000)`);
const free = r3.services.lines.find((l) => l.id === "free");
ok(free.payable === 0 && free.fullValue === 25000 && free.free === true,
   `free-partnership: payable ${money(free.payable, "CHF")}, full value ${money(free.fullValue, "CHF")} waived`);

console.log("\n[4] LICENCE OPTIONS — 5-tier ladder, different quoted tier highlighted, add-on");
const lic = JSON.parse(JSON.stringify(hensoldt));
lic.commercials.tiers = ["Starter", "Domain", "Enterprise", "Global", "Sovereign"].map((n, i) => ({
  name: n, annualFee: [60000, 150000, 600000, 1200000, 2500000][i],
  agents: "x", runs: "y", runtimes: "z", cdap: "w", support: "v",
}));
lic.commercials.licence.quotedTier = "Enterprise";
lic.commercials.licence.introOffer = { enabled: false };
lic.commercials.licence.addOns = [{ name: "Marketplace", annualFee: 50000 }];
const r4 = reconcile(lic);
ok(r4.tiers.length === 5, `tier ladder has ${r4.tiers.length} tiers (variable N)`);
ok(r4.tiers.filter((t) => t.highlight).length === 1 && r4.tiers.find((t) => t.highlight).name === "Enterprise",
   "exactly one tier highlighted, and it is the quoted tier (Enterprise)");
ok(r4.licence.annualFee === 600000, `quoted annual fee resolved from ladder = ${money(r4.licence.annualFee, "CHF")}`);
ok(r4.licence.addOnsTotal === 50000, `add-on total = ${money(r4.licence.addOnsTotal, "CHF")}`);

console.log("\n[5] Guardrails — warnings fire on bad input");
const bad = JSON.parse(JSON.stringify(hensoldt));
bad.commercials.licence.quotedTier = "Platinum";          // not in ladder
bad.commercials.services[0].stages[0].cost = 999999;      // cost != days×rate
const r5 = reconcile(bad);
ok(r5.warnings.some((w) => /Platinum/.test(w)), "warns: quoted tier not in ladder");
ok(r5.warnings.some((w) => /stored cost/.test(w)), "warns: stage cost mismatch");

console.log(`\nALL ${pass} CHECKS PASSED\n`);

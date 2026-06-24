// Commercials reconciliation — the single computation the whole pack trusts.
//
// Input: engagement.commercials (see references/inputs.md, schema v2).
// Output: a fully-DERIVED commercial view. Totals are NEVER read from the brief;
// they are computed here so the proposal, deck, SoW, Gantt, exec summary and order
// form cannot disagree. The brief states inputs (days, rates, tiers); this states money.
//
// Three flexibility axes this exists to serve:
//   - CONTRACT LENGTH: licence.term {initialMonths, renewal} + structured introOffer.
//   - SERVICES: commercials.services is an ARRAY of lines, each with its own
//     pricingMode (fixed-from-stages | t&m | retainer | call-off | managed-runtime),
//     so retainer-plus-call-off, managed runtime, ingestion and free-partnership all fit.
//   - LICENCE OPTIONS: commercials.tiers is a variable-length ladder; the quoted offer
//     references a tier by name and may carry add-ons + overage.

const { money, termLabel, addDays } = require("./format");

// Each undefined MVP must be defined this many weeks before ITS OWN start.
const DEFINITION_LEAD_WEEKS = 2;

const ZERO_SCENARIO = () => ({ days: 0, amount: 0, ids: [], note: "" });

// ---- service lines ---------------------------------------------------------

function reconcileStageLine(line, currency, warnings) {
  const dayRate = line.dayRate;
  const stages = (line.stages || []).map((s) => {
    let cost = (typeof s.cost === "number") ? s.cost : null;
    const derived = (typeof s.days === "number" && typeof dayRate === "number")
      ? s.days * dayRate : null;
    if (cost === null) cost = derived;
    else if (derived !== null && cost !== derived) {
      warnings.push(`Stage "${s.title || s.id}" stored cost ${money(cost, currency)} != days×dayRate ${money(derived, currency)} — using stored, but confirm.`);
    }
    // QA rule carried into code: single-consultant 1-week stage should be <= 5 days.
    if ((line.consultants || 1) === 1 && s.elapsedWeeks === 1 && typeof s.days === "number" && s.days > 5) {
      warnings.push(`Stage "${s.title || s.id}" is ${s.days} days inside 1 week for a single consultant (>5) — aggressive; state the assumption.`);
    }
    return { ...s, cost, status: s.status || "confirmed", isBackup: !!s.isBackup, defined: s.defined !== false };
  });
  const fullValue = stages.reduce((a, s) => a + (s.cost || 0), 0);
  const discountPct = line.discountPct || (line.partnership && line.partnership.enabled ? (line.partnership.discountPct || 0) : 0);
  const discount = Math.round(fullValue * discountPct / 100);
  const payable = fullValue - discount;
  const totalDays = stages.reduce((a, s) => a + (typeof s.days === "number" ? s.days : 0), 0);
  return {
    ...line, stages, fullValue, discountPct, discount, payable, totalDays,
    free: discountPct === 100, recurring: null, callOff: null,
  };
}

function reconcileRecurringLine(line) {
  const months = line.months || 0;
  const monthlyFee = line.monthlyFee || 0;
  const recurringTotal = monthlyFee * months;
  const callOff = line.callOff
    ? { ...line.callOff, estimate: (line.callOff.dayRate || 0) * (line.callOff.estimatedDays || 0) }
    : null;
  const payable = recurringTotal + (callOff ? callOff.estimate : 0);
  return {
    ...line, stages: [], fullValue: payable, discountPct: 0, discount: 0,
    payable, totalDays: 0, free: payable === 0,
    recurring: { monthlyFee, months, total: recurringTotal }, callOff,
  };
}

function reconcileLine(line, currency, warnings) {
  switch (line.pricingMode) {
    case "fixed-from-stages":
    case "t&m":
      return reconcileStageLine(line, currency, warnings);
    case "retainer":
    case "managed-runtime":
    case "call-off":
      return reconcileRecurringLine(line);
    case "free-partnership":
      return reconcileStageLine({ ...line, discountPct: 100 }, currency, warnings);
    default:
      warnings.push(`Service line "${line.name || line.id}" has unknown pricingMode "${line.pricingMode}".`);
      return reconcileStageLine(line, currency, warnings);
  }
}

// ---- scenarios (derived from stage status across stage-based lines) ---------

function buildScenarios(lines, currency) {
  const stageLines = lines.filter((l) => l.stages && l.stages.length);
  const allStages = [].concat(...stageLines.map((l) => l.stages));
  const pick = (pred) => {
    const sel = allStages.filter(pred);
    return {
      days: sel.reduce((a, s) => a + (s.days || 0), 0),
      amount: sel.reduce((a, s) => a + (s.cost || 0), 0),
      ids: sel.map((s) => s.id || s.title),
    };
  };
  const confirmed = pick((s) => s.status === "confirmed" && !s.isBackup);
  const fullSlate = pick((s) => !s.isBackup);                       // confirmed + conditional
  const backupPath = pick((s) => (s.status === "confirmed" && !s.isBackup) || s.isBackup);
  confirmed.note = `confirmed only — ${confirmed.ids.join(", ") || "none"}`;
  fullSlate.note = `full slate — ${fullSlate.ids.join(", ") || "none"}`;
  backupPath.note = `confirmed + backup — ${backupPath.ids.join(", ") || "none"}`;
  return { confirmed, fullSlate, backupPath };
}

// ---- licence ---------------------------------------------------------------

function tierByName(tiers, name) {
  return tiers.find((t) => t.name && name && t.name.toLowerCase() === name.toLowerCase());
}

function introOfferSentence(io, tiers, quotedTierName, clientName) {
  if (!io || !io.enabled) return "";
  const C = clientName || "the customer";
  const basisTier = tierByName(tiers, io.priceBasis) || {};
  const basisPrice = (typeof basisTier.annualFee === "number")
    ? ` (${money(basisTier.annualFee, basisTier.currency || "")}`.replace(/\($/, "(") : "";
  // Build a clean sentence from fields; no hand-typing in generators.
  const promo = `The first ${io.promoMonths} months include ${io.promoTier}-tier usage at the ${io.priceBasis} price`;
  const renew = `the licence then auto-renews to ${io.defaultsTo} unless ${C} gives ${io.noticeWeeks} weeks' written notice to remain on ${quotedTierName}`;
  return `${promo}; ${renew}.`;
}

function reconcileLicence(lic, tiers, currency, clientName, warnings) {
  if (!lic) return null;
  const quoted = tierByName(tiers, lic.quotedTier);
  if (lic.quotedTier && !quoted) warnings.push(`Quoted tier "${lic.quotedTier}" not found in commercials.tiers.`);
  const annualFee = quoted && typeof quoted.annualFee === "number" ? quoted.annualFee
    : (typeof lic.annualFee === "number" ? lic.annualFee : null);
  const initialMonths = lic.term && lic.term.initialMonths;
  const io = lic.introOffer && lic.introOffer.enabled ? lic.introOffer : null;
  if (io) {
    if (!tierByName(tiers, io.promoTier)) warnings.push(`introOffer.promoTier "${io.promoTier}" not in tiers.`);
    if (!tierByName(tiers, io.priceBasis)) warnings.push(`introOffer.priceBasis "${io.priceBasis}" not in tiers.`);
    if (io.promoMonths > (initialMonths || Infinity)) warnings.push(`introOffer.promoMonths (${io.promoMonths}) exceeds initial term.`);
  }
  // year1 licence: honest default is the quoted annual fee. A blended figure is a
  // commercial decision (Felix) — only emit one if the brief sets it explicitly.
  const year1 = (typeof lic.year1 === "number") ? lic.year1 : annualFee;
  const addOns = (lic.addOns || []).map((a) => ({ ...a }));
  return {
    quotedTier: lic.quotedTier,
    annualFee,
    domainDefinition: lic.domainDefinition || "",
    term: { initialMonths, label: termLabel(initialMonths), renewal: lic.term && lic.term.renewal },
    introOffer: io ? { ...io, sentence: introOfferSentence(io, tiers, lic.quotedTier, clientName) } : null,
    addOns,
    addOnsTotal: addOns.reduce((a, x) => a + (typeof x.annualFee === "number" ? x.annualFee : 0), 0),
    overage: lic.overage || "",
    year1,
  };
}

// ---- commercial options (the "options" model: 2-3 whole offers compared) ---
// Used when a deal is sold as alternative commitments (e.g. Reduced Initial
// Commitment vs Strategic Partnership) rather than a tier ladder. Each option is
// a complete offer; the comparison rows are fee / term / days / co-investment /
// total value — the things that actually differ — not tier-ladder attributes.
function reconcileOptions(opts, currency, warnings) {
  const list = (opts || []).map((o) => {
    const months = o.term && o.term.initialMonths;
    const customerPays = (typeof o.customerPaysYear1 === "number") ? o.customerPaysYear1
      : (typeof o.licenceFee === "number" ? o.licenceFee : null);
    const coInvestment = (typeof o.coInvestment === "number") ? o.coInvestment : 0;
    const totalValue = (typeof o.totalValueYear1 === "number") ? o.totalValueYear1
      : (customerPays !== null ? customerPays + coInvestment : null);
    return {
      ...o,
      term: { initialMonths: months, label: termLabel(months), renewal: o.term && o.term.renewal },
      customerPays, coInvestment, totalValue,
      deliveryDays: (typeof o.deliveryDays === "number") ? o.deliveryDays : null,
      recommended: !!o.recommended,
    };
  });
  if (list.length && !list.some((o) => o.recommended)) list[0].recommended = true;
  if (!list.length) warnings.push("commercials.options is empty.");
  return list;
}



function reconcileTiers(tiers, quotedTierName) {
  return (tiers || []).map((t) => ({
    ...t,
    highlight: !!(quotedTierName && t.name && t.name.toLowerCase() === quotedTierName.toLowerCase()),
  }));
}

// ---- runtimes -------------------------------------------------------------
// An explicit list is the deal's in-scope runtimes and is authoritative — do
// NOT inject Agentforce into it (the "always include Agentforce" voice rule is
// for capability/positioning lists, not a specific customer's in-scope runtimes).
// Only fall back to Agentforce when the brief gives no runtimes at all.
function reconcileRuntimes(runtimes) {
  const list = Array.isArray(runtimes) ? runtimes.slice() : [];
  return list.length ? list : ["Salesforce Agentforce"];
}

// ---- top level -------------------------------------------------------------

function reconcile(engagement) {
  const c = engagement.commercials || {};
  const currency = c.currency || "CHF";
  const clientName = (engagement.client && engagement.client.name) || "the customer";
  const warnings = [];

  const lines = (c.services || []).map((l) => reconcileLine(l, currency, warnings));
  const subtotalPayable = lines.reduce((a, l) => a + (l.payable || 0), 0);
  const totalFullValue = lines.reduce((a, l) => a + (l.fullValue || 0), 0);
  const totalDays = lines.reduce((a, l) => a + (l.totalDays || 0), 0);
  const primaryRate = (lines.find((l) => l.dayRate) || {}).dayRate || c.dayRate || null;

  const scenarios = buildScenarios(lines, currency);
  // Flattened slate: every stage across stage-based lines, carrying narrative +
  // sizing + derived cost. This is THE MVP list — generators read it here, so the
  // slate and the costs can never come from two different places.
  const mvps = [].concat(...lines.filter((l) => l.stages.length).map((l) => l.stages));

  // 2-week rule: each undefined MVP must be defined 2 weeks before ITS OWN start.
  const kickoff = engagement.dates && engagement.dates.kickoff;
  const wnum = (t) => { const mm = /^W(\d+)/.exec(t || ""); return mm ? parseInt(mm[1], 10) : null; };
  const undefinedMvps = mvps.filter((m) => m.defined === false);
  undefinedMvps.forEach((m) => {
    const sw = wnum(m.timeline && m.timeline.startWeek);
    if (m.definitionDueWeek == null) m.definitionDueWeek = (sw != null) ? Math.max(0, sw - DEFINITION_LEAD_WEEKS) : null;
    if (!m.definitionDue) m.definitionDue = (kickoff && m.definitionDueWeek != null) ? addDays(kickoff, m.definitionDueWeek * 7) : null;
  });
  const tiers = reconcileTiers(c.tiers, c.licence && c.licence.quotedTier);
  const licence = reconcileLicence(c.licence, c.tiers || [], currency, clientName, warnings);
  const runtimes = reconcileRuntimes(c.runtimes);

  // Commercial model: "options" when commercials.options is present, else "ladder".
  const options = (c.options && c.options.length) ? reconcileOptions(c.options, currency, warnings) : null;
  const model = options ? "options" : "ladder";
  const recommended = options ? (options.find((o) => o.recommended) || options[0]) : null;

  const year1Total = options
    ? (recommended && typeof recommended.customerPays === "number" ? recommended.customerPays : 0)
    : ((licence && typeof licence.year1 === "number" ? licence.year1 : 0) + subtotalPayable);

  return {
    currency,
    model,
    dayRate: primaryRate,
    services: { lines, subtotalPayable, totalFullValue, totalDays },
    mvps,
    undefinedMvps,
    definitionLeadWeeks: DEFINITION_LEAD_WEEKS,
    scenarios,
    licence,
    tiers,
    options,
    recommendedOption: recommended,
    runtimes,
    year1Total,
    warnings,
  };
}

module.exports = { reconcile, introOfferSentence, tierByName };

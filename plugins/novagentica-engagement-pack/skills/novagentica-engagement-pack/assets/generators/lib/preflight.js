// Preflight — "prompt, don't fabricate."
//
// Before any artefact is generated, this inspects the brief and returns the
// clarifying questions that must be answered. The generator refuses to write a
// document while blocking questions remain, so the skill asks the user instead of
// inventing use cases, numbers, names or dates. Soft items render as "[TBC]" but
// are listed so they get confirmed.
//
// preflight(engagement, R) -> { questions: [..], confirmations: [..] }
//   questions      = BLOCKERS. Generation should stop and the user be asked these.
//   confirmations  = non-blocking; fine to proceed, but surface them.

const TBC = /\[\s*tbc\s*\]/i;
const isTBC = (v) => v === undefined || v === null || v === "" || (typeof v === "string" && TBC.test(v));

function preflight(E, R) {
  const q = [], soft = [];
  const cl = E.client || {}, c = E.commercials || {}, pr = E.procurement || {}, dates = E.dates || {};

  // --- structural blockers: never fabricate these ---
  if (!cl.name) q.push("Who is this engagement for? (client.name)");
  if (!c.currency) q.push("Which currency — CHF, EUR, or other? (commercials.currency)");

  const hasLadder = c.tiers && c.tiers.length;
  const hasOptions = c.options && c.options.length;
  if (!hasLadder && !hasOptions) q.push("What's the commercial model — a tier ladder (commercials.tiers) or commercial options (commercials.options)?");

  const stages = R ? R.mvps : [].concat(...((c.services || []).map((l) => l.stages || [])));
  if (!stages.length) q.push("No MVP/slate is defined. List at least one MVP, or use build_timeline.js for a generic (no-use-case) timeline.");

  // start mechanism — never default to LOI
  if (!(pr.start && pr.start.type) && !pr.loi) {
    q.push("How does this engagement start — LOI, purchase order, or signed contract? (procurement.start.type)");
  }
  // external dependency — never assume
  if (!("gate" in dates)) {
    q.push("Does any external approval gate this engagement (works council/Betriebsrat, security review, regulator)? Set dates.gate {name,date}, or dates.gate:null for none.");
  }

  // --- 2-week rule: each undefined MVP needs a planned start week to anchor its deadline ---
  const undef = R ? R.undefinedMvps : stages.filter((s) => s.defined === false);
  (undef || []).forEach((m) => {
    const hasSlot = (m.definitionDueWeek != null) || (m.timeline && m.timeline.startWeek);
    if (!hasSlot) q.push(`${m.id} is undefined and has no planned start week to anchor its definition deadline. Set its timeline.startWeek (definition falls due 2 weeks before it).`);
  });
  if (undef && undef.length && !dates.kickoff) soft.push("No dates.kickoff — undefined-MVP deadlines will show in weeks, not calendar dates.");

  // --- never invent figures: a stage that is "defined" must carry sizing ---
  (stages || []).forEach((s) => {
    if (s.defined !== false && (s.days === undefined || s.days === null)) {
      q.push(`MVP "${s.id || s.title}" is marked defined but has no day estimate. Provide days, or mark it defined:false (definition due 2 weeks before kickoff).`);
    }
  });

  // --- soft confirmations (proceed, but flag) ---
  if (isTBC(cl.sponsor)) soft.push("Sponsor is [TBC].");
  if (isTBC(cl.mainContact)) soft.push("Main contact is [TBC].");
  if (R && R.warnings) R.warnings.forEach((w) => soft.push(w));
  (undef || []).forEach((m) => soft.push(`${m.id} is undefined — definition due ${m.definitionDue ? m.definitionDue : (m.definitionDueWeek != null ? "week " + m.definitionDueWeek : "2 weeks before its start")} (2 weeks before its build starts).`));

  return { questions: q, confirmations: soft };
}

// Print preflight to the console in a consistent format. Returns true if blocked.
function report(pf, label) {
  if (pf.confirmations.length) {
    console.log(`\nℹ ${label || "Preflight"} — confirm:`);
    pf.confirmations.forEach((s) => console.log("  · " + s));
  }
  if (pf.questions.length) {
    console.log(`\n✋ ${label || "Preflight"} — ASK before generating (do not fabricate):`);
    pf.questions.forEach((qq, i) => console.log(`  ${i + 1}. ${qq}`));
    console.log("");
    return true;
  }
  return false;
}

module.exports = { preflight, report };

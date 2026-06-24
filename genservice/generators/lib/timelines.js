// Engagement archetypes — generic, reusable delivery shapes for prospects who
// don't yet have a defined use case. Pick an archetype + scale; get a phased
// timeline with no use-case specifics. Use cases are confirmed at discovery.
//
// expand(timeline) -> { archetypeLabel, blurb, weeks[], ganttRows[], phaseTiles[] }

const PHASES = {
  ingestion: {
    label: "Agent ingestion",
    blurb: "Govern the agents you already run — no rip-and-replace.",
    phases: [
      { label: "Ingest & inventory", desc: "Connect runtimes; inventory and select the agents in scope.", weeks: 1 },
      { label: "Reverse-engineer & certify", desc: "Charter, Decision Contract, authority mapping; AQVP certification.", weeks: 2 },
      { label: "Gap improvements", desc: "Close the governance gaps surfaced per agent.", weeks: 1 },
      { label: "Execution Gateway", desc: "Bind NO PASSPORT = NO EXECUTION at the gateway.", weeks: 1 },
      { label: "Go-live + monitoring", desc: "Governed agents live, Crypto Passport-signed; CDAP™ monitoring active.", weeks: 1, goLive: true },
    ],
  },
  greenfield: {
    label: "Greenfield build",
    blurb: "Build a new agent under enforced authority from day one.",
    phases: [
      { label: "Discovery & process design", desc: "Map the process and the decision points.", weeks: 1 },
      { label: "Agent design", desc: "Charter, Decision Contract, authority, Agent Pack.", weeks: 2 },
      { label: "Core build", desc: "Build the agent against the design.", weeks: 2 },
      { label: "Integration", desc: "Connect target systems and the Execution Gateway.", weeks: 1 },
      { label: "QA & UAT", desc: "Internal QA then user acceptance.", weeks: 1 },
      { label: "Go-live + CDAP™", desc: "Agent live, Crypto Passport-signed; CDAP™ activation.", weeks: 1, goLive: true },
    ],
  },
  "govern-in-place": {
    label: "Govern in place",
    blurb: "Certify and govern existing agents — the lightweight path.",
    phases: [
      { label: "Ingest & gap-analyse", desc: "Connect runtimes; surface governance gaps.", weeks: 1 },
      { label: "AQVP certification", desc: "Three-tier certification before anything goes live.", weeks: 1 },
      { label: "Authority & passport binding", desc: "Encode authority bands; bind Crypto Passports.", weeks: 1 },
      { label: "Go-live", desc: "Governed agents live, Passport-signed.", weeks: 1, goLive: true },
      { label: "CDAP™ activation", desc: "Continuous monitoring and improvement on.", weeks: 1 },
    ],
  },
};

const HYBRID = {
  label: "Hybrid — reverse-engineer + build",
  blurb: "Two production tracks on one enforcement layer.",
  tracks: [
    { name: "Track 1 — reverse-engineer", archetype: "ingestion" },
    { name: "Track 2 — greenfield build", archetype: "greenfield" },
  ],
};

function scalePhases(phases, totalWeeks) {
  const base = phases.reduce((a, p) => a + p.weeks, 0);
  if (!totalWeeks || totalWeeks === base) return phases.map((p) => ({ ...p }));
  const f = totalWeeks / base;
  return phases.map((p) => ({ ...p, weeks: Math.max(1, Math.round(p.weeks * f)) }));
}

// Lay phases out sequentially from a 1-based start week. Returns {rows, end}.
function layout(phases, startWeek) {
  let w = startWeek; const rows = [];
  phases.forEach((p) => {
    const a = w, b = w + p.weeks - 1;
    rows.push({ label: p.label, desc: p.desc, a, b, goLive: !!p.goLive, weeks: p.weeks });
    w = b + 1;
  });
  return { rows, end: w - 1 };
}

function expand(timeline) {
  const t = timeline || {};
  const startType = (t.start && t.start.type) || (t.loi ? "loi" : null);
  const startShort = startType === "po" ? "PO" : startType === "contract" ? "START" : startType === "loi" ? "LOI" : null;
  const loi = !!startShort;            // a start instrument occupies the first column
  const offset = loi ? 1 : 0;
  const startWeek = 1;

  if (t.archetype === "hybrid") {
    const trackRows = HYBRID.tracks.map((tr) => {
      const phases = scalePhases(PHASES[tr.archetype].phases, t.totalWeeks);
      const laid = layout(phases, startWeek);
      return { name: tr.name, phases: laid.rows, end: laid.end };
    });
    const maxEnd = Math.max(...trackRows.map((r) => r.end));
    const weeks = [];
    if (loi) weeks.push(startShort);
    for (let i = 1; i <= maxEnd; i++) weeks.push("W" + i);
    const idx = (wk) => weeks.indexOf("W" + wk) >= 0 ? weeks.indexOf("W" + wk) : (offset + wk - 1);
    // Gantt: one bar per track (full span), go-live diamond at track end.
    const ganttRows = trackRows.map((r) => ({ label: r.name, a: idx(1), b: idx(r.end), live: idx(r.end) }));
    if (loi) ganttRows.unshift({ label: `${startShort} — ingest & gap-analyse`, a: 0, b: 0 });
    // Phase tiles: the two tracks summarised.
    const phaseTiles = trackRows.map((r, i) => ({
      n: String(i + 1).padStart(2, "0"),
      when: `WK 1–${r.end}`,
      label: r.name,
      desc: r.phases.map((p) => p.label).join(" → "),
      gate: false,
    }));
    return { archetypeLabel: HYBRID.label, blurb: HYBRID.blurb, weeks, ganttRows, phaseTiles, goLiveWeek: maxEnd };
  }

  const arch = PHASES[t.archetype] || PHASES.ingestion;
  const phases = scalePhases(arch.phases, t.totalWeeks);
  const laid = layout(phases, startWeek);
  const weeks = [];
  if (loi) weeks.push(startShort);
  for (let i = 1; i <= laid.end; i++) weeks.push("W" + i);
  const idx = (wk) => offset + (wk - 1);
  const ganttRows = laid.rows.map((r) => ({ label: r.label, a: idx(r.a), b: idx(r.b), live: r.goLive ? idx(r.b) : undefined }));
  if (loi) ganttRows.unshift({ label: `${startShort} — ingest & gap-analyse`, a: 0, b: 0 });
  const phaseTiles = laid.rows.slice(0, 5).map((r, i) => ({
    n: String(i + 1).padStart(2, "0"),
    when: r.a === r.b ? `WK ${r.a}` : `WK ${r.a}–${r.b}`,
    label: r.label, desc: r.desc, gate: false, goLive: r.goLive,
  }));
  return { archetypeLabel: arch.label, blurb: arch.blurb, weeks, ganttRows, phaseTiles, goLiveWeek: laid.end };
}

module.exports = { expand, PHASES, HYBRID };

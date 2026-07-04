// Novagentica engagement-pack — Solution Proposal, NATIVE GOOGLE DOCS.
// Faithful port of build_proposal.js: same proposalDoc spine (identity + run-spec sections),
// same derived cost table, but emits a Google Docs `documents.batchUpdate` payload instead of a
// .docx. n8n runs documents.create {title} -> documents.batchUpdate {requests}.
// Usage: node build_proposal_gdocs.js [engagement.json] [out.json]
const fs = require("fs");
const { Doc, brand: B } = require("./lib/gdocs");

const SPINE_PATH = process.argv[2] || "engagement.json";
const E = JSON.parse(fs.readFileSync(SPINE_PATH, "utf8"));
const C = E.commercials || {};
const client = E.client || {};
const PD = E.proposalDoc || {};
const ID = PD.identity || {};
const CLIENT = client.name || "[Client]";
const cur = C.currency || "CHF";
const dayRate = C.dayRate || 0;
const money = (n) => `${cur} ${Number(n).toLocaleString("en-US")}`;
const mvps = E.mvps || [];
const liveMvps = mvps.filter((m) => !m.isBackup);
const backups = mvps.filter((m) => m.isBackup);
const sumDays = (arr) => arr.reduce((a, m) => a + ((m.sizing && m.sizing.consultantDays) || 0), 0);
const confirmedDays = sumDays(mvps.filter((m) => m.status === "confirmed" && !m.isBackup));
const totals = { fullSlate: sumDays(liveMvps), confirmedOnly: confirmedDays, backupPath: confirmedDays + sumDays(backups) };
const d = (i) => (mvps[i] && mvps[i].sizing && mvps[i].sizing.consultantDays) || 0;

const CRIMSON = B.ACCENT, CRIMSON_LIGHT = B.CRIMSON_LIGHT, INK = B.INK, DARK = B.DARK, WHITE = B.WHITE;
const BODY = B.SANS, SERIF = B.SERIF;
const F7 = "F7F7F5";
const doc = new Doc(`Novagentica × ${CLIENT} — Solution Proposal`);

// run-spec → gdocs run (docx sizes are half-points → points via /2)
// prose runs default to Georgia 11 (design DOCX convention); tables/labels stay Inter.
function run(r) {
  if (typeof r === "string") return { text: r, font: SERIF, size: 11 };
  const o = { text: r.t, font: SERIF, size: 11 };
  if (r.b) o.bold = true;
  if (r.c) { o.bold = true; o.color = CRIMSON; }
  if (r.i) { o.italic = true; o.font = SERIF; }
  if (r.dark) o.color = DARK;
  return o;
}
const h1 = (t) => doc.heading(t, { level: 1, size: 15, color: CRIMSON, spaceBefore: 14, spaceAfter: 8 });
const h2 = (t) => doc.heading(t, { level: 2, size: 12, color: INK, spaceBefore: 10, spaceAfter: 5 });
const bodyP = (runs, o = {}) => doc.para(runs, { align: "left", spaceAfter: 7, ...o });
const bullet = (runs) => doc.para(runs, { bullet: true, spaceAfter: 4 });
const quote = (item) => doc.para([{ text: item.t, italic: true, font: SERIF, size: 12, color: INK }], { indent: 12, spaceAfter: 8 });

// header/data cells for tables
const headerCell = (text) => ({ runs: [{ text, bold: true, color: WHITE, size: 9.5, font: BODY }], fill: CRIMSON });
const dataCell = (text, o = {}) => ({ runs: [{ text: String(text), size: 9.5, bold: o.bold, color: o.color, font: BODY }], fill: o.fill, align: o.align });

function routesTable(item) {
  const rows = [[headerCell(item.headers[0]), headerCell(item.headers[1]), headerCell(item.headers[2])]];
  item.rows.forEach((r) => rows.push([dataCell(r.label, { bold: true, fill: F7 }), dataCell(runsText(r.r1)), dataCell(runsText(r.r2))]));
  return doc.table(rows, { border: { color: B.GREY, pt: 0.5 } });
}
function risksTable(item) {
  const rows = [[headerCell(item.headers[0]), headerCell(item.headers[1])]];
  item.rows.forEach((r) => rows.push([dataCell(runsText(r.risk)), dataCell(runsText(r.mit))]));
  return doc.table(rows, { border: { color: B.GREY, pt: 0.5 } });
}
function daysTable(item) {
  const rateHeader = `${item.rateHeaderPre}${money(dayRate)}${item.rateHeaderPost}`;
  const rows = [[headerCell(item.header[0]), headerCell(item.header[1]), headerCell(rateHeader)]];
  const dRow = (phase, days, chf, o = {}) => rows.push([
    dataCell(phase, { bold: o.bold, fill: o.fill }),
    dataCell(days, { align: "center", bold: o.bold, fill: o.fill }),
    dataCell(chf, { align: "right", bold: o.bold, fill: o.fill }),
  ]);
  dRow(item.mvpRows[0], String(d(0)), money(d(0) * dayRate));
  dRow(item.mvpRows[1], String(d(1)), money(d(1) * dayRate));
  dRow(item.mvpRows[2], String(d(2)), money(d(2) * dayRate));
  dRow(item.fullLabel, String(totals.fullSlate), money(totals.fullSlate * dayRate), { bold: true, fill: CRIMSON_LIGHT });
  dRow(item.confirmedLabel, String(totals.confirmedOnly), money(totals.confirmedOnly * dayRate), { fill: F7 });
  dRow(item.backupLabel, String(totals.backupPath), money(totals.backupPath * dayRate), { fill: F7 });
  return doc.table(rows, { border: { color: B.GREY, pt: 0.5 } });
}
// a run-spec array or plain text → a single display string (cell text)
function runsText(v) { if (typeof v === "string") return v; if (Array.isArray(v)) return v.map((r) => (typeof r === "string" ? r : r.t)).join(""); return String(v || ""); }

// ===== COVER =====
doc.para(B.wordmarkRuns(INK, CRIMSON).map(w => ({ text: w.text, bold: true, color: w.color, size: 15, font: BODY })), { spaceAfter: 2 });
doc.para([{ text: ID.kicker || "", color: B.MUTED, size: 9, font: BODY }], { spaceAfter: 30 });
doc.para([{ text: ID.title1 || "", bold: true, size: 28, color: INK, font: BODY }], { spaceAfter: 0 });
doc.para([{ text: ID.title2 || "", bold: true, size: 28, color: INK, font: BODY }], { spaceAfter: 12 });
doc.para([{ text: ID.subtitle || "", italic: true, font: SERIF, size: 13, color: DARK }], { spaceAfter: 4 });
doc.para([{ text: ID.tagline || "", size: 10, color: INK, font: BODY }], { spaceAfter: 3 });
doc.para([{ text: "Prepared for:  ", bold: true, font: BODY, size: 11 }, { text: ID.preparedFor || "", font: BODY, size: 11 }], { spaceAfter: 2 });
doc.para([{ text: "From:  ", bold: true, font: BODY, size: 11 }, { text: ID.from || "", font: BODY, size: 11 }], { spaceAfter: 2 });
doc.para([{ text: "Date:  ", bold: true, font: BODY, size: 11 }, { text: ID.date || "", font: BODY, size: 11 }], { spaceAfter: 2 });
doc.para([{ text: "Status:  ", bold: true, font: BODY, size: 11 }, { text: ID.status || "", font: BODY, size: 11 }], { spaceAfter: 2 });
doc.para([{ text: ID.passportLine || "", bold: true, color: CRIMSON, size: 9, font: BODY }], { spaceAfter: 6 });
doc.pageBreak();

// ===== SECTIONS =====
function render(item) {
  switch (item.k) {
    case "h1": h1(item.t); break;
    case "h2": h2(item.t); break;
    case "body": bodyP(item.runs.map(run)); break;
    case "bullet": bullet(item.runs.map(run)); break;
    case "quote": quote(item); break;
    case "numbered": doc.para(item.runs.map(run), { indent: 18, spaceAfter: 4 }); break;
    case "routesTable": routesTable(item); break;
    case "risksTable": risksTable(item); break;
    case "daysTable": daysTable(item); break;
    default: break;
  }
}
(PD.sections || []).forEach(render);

// Footer with live page numbers is a documented Docs-API limitation (no auto page-number field
// insertable via batchUpdate) — n8n / a one-off UI step adds it. We stamp the wordmark line at the end.
doc.para([...B.wordmarkRuns(INK, CRIMSON).map(w => ({ text: w.text, bold: true, color: w.color, size: 9, font: BODY })), { text: `    ${CLIENT} · ${ID.footerLabel || ""}`, color: B.MUTED, size: 7, font: BODY }], { spaceAfter: 0 });

const payload = doc.payload();
const out = process.argv[3];
if (out) { fs.writeFileSync(out, JSON.stringify(payload, null, 2)); console.log(`gdocs payload written: ${out} (${payload.requests.length} requests)`); }
else { process.stdout.write(JSON.stringify(payload, null, 2)); }

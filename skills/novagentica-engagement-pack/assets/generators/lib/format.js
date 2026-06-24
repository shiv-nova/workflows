// Shared formatting helpers. One implementation of money/number formatting so
// "CHF 150,000" looks identical in every artefact.

// Thousands-separated integer, no decimals. money(150000,"CHF") -> "CHF 150,000"
function money(n, currency) {
  if (n === null || n === undefined || n === "") return "";
  if (typeof n !== "number") return String(n);
  const s = Math.round(n).toLocaleString("en-US");
  return currency ? `${currency} ${s}` : s;
}

// "CHF 150,000 / yr"
function perYear(n, currency) {
  return money(n, currency) + " / yr";
}

// "CHF 2,500 / day"
function perDay(n, currency) {
  return money(n, currency) + " / day";
}

// Term in months -> human ("36 months" or "3-year" when a clean multiple of 12)
function termLabel(months) {
  if (typeof months !== "number") return String(months || "[TBC]");
  if (months % 12 === 0) return `${months / 12}-year`;
  return `${months} months`;
}

function pct(n) {
  return (n === null || n === undefined) ? "" : `${n}%`;
}

// ISO date helpers for the "undefined MVP definition due 2 weeks before kickoff" rule.
function parseISO(d) { const t = Date.parse(d); return Number.isNaN(t) ? null : new Date(t); }
function addDays(d, n) { const x = parseISO(d); if (!x) return null; x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); }
function fmtDate(d) {
  const x = parseISO(d); if (!x) return d || "";
  return x.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

module.exports = { money, perYear, perDay, termLabel, pct, parseISO, addDays, fmtDate };

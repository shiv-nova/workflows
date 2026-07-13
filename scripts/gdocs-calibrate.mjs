#!/usr/bin/env node
// gdocs-calibrate.mjs — the ONE live check the offline self-test can't do: confirm the Google
// Docs table-index constants in lib/gdocs.js (TABLE.START_PAD / ROW_PAD / CELL_STRIDE).
//
// It creates a throwaway doc, inserts a 2×3 table, reads back the REAL cell start indices Google
// assigned, derives the constants, tells you whether lib/gdocs.js matches, and deletes the doc.
//
// SAFE CREDENTIAL: a SHORT-LIVED OAuth access token — nothing long-lived, nothing in the repo.
// Provide it out-of-band (never paste into chat), e.g.:
//   export GOOGLE_ACCESS_TOKEN="$(gcloud auth print-access-token \
//       --scopes=https://www.googleapis.com/auth/documents,https://www.googleapis.com/auth/drive.file)"
//   node scripts/gdocs-calibrate.mjs
// The token needs scopes: documents (create/edit) + drive.file (delete the throwaway doc).
// Tokens expire in ~1h; revoke/rotate after. No key file, no personal password.
const TOKEN = process.env.GOOGLE_ACCESS_TOKEN;
if (!TOKEN) {
  console.error("Set GOOGLE_ACCESS_TOKEN (a short-lived OAuth token with documents + drive.file scopes). See header.");
  process.exit(1);
}
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
const api = async (url, method = "GET", body) => {
  const r = await fetch(url, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`${method} ${url} -> ${r.status} ${(await r.text()).slice(0, 300)}`);
  return r.json();
};

const ROWS = 2, COLS = 3;
let docId;
try {
  const doc = await api("https://docs.googleapis.com/v1/documents", "POST", { title: "nvg-gdocs-calibration (delete me)" });
  docId = doc.documentId;
  await api(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, "POST", {
    requests: [{ insertTable: { rows: ROWS, columns: COLS, location: { index: 1 } } }],
  });
  const full = await api(`https://docs.googleapis.com/v1/documents/${docId}`);
  const tableEl = full.body.content.find((el) => el.table);
  const tableStart = tableEl.startIndex;
  const cell = (r, c) => tableEl.table.tableRows[r].tableCells[c].content[0].startIndex;

  // Derive from observed indices (table inserted at index 1).
  const START_PAD = cell(0, 0) - tableStart - 1;          // pad before first row's first cell paragraph, minus the ROW_PAD
  const CELL_STRIDE = cell(0, 1) - cell(0, 0);            // step between cells in a row
  const ROW_PAD = cell(1, 0) - cell(0, 0) - COLS * CELL_STRIDE; // extra step entering a new row
  const observed = { START_PAD: cell(0, 0) - tableStart - ROW_PAD, ROW_PAD, CELL_STRIDE };

  console.log("Observed cell start indices (table at index " + tableStart + "):");
  for (let r = 0; r < ROWS; r++) console.log("  row " + r + ": " + [...Array(COLS)].map((_, c) => cell(r, c)).join(", "));
  console.log("\nDerived lib/gdocs.js TABLE constants:");
  console.log(JSON.stringify(observed, null, 2));

  const mod = (await import("../skills/novagentica-engagement-pack/assets/generators/lib/gdocs.js").catch(() => null));
  const curTABLE = mod && (mod.default || mod).TABLE;
  if (curTABLE) {
    const match = curTABLE.START_PAD === observed.START_PAD && curTABLE.ROW_PAD === observed.ROW_PAD && curTABLE.CELL_STRIDE === observed.CELL_STRIDE;
    console.log("\nlib/gdocs.js currently: " + JSON.stringify(curTABLE));
    console.log(match ? "✅ MATCH — no change needed." : "⚠ MISMATCH — update lib/gdocs.js TABLE to the derived values above.");
  }
} catch (e) {
  console.error("calibration failed:", String(e.message || e));
  process.exitCode = 1;
} finally {
  if (docId) { try { await api(`https://www.googleapis.com/drive/v3/files/${docId}`, "DELETE"); console.log("\n(cleaned up throwaway doc)"); } catch { /* leave it */ } }
}

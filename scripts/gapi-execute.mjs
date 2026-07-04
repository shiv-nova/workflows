#!/usr/bin/env node
// gapi-execute.mjs — render a generator payload to a REAL Google Slides / Google Doc and print
// its URL. This is the live smoke test the offline self-tests can't do.
//
//   # a deck:
//   node .../build_execsummary_gslides.js <spine> /tmp/deck.json
//   node scripts/gapi-execute.mjs /tmp/deck.json --type=slides
//
//   # a doc:
//   node .../build_proposal_gdocs.js <spine> /tmp/doc.json
//   node scripts/gapi-execute.mjs /tmp/doc.json --type=docs
//
// Auth: a short-lived OAuth token with the right scopes (see README of gdocs-calibrate.mjs):
//   presentations + drive.file   (slides)      /   documents + drive.file   (docs)
//   export GOOGLE_ACCESS_TOKEN="$(gcloud auth print-access-token --scopes=...)"
import fs from "node:fs";

const file = process.argv[2];
const type = (process.argv.find((a) => a.startsWith("--type=")) || "").split("=")[1];
const TOKEN = process.env.GOOGLE_ACCESS_TOKEN;
if (!file || !["slides", "docs"].includes(type) || !TOKEN) {
  console.error("Usage: GOOGLE_ACCESS_TOKEN=... node scripts/gapi-execute.mjs <payload.json> --type=slides|docs");
  process.exit(1);
}
const payload = JSON.parse(fs.readFileSync(file, "utf8"));
const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
const api = async (url, method = "GET", body) => {
  const r = await fetch(url, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`${method} ${url} -> ${r.status} ${(await r.text()).slice(0, 400)}`);
  return r.json();
};

try {
  if (type === "slides") {
    const pres = await api("https://slides.googleapis.com/v1/presentations", "POST", { title: payload.title });
    const defaultSlide = pres.slides && pres.slides[0] && pres.slides[0].objectId;
    const requests = [];
    if (defaultSlide) requests.push({ deleteObject: { objectId: defaultSlide } });
    requests.push(...payload.requests);
    await api(`https://slides.googleapis.com/v1/presentations/${pres.presentationId}:batchUpdate`, "POST", { requests });
    console.log(`✅ https://docs.google.com/presentation/d/${pres.presentationId}/edit`);
  } else {
    const doc = await api("https://docs.googleapis.com/v1/documents", "POST", { title: payload.title });
    await api(`https://docs.googleapis.com/v1/documents/${doc.documentId}:batchUpdate`, "POST", { requests: payload.requests });
    console.log(`✅ https://docs.google.com/document/d/${doc.documentId}/edit`);
  }
} catch (e) {
  console.error("execute failed:", String(e.message || e));
  process.exit(1);
}

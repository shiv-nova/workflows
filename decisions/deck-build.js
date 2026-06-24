// Novagentica internal decision deck — Deel vs Rippling. Brand-faithful (CIOMove template spec).
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "NOVA", width: 13.333, height: 7.5 });
p.layout = "NOVA";

// ---- tokens ----
const BG="FAFBF6", INK="0E0E0C", INKSOFT="5C5C58", MUTED="8A8A86", RULE="D9D9D2", ACCENT="CC0D2C";
const INTER="Inter", GEO="Georgia";
const MX=0.6, RX=12.733, CW=12.133, TOPRULE=1.02, BOTRULE=6.66, FOOTY=6.82;
const TOTAL=6;
// cross-model line is parameterized so the deck can be rebuilt cheaply when the 2nd model runs
const CROSS_MODEL = process.env.CROSS_MODEL ||
  "Single-model GO (Claude). Genuine second-model review pending.";

function chrome(s, page, roman){
  s.background = { color: BG };
  if (roman){
    s.addText(roman, {x:MX, y:0.44, w:1.2, h:0.34, fontFace:GEO, italic:true, bold:true, fontSize:16, color:ACCENT});
  } else {
    s.addShape(p.ShapeType.rect, {x:MX, y:0.5, w:0.2, h:0.2, fill:{color:ACCENT}, line:{color:ACCENT}});
  }
  s.addShape(p.ShapeType.line, {x:MX, y:0.84, w:0.5, h:0, line:{color:ACCENT, width:2}});      // crimson short underline
  s.addShape(p.ShapeType.line, {x:MX, y:TOPRULE, w:CW, h:0, line:{color:RULE, width:1}});       // top hairline
  s.addShape(p.ShapeType.line, {x:MX, y:BOTRULE, w:CW, h:0, line:{color:RULE, width:1}});       // bottom hairline
  s.addText([{text:"nova",options:{color:INK,bold:true,fontFace:INTER}},
             {text:"gentica",options:{color:ACCENT,bold:true,fontFace:INTER}}],
            {x:MX, y:FOOTY, w:4, h:0.3, fontSize:13, align:"left"});
  s.addText(`${String(page).padStart(2,"0")} / ${String(TOTAL).padStart(2,"0")}`,
            {x:RX-2, y:FOOTY, w:2, h:0.3, align:"right", fontFace:INTER, fontSize:10, color:MUTED, charSpacing:1});
}
function eyebrow(s, t, y=1.24){
  s.addText(t, {x:MX, y, w:CW, h:0.3, fontFace:INTER, bold:true, fontSize:11, color:MUTED, charSpacing:2, align:"left"});
}
function headline(s, t, y=1.58, size=40){
  s.addText(t, {x:MX, y, w:CW, h:1.0, fontFace:INTER, bold:true, fontSize:size, color:INK, align:"left", lineSpacingMultiple:0.96, fit:"shrink"});
}
function subhead(s, t, y){
  s.addText(t, {x:MX, y, w:CW, h:0.5, fontFace:GEO, italic:true, bold:true, fontSize:23, color:ACCENT, align:"left"});
}
function midrule(s, y){ s.addShape(p.ShapeType.line, {x:MX, y, w:CW, h:0, line:{color:RULE, width:1}}); }
function rows(s, items, startY, rowH){
  items.forEach((it,i)=>{
    const y = startY + i*rowH;
    s.addText(it.k, {x:MX, y, w:2.7, h:rowH-0.06, fontFace:INTER, bold:true, fontSize:11.5, color:INK, charSpacing:1.2, align:"left", valign:"top"});
    s.addText(it.v, {x:MX+2.85, y, w:CW-2.85, h:rowH-0.06, fontFace:GEO, fontSize:14.5, color:INKSOFT, align:"left", valign:"top", lineSpacingMultiple:1.02,
      bold:!!it.b, italic:!!it.i, color: it.accent?ACCENT:INKSOFT});
    if(i>0) s.addShape(p.ShapeType.line, {x:MX, y:y-0.06, w:CW, h:0, line:{color:RULE, width:0.5}});
  });
}
function tagline(s, parts, y=6.18){
  s.addText(parts, {x:MX, y, w:CW, h:0.32, fontFace:GEO, italic:true, fontSize:15, color:INKSOFT, align:"left"});
}

// ---------- Slide 1 — hero / decision ----------
let s = p.addSlide(); chrome(s, 1, null);
eyebrow(s, "NOVAGENTICA · INTERNAL DECISION · 24 JUN 2026");
headline(s, "The back office, on one vendor.", 1.66, 46);
subhead(s, "Decision: Deel.", 2.95);
midrule(s, 3.7);
s.addText("HR · IT · EOR · Payroll · Recruiting · managed endpoint. One contract, across the 3→30 ramp (Jul 26 → Jun 28).",
  {x:MX, y:3.95, w:CW, h:0.6, fontFace:GEO, fontSize:16, color:INKSOFT, align:"left", lineSpacingMultiple:1.05});
tagline(s, [{text:"A type-1 call. ",options:{}},{text:"Decided on the terms — not the price.",options:{bold:true, color:INK}}]);

// ---------- Slide 2 — the frame ----------
s = p.addSlide(); chrome(s, 2, "I.");
eyebrow(s, "THE DECISION");
headline(s, "One question, decided.", 1.58, 40);
midrule(s, 2.7);
rows(s, [
  {k:"DECISION", v:"Sign Deel as the single managed back-office vendor — 2-year term, 3→30 ramp."},
  {k:"OWNER", v:"Shiv. Felix owns the payroll go-live gate."},
  {k:"REVERSIBILITY", v:"Type-1. Re-migrating payroll + identity + devices off one platform is expensive — decide deliberately."},
  {k:"DECIDE BY", v:"Before Stage-1 onboarding (Jul 2026). Pre-signature is peak leverage."},
], 3.0, 0.86);

// ---------- Slide 3 — the numbers ----------
s = p.addSlide(); chrome(s, 3, "II.");
eyebrow(s, "WHAT THE MODEL SAID");
headline(s, "Price was a tie. The call wasn't about price.", 1.58, 36);
midrule(s, 2.78);
rows(s, [
  {k:"2-YEAR COST", v:"Deel €97.2k vs Rippling €96.4k — 0.9%. A tie, within model noise."},
  {k:"FX", v:"Deel is USD-billed; Rippling EUR-native. The weak-EUR case swings ~€8k against Deel."},
  {k:"SCORECARD", v:"Deel 3.85 · Rippling 4.05 — close, and it flips on small changes."},
  {k:"THEREFORE", v:"Decided on terms and fit, not on cost.", b:true, accent:true},
], 3.06, 0.84);

// ---------- Slide 4 — two-column contrast ----------
s = p.addSlide(); chrome(s, 4, "III.");
eyebrow(s, "THE FORK");
headline(s, "Why Deel, not Rippling.", 1.58, 40);
midrule(s, 2.7);
const colTop=3.0, colH=3.0, divX=6.7;
s.addShape(p.ShapeType.line, {x:divX, y:colTop, w:0, h:colH, line:{color:ACCENT, width:1.5}});
s.addText("RIPPLING", {x:MX, y:colTop, w:5.6, h:0.3, fontFace:INTER, bold:true, fontSize:12, color:INK, charSpacing:1.5});
s.addText([
  {text:"Held the auto-renewal clause.\n",options:{}},
  {text:"Does not lease IT devices.\n",options:{}},
  {text:"Leads the draft scorecard — but on points that tie.",options:{}},
], {x:MX, y:colTop+0.42, w:5.7, h:2.4, fontFace:GEO, fontSize:15, color:INKSOFT, lineSpacingMultiple:1.25, valign:"top"});
s.addText("DEEL", {x:divX+0.3, y:colTop, w:5.6, h:0.3, fontFace:INTER, bold:true, fontSize:12, color:ACCENT, charSpacing:1.5});
s.addText([
  {text:"No auto-renewal + locked rate — leverage at renewal.\n",options:{}},
  {text:"Leases IT devices — no internal IT hire.\n",options:{}},
  {text:"The pre-registered tripwire chose it.",options:{}},
], {x:divX+0.3, y:colTop+0.42, w:5.5, h:2.4, fontFace:GEO, fontSize:15, color:INK, lineSpacingMultiple:1.25, valign:"top"});
tagline(s, [{text:"On an all-eggs bet, ",options:{}},{text:"optionality beats a 0.2-point edge.",options:{bold:true,color:INK}}]);

// ---------- Slide 5 — numbered conditions ----------
s = p.addSlide(); chrome(s, 5, "IV.");
eyebrow(s, "CONDITIONS OF SIGNATURE");
headline(s, "What we accept — and how we de-risk it.", 1.58, 34);
midrule(s, 2.74);
const conds = [
  {n:"01", k:"CONFIRM THE DE COUNTRY FEE", v:"EOR may carry a mandatory entity fee. Know it, and budget it, before signing."},
  {n:"02", k:"LOCK THE FX", v:"Fixed-FX clause or a simple hedge — Deel bills in USD."},
  {n:"03", k:"DE-RISK THE GO-LIVE", v:"Named, proven implementation lead; a recovered-failure reference. Felix lived a failed Deel go-live."},
  {n:"04", k:"PARALLEL PAYROLL", v:"Two clean cycles before cutover. Never single-cut pay."},
  {n:"05", k:"TERMS IN WRITING", v:"No auto-renewal, data export + exit assistance, SLAs with credits, device-lease scope."},
];
const cTop=3.02, cH=0.71;
conds.forEach((c,i)=>{
  const y=cTop+i*cH;
  s.addText(c.n, {x:MX, y, w:0.7, h:cH-0.05, fontFace:GEO, bold:true, italic:true, fontSize:18, color:ACCENT, valign:"top"});
  s.addText(c.k, {x:MX+0.85, y:y+0.02, w:3.5, h:cH-0.05, fontFace:INTER, bold:true, fontSize:11, color:INK, charSpacing:1, valign:"top"});
  s.addText(c.v, {x:MX+4.5, y:y+0.02, w:CW-4.5, h:cH-0.05, fontFace:GEO, fontSize:13, color:INKSOFT, valign:"top", lineSpacingMultiple:1.0});
  if(i>0) s.addShape(p.ShapeType.line, {x:MX, y:y-0.04, w:CW, h:0, line:{color:RULE, width:0.5}});
});

// ---------- Slide 6 — verdict ----------
s = p.addSlide(); chrome(s, 6, null);
eyebrow(s, "DECISION");
headline(s, "Approved. Conditional.", 1.62, 44);
subhead(s, "Deel — sign once the conditions are met.", 2.84);
midrule(s, 3.55);
rows(s, [
  {k:"CEO REVIEW", v:"Approve, conditional. Optionality preserved; execution risk owned."},
  {k:"CROSS-MODEL", v:CROSS_MODEL},
  {k:"REOPEN IF", v:"Rippling's refusal wasn't final, or the DE fee breaks the budget — before signature."},
], 3.82, 0.72);
tagline(s, [{text:"Decided on the terms. ",options:{italic:true}},{text:"Not the price.",options:{bold:true,italic:true,color:ACCENT}}], 6.16);

p.writeFile({ fileName: "/home/user/workflows/decisions/Novagentica-Deel-Decision.pptx" })
 .then(f => console.log("wrote", f))
 .catch(e => { console.error("ERR", e); process.exit(1); });

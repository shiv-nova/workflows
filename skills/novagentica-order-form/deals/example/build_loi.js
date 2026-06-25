const H = require("./nvg_helpers");
const { T, AlignmentType, Paragraph, TextRun, TableRow, TableCell, WidthType, VerticalAlign,
  cellMargins, cellBorders, gap, rule, head, body, clause, cellPara, tc, hRow, table,
  masthead, buildDoc, write } = H;
const { Table, BorderStyle, ShadingType } = require("docx");

// ---- meta block: addressed-to (left) + Novagentica contact/date/ref (right) ----
function metaCell(children, fill){
  return new TableCell({ width:{size:T.HALF,type:WidthType.DXA}, borders:cellBorders(), margins:cellMargins,
    shading: fill?{fill,type:ShadingType.CLEAR}:undefined, verticalAlign:VerticalAlign.TOP, children });
}
const metaBlock = table([T.HALF,T.HALF], [ new TableRow({ children:[
  metaCell([
    cellPara([{text:"Addressed to",bold:true,color:T.CRIMSON,size:16}]),
    cellPara([{text:"ACME Defence AG",bold:true}]),
    cellPara("Attn.: Jane Doe — Chief Information Officer"),
    cellPara("1 Example Avenue"),
    cellPara("00000 Example City, [Country]"),
  ], T.CREAM2),
  metaCell([
    cellPara([{text:"Your contact",bold:true,color:T.CRIMSON,size:16}]),
    cellPara([{text:"[Novagentica contact]",bold:true}]),
    cellPara("sales@novagentica.com"),
    cellPara("+41 44 000 00 00"),
    gap(60),
    cellPara([{text:"Date: ",bold:true},{text:"25 June 2026"}]),
    cellPara([{text:"Ref.: ",bold:true},{text:"LOI-2026-EX-001"}]),
  ]),
] }) ]);

// ---- §1 scope table ----
const w1=[2450,4576,2000];
function scopeRow(name, scope, lic, shaded){
  const fill = shaded ? T.CREAM2 : undefined;
  return new TableRow({ children:[
    tc(name,  {w:w1[0], bold:true, fill}),
    tc(scope, {w:w1[1], fill}),
    tc(lic,   {w:w1[2], fill, align:AlignmentType.CENTER}),
  ]});
}
const scopeTable = table(w1, [
  hRow(["Product / Service","Scope of Service","Licence / Model"], w1),
  scopeRow("Novagentica Platform",
    "Agentic AI governance and orchestration platform: Outcome Engineering, Decision Contracts, agent registry and governance, runtime integration, monitoring and controls, reporting dashboards, and standard integrations as agreed in the Order Form.",
    "Enterprise licence", true),
  scopeRow("Template Library / Use-Case Templates",
    "Access to selected Novagentica use-case templates, including pre-populated outcome-engineering fields and decision-contract structures to accelerate implementation.",
    "Included", false),
  scopeRow("Launch Package",
    "Fixed-price implementation in phases: Launch, Discover / Define, Configure / Validate, Go-Live and Hypercare. Includes workshops, configuration, UAT support, training, project management and enablement.",
    "Fixed price (one-off)", true),
  scopeRow("Optional Services",
    "Additional consulting days, bespoke runtimes, custom integrations, data migration, change management or advisory support as agreed between the Parties.",
    "By agreement (T&M)", false),
]);

// ---- §2 payment schedule (Notion master) ----
const w2=[4626,2200,2200];
function payRow(item, date, amt, shaded){
  const fill = shaded ? T.CREAM2 : undefined;
  return new TableRow({ children:[
    tc(item, {w:w2[0], fill}),
    tc(date, {w:w2[1], fill, align:AlignmentType.CENTER}),
    tc(amt,  {w:w2[2], fill, align:AlignmentType.RIGHT}),
  ]});
}
const totalRow = new TableRow({ children:[
  tc("Total contract value (incl. services)", {w:w2[0], fill:T.CRIMSON, bold:true, color:"FFFFFF"}),
  tc("", {w:w2[1], fill:T.CRIMSON}),
  tc("CHF 1,642,500", {w:w2[2], fill:T.CRIMSON, bold:true, color:"FFFFFF", align:AlignmentType.RIGHT}),
]});
const payTable = table(w2, [
  hRow(["Item","Payment date","Amount (net, CHF)"], w2),
  payRow("Subscription — Enterprise licence (first 6 months at Domain price)","01.07.2026","150,000", true),
  payRow("Professional services — MVP delivery (100% upfront)","01.07.2026","67,500", false),
  payRow("Subscription — transition to full Enterprise pricing","01.01.2027","225,000", true),
  payRow("Subscription — Enterprise tier (Year 2)","01.07.2027","600,000", false),
  payRow("Subscription — Enterprise tier (Year 3)","01.07.2028","600,000", true),
  totalRow,
]);

// ---- signature block (customer side pre-filled with CIO) ----
function sigCustom(){
  const mkLine = () => new Paragraph({ spacing:{before:360,after:20}, border:{bottom:{style:BorderStyle.SINGLE,size:6,color:T.INK,space:2}}, children:[] });
  const lbl = (t,strong) => new Paragraph({ spacing:{after:140}, children:[new TextRun({ text:t, font:T.SANS, size:16, color: strong?T.INK:T.GREY, bold:!!strong })] });
  const col = (title, name) => [
    new Paragraph({ children:[new TextRun({text:title,bold:true,font:T.SANS,size:19,color:T.CRIMSON})] }),
    mkLine(), lbl("Signature / Date"),
    mkLine(), name ? lbl(name, true) : lbl("Name / Title"),
  ];
  return table([T.HALF,T.HALF], [ new TableRow({ children:[
    new TableCell({ width:{size:T.HALF,type:WidthType.DXA}, borders:cellBorders(), margins:{top:120,bottom:200,left:160,right:160}, children: col("For Novagentica AG", null) }),
    new TableCell({ width:{size:T.HALF,type:WidthType.DXA}, borders:cellBorders(), margins:{top:120,bottom:200,left:160,right:160}, children: col("For ACME Defence AG", "Jane Doe · Chief Information Officer") }),
  ] }) ]);
}

const children = [
  ...masthead("Letter of Intent", "Statement of intent to negotiate a SaaS agreement"),
  metaBlock,
  gap(160),
  body("Dear Ms Doe,"),
  body("We appreciate your interest in the Novagentica Agentic AI Governance Platform and the trust you place in Novagentica. By way of this Letter of Intent (the “LOI”), Novagentica AG (“Novagentica”) and ACME Defence AG (the “Customer”; together the “Parties”) record the current status of negotiations and their mutual intent to enter into detailed negotiations regarding a SaaS agreement."),

  head("§ 1  Subject Matter and Scope of Services"),
  body("The intended agreement covers the provision of the following products and services under a SaaS licence model to the ACME procurement and SAP-transformation domain. Subject to final negotiations, the scope comprises:"),
  scopeTable,
  gap(80),
  body([{text:"The detailed scope of services, commercial assumptions, phase plan, usage limits and implementation responsibilities are to be set out in Annex 1.", italics:true}]),

  head("§ 2  Commercial Terms (subject to final negotiations)"),
  body("The following commercial key terms shall serve as the basis for further negotiations. All amounts are net amounts in CHF plus statutory value-added tax, where applicable. The payment schedule below is the agreed commercial profile for this deal."),
  payTable,
  gap(120),
  clause("›", [{text:"Term: ",bold:true},{text:"thirty-six (36) months from the Effective Date (01.07.2026 – 30.06.2029). Licence fees follow the payment schedule above. The licence auto-renews for fixed 12-month periods with a 12% annual uplift unless terminated on notice."}]),
  clause("›", [{text:"Payment terms: ",bold:true},{text:"subscription fees payable per the payment schedule above; professional services payable 100% on the Effective Date. Three-year subscription value CHF 1,575,000; total contract value including services CHF 1,642,500 (net of VAT and expenses)."}]),
  clause("›", [{text:"Usage: ",bold:true},{text:"included agents, business domains, runtimes and run volumes are defined in Annex 1 or the Order Form; excess usage, custom runtimes or bespoke integrations require prior written agreement. Introductory period (01.07.2026 – 31.12.2026): Enterprise-tier capability is provided at the Domain price; the Customer may instead remain on the Domain tier by giving four (4) weeks’ written notice before 31.12.2026, failing which full Enterprise pricing applies from 01.01.2027."}]),
  clause("›", [{text:"Travel expenses, ",bold:true},{text:"where required for on-site sessions, will be invoiced separately on a time-and-cost basis and approved beforehand by the Customer."}]),
  clause("›", [{text:"Validity: ",bold:true},{text:"this commercial basis is valid until 30 September 2026 unless superseded by execution of the main agreement."}]),

  head("§ 3  Negotiation Schedule"),
  body("The Parties shall use their best efforts to conduct the contract negotiations promptly and in good faith, with the objective of executing the main agreement by 30 September 2026."),

  head("§ 4  Confidentiality (legally binding)"),
  body("The mutual non-disclosure agreement between the Parties shall apply. If no separate NDA has been signed, the Parties agree to treat this LOI, the negotiations and all exchanged commercial, technical and operational information as confidential."),

  head("§ 5  Legal Effect — Subject to Contract"),
  body("This LOI is expressly non-binding, except for Sections 4, 6 and 7 where stated or required by law. In particular, the scope and pricing terms set out in Sections 1 and 2 are to be understood as a basis for negotiation and shall only become legally effective upon execution of a definitive SaaS agreement, Order Form or equivalent binding agreement accepted by Novagentica. Each Party shall bear its own costs incurred until that point."),

  head("§ 6  Governing Law and Jurisdiction"),
  body("This LOI and any disputes arising from or in connection with it shall be governed exclusively by the laws of Switzerland, excluding conflict-of-laws rules and the United Nations Convention on Contracts for the International Sale of Goods (CISG), where applicable. The exclusive place of jurisdiction shall be Zurich, Switzerland, provided both Parties are merchants or commercial entities under the applicable law."),

  head("§ 7  Miscellaneous"),
  body("All amendments and additions to this LOI must be made in writing in order to be legally effective. This formal requirement can only be waived by written agreement. The written form is maintained by Adobe Sign, DocuSign or an equivalent electronic signature, but not by ordinary e-mail unless expressly agreed by the Parties."),

  gap(220),
  sigCustom(),
  gap(140),
  body([{text:"Annex 1: Novagentica–ACME Engagement Offer NG-2026-EX-001 v1.0 — Commercial Terms, Platform Scope, Usage Limits, Launch Package, Responsibilities and Timeline — forms an integral part of this LOI.", italics:true, color:T.GREY, size:17}]),
];

const doc = buildDoc(children, { docTitle:"Letter of Intent — ACME Defence AG", headerLabel:"LOI-2026-EX-001" });
write(doc, "/home/user/workflows/outputs/Novagentica_LOI_Example.docx");

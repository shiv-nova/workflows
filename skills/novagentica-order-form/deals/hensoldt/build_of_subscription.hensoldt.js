/* Hensoldt-specific SUBSCRIPTION order form.
   Reuses the skill brand helpers; bakes in the Hensoldt deal record (NG-2026-HE-001),
   the 23-24 Jun template decisions, and Shiv's 24 Jun commercial update
   (3-yr Enterprise @ 600k ARR; 6-mo Enterprise-at-Domain-price intro; fixed payment schedule). */
const H = require("../../scripts/nvg_helpers.js");
const { T, BOX, AlignmentType: AT } = H;
const { masthead, draftPanel, head, body, note, clause, lead, fieldRow, hRow, tc, cellPara, table,
  sigBlock, buildDoc, write, TableRow, TableCell, WidthType, VerticalAlign, cellBorders, cellMargins } = H;
const CHECK = "☒"; // selected
const HILITE = "F3E7EA"; // subtle crimson-tint highlight for the selected tier

function hensoldtAddress() {
  return table([T.HALF, T.HALF], [new TableRow({ children: [
    new TableCell({ width: { size: T.HALF, type: WidthType.DXA }, borders: cellBorders(), margins: cellMargins, verticalAlign: VerticalAlign.TOP, children: [
      cellPara([{ text: "Supplier", bold: true, color: T.CRIMSON, size: 16 }]),
      cellPara([{ text: "Novagentica AG", bold: true }]),
      cellPara("Chläusjägergasse 8"), cellPara("CH-6403 Küssnacht am Rigi, Switzerland"),
      cellPara([{ text: "Reg. no. CH-020.3.051.524-2", size: 16, color: T.GREY }]) ] }),
    new TableCell({ width: { size: T.HALF, type: WidthType.DXA }, borders: cellBorders(), margins: cellMargins, verticalAlign: VerticalAlign.TOP, children: [
      cellPara([{ text: "Customer", bold: true, color: T.CRIMSON, size: 16 }]),
      cellPara([{ text: "HENSOLDT AG", bold: true }]),
      cellPara("Willy-Messerschmitt-Strasse 3"), cellPara("82024 Taufkirchen, Germany"),
      cellPara([{ text: "Reg. no. Amtsgericht München, HRB 234461 · VAT no. [to be provided]", size: 16, color: T.GREY }]) ] }),
  ] })]);
}

function hensoldtSig() {
  const mkLine = () => new H.Paragraph({ spacing: { before: 360, after: 20 }, border: { bottom: H.border(T.INK, 6) }, children: [] });
  const lbl = (t) => new H.Paragraph({ spacing: { after: 140 }, children: [new H.TextRun({ text: t, font: T.SANS, size: 16, color: T.GREY })] });
  const fill = (t) => new H.Paragraph({ spacing: { after: 140 }, children: [new H.TextRun({ text: t, font: T.SANS, size: 18, color: T.INK })] });
  const title = (t) => new H.Paragraph({ children: [new H.TextRun({ text: t, bold: true, font: T.SANS, size: 19, color: T.CRIMSON })] });
  const novaCol = [title("For Novagentica AG"), mkLine(), lbl("Signature / Date"), mkLine(), lbl("Name / Title")];
  const custCol = [title("For HENSOLDT AG"), mkLine(), lbl("Signature / Date"), mkLine(), fill("André Scheidhammer · Chief Information Officer")];
  const cell = (ch) => new TableCell({ width: { size: T.HALF, type: WidthType.DXA }, borders: cellBorders(), margins: { top: 120, bottom: 200, left: 160, right: 160 }, children: ch });
  return table([T.HALF, T.HALF], [new TableRow({ children: [cell(novaCol), cell(custCol)] })]);
}

const c = [];
c.push(...masthead("ORDER FORM — SUBSCRIPTION", "Novagentica Architect™ · Platform Subscription · HENSOLDT"));
c.push(draftPanel([
  "DRAFT — populated from Notion CRM (Hensoldt deal NG-2026-HE-001) and the 24 Jun commercial update. Enterprise tier (CHF 600,000 ARR), 3-year term, with a six-month Enterprise-at-Domain-price introduction (01.07–31.12.2026). Auto-renewal 12 months + 12% uplift; overage clause removed from the order form per the 23–24 Jun decision.",
  "Contracting entity: HENSOLDT AG · signatory: André Scheidhammer (CIO). Remaining items to provide before issue: Hensoldt VAT no., accounts-payable billing e-mail, and the PO (if required). Resolve every ‹drafting note› and delete this panel before the form is issued.",
  "Governed by, and incorporates, the MSA. Master legal terms (liability, IP, warranties, confidentiality, data protection) stay in the MSA/DPA — not restated here.",
]));
c.push(H.gap(120));
c.push(hensoldtAddress());

/* ORDER DETAILS */
c.push(head("Order details"));
c.push(table([3000, 6026], [
  fieldRow("Order Form type", "Subscription"),
  fieldRow("Order Form no.", "2026-NVG-HE-SC-001"),
  fieldRow("Linked engagement offer", "NG-2026-HE-001 (June 2026)"),
  fieldRow("Offer date", "24 June 2026"),
  fieldRow("Offer valid until", "22 September 2026 (90 days)"),
  fieldRow("Effective Date", "1 July 2026 (or date of last signature, if later)"),
  fieldRow("Initial Term", "36 months from the Effective Date (01.07.2026 – 30.06.2029)"),
  fieldRow("Contact — Customer", "André Scheidhammer, CIO — Andre.Scheidhammer@hensoldt.net"),
  fieldRow("Contact — Novagentica", "Shiv Tailor (delivery) / [account owner TBC]"),
  fieldRow("Billing e-mail — Customer", "[TBC]"),
  fieldRow("VAT no. — Customer", "[TBC]"),
  fieldRow("Currency", "Swiss Francs (CHF). All amounts net, exclusive of VAT."),
]));
c.push(note("Contracting entity confirmed as HENSOLDT AG; signatory is André Scheidhammer (CIO). Secondary contact on file: Alexander Rothmaier (alexander.rothmaier@hensoldt.net). Provide the Hensoldt VAT number and accounts-payable billing e-mail before issue."));

/* SUBSCRIPTION OVERVIEW */
c.push(head("Subscription overview"));
c.push(body([{ text: "Selected tier — Enterprise (CHF 600,000 ARR), 3-year term. ", bold: true }, "For the first six months (01.07.2026–31.12.2026) Enterprise capability is provided at the Domain price. The Customer may instead remain on the Domain tier by giving four (4) weeks’ written notice before 31.12.2026; otherwise full Enterprise pricing applies from 01.01.2027 (see Special provisions and the Payment schedule)."]));
c.push(table([2200, 2275, 2275, 2276], [
  new TableRow({ tableHeader: true, children: [tc("", { w: 2200, fill: T.CRIMSON }),
    tc("Domain", { w: 2275, fill: T.CRIMSON, bold: true, color: "FFFFFF", align: AT.CENTER }),
    tc("Enterprise — selected", { w: 2275, fill: T.CRIMSON, bold: true, color: "FFFFFF", align: AT.CENTER }),
    tc("Global", { w: 2276, fill: T.CRIMSON, bold: true, color: "FFFFFF", align: AT.CENTER })] }),
  new TableRow({ children: [tc("Annual fee", { w: 2200, fill: T.CREAM2, bold: true }), tc([cellPara([{ text: "CHF 150,000", bold: true }], { align: AT.CENTER })], { w: 2275 }), tc([cellPara([{ text: "CHF 600,000", bold: true }], { align: AT.CENTER })], { w: 2275, fill: HILITE }), tc([cellPara([{ text: "CHF 1,200,000", bold: true }], { align: AT.CENTER })], { w: 2276 })] }),
  new TableRow({ children: [tc("Agents governed", { w: 2200, fill: T.CREAM2, bold: true }), tc("Up to 20", { w: 2275, align: AT.CENTER }), tc([cellPara([{ text: "Up to 100", bold: true }], { align: AT.CENTER })], { w: 2275, fill: HILITE }), tc("Unlimited", { w: 2276, align: AT.CENTER })] }),
  new TableRow({ children: [tc("Runs / month", { w: 2200, fill: T.CREAM2, bold: true }), tc("100,000", { w: 2275, align: AT.CENTER }), tc([cellPara([{ text: "500,000", bold: true }], { align: AT.CENTER })], { w: 2275, fill: HILITE }), tc("20,000,000*", { w: 2276, align: AT.CENTER })] }),
  new TableRow({ children: [tc("Runtimes", { w: 2200, fill: T.CREAM2, bold: true }), tc("2 platforms", { w: 2275, align: AT.CENTER }), tc([cellPara([{ text: "All supported", bold: true }], { align: AT.CENTER })], { w: 2275, fill: HILITE }), tc("All + custom", { w: 2276, align: AT.CENTER })] }),
  new TableRow({ children: [tc("CDAP™ refresh", { w: 2200, fill: T.CREAM2, bold: true }), tc("Weekly", { w: 2275, align: AT.CENTER }), tc([cellPara([{ text: "Daily", bold: true }], { align: AT.CENTER })], { w: 2275, fill: HILITE }), tc("Real-time", { w: 2276, align: AT.CENTER })] }),
  new TableRow({ children: [tc("Support", { w: 2200, fill: T.CREAM2, bold: true }), tc("Business hours", { w: 2275, align: AT.CENTER }), tc([cellPara([{ text: "24/5 + CSM", bold: true }], { align: AT.CENTER })], { w: 2275, fill: HILITE }), tc("24/7 + dedicated SA", { w: 2276, align: AT.CENTER })] }),
]));
c.push(body([{ text: "* Global runs/month is subject to a fair-use cap.", italics: true, size: 16, color: T.GREY }]));

c.push(body([{ text: "Subscribed position", bold: true }], { after: 60 }));
c.push(table([3000, 6026], [
  fieldRow("Service", "Novagentica Architect™ platform subscription"),
  fieldRow("Selected tier", CHECK + " Enterprise   ☐ Domain   ☐ Global"),
  fieldRow("Introductory pricing", "Enterprise at Domain price for 01.07.2026–31.12.2026 (6 months)"),
  fieldRow("Agents governed", "Up to 100 (3 in scope — one per MVP)"),
  fieldRow("Committed volume", "Enterprise allowance — 500,000 runs / month; all supported runtimes"),
  fieldRow("Order start (min. term)", "01.07.2026"),
  fieldRow("Order end (min. term)", "30.06.2029"),
  fieldRow("Annual subscription fee", "CHF 600,000 (Enterprise ARR; first 6 months at Domain price)"),
  fieldRow("Total contract value (3 yrs)", "CHF 1,575,000 (reflects the 6-month introductory pricing)"),
]));
c.push(note("Per the 23–24 Jun decision the over-consumption / overage clause is removed from the issued order form (retained in the master template). The annual fee is a minimum commitment for the Enterprise allowance."));

/* AVAILABLE RUNTIMES — full overview */
c.push(head("Available runtimes"));
c.push(body([{ text: "Enterprise includes all supported runtimes. ", bold: true }, "The full set of Novagentica-supported runtimes is listed below; all are available to Hensoldt under the Enterprise tier. The platform build runtimes for each MVP will be confirmed before kick-off."]));
c.push(table([3600, 4026, 1400], [
  hRow(["Runtime", "Notes", "Enterprise"], [3600, 4026, 1400]),
  ...[
    ["Salesforce Agentforce", "Enforced over — not resold; no OEM/ISV relationship"],
    ["Microsoft Copilot Studio", ""],
    ["SAP Joule", ""],
    ["n8n", ""],
    ["LangGraph", ""],
    ["Haystack", ""],
    ["Dataiku", ""],
    ["OpenClaw", ""],
    ["NemoClaw", ""],
  ].map(([r, n]) => new TableRow({ children: [
    tc([cellPara([{ text: r, bold: r === "Salesforce Agentforce" }])], { w: 3600 }),
    tc(n, { w: 4026, size: 16, color: T.GREY }),
    tc("✓ Included", { w: 1400, align: AT.CENTER }),
  ] })),
]));
c.push(note("SuccessFactors and SAP S/4 (the MVP integration systems) are integration targets, not platform runtimes — they are not listed above. Salesforce Agentforce is a runtime Novagentica enforces over; it is not resold. Platform build runtimes per MVP are confirmed before kick-off."));

/* PAYMENT SCHEDULE */
c.push(head("Payment schedule"));
c.push(body("The subscription charges for the Initial Term are invoiced in advance in accordance with the schedule below. The schedule gives effect to the introductory period (1 July 2026 – 31 December 2026), during which Enterprise capability is provided at the Domain price, and to the commencement of full Enterprise pricing on 1 January 2027."));
c.push(table([2200, 4426, 2400], [
  hRow(["Due date", "Description", "Amount (net, excl. VAT)"], [2200, 4426, 2400]),
  new TableRow({ children: [tc("01.07.2026", { w: 2200 }), tc("First instalment of the Year 1 subscription charge, due on the Effective Date, in respect of the introductory period (Enterprise capability at the Domain price).", { w: 4426 }), tc("CHF 150,000", { w: 2400, align: AT.RIGHT })] }),
  new TableRow({ children: [tc("01.01.2027", { w: 2200 }), tc("Second instalment of the Year 1 subscription charge, due on 1 January 2027 upon commencement of full Enterprise pricing.", { w: 4426 }), tc("CHF 225,000", { w: 2400, align: AT.RIGHT })] }),
  new TableRow({ children: [tc("01.07.2027", { w: 2200 }), tc("Year 2 subscription charge, due annually in advance on 1 July 2027.", { w: 4426 }), tc("CHF 600,000", { w: 2400, align: AT.RIGHT })] }),
  new TableRow({ children: [tc("01.07.2028", { w: 2200 }), tc("Year 3 subscription charge, due annually in advance on 1 July 2028.", { w: 4426 }), tc("CHF 600,000", { w: 2400, align: AT.RIGHT })] }),
  new TableRow({ children: [tc([cellPara([{ text: "Total", bold: true }])], { w: 2200, fill: T.CREAM2 }), tc([cellPara([{ text: "Aggregate subscription charges for the 36-month Initial Term", bold: true }])], { w: 4426, fill: T.CREAM2 }), tc([cellPara([{ text: "CHF 1,575,000", bold: true }], { align: AT.RIGHT })], { w: 2400, fill: T.CREAM2 })] }),
]));

/* PAYMENT TERMS */
c.push(head("Payment terms"));
c.push(clause("1", lead("Terms.", "Net 14 days from the date of a valid invoice. Invoices are issued electronically (PDF). All amounts are net and exclusive of applicable VAT.")));
c.push(clause("2", lead("Late payment.", "Overdue amounts accrue interest at 5% per annum above the Swiss National Bank policy rate, or the maximum permitted by law if lower (per the MSA).")));
c.push(clause("3", lead("Purchase orders.", "If the Customer requires a Purchase Order, it must be provided at least seven (7) days before the start of the subscription term. If it is not, Novagentica may invoice on the basis of this Order Form and the Customer remains obliged to pay.")));

/* PO REQUIREMENTS */
c.push(head("Purchase-order requirements"));
c.push(body([{ text: "Is a Purchase Order required (to be completed by the Customer)?  " }, { text: "☐ No   ☐ Yes", bold: true }]));
c.push(table([3000, 6026], [ fieldRow("PO number", "[TBC]"), fieldRow("PO amount", "CHF [TBC]") ]));

/* MARKETING & REFERENCE RIGHTS — RETAINED AS NEGOTIATION ROUTE */
c.push(head("Marketing & reference rights"));
c.push(body("Under MSA clause 17.9, neither party uses the other’s name or marks without prior written consent, except that any agreed reference right is set out in this Order Form. This Section is that agreed reference right. Marketing & reference rights are granted under this Order Form as set out below."));
c.push(clause("1", lead("Mutual licence.", "Each Party grants the other Party and its Affiliates a right to use the Party’s company name and company logo in full, free of charge, and without restriction as to time and place, regardless of whether they already exist or are being created, including a right to sub-license use of them, only for the marketing measures set out below.")));
c.push(clause("2", lead("Activities.", "The Parties agree to conduct the following marketing activities and grant each other the necessary rights to do so.")));
c.push(clause("3", lead("Automatic Consent Activities.", "Upon execution of this Agreement, the Customer grants Novagentica a non-exclusive, royalty-free, worldwide licence to use the Customer’s company name, logo and a brief description of the collaboration (“Customer X uses Novagentica for […]”) on the Novagentica website, in sales decks, pitch materials, social media and other marketing collateral. The Customer will also publicise the strategic partnership with Novagentica via social media, a press release, and/or on the Customer’s website. The Customer shall provide Novagentica with one (1) to two (2) pre-approved quotes for use in such materials. The Customer shall submit at least one (1) G2 Business Software and Services Review (g2.com) and/or one (1) Gartner Peer Insights review no later than the Go-Live date. Novagentica shall draft and distribute a social media post on its corporate LinkedIn account to announce the commencement of the partnership and/or Go-Live (including tagging, photo and Customer logo).")));
c.push(clause("4", lead("Opt-in Activities.", "Novagentica may draft and distribute: (a) joint posts at milestones; (b) press releases confirming the partnership and/or launch; (c) one or more case studies describing the starting situation, the Novagentica solution and the impact achieved. Case studies, relevant parts or derivative versions may be included in blogs, white papers, further social media posts and on the Novagentica website, provided the scope and intent remain unchanged. The Customer conducts up to four (4) non-public reference calls per calendar year with prospective Novagentica customers and/or industry analysts, upon reasonable notice of at least ten (10) business days.")));
c.push(clause("5", lead("Best-Efforts Activities.", "Upon mutual agreement, the Customer shall use best efforts to: (a) present on stage at a Novagentica event up to one (1) time per calendar year; such presentation may be filmed and published on the Novagentica website and YouTube, subject to the Customer’s prior written consent; (b) participate as a guest speaker in a webinar hosted by Novagentica; (c) participate in video interviews (including AI-assisted formats such as HeyGen); and (d) co-author whitepapers on industry topics relevant to the Parties’ collaboration. Any content generated using AI tools shall include an appropriate AI-disclosure.")));
c.push(clause("6", lead("Governance & Approvals.", "For marketing activities under clauses 4 and 5, Novagentica shall submit the relevant materials to the Customer for review. The Customer must respond to such request within ten (10) business days, failing which the request shall be deemed approved (Deemed Approval). The Customer’s consent shall not be unreasonably withheld. Notwithstanding the foregoing, any publication featuring a Customer individual’s name, likeness or personal statement in video format requires separate prior written consent, to which the Deemed Approval mechanism does not apply.")));
c.push(clause("7", lead("Termination of Marketing Rights.", "Upon termination of this Agreement, the rights granted under this Section shall survive for twelve (12) months solely for materials already published or in production at the date of termination. Either Party may request removal of specific materials with thirty (30) days’ written notice.")));
c.push(note("RETAINED AS A NEGOTIATION ROUTE (per instruction). Hensoldt is an Aerospace & Defence customer and will likely resist logo use, press releases and public reference calls. This section is kept in as Novagentica’s opening position and a route to negotiate a narrower set of rights (e.g. private references / analyst briefings only) rather than being struck. Expect routing through Hensoldt Customer Communications; a procurement-only signatory may not be able to bind the press-release / G2 / reference-call commitments."));

/* CONFIDENTIALITY */
c.push(head("Confidentiality"));
c.push(body("This Order Form and its contents are confidential. The confidentiality obligations of the MSA apply to it; each party protects the other’s confidential information on the terms set out there."));

/* SPECIAL PROVISIONS & MSA */
c.push(head("Special provisions & relationship to the MSA"));
c.push(clause("1", lead("Incorporation.", "This Order Form is a separate contract that incorporates and is subject to the MSA. Capitalised terms have the meanings given in the MSA unless defined otherwise here.")));
c.push(clause("2", lead("Order of precedence.", "If there is a conflict, the following order applies: (a) the DPA, for personal data; (b) this Order Form, for the commercial terms it covers; (c) the MSA; and (d) the Service Description and Documentation.")));
c.push(clause("3", lead("Enterprise tier with six-month introductory pricing.", "The Customer is contracted on the Enterprise tier (CHF 600,000 / yr) for the Initial Term. For the first six (6) months (01.07.2026–31.12.2026) Enterprise capability is provided at the Domain price. The Customer may elect to remain on the Domain tier by giving Novagentica at least four (4) weeks’ written notice before 31.12.2026; absent such notice, full Enterprise pricing applies from 01.01.2027 in accordance with the Payment schedule.")));
c.push(note("Material pricing step-up. Make the introductory period, the 4-week opt-out to remain on Domain, and the Enterprise price unmistakable to the Customer before signature; align with the deal record (NG-2026-HE-001)."));
c.push(clause("4", lead("Renewal & price adjustment.", "After the Initial Term the subscription renews for successive fixed twelve (12) month periods unless either party gives written notice at least 90 days before the end of the then-current term. On each renewal the annual fee increases by 12%.")));
c.push(clause("5", lead("Reproduced wording.", "Where this Order Form reproduces MSA wording, it does so for convenience; the MSA governs and prevails to the extent of any difference.")));
c.push(clause("6", lead("Further special provisions.", "[None / as follows: insert any deal-specific terms that do not conflict with the MSA.]")));

/* SIGNATURES */
c.push(head("Signatures"));
c.push(body([{ text: "By signing, each party agrees to this Order Form under the MSA identified above. Each signatory warrants they are authorised to bind their organisation.", size: 18 }]));
c.push(H.gap(80));
c.push(hensoldtSig());

write(buildDoc(c, { docTitle: "Novagentica Order Form — Subscription — HENSOLDT (DRAFT)", headerLabel: "Order Form · Subscription · HENSOLDT · DRAFT" }),
  "Novagentica_OF_Subscription_HENSOLDT_DRAFT.docx");

const H = require("./nvg_helpers.js");
const { T, BOX, AlignmentType: AT } = H;
const { masthead, draftPanel, addressBlock, head, body, note, clause, lead, fieldRow, hRow, tc, cellPara, table, sigBlock, buildDoc, write, TableRow } = H;

const c = [];
c.push(...masthead("ORDER FORM \u2014 PROFESSIONAL SERVICES", "Novagentica Architect\u2122 \u00B7 Expert Services (MVP1 \u2192 MVPx)"));
c.push(H.gap(120));
c.push(addressBlock());

/* ORDER DETAILS */
c.push(head("Order details"));
c.push(table([3000, 6026], [
  fieldRow("Order Form type", "Professional Services"),
  fieldRow("Order Form no.", "2026-NVG-HE-PS-001"),
  fieldRow("Offer date", "25 June 2026"),
  fieldRow("Offer valid until", "30 September 2026"),
  fieldRow("Contact \u2014 Customer", "André Scheidhammer, Chief Information Officer"),
  fieldRow("Contact \u2014 Novagentica", "Felix Bühner, Commercial Lead"),
  fieldRow("Billing e-mail \u2014 Customer", "[Customer billing contact \u2014 to confirm]"),
  fieldRow("VAT no. \u2014 Customer", "[Customer VAT / register no. \u2014 to confirm]"),
  fieldRow("Currency", "Swiss Francs (CHF). All amounts net, exclusive of VAT."),
]));

/* DELIVERY MODEL */
c.push(head("Delivery model"));
c.push(body([{ text: "Select one. ", bold: true }, "Professional Services are delivered on an MVP1 \u2192 MVPx basis: each stage delivers a working, enforced increment rather than a throwaway trial."]));
c.push(table([900, 2900, 5226], [
  hRow(["Select", "Model", "What it means"], [900, 2900, 5226]),
  new TableRow({ children: [tc(BOX, { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: "Novagentica-built", bold: true }])], { w: 2900 }), tc("Novagentica designs, builds and enforces the agents and delivers them into the Customer\u2019s runtimes.", { w: 5226 })] }),
  new TableRow({ children: [tc("\u2612", { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: "Co-build (Agentic Atelier)", bold: true }])], { w: 2900 }), tc("Novagentica and the Customer build together; the Customer\u2019s team is upskilled alongside delivery.", { w: 5226 })] }),
  new TableRow({ children: [tc(BOX, { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: "Customer-built + supported", bold: true }])], { w: 2900 }), tc("The Customer builds; Novagentica provides enablement, review and enforcement support. Includes ingestion of existing agents.", { w: 5226 })] }),
]));

/* SERVICES OVERVIEW */
c.push(head("Professional services overview"));
c.push(table([3000, 6026], [
  fieldRow("Service / position", "Architect\u2122 MVP1\u2192MVP3 build \u2014 RFI/RFQ governance, candidate screening, SAP source-to-PO"),
  fieldRow("Description", "Reverse-engineer and govern the existing Copilot Studio + LangGraph build; candidate screening on SuccessFactors with human sign-off; SAP source-to-PO on SAP MM. Detailed scope and acceptance criteria in the attached SoW / Appendix 1."),
  fieldRow("Order start", "01.07.2026"),
  fieldRow("Order end", "31.08.2026"),
  fieldRow("Estimated effort (person-days)", "27 person-days"),
  fieldRow("Day rate", "CHF 2,500 per person-day"),
  fieldRow("Fee basis", "\u2610 Time & materials against the estimate   \u2612 Fixed package price of CHF 67,500"),
  fieldRow("Estimated / fixed fee", "CHF 67,500 (net, excl. VAT and expenses)"),
]));
c.push(body([{ text: "MVP stages", bold: true }], { after: 60 }));
c.push(table([1500, 4926, 2600], [
  hRow(["Stage", "Outcome delivered & enforced", "Est. effort (days)"], [1500, 4926, 2600]),
  new TableRow({ children: [tc([cellPara([{ text: "MVP1", bold: true }])], { w: 1500, fill: T.CREAM2 }), tc("RFI/RFQ governance \u2014 govern the Copilot Studio + LangGraph build; authority bands encoded as a Decision Contract; every commit gated and Crypto Passport-signed.", { w: 4926 }), tc("2", { w: 2600, align: AT.CENTER })] }),
  new TableRow({ children: [tc([cellPara([{ text: "MVP2", bold: true }])], { w: 1500, fill: T.CREAM2 }), tc("Candidate screening on SuccessFactors \u2014 co-built with Hensoldt\u2019s HR and engineering teams in the Agentic Atelier, who are upskilled to own it; rank-and-recommend with Article 14 human sign-off (Annex III high-risk; works-council gated).", { w: 4926 }), tc("5", { w: 2600, align: AT.CENTER })] }),
  new TableRow({ children: [tc([cellPara([{ text: "MVP3", bold: true }])], { w: 1500, fill: T.CREAM2 }), tc("SAP source-to-PO on SAP MM \u2014 co-built alongside Hensoldt\u2019s SAP and procurement teams in the Agentic Atelier, with knowledge transfer so the team can own and extend it; in-policy purchase orders drawn automatically, out-of-policy escalated, every output signed.", { w: 4926 }), tc("20", { w: 2600, align: AT.CENTER })] }),
  new TableRow({ children: [tc([cellPara([{ text: "Total", bold: true }])], { w: 1500, fill: T.CRIMSON, color: "FFFFFF" }), tc("", { w: 4926, fill: T.CRIMSON }), tc([cellPara([{ text: "27", bold: true }], { align: AT.CENTER })], { w: 2600, fill: T.CRIMSON, color: "FFFFFF" })] }),
]));
c.push(note("Hensoldt MVP plan (27 person-days). MVP2 is conditional on works-council (Betriebsrat) approval \u2014 see SoW. Detailed scope and acceptance criteria belong in the SoW / Appendix 1."));

/* TRAVEL & EXPENSES */
c.push(head("Travel & expenses"));
c.push(clause("1", lead("Expenses.", "Travel expenses are reimbursed based on actual costs incurred and upon presentation of relevant receipts. The use of a private car will be reimbursed at CHF 0.70 per km, up to a maximum of 500 km/day, only if there is no economically reasonable train or flight connection. Economy class (train 2nd class / air), rental cars up to mid-range class. Accommodation up to CHF 140 (Switzerland) / CHF 190 (abroad) against receipt. Additional meal expenses at applicable statutory flat rates. Other incidental expenses (parking, tolls, etc.) against proof.")));

/* CHANGE CONTROL */
c.push(head("Change control"));
c.push(clause("1", "Work outside the agreed scope is performed only under a written Change Order signed by both parties before it starts (this mirrors MSA clause 5.4). No out-of-scope work proceeds on the basis of email or verbal agreement alone."));

/* PAYMENT SCHEDULE */
c.push(head("Payment schedule"));
c.push(body("For this engagement the Professional Services are a fixed package price of CHF 67,500, payable 100% on the Effective Date (01.07.2026). Foundation, AQVP\u2122 certification and engagement management are absorbed within each MVP and are not billed separately. Indicative \u00B1 15%, fixed at SoW sign-off."));
c.push(table([2400, 4226, 2400], [
  hRow(["Date", "Service / description", "Amount (net, excl. VAT)"], [2400, 4226, 2400]),
  new TableRow({ children: [tc("01.07.2026", { w: 2400 }), tc("Professional Services \u2014 fixed package price, 100% on the Effective Date", { w: 4226 }), tc("CHF 67,500", { w: 2400, align: AT.RIGHT })] }),
]));

/* PAYMENT TERMS */
c.push(head("Payment terms"));
c.push(clause("1", lead("Terms.", "Net 14 days from the date of a valid invoice. Invoices are issued electronically (PDF). All amounts are net and exclusive of applicable VAT.")));
c.push(clause("2", lead("Late payment.", "Overdue amounts accrue interest at 5% per annum above the Swiss National Bank policy rate, or the maximum permitted by law if lower (per the MSA).")));
c.push(clause("3", lead("Purchase orders.", "If the Customer requires a Purchase Order, it must be provided at least seven (7) days before the start of the service term. If it is not, Novagentica may invoice on the basis of this Order Form and the Customer remains obliged to pay.")));

/* PO REQUIREMENTS */
c.push(head("Purchase-order requirements"));
c.push(body([{ text: "Is a Purchase Order required (to be completed by the Customer)?  " }, { text: "\u2610 No   \u2610 Yes", bold: true }]));
c.push(table([3000, 6026], [ fieldRow("PO number", "[ ]"), fieldRow("PO amount", "CHF [ ]") ]));

/* CONFIDENTIALITY */
c.push(head("Confidentiality"));
c.push(body("This Order Form and its contents are confidential. The confidentiality obligations of the MSA apply to it; each party protects the other\u2019s confidential information on the terms set out there."));

/* SPECIAL PROVISIONS & MSA */
c.push(head("Special provisions & relationship to the MSA"));
c.push(clause("1", lead("Incorporation.", "This Order Form is a separate contract that incorporates and is subject to the MSA. Capitalised terms have the meanings given in the MSA unless defined otherwise here.")));
c.push(clause("2", lead("Order of precedence.", "If there is a conflict, the following order applies: (a) the DPA, for personal data; (b) this Order Form, for the commercial terms it covers; (c) the MSA; and (d) the Service Description and Documentation.")));
c.push(clause("3", lead("Standard of performance.", "Novagentica performs the Professional Services with reasonable skill and care, using suitably qualified personnel, as set out in the MSA. Customer dependencies (timely access, information, decisions, personnel) may affect timelines and fees.")));
c.push(clause("4", lead("Fixed price & relationship to licence.", "The fee is a fixed package price (indicative \u00B1 15%, fixed at SoW sign-off). The platform licence is quoted separately under Order Form 2026-NVG-HE-SC-001.")));

/* SIGNATURES */
c.push(head("Signatures"));
c.push(body([{ text: "By signing, each party agrees to this Order Form under the MSA identified above. Each signatory warrants they are authorised to bind their organisation.", size: 18 }]));
c.push(H.gap(80));
c.push(sigBlock("For HENSOLDT AG"));

write(buildDoc(c, { docTitle: "Novagentica Order Form \u2014 Professional Services \u2014 HENSOLDT AG", headerLabel: "Order Form \u00B7 Professional Services \u00B7 Hensoldt" }),
  "/home/user/workflows/outputs/Novagentica_OF_Professional_Services_Hensoldt.docx");

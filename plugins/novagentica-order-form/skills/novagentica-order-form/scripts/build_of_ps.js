const H = require("./nvg_helpers.js");
const { T, BOX, AlignmentType: AT } = H;
const { masthead, draftPanel, addressBlock, head, body, note, clause, lead, fieldRow, hRow, tc, cellPara, table, sigBlock, buildDoc, write, TableRow } = H;

const c = [];
c.push(...masthead("ORDER FORM \u2014 PROFESSIONAL SERVICES", "Novagentica Architect\u2122 \u00B7 Expert Services (MVP1 \u2192 MVPx)"));
c.push(draftPanel([
  "This Order Form is a binding commercial schedule under the MSA. Complete every [bracketed] field, select the applicable options, resolve every \u2039drafting note\u203A, and delete this panel before issue.",
  "It is governed by, and incorporates, the MSA. Detailed scope, acceptance criteria and assumptions belong in an attached Statement of Work / Appendix 1.",
]));
c.push(H.gap(120));
c.push(addressBlock());

/* ORDER DETAILS */
c.push(head("Order details"));
c.push(table([3000, 6026], [
  fieldRow("Order Form type", "Professional Services"),
  fieldRow("Order Form no.", "[YYYY]-NVG-[XYZ]-PS-0[XX]"),
  fieldRow("Offer date", "[DD Month YYYY]"),
  fieldRow("Offer valid until", "[DD Month YYYY]"),
  fieldRow("Contact \u2014 Customer", "[Name, title]"),
  fieldRow("Contact \u2014 Novagentica", "[Name, title]"),
  fieldRow("Billing e-mail \u2014 Customer", "[billing@customer.com]"),
  fieldRow("VAT no. \u2014 Customer", "[VAT registration number]"),
  fieldRow("Currency", "Swiss Francs (CHF). All amounts net, exclusive of VAT."),
]));

/* DELIVERY MODEL */
c.push(head("Delivery model"));
c.push(body([{ text: "Select one. ", bold: true }, "Professional Services are delivered on an MVP1 \u2192 MVPx basis: each stage delivers a working, enforced increment rather than a throwaway trial."]));
c.push(table([900, 2900, 5226], [
  hRow(["Select", "Model", "What it means"], [900, 2900, 5226]),
  new TableRow({ children: [tc(BOX, { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: "Novagentica-built", bold: true }])], { w: 2900 }), tc("Novagentica designs, builds and enforces the agents and delivers them into the Customer\u2019s runtimes.", { w: 5226 })] }),
  new TableRow({ children: [tc("☒", { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: "Co-build (Agentic Atelier)", bold: true }])], { w: 2900 }), tc("Novagentica and the Customer build together; the Customer\u2019s team is upskilled alongside delivery.", { w: 5226 })] }),
  new TableRow({ children: [tc(BOX, { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: "Customer-built + supported", bold: true }])], { w: 2900 }), tc("The Customer builds; Novagentica provides enablement, review and enforcement support. Includes ingestion of existing agents.", { w: 5226 })] }),
]));
c.push(note("Delivery model is always Co-build (Agentic Atelier) — Novagentica does not deliver on a pure “Novagentica-built” basis. Keep Co-build selected; the other rows are shown for context."));

/* SERVICES OVERVIEW */
c.push(head("Professional services overview"));
c.push(table([3000, 6026], [
  fieldRow("Service / position", "[Service name \u2014 e.g. Architect MVP1 build]"),
  fieldRow("Description", "[Brief description, or see attached Statement of Work / Appendix 1]"),
  fieldRow("Order start", "[DD.MM.YYYY]"),
  fieldRow("Order end", "[DD.MM.YYYY]"),
  fieldRow("Estimated effort (person-days)", "[XX] person-days"),
  fieldRow("Day rate", "CHF 2,500 per person-day"),
  fieldRow("Fee basis", "\u2612 Time & materials against the estimate   \u2610 Fixed package price of CHF [ ]"),
  fieldRow("Estimated / fixed fee", "CHF [ ] (net, excl. VAT and expenses)"),
]));
c.push(body([{ text: "MVP stages", bold: true }], { after: 60 }));
c.push(table([1500, 4926, 2600], [
  hRow(["Stage", "Outcome delivered & enforced", "Est. effort (days)"], [1500, 4926, 2600]),
  ...["MVP1", "MVP2", "MVP3"].map((s, i) => new TableRow({ children: [tc([cellPara([{ text: s, bold: true }])], { w: 1500, fill: T.CREAM2 }), tc(i === 0 ? "[Outcome delivered and enforced at MVP1]" : "[Outcome]", { w: 4926, color: T.GREY }), tc("[n]", { w: 2600, align: AT.CENTER })] })),
]));
c.push(note("Add or remove MVP rows to match the engagement. Keep this table to outcomes and effort; detailed scope and acceptance criteria belong in the SoW / Appendix 1."));

/* TRAVEL & EXPENSES */
c.push(head("Travel & expenses"));
c.push(clause("1", lead("Expenses.", "Travel expenses are reimbursed based on actual costs incurred and upon presentation of relevant receipts. The use of a private car will be reimbursed at CHF 0.70 per km, up to a maximum of 500 km/day, only if there is no economically reasonable train or flight connection. Economy class (train 2nd class / air), rental cars up to mid-range class. Accommodation up to CHF 140 (Switzerland) / CHF 190 (abroad) against receipt. Additional meal expenses at applicable statutory flat rates. Other incidental expenses (parking, tolls, etc.) against proof.")));

/* CHANGE CONTROL */
c.push(head("Change control"));
c.push(clause("1", "Work outside the agreed scope is performed only under a written Change Order signed by both parties before it starts (this mirrors MSA clause 5.4). No out-of-scope work proceeds on the basis of email or verbal agreement alone."));

/* PAYMENT SCHEDULE */
c.push(head("Payment schedule"));
c.push(body("Expert Services are offered as a budgetary amount for a lean, agile approach. They are billed monthly in arrears on the person-days actually consumed in the relevant calendar month (or on MVP-stage acceptance, for a fixed package price). Unused person-days at the end of the service period are forfeited unless otherwise agreed in writing."));
c.push(table([2400, 4226, 2400], [
  hRow(["Date", "Service / description", "Amount (net, excl. VAT)"], [2400, 4226, 2400]),
  new TableRow({ children: [tc("[DD.MM.YYYY]", { w: 2400, color: T.GREY }), tc("[Person-days consumed \u2014 month n]", { w: 4226, color: T.GREY }), tc("CHF [ ]", { w: 2400, align: AT.RIGHT })] }),
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
c.push(clause("4", lead("Further special provisions.", "[None / as follows: insert any deal-specific terms that do not conflict with the MSA.]")));

/* SIGNATURES */
c.push(head("Signatures"));
c.push(body([{ text: "By signing, each party agrees to this Order Form under the MSA identified above. Each signatory warrants they are authorised to bind their organisation.", size: 18 }]));
c.push(H.gap(80));
c.push(sigBlock("For [Customer]"));

write(buildDoc(c, { docTitle: "Novagentica Order Form \u2014 Professional Services (DRAFT)", headerLabel: "Order Form \u00B7 Professional Services \u00B7 DRAFT" }),
  "Novagentica_OF_Professional_Services_DRAFT.docx");

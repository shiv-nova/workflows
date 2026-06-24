/* Hensoldt-specific PROFESSIONAL SERVICES order form.
   Reuses the skill brand helpers; bakes in the Hensoldt deal record (NG-2026-HE-001)
   and the 23-24 Jun template decisions (unused PS days expire 31 Dec; start 1 Jul). */
const H = require("../../scripts/nvg_helpers.js");
const { T, BOX, AlignmentType: AT } = H;
const { masthead, draftPanel, head, body, note, clause, lead, fieldRow, hRow, tc, cellPara, table,
  sigBlock, buildDoc, write, TableRow, TableCell, WidthType, VerticalAlign, cellBorders, cellMargins } = H;
const CHECK = "☒";

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
c.push(...masthead("ORDER FORM — PROFESSIONAL SERVICES", "Novagentica Architect™ · Expert Services (MVP1 → MVP3) · HENSOLDT"));
c.push(draftPanel([
  "DRAFT — populated from Notion CRM (Hensoldt deal NG-2026-HE-001) and the 24 Jun commercial update. Fixed-price agreement: CHF 67,500 for the full MVP1→MVP3 slate, payable in full, in advance, on the Effective Date (1 Jul 2026). Scope and effort follow the engagement offer.",
  "Contracting entity: HENSOLDT AG · signatory: André Scheidhammer (CIO). Remaining items to provide before issue: Hensoldt VAT no., accounts-payable billing e-mail, and the PO (if required). Detailed scope and acceptance criteria belong in the attached Statement of Work / Appendix 1.",
]));
c.push(H.gap(120));
c.push(hensoldtAddress());

/* ORDER DETAILS */
c.push(head("Order details"));
c.push(table([3000, 6026], [
  fieldRow("Order Form type", "Professional Services"),
  fieldRow("Order Form no.", "2026-NVG-HE-PS-001"),
  fieldRow("Linked engagement offer", "NG-2026-HE-001 (June 2026)"),
  fieldRow("Offer date", "24 June 2026"),
  fieldRow("Offer valid until", "22 September 2026 (90 days)"),
  fieldRow("Contact — Customer", "André Scheidhammer, CIO — Andre.Scheidhammer@hensoldt.net"),
  fieldRow("Contact — Novagentica", "Shiv Tailor (delivery) / [account owner TBC]"),
  fieldRow("Billing e-mail — Customer", "[TBC]"),
  fieldRow("VAT no. — Customer", "[TBC]"),
  fieldRow("Currency", "Swiss Francs (CHF). All amounts net, exclusive of VAT."),
]));

/* DELIVERY MODEL */
c.push(head("Delivery model"));
c.push(body([{ text: "Selected: Novagentica-built (single consultant). ", bold: true }, "Professional Services are delivered on an MVP1 → MVP3 basis: each stage delivers a working, enforced increment rather than a throwaway trial."]));
c.push(table([900, 2900, 5226], [
  hRow(["Select", "Model", "What it means"], [900, 2900, 5226]),
  new TableRow({ children: [tc(CHECK, { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: "Novagentica-built", bold: true }])], { w: 2900 }), tc("Novagentica designs, builds and enforces the agents and delivers them into the Customer’s runtimes.", { w: 5226 })] }),
  new TableRow({ children: [tc(BOX, { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: "Co-build (Agentic Atelier)", bold: true }])], { w: 2900 }), tc("Novagentica and the Customer build together; the Customer’s team is upskilled alongside delivery.", { w: 5226 })] }),
  new TableRow({ children: [tc(BOX, { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: "Customer-built + supported", bold: true }])], { w: 2900 }), tc("The Customer builds; Novagentica provides enablement, review and enforcement support. Includes ingestion of existing agents.", { w: 5226 })] }),
]));
c.push(note("Delivery model defaulted to Novagentica-built (single consultant), matching the engagement offer’s 27-day estimate. Confirm with the Customer before issue."));

/* SERVICES OVERVIEW */
c.push(head("Professional services overview"));
c.push(table([3000, 6026], [
  fieldRow("Service / position", "Architect MVP1 → MVP3 build — Procurement & HR governance"),
  fieldRow("Description", "Three enforced MVP increments (see MVP stages below); detailed scope per attached Statement of Work / Appendix 1"),
  fieldRow("Order start", "01.07.2026"),
  fieldRow("Delivery target", "31.12.2026"),
  fieldRow("Effort (basis for fixed price)", "27 person-days @ CHF 2,500 = CHF 67,500"),
  fieldRow("Fee basis", "☐ Time & materials   " + CHECK + " Fixed package price (fixed-price agreement)"),
  fieldRow("Fixed fee", "CHF 67,500 (net, excl. VAT and expenses) — payable 100% upfront"),
]));
c.push(body([{ text: "MVP stages", bold: true }], { after: 60 }));
c.push(table([1300, 5126, 2600], [
  hRow(["Stage", "Outcome delivered & enforced", "Est. effort (days)"], [1300, 5126, 2600]),
  new TableRow({ children: [tc([cellPara([{ text: "MVP1", bold: true }])], { w: 1300, fill: T.CREAM2 }), tc("RFI/RFQ governance (EU AI Act limited-risk).", { w: 5126 }), tc("2", { w: 2600, align: AT.CENTER })] }),
  new TableRow({ children: [tc([cellPara([{ text: "MVP2", bold: true }])], { w: 1300, fill: T.CREAM2 }), tc("Candidate screening on SuccessFactors (EU AI Act Annex III high-risk; Article 14 human sign-off enforced; works-council gated).", { w: 5126 }), tc("5", { w: 2600, align: AT.CENTER })] }),
  new TableRow({ children: [tc([cellPara([{ text: "MVP3", bold: true }])], { w: 1300, fill: T.CREAM2 }), tc("SAP source-to-PO (EU AI Act limited-risk).", { w: 5126 }), tc("20", { w: 2600, align: AT.CENTER })] }),
  new TableRow({ children: [tc([cellPara([{ text: "Total", bold: true }])], { w: 1300, fill: T.CREAM2 }), tc([cellPara([{ text: "Full slate — all three MVPs", bold: true }])], { w: 5126 }), tc([cellPara([{ text: "27", bold: true }], { align: AT.CENTER })], { w: 2600 })] }),
]));
c.push(note("MVP2 is gated by the Hensoldt works council and is EU AI Act Annex III high-risk — its 5-day estimate and go-live depend on works-council clearance. Detailed acceptance criteria and assumptions belong in the SoW / Appendix 1."));

/* TRAVEL & EXPENSES */
c.push(head("Travel & expenses"));
c.push(clause("1", lead("Expenses.", "Travel expenses are reimbursed based on actual costs incurred and upon presentation of relevant receipts. The use of a private car will be reimbursed at CHF 0.70 per km, up to a maximum of 500 km/day, only if there is no economically reasonable train or flight connection. Economy class (train 2nd class / air), rental cars up to mid-range class. Accommodation up to CHF 140 (Switzerland) / CHF 190 (abroad) against receipt. Additional meal expenses at applicable statutory flat rates. Other incidental expenses (parking, tolls, etc.) against proof.")));

/* CHANGE CONTROL */
c.push(head("Change control"));
c.push(clause("1", "Work outside the agreed scope is performed only under a written Change Order signed by both parties before it starts (this mirrors MSA clause 5.4). No out-of-scope work proceeds on the basis of email or verbal agreement alone."));

/* PAYMENT SCHEDULE */
c.push(head("Payment schedule"));
c.push(body("The Professional Services are provided on a fixed-price basis — CHF 67,500 for the full MVP1→MVP3 slate — and are payable in full, in advance, on signature / the Effective Date. The fixed price is not day-metered; the 27-day figure is the basis of the fixed price, not a consumption cap."));
c.push(table([2200, 4426, 2400], [
  hRow(["Date", "Service / description", "Amount (net, excl. VAT)"], [2200, 4426, 2400]),
  new TableRow({ children: [tc("01.07.2026", { w: 2200 }), tc("Professional services — full MVP1→MVP3 slate (fixed price; 100% payable upfront)", { w: 4426 }), tc([cellPara([{ text: "CHF 67,500", bold: true }], { align: AT.RIGHT })], { w: 2400 })] }),
  new TableRow({ children: [tc([cellPara([{ text: "Total", bold: true }])], { w: 2200, fill: T.CREAM2 }), tc([cellPara([{ text: "Fixed services fee", bold: true }])], { w: 4426, fill: T.CREAM2 }), tc([cellPara([{ text: "CHF 67,500", bold: true }], { align: AT.RIGHT })], { w: 2400, fill: T.CREAM2 })] }),
]));

/* PAYMENT TERMS */
c.push(head("Payment terms"));
c.push(clause("1", lead("Terms.", "Net 14 days from the date of a valid invoice. Invoices are issued electronically (PDF). All amounts are net and exclusive of applicable VAT.")));
c.push(clause("2", lead("Late payment.", "Overdue amounts accrue interest at 5% per annum above the Swiss National Bank policy rate, or the maximum permitted by law if lower (per the MSA).")));
c.push(clause("3", lead("Purchase orders.", "If the Customer requires a Purchase Order, it must be provided at least seven (7) days before the start of the service term. If it is not, Novagentica may invoice on the basis of this Order Form and the Customer remains obliged to pay.")));

/* PO REQUIREMENTS */
c.push(head("Purchase-order requirements"));
c.push(body([{ text: "Is a Purchase Order required (to be completed by the Customer)?  " }, { text: "☐ No   ☐ Yes", bold: true }]));
c.push(table([3000, 6026], [ fieldRow("PO number", "[TBC]"), fieldRow("PO amount", "CHF [TBC]") ]));

/* CONFIDENTIALITY */
c.push(head("Confidentiality"));
c.push(body("This Order Form and its contents are confidential. The confidentiality obligations of the MSA apply to it; each party protects the other’s confidential information on the terms set out there."));

/* SPECIAL PROVISIONS & MSA */
c.push(head("Special provisions & relationship to the MSA"));
c.push(clause("1", lead("Incorporation.", "This Order Form is a separate contract that incorporates and is subject to the MSA. Capitalised terms have the meanings given in the MSA unless defined otherwise here.")));
c.push(clause("2", lead("Order of precedence.", "If there is a conflict, the following order applies: (a) the DPA, for personal data; (b) this Order Form, for the commercial terms it covers; (c) the MSA; and (d) the Service Description and Documentation.")));
c.push(clause("3", lead("Standard of performance.", "Novagentica performs the Professional Services with reasonable skill and care, using suitably qualified personnel, as set out in the MSA. Customer dependencies (timely access, information, decisions, personnel and — for MVP2 — works-council clearance) may affect timelines and fees.")));
c.push(clause("4", lead("Relationship to the subscription.", "These Professional Services are provided alongside the Novagentica Architect™ platform subscription (Enterprise, CHF 600,000 / yr; 3-year contract value CHF 1,575,000 with the six-month introductory pricing) under separate Order Form 2026-NVG-HE-SC-001. Including these fixed-price services (CHF 67,500), the total contract value over the term is CHF 1,642,500 (excl. VAT and expenses).")));
c.push(clause("5", lead("Further special provisions.", "[None / as follows: insert any deal-specific terms that do not conflict with the MSA.]")));

/* SIGNATURES */
c.push(head("Signatures"));
c.push(body([{ text: "By signing, each party agrees to this Order Form under the MSA identified above. Each signatory warrants they are authorised to bind their organisation.", size: 18 }]));
c.push(H.gap(80));
c.push(hensoldtSig());

write(buildDoc(c, { docTitle: "Novagentica Order Form — Professional Services — HENSOLDT (DRAFT)", headerLabel: "Order Form · Professional Services · HENSOLDT · DRAFT" }),
  "Novagentica_OF_Professional_Services_HENSOLDT_DRAFT.docx");

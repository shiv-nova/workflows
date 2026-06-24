const H = require("./nvg_helpers.js");
const { T, BOX, AlignmentType: AT } = H;
const { masthead, draftPanel, addressBlock, head, body, note, clause, lead, fieldRow, hRow, tc, cellPara, table, sigBlock, buildDoc, write, TableRow } = H;

const c = [];
c.push(...masthead("ORDER FORM \u2014 SUBSCRIPTION", "Novagentica Architect\u2122 \u00B7 Platform Subscription"));
c.push(draftPanel([
  "This Order Form is a binding commercial schedule under the MSA. Complete every [bracketed] field, select the applicable options, resolve every \u2039drafting note\u203A, and delete this panel before issue. Do not issue with placeholder commercials.",
  "It is governed by, and incorporates, the MSA. Keep master legal terms (liability, IP, warranties, confidentiality, data protection) in the MSA/DPA \u2014 do not restate them here.",
]));
c.push(H.gap(120));
c.push(addressBlock());

/* ORDER DETAILS */
c.push(head("Order details"));
c.push(table([3000, 6026], [
  fieldRow("Order Form type", "Subscription"),
  fieldRow("Order Form no.", "[YYYY]-NVG-[XYZ]-SC-0[XX]"),
  fieldRow("Offer date", "[DD Month YYYY]"),
  fieldRow("Offer valid until", "[DD Month YYYY]"),
  fieldRow("Effective Date", "[DD Month YYYY] (or date of last signature, if later)"),
  fieldRow("Initial Term", "36 months from the Effective Date"),
  fieldRow("Contact \u2014 Customer", "[Name, title]"),
  fieldRow("Contact \u2014 Novagentica", "[Name, title]"),
  fieldRow("Billing e-mail \u2014 Customer", "[billing@customer.com]"),
  fieldRow("VAT no. \u2014 Customer", "[VAT registration number]"),
  fieldRow("Currency", "Swiss Francs (CHF). All amounts net, exclusive of VAT."),
]));

/* SUBSCRIPTION OVERVIEW */
c.push(head("Subscription overview"));
c.push(body([{ text: "Select one tier. ", bold: true }, "Each tier sets the annual fee and the committed volume (agents governed and runs per month). Runs above the monthly allowance are charged as overage (see Over-consumption)."]));
c.push(table([2200, 2275, 2275, 2276], [
  new TableRow({ tableHeader: true, children: [tc("", { w: 2200, fill: T.CRIMSON }),
    tc("Domain", { w: 2275, fill: T.CRIMSON, bold: true, color: "FFFFFF", align: AT.CENTER }),
    tc("Enterprise", { w: 2275, fill: T.CRIMSON, bold: true, color: "FFFFFF", align: AT.CENTER }),
    tc("Global", { w: 2276, fill: T.CRIMSON, bold: true, color: "FFFFFF", align: AT.CENTER })] }),
  new TableRow({ children: [tc("Annual fee", { w: 2200, fill: T.CREAM2, bold: true }), tc([cellPara([{ text: "CHF 150,000", bold: true }], { align: AT.CENTER })], { w: 2275 }), tc([cellPara([{ text: "CHF 600,000", bold: true }], { align: AT.CENTER })], { w: 2275 }), tc([cellPara([{ text: "CHF 1,200,000", bold: true }], { align: AT.CENTER })], { w: 2276 })] }),
  new TableRow({ children: [tc("Agents governed", { w: 2200, fill: T.CREAM2, bold: true }), tc("Up to 20", { w: 2275, align: AT.CENTER }), tc("Up to 100", { w: 2275, align: AT.CENTER }), tc("Unlimited", { w: 2276, align: AT.CENTER })] }),
  new TableRow({ children: [tc("Runs / month", { w: 2200, fill: T.CREAM2, bold: true }), tc("100,000", { w: 2275, align: AT.CENTER }), tc("500,000", { w: 2275, align: AT.CENTER }), tc("20,000,000*", { w: 2276, align: AT.CENTER })] }),
  new TableRow({ children: [tc("Runtimes", { w: 2200, fill: T.CREAM2, bold: true }), tc("2 platforms", { w: 2275, align: AT.CENTER }), tc("All supported", { w: 2275, align: AT.CENTER }), tc("All + custom", { w: 2276, align: AT.CENTER })] }),
  new TableRow({ children: [tc("CDAP\u2122 refresh", { w: 2200, fill: T.CREAM2, bold: true }), tc("Weekly", { w: 2275, align: AT.CENTER }), tc("Daily", { w: 2275, align: AT.CENTER }), tc("Real-time", { w: 2276, align: AT.CENTER })] }),
  new TableRow({ children: [tc("Support", { w: 2200, fill: T.CREAM2, bold: true }), tc("Business hours", { w: 2275, align: AT.CENTER }), tc("24/5 + CSM", { w: 2275, align: AT.CENTER }), tc("24/7 + dedicated SA", { w: 2276, align: AT.CENTER })] }),
]));
c.push(body([{ text: "* Global runs/month is subject to a fair-use cap.", italics: true, size: 16, color: T.GREY }]));

c.push(body([{ text: "Subscribed position", bold: true }], { after: 60 }));
c.push(table([3000, 6026], [
  fieldRow("Service", "Novagentica Architect\u2122 platform subscription"),
  fieldRow("Selected tier", "\u2610 Domain   \u2610 Enterprise   \u2610 Global"),
  fieldRow("Committed runs / month", "[per selected tier]"),
  fieldRow("Order start (min. term)", "[DD.MM.YYYY]"),
  fieldRow("Order end (min. term)", "[DD.MM.YYYY]"),
  fieldRow("Annual subscription fee", "CHF [ ]"),
  fieldRow("Overage rate", "CHF [ ] per [n] runs above the monthly allowance"),
  fieldRow("Total for minimum term", "CHF [ ] (annual fee \u00D7 term years)"),
]));

c.push(body([{ text: "Runtimes in scope", bold: true }], { after: 60 }));
c.push(table([900, 4946, 3180], [
  hRow(["Select", "Runtime", "Notes"], [900, 4946, 3180]),
  ...[["Salesforce Agentforce", "Enforced over \u2014 not resold; no OEM/ISV relationship"], ["Microsoft Copilot Studio", ""], ["SAP Joule", ""], ["n8n", ""], ["LangGraph", ""], ["Haystack", ""], ["Dataiku", ""], ["OpenClaw", ""], ["NemoClaw", ""]].map(([r, n]) =>
    new TableRow({ children: [tc(BOX, { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: r, bold: r === "Salesforce Agentforce" }])], { w: 4946 }), tc(n, { w: 3180, size: 16, color: T.GREY })] })),
]));
c.push(note("Connectable runtimes depend on the tier: Domain = 2 platforms; Enterprise = all supported; Global = all + custom."));

/* OVER-CONSUMPTION */
c.push(head("Over-consumption"));
c.push(clause("1", "The subscription includes the runs-per-month allowance for the selected tier (the \u201CCommitted Volume\u201D), measured over each billing period."));
c.push(clause("2", lead("Overage.", "Runs in excess of the Committed Volume are charged at the Overage Rate above and invoiced in arrears at the end of the relevant billing period.")));
c.push(clause("3", lead("No interruption.", "Enforcement and execution continue when the Committed Volume is reached. Novagentica notifies the Customer\u2019s nominated contact at 80% and 100% of the Committed Volume in any billing period.")));
c.push(clause("4", lead("Sustained over-use.", "If runs exceed 100% of the Committed Volume for two consecutive billing periods, the parties will discuss in good faith an uplift, or a move to the next tier, recorded by a replacement or amended Order Form.")));
c.push(clause("5", lead("Minimum commitment.", "The annual fee is a minimum commitment; no credit accrues for runs below the Committed Volume.")));
c.push(note("Replaces the legacy \u201Cxyz\u201D placeholder. Set the per-run Overage Rate and define the Global fair-use behaviour at the 20M ceiling (soft cap with a conversation, or hard cap)."));

/* PAYMENT SCHEDULE */
c.push(head("Payment schedule"));
c.push(body("The subscription is invoiced annually in advance at the start of each contract year, unless a different schedule is agreed below. Additional runs or an in-term tier change are invoiced on a pro-rated basis from the effective date to the next annual invoice date."));
c.push(table([2400, 4226, 2400], [
  hRow(["Date", "Service / description", "Amount (net, excl. VAT)"], [2400, 4226, 2400]),
  ...[1, 2, 3].map(() => new TableRow({ children: [tc("[DD.MM.YYYY]", { w: 2400, color: T.GREY }), tc("[Annual subscription \u2014 contract year n]", { w: 4226, color: T.GREY }), tc("CHF [ ]", { w: 2400, align: AT.RIGHT })] })),
]));

/* PAYMENT TERMS */
c.push(head("Payment terms"));
c.push(clause("1", lead("Terms.", "Net 14 days from the date of a valid invoice. Invoices are issued electronically (PDF). All amounts are net and exclusive of applicable VAT.")));
c.push(clause("2", lead("Late payment.", "Overdue amounts accrue interest at 5% per annum above the Swiss National Bank policy rate, or the maximum permitted by law if lower (per the MSA).")));
c.push(clause("3", lead("Purchase orders.", "If the Customer requires a Purchase Order, it must be provided at least seven (7) days before the start of the subscription term. If it is not, Novagentica may invoice on the basis of this Order Form and the Customer remains obliged to pay.")));

/* PO REQUIREMENTS */
c.push(head("Purchase-order requirements"));
c.push(body([{ text: "Is a Purchase Order required (to be completed by the Customer)?  ", }, { text: "\u2610 No   \u2610 Yes", bold: true }]));
c.push(table([3000, 6026], [ fieldRow("PO number", "[ ]"), fieldRow("PO amount", "CHF [ ]") ]));

/* MARKETING & REFERENCE RIGHTS */
c.push(head("Marketing & reference rights"));
c.push(body("Under MSA clause 17.9, neither party uses the other\u2019s name or marks without prior written consent, except that any agreed reference right is set out in this Order Form. This Section is that agreed reference right. Marketing & reference rights are granted under this Order Form as set out below."));
c.push(clause("1", lead("Mutual licence.", "Each Party grants the other Party and its Affiliates a right to use the Party\u2019s company name and company logo in full, free of charge, and without restriction as to time and place, regardless of whether they already exist or are being created, including a right to sub-license use of them, only for the marketing measures set out below.")));
c.push(clause("2", lead("Activities.", "The Parties agree to conduct the following marketing activities and grant each other the necessary rights to do so.")));
c.push(clause("3", lead("Automatic Consent Activities.", "Upon execution of this Agreement, the Customer grants Novagentica a non-exclusive, royalty-free, worldwide licence to use the Customer\u2019s company name, logo and a brief description of the collaboration (\u201CCustomer X uses Novagentica for [\u2026]\u201D) on the Novagentica website, in sales decks, pitch materials, social media and other marketing collateral. The Customer will also publicise the strategic partnership with Novagentica via social media, a press release, and/or on the Customer\u2019s website. The Customer shall provide Novagentica with one (1) to two (2) pre-approved quotes for use in such materials. The Customer shall submit at least one (1) G2 Business Software and Services Review (g2.com) and/or one (1) Gartner Peer Insights review no later than the Go-Live date. Novagentica shall draft and distribute a social media post on its corporate LinkedIn account to announce the commencement of the partnership and/or Go-Live (including tagging, photo and Customer logo).")));
c.push(clause("4", lead("Opt-in Activities.", "Novagentica may draft and distribute: (a) joint posts at milestones; (b) press releases confirming the partnership and/or launch; (c) one or more case studies describing the starting situation, the Novagentica solution and the impact achieved. Case studies, relevant parts or derivative versions may be included in blogs, white papers, further social media posts and on the Novagentica website, provided the scope and intent remain unchanged. The Customer conducts up to four (4) non-public reference calls per calendar year with prospective Novagentica customers and/or industry analysts, upon reasonable notice of at least ten (10) business days.")));
c.push(clause("5", lead("Best-Efforts Activities.", "Upon mutual agreement, the Customer shall use best efforts to: (a) present on stage at a Novagentica event up to one (1) time per calendar year; such presentation may be filmed and published on the Novagentica website and YouTube, subject to the Customer\u2019s prior written consent; (b) participate as a guest speaker in a webinar hosted by Novagentica; (c) participate in video interviews (including AI-assisted formats such as HeyGen); and (d) co-author whitepapers on industry topics relevant to the Parties\u2019 collaboration. Any content generated using AI tools shall include an appropriate AI-disclosure.")));
c.push(clause("6", lead("Governance & Approvals.", "For marketing activities under clauses 4 and 5, Novagentica shall submit the relevant materials to the Customer for review. The Customer must respond to such request within ten (10) business days, failing which the request shall be deemed approved (Deemed Approval). The Customer\u2019s consent shall not be unreasonably withheld. Notwithstanding the foregoing, any publication featuring a Customer individual\u2019s name, likeness or personal statement in video format requires separate prior written consent, to which the Deemed Approval mechanism does not apply.")));
c.push(clause("7", lead("Termination of Marketing Rights.", "Upon termination of this Agreement, the rights granted under this Section shall survive for twelve (12) months solely for materials already published or in production at the date of termination. Either Party may request removal of specific materials with thirty (30) days\u2019 written notice.")));
c.push(note("Marketing rights are granted by default in this template. Defence and regulated customers (e.g. Hensoldt) routinely refuse logo use and press-release commitments \u2014 if the customer is in that category, strike or negotiate this section before issue rather than removing the default. Customer-side signatories with procurement-only authority may not be able to bind their organisation to the press-release / G2 review / reference-call commitments \u2014 expect routing through Customer Communications."));

/* CONFIDENTIALITY */
c.push(head("Confidentiality"));
c.push(body("This Order Form and its contents are confidential. The confidentiality obligations of the MSA apply to it; each party protects the other\u2019s confidential information on the terms set out there."));

/* SPECIAL PROVISIONS & MSA */
c.push(head("Special provisions & relationship to the MSA"));
c.push(clause("1", lead("Incorporation.", "This Order Form is a separate contract that incorporates and is subject to the MSA. Capitalised terms have the meanings given in the MSA unless defined otherwise here.")));
c.push(clause("2", lead("Order of precedence.", "If there is a conflict, the following order applies: (a) the DPA, for personal data; (b) this Order Form, for the commercial terms it covers; (c) the MSA; and (d) the Service Description and Documentation.")));
c.push(clause("3", lead("Reproduced wording.", "Where this Order Form reproduces MSA wording, it does so for convenience; the MSA governs and prevails to the extent of any difference.")));
c.push(clause("4", lead("Renewal & price adjustment.", "The subscription renews for successive periods equal to the Initial Term unless either party gives written notice at least 90 days before the end of the then-current term. On renewal the fee may increase by the greater of 5% or the change in the Swiss CPI over the preceding 12 months, on at least 90 days\u2019 notice.")));
c.push(clause("5", lead("Further special provisions.", "[None / as follows: insert any deal-specific terms that do not conflict with the MSA.]")));

/* SIGNATURES */
c.push(head("Signatures"));
c.push(body([{ text: "By signing, each party agrees to this Order Form under the MSA identified above. Each signatory warrants they are authorised to bind their organisation.", size: 18 }]));
c.push(H.gap(80));
c.push(sigBlock("For [Customer]"));

write(buildDoc(c, { docTitle: "Novagentica Order Form \u2014 Subscription (DRAFT)", headerLabel: "Order Form \u00B7 Subscription \u00B7 DRAFT" }),
  "Novagentica_OF_Subscription_DRAFT.docx");

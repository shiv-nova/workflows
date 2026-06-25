const H = require("./nvg_helpers.js");
const { T, BOX, AlignmentType: AT } = H;
const { masthead, draftPanel, addressBlock, head, body, note, clause, lead, fieldRow, hRow, tc, cellPara, table, sigBlock, buildDoc, write, TableRow } = H;

const c = [];
c.push(...masthead("ORDER FORM \u2014 SUBSCRIPTION", "Novagentica Architect\u2122 \u00B7 Platform Subscription"));
c.push(H.gap(120));
c.push(addressBlock());

/* ORDER DETAILS */
c.push(head("Order details"));
c.push(table([3000, 6026], [
  fieldRow("Order Form type", "Subscription"),
  fieldRow("Order Form no.", "2026-NVG-EX-SC-001"),
  fieldRow("Offer date", "25 June 2026"),
  fieldRow("Offer valid until", "30 September 2026"),
  fieldRow("Effective Date", "01 July 2026 (or date of last signature, if later)"),
  fieldRow("Initial Term", "36 months from the Effective Date"),
  fieldRow("Contact \u2014 Customer", "Jane Doe, Chief Information Officer"),
  fieldRow("Contact \u2014 Novagentica", "[Novagentica contact], Commercial Lead"),
  fieldRow("Billing e-mail \u2014 Customer", "[Customer billing contact \u2014 to confirm]"),
  fieldRow("VAT no. \u2014 Customer", "[Customer VAT / register no. \u2014 to confirm]"),
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
  fieldRow("Selected tier", "\u2610 Domain   \u2612 Enterprise   \u2610 Global"),
  fieldRow("Committed runs / month", "500,000 (Enterprise allowance)"),
  fieldRow("Order start (min. term)", "01.07.2026"),
  fieldRow("Order end (min. term)", "30.06.2029"),
  fieldRow("Annual subscription fee", "CHF 600,000 (Enterprise; first 6 months at the Domain price \u2014 see Special provisions)"),
  fieldRow("Overage rate", "Not applicable \u2014 committed-volume model; no overage on this Order Form"),
  fieldRow("Total for minimum term", "CHF 1,575,000 (3-year subscription value \u2014 see Payment schedule)"),
]));

c.push(body([{ text: "Runtimes in scope", bold: true }], { after: 60 }));
c.push(table([900, 4946, 3180], [
  hRow(["Select", "Runtime", "Notes"], [900, 4946, 3180]),
  ...[["Salesforce Agentforce", "Enforced over \u2014 not resold; no OEM/ISV relationship"], ["Microsoft Copilot Studio", ""], ["SAP Joule", ""], ["n8n", ""], ["LangGraph", ""], ["Haystack", ""], ["Dataiku", ""], ["OpenClaw", ""], ["NemoClaw", ""]].map(([r, n]) =>
    new TableRow({ children: [tc(["Microsoft Copilot Studio","LangGraph"].includes(r) ? "\u2612" : BOX, { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: r, bold: r === "Salesforce Agentforce" }])], { w: 4946 }), tc(n, { w: 3180, size: 16, color: T.GREY })] })),
]));
c.push(note("Connectable runtimes depend on the tier: Domain = 2 platforms; Enterprise = all supported; Global = all + custom."));

/* OVER-CONSUMPTION */
c.push(head("Over-consumption"));
c.push(clause("1", lead("Committed-volume model.", "For this Order Form the subscription is provided on a committed-volume basis at the Enterprise allowance (500,000 runs/month). No overage applies and runs are not metered for additional charge during the Initial Term.")));

c.push(clause("2", lead("No interruption.", "Enforcement and execution continue without interruption. Novagentica notifies the Customer\u2019s nominated contact if sustained usage materially exceeds the committed allowance, for a good-faith tiering discussion recorded by an amended Order Form.")));

c.push(clause("3", lead("Minimum commitment.", "The annual fee is a minimum commitment; no credit accrues for runs below the committed allowance.")));
c.push(note("ACME: the standard per-run over-consumption / overage clause has been removed by agreement (committed-volume model). Reinstate metered overage only if the commercial model changes."));

/* PAYMENT SCHEDULE */
c.push(head("Payment schedule"));
c.push(body("The subscription is invoiced per the dated schedule below, reflecting the six-month introductory period at the Domain price and the transition to full Enterprise pricing from 01.01.2027."));
c.push(table([2400, 4226, 2400], [
  hRow(["Date", "Service / description", "Amount (net, excl. VAT)"], [2400, 4226, 2400]),
  new TableRow({ children: [tc("01.07.2026", { w: 2400 }), tc("Subscription \u2014 contract year 1 (Enterprise capability at Domain price)", { w: 4226 }), tc("CHF 150,000", { w: 2400, align: AT.RIGHT })] }),
  new TableRow({ children: [tc("01.01.2027", { w: 2400 }), tc("Subscription \u2014 transition to full Enterprise pricing", { w: 4226 }), tc("CHF 225,000", { w: 2400, align: AT.RIGHT })] }),
  new TableRow({ children: [tc("01.07.2027", { w: 2400 }), tc("Subscription \u2014 contract year 2 (Enterprise)", { w: 4226 }), tc("CHF 600,000", { w: 2400, align: AT.RIGHT })] }),
  new TableRow({ children: [tc("01.07.2028", { w: 2400 }), tc("Subscription \u2014 contract year 3 (Enterprise)", { w: 4226 }), tc("CHF 600,000", { w: 2400, align: AT.RIGHT })] }),
  new TableRow({ children: [tc([cellPara([{ text: "3-year subscription value", bold: true }])], { w: 2400, fill: T.CRIMSON, color: "FFFFFF" }), tc("", { w: 4226, fill: T.CRIMSON }), tc([cellPara([{ text: "CHF 1,575,000", bold: true }], { align: AT.RIGHT })], { w: 2400, fill: T.CRIMSON, color: "FFFFFF" })] }),
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
c.push(note("Marketing rights are granted by default in this template. Defence and regulated customers routinely refuse logo use and press-release commitments \u2014 if the customer is in that category, strike or negotiate this section before issue rather than removing the default. Customer-side signatories with procurement-only authority may not be able to bind their organisation to the press-release / G2 review / reference-call commitments \u2014 expect routing through Customer Communications."));

/* CONFIDENTIALITY */
c.push(head("Confidentiality"));
c.push(body("This Order Form and its contents are confidential. The confidentiality obligations of the MSA apply to it; each party protects the other\u2019s confidential information on the terms set out there."));

/* SPECIAL PROVISIONS & MSA */
c.push(head("Special provisions & relationship to the MSA"));
c.push(clause("1", lead("Incorporation.", "This Order Form is a separate contract that incorporates and is subject to the MSA. Capitalised terms have the meanings given in the MSA unless defined otherwise here.")));
c.push(clause("2", lead("Order of precedence.", "If there is a conflict, the following order applies: (a) the DPA, for personal data; (b) this Order Form, for the commercial terms it covers; (c) the MSA; and (d) the Service Description and Documentation.")));
c.push(clause("3", lead("Reproduced wording.", "Where this Order Form reproduces MSA wording, it does so for convenience; the MSA governs and prevails to the extent of any difference.")));
c.push(clause("4", lead("Renewal & price adjustment.", "After the Initial Term the subscription renews for successive 12-month periods unless either party gives written notice at least 90 days (three months) before the end of the then-current term. On each renewal the annual fee increases by twelve per cent (12%) over the preceding year, as agreed for this engagement.")));
c.push(clause("5", lead("Introductory pricing.", "For the first six (6) months (01.07.2026\u201331.12.2026) Enterprise-tier capability is provided at the Domain price. The Customer may elect to remain on the Domain tier by giving four (4) weeks\u2019 written notice before 31.12.2026; absent such notice, full Enterprise pricing applies from 01.01.2027. The dated payment schedule above reflects this arrangement.")));

/* SIGNATURES */
c.push(head("Signatures"));
c.push(body([{ text: "By signing, each party agrees to this Order Form under the MSA identified above. Each signatory warrants they are authorised to bind their organisation.", size: 18 }]));
c.push(H.gap(80));
c.push(sigBlock("For ACME Defence AG"));

write(buildDoc(c, { docTitle: "Novagentica Order Form \u2014 Subscription \u2014 ACME Defence AG", headerLabel: "Order Form \u00B7 Subscription \u00B7 ACME" }),
  "/home/user/workflows/outputs/Novagentica_OF_Subscription_Example.docx");

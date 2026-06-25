import re, sys
SRC="/home/user/workflows/skills/novagentica-order-form/scripts/"
DST="/home/user/workflows/skills/novagentica-order-form/deals/example/"

def load(n): return open(SRC+n,encoding="utf-8").read()
def save(n,s): open(DST+n,"w",encoding="utf-8").write(s)

class P:
    def __init__(s,t): s.t=t
    def one(s,old,new):  # unique replace
        assert s.t.count(old)>=1, "MISSING: "+repr(old[:80])
        s.t=s.t.replace(old,new,1); return s
    def nth(s,old,new,n):  # n-th (1-based)
        i=-1
        for _ in range(n):
            i=s.t.find(old,i+1); assert i>=0, "nth MISSING: "+repr(old[:60])
        s.t=s.t[:i]+new+s.t[i+len(old):]; return s
    def drop(s,old):
        assert old in s.t, "drop MISSING: "+repr(old[:80])
        s.t=s.t.replace(old,"",1); return s

# ============ SUBSCRIPTION ============
p=P(load("build_of_subscription.js"))
# remove draft panel
p.one('''c.push(draftPanel([
  "This Order Form is a binding commercial schedule under the MSA. Complete every [bracketed] field, select the applicable options, resolve every \\u2039drafting note\\u203A, and delete this panel before issue. Do not issue with placeholder commercials.",
  "It is governed by, and incorporates, the MSA. Keep master legal terms (liability, IP, warranties, confidentiality, data protection) in the MSA/DPA \\u2014 do not restate them here.",
]));
''','')
# order details
p.one('"[YYYY]-NVG-[XYZ]-SC-0[XX]"','"2026-NVG-EX-SC-001"')
p.one('fieldRow("Offer date", "[DD Month YYYY]")','fieldRow("Offer date", "25 June 2026")')
p.one('fieldRow("Offer valid until", "[DD Month YYYY]")','fieldRow("Offer valid until", "30 September 2026")')
p.one('fieldRow("Effective Date", "[DD Month YYYY] (or date of last signature, if later)")','fieldRow("Effective Date", "01 July 2026 (or date of last signature, if later)")')
p.one('fieldRow("Contact \\u2014 Customer", "[Name, title]")','fieldRow("Contact \\u2014 Customer", "Jane Doe, Chief Information Officer")')
p.one('fieldRow("Contact \\u2014 Novagentica", "[Name, title]")','fieldRow("Contact \\u2014 Novagentica", "[Novagentica contact], Commercial Lead")')
p.one('fieldRow("Billing e-mail \\u2014 Customer", "[billing@customer.com]")','fieldRow("Billing e-mail \\u2014 Customer", "[Customer billing contact \\u2014 to confirm]")')
p.one('fieldRow("VAT no. \\u2014 Customer", "[VAT registration number]")','fieldRow("VAT no. \\u2014 Customer", "[Customer VAT / register no. \\u2014 to confirm]")')
# subscribed position
p.one('fieldRow("Selected tier", "\\u2610 Domain   \\u2610 Enterprise   \\u2610 Global")','fieldRow("Selected tier", "\\u2610 Domain   \\u2612 Enterprise   \\u2610 Global")')
p.one('fieldRow("Committed runs / month", "[per selected tier]")','fieldRow("Committed runs / month", "500,000 (Enterprise allowance)")')
p.one('fieldRow("Order start (min. term)", "[DD.MM.YYYY]")','fieldRow("Order start (min. term)", "01.07.2026")')
p.one('fieldRow("Order end (min. term)", "[DD.MM.YYYY]")','fieldRow("Order end (min. term)", "30.06.2029")')
p.one('fieldRow("Annual subscription fee", "CHF [ ]")','fieldRow("Annual subscription fee", "CHF 600,000 (Enterprise; first 6 months at the Domain price \\u2014 see Special provisions)")')
p.one('fieldRow("Overage rate", "CHF [ ] per [n] runs above the monthly allowance")','fieldRow("Overage rate", "Not applicable \\u2014 committed-volume model; no overage on this Order Form")')
p.one('fieldRow("Total for minimum term", "CHF [ ] (annual fee \\u00D7 term years)")','fieldRow("Total for minimum term", "CHF 1,575,000 (3-year subscription value \\u2014 see Payment schedule)")')
# runtimes: tick the two confirmed
p.one('tc(BOX, { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: r, bold: r === "Salesforce Agentforce" }])]',
      'tc(["Microsoft Copilot Studio","LangGraph"].includes(r) ? "\\u2612" : BOX, { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: r, bold: r === "Salesforce Agentforce" }])]')
# over-consumption -> committed-volume (Notion: overage removed)
p.one('c.push(clause("1", "The subscription includes the runs-per-month allowance for the selected tier (the \\u201CCommitted Volume\\u201D), measured over each billing period."));','c.push(clause("1", lead("Committed-volume model.", "For this Order Form the subscription is provided on a committed-volume basis at the Enterprise allowance (500,000 runs/month). No overage applies and runs are not metered for additional charge during the Initial Term.")));')
p.one('c.push(clause("2", lead("Overage.", "Runs in excess of the Committed Volume are charged at the Overage Rate above and invoiced in arrears at the end of the relevant billing period.")));','')
p.one('c.push(clause("3", lead("No interruption.", "Enforcement and execution continue when the Committed Volume is reached. Novagentica notifies the Customer\\u2019s nominated contact at 80% and 100% of the Committed Volume in any billing period.")));','c.push(clause("2", lead("No interruption.", "Enforcement and execution continue without interruption. Novagentica notifies the Customer\\u2019s nominated contact if sustained usage materially exceeds the committed allowance, for a good-faith tiering discussion recorded by an amended Order Form.")));')
p.one('c.push(clause("4", lead("Sustained over-use.", "If runs exceed 100% of the Committed Volume for two consecutive billing periods, the parties will discuss in good faith an uplift, or a move to the next tier, recorded by a replacement or amended Order Form.")));','')
p.one('c.push(clause("5", lead("Minimum commitment.", "The annual fee is a minimum commitment; no credit accrues for runs below the Committed Volume.")));','c.push(clause("3", lead("Minimum commitment.", "The annual fee is a minimum commitment; no credit accrues for runs below the committed allowance.")));')
p.one('c.push(note("Replaces the legacy \\u201Cxyz\\u201D placeholder. Set the per-run Overage Rate and define the Global fair-use behaviour at the 20M ceiling (soft cap with a conversation, or hard cap)."));','c.push(note("ACME: the standard per-run over-consumption / overage clause has been removed by agreement (committed-volume model). Reinstate metered overage only if the commercial model changes."));')
# payment schedule body + table
p.one('c.push(body("The subscription is invoiced annually in advance at the start of each contract year, unless a different schedule is agreed below. Additional runs or an in-term tier change are invoiced on a pro-rated basis from the effective date to the next annual invoice date."));',
      'c.push(body("The subscription is invoiced per the dated schedule below, reflecting the six-month introductory period at the Domain price and the transition to full Enterprise pricing from 01.01.2027."));')
p.one('''  ...[1, 2, 3].map(() => new TableRow({ children: [tc("[DD.MM.YYYY]", { w: 2400, color: T.GREY }), tc("[Annual subscription \\u2014 contract year n]", { w: 4226, color: T.GREY }), tc("CHF [ ]", { w: 2400, align: AT.RIGHT })] })),''',
      '''  new TableRow({ children: [tc("01.07.2026", { w: 2400 }), tc("Subscription \\u2014 contract year 1 (Enterprise capability at Domain price)", { w: 4226 }), tc("CHF 150,000", { w: 2400, align: AT.RIGHT })] }),
  new TableRow({ children: [tc("01.01.2027", { w: 2400 }), tc("Subscription \\u2014 transition to full Enterprise pricing", { w: 4226 }), tc("CHF 225,000", { w: 2400, align: AT.RIGHT })] }),
  new TableRow({ children: [tc("01.07.2027", { w: 2400 }), tc("Subscription \\u2014 contract year 2 (Enterprise)", { w: 4226 }), tc("CHF 600,000", { w: 2400, align: AT.RIGHT })] }),
  new TableRow({ children: [tc("01.07.2028", { w: 2400 }), tc("Subscription \\u2014 contract year 3 (Enterprise)", { w: 4226 }), tc("CHF 600,000", { w: 2400, align: AT.RIGHT })] }),
  new TableRow({ children: [tc([cellPara([{ text: "3-year subscription value", bold: true }])], { w: 2400, fill: T.CRIMSON, color: "FFFFFF" }), tc("", { w: 4226, fill: T.CRIMSON }), tc([cellPara([{ text: "CHF 1,575,000", bold: true }], { align: AT.RIGHT })], { w: 2400, fill: T.CRIMSON, color: "FFFFFF" })] }),''')
# renewal uplift -> 12%
p.one('c.push(clause("4", lead("Renewal & price adjustment.", "The subscription renews for successive periods equal to the Initial Term unless either party gives written notice at least 90 days before the end of the then-current term. On renewal the fee may increase by the greater of 5% or the change in the Swiss CPI over the preceding 12 months, on at least 90 days\\u2019 notice.")));',
      'c.push(clause("4", lead("Renewal & price adjustment.", "After the Initial Term the subscription renews for successive 12-month periods unless either party gives written notice at least 90 days (three months) before the end of the then-current term. On each renewal the annual fee increases by twelve per cent (12%) over the preceding year, as agreed for this engagement.")));')
# special provisions clause 5 -> intro offer
p.one('c.push(clause("5", lead("Further special provisions.", "[None / as follows: insert any deal-specific terms that do not conflict with the MSA.]")));',
      'c.push(clause("5", lead("Introductory pricing.", "For the first six (6) months (01.07.2026\\u201331.12.2026) Enterprise-tier capability is provided at the Domain price. The Customer may elect to remain on the Domain tier by giving four (4) weeks\\u2019 written notice before 31.12.2026; absent such notice, full Enterprise pricing applies from 01.01.2027. The dated payment schedule above reflects this arrangement.")));')
# signature + output
p.one('c.push(sigBlock("For [Customer]"));','c.push(sigBlock("For ACME Defence AG"));')
p.one('{ docTitle: "Novagentica Order Form \\u2014 Subscription (DRAFT)", headerLabel: "Order Form \\u00B7 Subscription \\u00B7 DRAFT" }',
      '{ docTitle: "Novagentica Order Form \\u2014 Subscription \\u2014 ACME Defence AG", headerLabel: "Order Form \\u00B7 Subscription \\u00B7 ACME" }')
p.one('"Novagentica_OF_Subscription_DRAFT.docx"','"/home/user/workflows/outputs/Novagentica_OF_Subscription_Example.docx"')
# anonymise the canonical marketing-note guardrail (strip the real-customer example name)
p.t = re.sub(r'Defence and regulated customers \(e\.g\. [^)]*\) routinely', 'Defence and regulated customers routinely', p.t)
save("build_of_subscription_example.js", p.t)
print("subscription patched OK")

# ============ PROFESSIONAL SERVICES ============
q=P(load("build_of_ps.js"))
q.one('''c.push(draftPanel([
  "This Order Form is a binding commercial schedule under the MSA. Complete every [bracketed] field, select the applicable options, resolve every \\u2039drafting note\\u203A, and delete this panel before issue.",
  "It is governed by, and incorporates, the MSA. Detailed scope, acceptance criteria and assumptions belong in an attached Statement of Work / Appendix 1.",
]));
''','')
q.one('"[YYYY]-NVG-[XYZ]-PS-0[XX]"','"2026-NVG-EX-PS-001"')
q.one('fieldRow("Offer date", "[DD Month YYYY]")','fieldRow("Offer date", "25 June 2026")')
q.one('fieldRow("Offer valid until", "[DD Month YYYY]")','fieldRow("Offer valid until", "30 September 2026")')
q.one('fieldRow("Contact \\u2014 Customer", "[Name, title]")','fieldRow("Contact \\u2014 Customer", "Jane Doe, Chief Information Officer")')
q.one('fieldRow("Contact \\u2014 Novagentica", "[Name, title]")','fieldRow("Contact \\u2014 Novagentica", "[Novagentica contact], Commercial Lead")')
q.one('fieldRow("Billing e-mail \\u2014 Customer", "[billing@customer.com]")','fieldRow("Billing e-mail \\u2014 Customer", "[Customer billing contact \\u2014 to confirm]")')
q.one('fieldRow("VAT no. \\u2014 Customer", "[VAT registration number]")','fieldRow("VAT no. \\u2014 Customer", "[Customer VAT / register no. \\u2014 to confirm]")')
# delivery model: always Co-build (Agentic Atelier) for Novagentica deals
q.one('tc(BOX, { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: "Co-build (Agentic Atelier)"',
      'tc("\\u2612", { w: 900, align: AT.CENTER, fill: T.CREAM2 }), tc([cellPara([{ text: "Co-build (Agentic Atelier)"')
# services overview
q.one('fieldRow("Service / position", "[Service name \\u2014 e.g. Architect MVP1 build]")','fieldRow("Service / position", "Architect\\u2122 MVP1\\u2192MVP3 build \\u2014 RFI/RFQ governance, candidate screening, SAP source-to-PO")')
q.one('fieldRow("Description", "[Brief description, or see attached Statement of Work / Appendix 1]")','fieldRow("Description", "Reverse-engineer and govern the existing Copilot Studio + LangGraph build; candidate screening on SuccessFactors with human sign-off; SAP source-to-PO on SAP MM. Detailed scope and acceptance criteria in the attached SoW / Appendix 1.")')
q.one('fieldRow("Order start", "[DD.MM.YYYY]")','fieldRow("Order start", "01.07.2026")')
q.one('fieldRow("Order end", "[DD.MM.YYYY]")','fieldRow("Order end", "31.08.2026")')
q.one('fieldRow("Estimated effort (person-days)", "[XX] person-days")','fieldRow("Estimated effort (person-days)", "27 person-days")')
q.one('fieldRow("Fee basis", "\\u2612 Time & materials against the estimate   \\u2610 Fixed package price of CHF [ ]")','fieldRow("Fee basis", "\\u2610 Time & materials against the estimate   \\u2612 Fixed package price of CHF 67,500")')
q.one('fieldRow("Estimated / fixed fee", "CHF [ ] (net, excl. VAT and expenses)")','fieldRow("Estimated / fixed fee", "CHF 67,500 (net, excl. VAT and expenses)")')
# MVP stages
q.one('''  ...["MVP1", "MVP2", "MVP3"].map((s, i) => new TableRow({ children: [tc([cellPara([{ text: s, bold: true }])], { w: 1500, fill: T.CREAM2 }), tc(i === 0 ? "[Outcome delivered and enforced at MVP1]" : "[Outcome]", { w: 4926, color: T.GREY }), tc("[n]", { w: 2600, align: AT.CENTER })] })),''',
      '''  new TableRow({ children: [tc([cellPara([{ text: "MVP1", bold: true }])], { w: 1500, fill: T.CREAM2 }), tc("RFI/RFQ governance \\u2014 govern the Copilot Studio + LangGraph build; authority bands encoded as a Decision Contract; every commit gated and Crypto Passport-signed.", { w: 4926 }), tc("2", { w: 2600, align: AT.CENTER })] }),
  new TableRow({ children: [tc([cellPara([{ text: "MVP2", bold: true }])], { w: 1500, fill: T.CREAM2 }), tc("Candidate screening on SuccessFactors \\u2014 co-built with ACME\\u2019s HR and engineering teams in the Agentic Atelier, who are upskilled to own it; rank-and-recommend with Article 14 human sign-off (Annex III high-risk; works-council gated).", { w: 4926 }), tc("5", { w: 2600, align: AT.CENTER })] }),
  new TableRow({ children: [tc([cellPara([{ text: "MVP3", bold: true }])], { w: 1500, fill: T.CREAM2 }), tc("SAP source-to-PO on SAP MM \\u2014 co-built alongside ACME\\u2019s SAP and procurement teams in the Agentic Atelier, with knowledge transfer so the team can own and extend it; in-policy purchase orders drawn automatically, out-of-policy escalated, every output signed.", { w: 4926 }), tc("20", { w: 2600, align: AT.CENTER })] }),
  new TableRow({ children: [tc([cellPara([{ text: "Total", bold: true }])], { w: 1500, fill: T.CRIMSON, color: "FFFFFF" }), tc("", { w: 4926, fill: T.CRIMSON }), tc([cellPara([{ text: "27", bold: true }], { align: AT.CENTER })], { w: 2600, fill: T.CRIMSON, color: "FFFFFF" })] }),''')
q.one('c.push(note("Add or remove MVP rows to match the engagement. Keep this table to outcomes and effort; detailed scope and acceptance criteria belong in the SoW / Appendix 1."));','c.push(note("ACME MVP plan (27 person-days). MVP2 is conditional on works-council approval \\u2014 see SoW. Detailed scope and acceptance criteria belong in the SoW / Appendix 1."));')
# payment schedule body + table (fixed price, 100% upfront)
q.one('c.push(body("Expert Services are offered as a budgetary amount for a lean, agile approach. They are billed monthly in arrears on the person-days actually consumed in the relevant calendar month (or on MVP-stage acceptance, for a fixed package price). Unused person-days at the end of the service period are forfeited unless otherwise agreed in writing."));',
      'c.push(body("For this engagement the Professional Services are a fixed package price of CHF 67,500, payable 100% on the Effective Date (01.07.2026). Foundation, AQVP\\u2122 certification and engagement management are absorbed within each MVP and are not billed separately. Indicative \\u00B1 15%, fixed at SoW sign-off."));')
q.one('  new TableRow({ children: [tc("[DD.MM.YYYY]", { w: 2400, color: T.GREY }), tc("[Person-days consumed \\u2014 month n]", { w: 4226, color: T.GREY }), tc("CHF [ ]", { w: 2400, align: AT.RIGHT })] }),',
      '  new TableRow({ children: [tc("01.07.2026", { w: 2400 }), tc("Professional Services \\u2014 fixed package price, 100% on the Effective Date", { w: 4226 }), tc("CHF 67,500", { w: 2400, align: AT.RIGHT })] }),')
# special provisions clause 4
q.one('c.push(clause("4", lead("Further special provisions.", "[None / as follows: insert any deal-specific terms that do not conflict with the MSA.]")));',
      'c.push(clause("4", lead("Fixed price & relationship to licence.", "The fee is a fixed package price (indicative \\u00B1 15%, fixed at SoW sign-off). The platform licence is quoted separately under Order Form 2026-NVG-EX-SC-001.")));')
q.one('c.push(sigBlock("For [Customer]"));','c.push(sigBlock("For ACME Defence AG"));')
q.one('{ docTitle: "Novagentica Order Form \\u2014 Professional Services (DRAFT)", headerLabel: "Order Form \\u00B7 Professional Services \\u00B7 DRAFT" }',
      '{ docTitle: "Novagentica Order Form \\u2014 Professional Services \\u2014 ACME Defence AG", headerLabel: "Order Form \\u00B7 Professional Services \\u00B7 ACME" }')
q.one('"Novagentica_OF_Professional_Services_DRAFT.docx"','"/home/user/workflows/outputs/Novagentica_OF_Professional_Services_Example.docx"')
save("build_of_ps_example.js", q.t)
print("professional-services patched OK")

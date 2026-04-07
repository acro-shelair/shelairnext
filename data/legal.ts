export interface TermsSection {
  heading: string;
  bodies?: string[];
  list?: string[];
  numberedItems?: { id: string; text: string }[];
  contactDetails?: { label: string; value: string }[];
}

export const termsContent = {
  title: "Terms & Conditions",
  intro:
    "These Terms & Conditions apply to all quotations, work orders, service calls, repairs, maintenance, and installations performed by Shelair.",
  effectiveDate: "1 January 2026",
  company: "Shelair",
  qbcc: "15413155",
  abn: "43 672 578 264",
  sections: [
    {
      heading: "1. Definitions & Precedence",
      bodies: [
        "Contract means the accepted Quote/Work Order, these T&Cs, and any attached Schedules. Client includes the owner, tenant, principal contractor, builder, centre management, and any party requesting or benefiting from the works. Goods means all products supplied by us, including refrigeration units, parts, and accessories. Services means all services provided by us, including installation, maintenance, repair, and consultation. Quote means a written estimate detailing the costs and scope of Goods and/or Services.",
        "Precedence (highest to lowest): written special conditions signed by us; Quote/Scope; these T&Cs; Schedules; then any Client documents. Client terms are excluded unless we expressly accept them in writing.",
      ],
    },
    {
      heading: "2. Acceptance & Scope",
      bodies: [
        "Acceptance occurs when the Client signs/approves, issues a purchase order, instructs us to proceed, or pays any deposit. Our price covers only the stated Scope. Anything not expressly included is excluded and may be treated as a Variation. All dates, durations, and completion times are estimates only, dependent on access, permits, weather, parts lead times, and third parties.",
      ],
    },
    {
      heading: "3. Site Assumptions & Client Responsibilities",
      bodies: [
        "Pricing assumes reasonable access, required permits, shutdown windows, and serviceable base-building infrastructure. The Client must provide and maintain safe access and a safe work area including isolations/LOTO, permits, escorts, exclusion zones/barricades, traffic and pedestrian control, ceiling and roof access, and competent site representation to approve variations and safety controls. Standby, delays, and return visits caused by site readiness or access constraints are chargeable.",
      ],
    },
    {
      heading: "4. Public & Occupied Works",
      bodies: [
        "We will take reasonable steps to minimise disruption; however, restricted access, temporary closures, hoarding, or out-of-hours works may be required. If safe access or area control cannot be maintained, we may pause works until risks are controlled. Additional time, return visits, remobilisation, or out-of-hours works caused by access or safety constraints are chargeable as a Variation.",
      ],
    },
    {
      heading: "5. Hidden Conditions & Hazardous Materials",
      bodies: [
        "We are not responsible for concealed services, restricted voids, undocumented modifications, structural issues, water ingress, vermin contamination, mould, fragile roofs/ceilings, or other latent conditions. If asbestos or other hazardous materials are suspected or encountered, we may stop work immediately. Testing, containment, and removal are the Client's responsibility unless expressly included. Any delay or attendance is chargeable.",
      ],
    },
    {
      heading: "6. Variations & Authority to Proceed",
      bodies: [
        "A Variation includes any change to scope, specification, programme, access, safety controls, compliance requirements, site conditions, third-party constraints, or Client instruction. We will seek approval where practical. If urgent work is required to make safe, prevent damage/spoilage, or restore critical services, the Client authorises us to proceed on time and materials and treat it as a Variation.",
      ],
    },
    {
      heading: "7. Existing Equipment & Diagnostics",
      bodies: [
        "We do not warrant the condition, performance, capacity, compliance status, or remaining life of existing equipment or associated building systems. Fault-finding is based on reasonable inspection and testing at the time; intermittent, multiple, or latent faults may become apparent under load or during disassembly. Additional faults and repairs are chargeable. Repair outcomes are not guaranteed due to age, contamination, prior workmanship, and unknown defects.",
      ],
    },
    {
      heading: "8. Aged Equipment & Parts",
      bodies: [
        "Parts availability, compatibility, and lead times are not guaranteed, particularly for aged or obsolete equipment. Delays caused by suppliers, manufacturers, freight, or third parties are not our liability. Additional attendances, remobilisation, and time spent sourcing or confirming parts are chargeable.",
      ],
    },
    {
      heading: "9. Refrigerant & Leaks",
      bodies: [
        "Refrigerant is excluded unless expressly included. Leak detection/repair, evacuation, pressure testing, nitrogen, recovery, and refrigerant charges are chargeable unless included. Re-gassing without leak rectification is not guaranteed and may be refused where unsafe or non-compliant. Performance depends on airflow, filter/coil condition, controls settings, building load, power quality, and maintenance.",
      ],
    },
    {
      heading: "10. Third-Party Systems",
      bodies: [
        "Unless expressly included, we exclude responsibility for base-building electrical supply/switchboards, BMS, fire panels, security/access systems, networks, and third-party controls/integration. We are not liable for delays, rework, or performance issues caused by third-party systems, incorrect schematics, pre-existing wiring faults, or other contractors.",
      ],
    },
    {
      heading: "11. Exclusions",
      bodies: [
        "Exclusions apply as per Schedule A. Any Client-provided drawings, data, asset details, and site information are relied upon at the Client's risk. If incorrect or incomplete, resulting costs are a Variation.",
      ],
    },
    {
      heading: "12. Pricing & Additional Charges",
      bodies: [
        "Unless stated otherwise, works are charged per the Quote or on time and materials at our standard rates plus parts, materials, and applicable travel/attendance charges. All prices are exclusive of GST unless otherwise stated. Standby, waiting time, additional attendances, remobilisation, after-hours, and public holiday works are chargeable where caused by access, permits, shutdowns, or third parties.",
      ],
    },
    {
      heading: "13. Payment Terms",
      bodies: [
        "Deposit: A 50% deposit is required upon approval; parts are ordered only after cleared funds are received. Deposits are non-refundable once parts are ordered or costs committed — supplier restocking and cancellation fees are passed through at cost.",
        "Non-Account Customers: The balance is due before scheduling attendance and before delivery of equipment to site. Commissioning may be withheld until payment is received in full.",
        "Account Customers: Payment is due within 30 days of invoice, or per the written progress payment schedule. Variations are payable within 7 days or before the next attendance, whichever is sooner.",
        "No Set-Off or Retention: The Client must not withhold, set-off, or apply retention against any amount owing unless we agree in writing.",
        "Payment Methods: We accept payment via bank transfer, credit card, or other methods as agreed upon.",
      ],
    },
    {
      heading: "14. Overdue Accounts & Suspension",
      bodies: [
        "Interest accrues at 5% p.a. calculated daily from the due date; payments apply first to recovery costs, then interest, then principal. A $5.00/week administration fee may be charged on overdue accounts where permitted by law. The Client is liable for all recovery costs including collection fees, search fees, and legal costs on a full indemnity basis. We may suspend works, withhold commissioning, and refuse further attendance while any amount is overdue. Remobilisation and return visits following suspension are chargeable.",
      ],
    },
    {
      heading: "15. Title, Risk & PPSA",
      bodies: [
        "Risk in Goods passes on delivery to site. Title in Goods supplied does not pass until we receive full payment of all amounts owing, including variations and costs. The Client grants us a security interest under the Personal Property Securities Act 2009 (Cth) to secure payment and must do all things reasonably requested to perfect or enforce that interest. The Client waives rights to receive certain PPSA notices to the extent permitted by law.",
      ],
    },
    {
      heading: "16. Warranty",
      bodies: [
        "Manufacturer warranties apply to supplied equipment/parts subject to their terms, including registration and maintenance requirements. Our workmanship warranty is 12 months from installation completion and covers workmanship defects in work we performed only, limited to re-performing the defective work.",
        "Warranty excludes: misuse, lack of maintenance, blocked airflow, dirty coils/filters, contaminated power, water quality issues, vandalism, pests, accidental damage, normal wear and tear, and unrelated component failure. No-fault-found and excluded-cause call-outs are chargeable.",
      ],
    },
    {
      heading: "17. Limitation of Liability & Consequential Loss",
      bodies: [
        "To the maximum extent permitted by law, our total liability (including negligence) is limited — at our option — to re-performing the services or the value of the affected works under the Contract. We are not liable for indirect or consequential loss including loss of profit, loss of trade, loss of use, business interruption, spoilage/stock loss, or third-party claims, except where exclusion is prohibited by law.",
        "Nothing in these T&Cs excludes non-excludable rights under the Australian Consumer Law; where liability cannot be excluded, it is limited to the remedies permitted by law.",
      ],
    },
    {
      heading: "18. Australian Consumer Law",
      bodies: [
        "Nothing in these T&Cs excludes, restricts, or modifies any right or remedy the Client may have under the Australian Consumer Law or any other applicable legislation that cannot be excluded by agreement. Where the ACL applies and permits us to limit our liability, we limit it to the re-supply of the services or the cost of having the services re-supplied, at our election.",
      ],
    },
    {
      heading: "19. Indemnities",
      bodies: [
        "The Client indemnifies us against claims, losses, penalties, and costs arising from: unsafe site conditions or failure to provide safe access/area control; Client or third-party directions, acts, or omissions; inaccurate Client-provided information; undisclosed hazardous materials; and delays or disruptions caused by third parties — to the extent permitted by law.",
      ],
    },
    {
      heading: "20. WHS & Safety",
      bodies: [
        "Both parties must comply with their respective obligations under the Work Health and Safety Act 2011 (Qld) and applicable regulations. The Client, as person in control of the workplace, must ensure the site is safe and without risks to health before and during our works. We retain the right to stop work and leave site if conditions are unsafe, without liability for delay or additional cost.",
      ],
    },
    {
      heading: "21. Subcontracting",
      bodies: [
        "We reserve the right to subcontract any part of the works. Subcontractors engaged by us are our responsibility for the purposes of these T&Cs. We are not required to disclose subcontractor details unless required by law.",
      ],
    },
    {
      heading: "22. Intellectual Property & Confidentiality",
      bodies: [
        "Quotes, pricing, scopes, methods, and documents are confidential unless required by law. We retain intellectual property in our methods, templates, and documents. The Client is granted a non-exclusive licence to use deliverables only for the project and site specified. We bear no liability for documents provided by third parties or adapted from Client-supplied materials.",
      ],
    },
    {
      heading: "23. Force Majeure & Supply Delays",
      bodies: [
        "We are not liable for delays or increased costs caused by events beyond our reasonable control, including supply chain disruptions, equipment discontinuation, extreme weather, natural disasters, pandemics, government restrictions, utility outages, or industrial action. We will notify the Client as soon as practicable and use reasonable endeavours to mitigate delay. Timeframes and pricing may be revised accordingly.",
      ],
    },
    {
      heading: "24. Security of Payment",
      bodies: [
        "Where applicable, invoices issued under this contract may constitute payment claims under the Building Industry Fairness (Security of Payment) Act 2017 (Qld). The Client must respond with a payment schedule within the time required by the Act. Failure to do so may result in the full claimed amount becoming due and the Client losing the right to dispute the claim.",
      ],
    },
    {
      heading: "25. Dispute Resolution",
      bodies: [
        "If a dispute arises, the party raising it must give written notice to the other describing the dispute in reasonable detail. The parties must attempt to resolve it by good-faith negotiation between senior representatives within 10 business days. The Client must continue paying undisputed amounts while a dispute is being resolved. Either party may refer an unresolved dispute to mediation before commencing legal proceedings, except where urgent injunctive or debt recovery relief is required.",
      ],
    },
    {
      heading: "26. Notices",
      bodies: [
        "Notices may be given by email to the address used for the Quote or invoicing and are deemed received on sending (unless a bounce-back is received). Written notice is required for any variation to these T&Cs.",
      ],
    },
    {
      heading: "27. Validity & Scope Control",
      bodies: [
        "This quotation is valid for 30 days from the date of issue, subject to supplier pricing, availability, and lead times. Works are limited to the items listed in the Scope; anything not listed is deemed excluded unless agreed in writing.",
      ],
    },
    {
      heading: "28. Governing Law",
      bodies: [
        "This Contract is governed by the laws of Queensland, Australia. The parties submit to the non-exclusive jurisdiction of the courts of Queensland.",
      ],
    },
    {
      heading: "29. Privacy",
      bodies: [
        "HVACR Pty Ltd collects and handles personal information in accordance with our Privacy Policy and the Privacy Act 1988 (Cth). For enquiries regarding your personal information, contact us at workshop@shelair.com.au.",
      ],
    },
    {
      heading: "30. Website Product Pricing",
      bodies: [
        "All refrigeration equipment advertised on our website is offered on a reseller basis. Product descriptions and pricing are provided for informational purposes only and are subject to change without notice.",
        "Due to regular supplier price updates and market fluctuations, all prices listed are indicative only. Final pricing will be confirmed upon enquiry and is subject to availability, delivery charges, and applicable GST. We reserve the right to revise or withdraw product offers at any time prior to confirmation of order.",
        "For a formal quotation with confirmed pricing, stock status, and lead times, please contact us directly.",
      ],
    },
    {
      heading: "Schedule A — Exclusions",
      bodies: [
        "Unless expressly included in the Scope of works, the following are excluded from the scope of works unless expressly stated otherwise in writing. These exclusions remain the Client's responsibility unless separately quoted and accepted.",
      ],
      numberedItems: [
        { id: "A1",  text: "Builder's works and making good, including patching, painting, plastering, joinery, tiling, waterproofing, ceiling grid/tile reinstatement, roofing repairs, and penetrations." },
        { id: "A2",  text: "Structural and civil works, flooring, fire services, hydraulic and plumbing works, unless expressly specified." },
        { id: "A3",  text: "Asbestos and HAZMAT testing, containment, removal, and associated certifications." },
        { id: "A4",  text: "BMS systems, gateways, and third-party controls — supply, installation, programming, and integration — unless expressly specified." },
        { id: "A5",  text: "Power supply upgrades, switchboard works, and any electrical works beyond what is expressly included. This includes electrical circuits with isolators at condensing unit locations, mechanical services switchboards, and wiring of toilet ventilation fans." },
        { id: "A6",  text: "Traffic management, site access costs, hoardings beyond our scope, and crane or lifting equipment unless expressly included." },
        { id: "A7",  text: "Council, landlord, and body corporate approvals; engineering certifications; room certification; and permits not expressly included." },
        { id: "A8",  text: "Shop drawings, as-built drawings, manuals, spare parts manuals, commissioning sheets, training, and post-installation preventative maintenance. Preventative maintenance is available under a separate service agreement." },
        { id: "A9",  text: "Work outside normal business hours (7:00 AM–3:00 PM, Monday–Friday) or on public holidays, unless expressly included." },
        { id: "A10", text: "Construction work levy for projects valued at $150,000 or more (where applicable), and Contract Works Insurance, unless expressly included." },
        { id: "A11", text: "Stock loss and spoilage, unless expressly accepted in writing. Electronic controls with alarm contacts are available for connection to a security system; contact us for details." },
        { id: "A12", text: "Shelving (including Mantova shelving), strip curtains, infill panels, vermin proofing, and air curtain shrouds." },
        { id: "A13", text: "Condensate pumps (including for Hussmann cabinets), concrete pump hire, and additional concrete slabs under the building, unless expressly included." },
        { id: "A14", text: "Fire collars, fire pillows, core holes, fireproofing, and fire certification." },
        { id: "A15", text: "Repairs to roofs following air conditioning removal." },
        { id: "A16", text: "Rubbish removal and skip hire; noise attenuation measures." },
        { id: "A17", text: "Specific design recommendations — clients must obtain independent professional advice. Where Shelair facilitates third-party drawings on the client's behalf, we bear no liability for their accuracy, suitability, or completeness." },
        { id: "A18", text: "Union-endorsed EBA site rates and allowances, unless expressly stated. The Client must notify us before acceptance if EBA or site allowances apply; any resulting cost or time impact is a Variation." },
        { id: "A19", text: "Any latent conditions not identified at the time of quoting." },
        { id: "A20", text: "Anything not specifically included in this quotation is excluded unless otherwise agreed in writing." },
      ],
    },
  ] as TermsSection[],
};


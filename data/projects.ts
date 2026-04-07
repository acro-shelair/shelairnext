export interface Project {
  slug: string;
  title: string;
  type: string;
  size: string;
  desc: string;
  location: string;
  client: string;
  challenge: string;
  solution: string;
  outcomes: string[];
}

// ─── Page-level copy ──────────────────────────────────────────────────────────

export const projectsPage = {
  badge: "Our Work",
  heading: "Featured Projects",
  subheading:
    "A selection of commercial air conditioning projects delivered across Queensland.",
  cta: { label: "Discuss Your Needs", href: "/contact" },
};

// ─── Projects list ────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: "freshmart-national-fleet",
    title: "FreshMart National Fleet",
    type: "Maintenance Contract",
    size: "48 stores",
    location: "Nationwide, Australia",
    client: "FreshMart Supermarkets",
    desc: "Ongoing preventative maintenance across 48 supermarket locations. Reduced emergency call-outs by 60% in the first year through proactive servicing.",
    challenge:
      "FreshMart was averaging 3–4 emergency call-outs per store per year across their 48-location network, resulting in significant stock losses and compliance risk. Their previous contractor lacked the national coverage and documentation standards required.",
    solution:
      "Shelair implemented a structured preventative maintenance program with quarterly site visits, 24/7 remote monitoring, and centralised compliance reporting. Each store received a full system audit before the program commenced.",
    outcomes: [
      "60% reduction in emergency call-outs in the first 12 months",
      "Zero food safety compliance failures across the fleet",
      "Centralised digital maintenance records for every store",
      "Average response time of 90 minutes for any emergency during the contract",
    ],
  },
  {
    slug: "harbour-kitchen-emergency",
    title: "Harbour Kitchen — Emergency",
    type: "Emergency Repair",
    size: "Compressor failure",
    location: "Sydney, NSW",
    client: "Harbour Kitchen Restaurant",
    desc: "2am compressor failure at a high-volume waterfront restaurant. Technician on-site within 90 minutes, system restored before morning prep.",
    challenge:
      "A critical compressor failure at 2am threatened the entire cold storage system of a high-volume waterfront restaurant. With a full service the following morning, the kitchen had hours to resolve the issue or face closure and thousands in spoiled stock.",
    solution:
      "Shelair dispatched a technician within 20 minutes of the call. On arrival, the technician diagnosed a seized compressor motor and sourced a replacement from our emergency parts stock. The system was restored and temperature-stable before 5:30am.",
    outcomes: [
      "On-site within 90 minutes of the initial call",
      "System fully operational before morning kitchen prep",
      "Zero stock loss — cold chain maintained throughout",
      "Follow-up preventative maintenance plan established",
    ],
  },
  {
    slug: "pharmalogix-brisbane",
    title: "PharmaLogix Brisbane",
    type: "Maintenance & Monitoring",
    size: "120 sqm facility",
    location: "Brisbane, QLD",
    client: "PharmaLogix Pty Ltd",
    desc: "TGA-compliant maintenance contract with 24/7 remote monitoring. Zero temperature excursions since program inception.",
    challenge:
      "PharmaLogix required a refrigeration maintenance partner capable of meeting strict TGA (Therapeutic Goods Administration) standards for pharmaceutical cold storage. Temperature excursions carry serious regulatory and liability consequences in this environment.",
    solution:
      "We designed a bespoke maintenance and monitoring program incorporating continuous data logging, automated SMS/email alerts for any temperature deviation, quarterly calibration checks, and full audit-ready documentation. All technicians on this account hold relevant pharmaceutical cold chain certifications.",
    outcomes: [
      "Zero temperature excursions since program inception",
      "Full TGA-compliant documentation delivered after every visit",
      "24/7 real-time monitoring with sub-2-minute alert response",
      "Successfully passed two TGA audits with no findings",
    ],
  },
  {
    slug: "aussie-meats-processing",
    title: "Aussie Meats Processing",
    type: "Cold Room Build",
    size: "300 sqm blast freezer",
    location: "Toowoomba, QLD",
    client: "Aussie Meats Processing Co.",
    desc: "High-capacity blast freezing facility with processing rooms designed for continuous 24/7 operation. Delivered on time and on budget.",
    challenge:
      "Aussie Meats needed a 300 sqm blast freezing facility capable of continuous 24/7 operation to meet growing processing volumes. The existing site had structural constraints and required HACCP-compliant design from the ground up.",
    solution:
      "Shelair's in-house design and construction team engineered a modular blast freezer system incorporating redundant compressors, positive-pressure airlocks, and a custom drainage design to meet HACCP requirements. Construction was staged to minimise operational downtime on the existing facility.",
    outcomes: [
      "Delivered on time and within the agreed budget",
      "HACCP compliance achieved — passed inspection on first attempt",
      "Redundant compressor system providing 99.9% uptime",
      "28% more capacity than initially scoped, within the same footprint",
    ],
  },
  {
    slug: "greengrocer-co-op",
    title: "GreenGrocer Co-op",
    type: "System Upgrade",
    size: "80 sqm multi-temp",
    location: "Sunshine Coast, QLD",
    client: "GreenGrocer Co-operative",
    desc: "Ageing refrigeration system upgraded with energy-efficient compressors and smart monitoring. 28% reduction in energy costs.",
    challenge:
      "The co-op's 15-year-old multi-temperature refrigeration system was consuming excessive energy and generating frequent faults. Energy bills had increased 35% over the previous two years, and the system could no longer maintain consistent temperatures across zones.",
    solution:
      "We completed a full system audit, then replaced the ageing compressor units with inverter-driven alternatives and integrated a smart monitoring platform. The upgrade was completed over a single weekend to avoid trading disruptions.",
    outcomes: [
      "28% reduction in energy costs within the first quarter",
      "Consistent temperature performance across all zones",
      "Smart monitoring dashboard accessible by management",
      "Estimated 8-year equipment lifespan extension",
    ],
  },
  {
    slug: "coldchain-logistics",
    title: "ColdChain Logistics",
    type: "Emergency + Maintenance",
    size: "500 sqm warehouse",
    location: "Gold Coast, QLD",
    client: "ColdChain Logistics Australia",
    desc: "Started with an emergency condenser repair, now a full preventative maintenance client with quarterly servicing across two facilities.",
    challenge:
      "A condenser failure at their Gold Coast warehouse threatened time-sensitive cold chain deliveries during a peak summer period. After the emergency was resolved, it became clear the facility had not had a structured maintenance program in place.",
    solution:
      "We resolved the emergency condenser failure within four hours, then conducted a full facility audit. Following the audit, ColdChain engaged Shelair for a preventative maintenance contract across both their Gold Coast and Brisbane facilities, including quarterly servicing and remote monitoring.",
    outcomes: [
      "Emergency condenser failure resolved within 4 hours",
      "Full facility audit completed within two weeks",
      "Preventative maintenance now running across 2 facilities",
      "No unplanned downtime in 14 months since contract commencement",
    ],
  },
];

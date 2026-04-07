import { Phone, Search, Wrench, CheckCircle, Monitor, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ProcessStep {
  icon: LucideIcon;
  num: string;
  title: string;
  desc: string;
}

// ─── Page-level copy ──────────────────────────────────────────────────────────

export const processPage = {
  badge: "Our Process",
  heading: "How We Deliver Your Project",
  subheading: "A transparent, structured process that keeps you informed at every stage.",
  coldRoomNote: {
    heading: "Need a New Cold Room?",
    body: "For new cold room builds, our process includes consultation, site inspection, engineering & design, fabrication, installation and HACCP certification — typically 4–8 weeks from approval to handover.",
  },
  callCta: "Call Now — 24/7",
  phone: "1300227600",
};

// ─── Process steps ────────────────────────────────────────────────────────────

export const processSteps: ProcessStep[] = [
  {
    icon: Phone,
    num: "01",
    title: "You Call — 24/7",
    desc: "Speak to a real technician on our 24/7 emergency hotline. No call centres, no waiting. We triage your issue immediately.",
  },
  {
    icon: Search,
    num: "02",
    title: "We Dispatch & Diagnose",
    desc: "The nearest qualified technician is dispatched within minutes. On-site fault diagnosis with full cost transparency before any work begins.",
  },
  {
    icon: Wrench,
    num: "03",
    title: "Repair on First Visit",
    desc: "We carry common parts and refrigerants on every truck. 98% of repairs are completed on the first visit — minimising your downtime.",
  },
  {
    icon: CheckCircle,
    num: "04",
    title: "Test & Certify",
    desc: "System tested to manufacturer specifications. Compliance documentation provided for HACCP and food safety audits.",
  },
  {
    icon: Monitor,
    num: "05",
    title: "Monitor & Prevent",
    desc: "Optional smart monitoring installed to track temperatures and system health — catching issues before they become breakdowns.",
  },
  {
    icon: FileText,
    num: "06",
    title: "Ongoing Maintenance",
    desc: "Move from reactive to proactive with a scheduled maintenance plan. Extend system life, cut energy costs and stay compliant year-round.",
  },
];

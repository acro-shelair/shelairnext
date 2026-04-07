import {
  Clock,
  Wrench,
  ShieldCheck,
  Thermometer,
  BarChart3,
  Snowflake,
  Phone,
  Search,
  CheckCircle,
  Monitor,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Service {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface ServiceStep {
  icon: LucideIcon;
  num: string;
  title: string;
  desc: string;
}

// ─── Page-level copy ──────────────────────────────────────────────────────────

export const servicesPage = {
  badge: "Our Services",
  heading: "Repairs, Maintenance & Cold Room Solutions",
  subheading:
    "From 2am breakdowns to scheduled servicing and new cold room builds — one expert team for every commercial air conditioning need.",
  emergencyBanner: {
    heading: "Refrigeration Emergency?",
    subheading: "Call now for priority dispatch — average 2-hour response, 24/7.",
    phone: "1300227600",
  },
  allBrandsSection: {
    heading: "All Brands. All Systems. One Team.",
    body1:
      "We service and repair all major commercial air conditioning brands — Bitzer, Copeland, Danfoss, Daikin and more. Whether it's a compressor failure, refrigerant leak or control system fault, we've seen it and fixed it.",
    body2:
      "When you need new cold storage capacity, we also design, fabricate and install custom cold rooms with high-density polyurethane insulation and food-grade stainless steel finishes.",
  },
  processSection: {
    badge: "Our Process",
    heading: "How We Deliver Your Project",
    subheading: "A transparent, structured process that keeps you informed at every stage.",
    coldRoomNote: {
      heading: "Need a New Cold Room?",
      body: "For new cold room builds, our process includes consultation, site inspection, engineering & design, fabrication, installation and HACCP certification — typically 4–8 weeks from approval to handover.",
    },
  },
};

// ─── Services list ────────────────────────────────────────────────────────────

export const services: Service[] = [
  {
    icon: Clock,
    title: "24/7 Emergency Repairs",
    desc: "Round-the-clock emergency breakdown service with rapid response times across Brisbane, Gold Coast and SE Queensland.",
  },
  {
    icon: Wrench,
    title: "Preventative Maintenance",
    desc: "Scheduled maintenance plans that catch issues before they become costly breakdowns. Extend system life, cut energy costs and stay compliant.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance & Certification",
    desc: "Post-repair compliance checks, HACCP documentation and temperature logging for food safety and pharmaceutical audits.",
  },
  {
    icon: Thermometer,
    title: "Smart Monitoring",
    desc: "IoT-enabled temperature monitoring with cloud dashboards, automated alerts and compliance logging.",
  },
  {
    icon: BarChart3,
    title: "Energy Audits & Upgrades",
    desc: "Comprehensive energy efficiency assessments and system upgrades that reduce running costs by up to 30% on ageing systems.",
  },
  {
    icon: Snowflake,
    title: "Cold Room Construction",
    desc: "When you need new capacity, our in-house team designs, fabricates and installs custom HACCP-compliant cold rooms built to last.",
  },
];

// ─── How-it-works steps ───────────────────────────────────────────────────────

export const serviceSteps: ServiceStep[] = [
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

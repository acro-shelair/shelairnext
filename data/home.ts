import {
  Shield,
  Clock,
  Headphones,
  Wrench,
  AlertTriangle,
  ThermometerSnowflake,
  TrendingDown,
  ClipboardList,
  Settings,
  ShieldCheck,
  Zap,
  Wifi,
  Bell,
  Award,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Hero ─────────────────────────────────────────────────────────────────────

export interface HeroStat {
  value: string;
  label: string;
  className: string;
  motionStyle: Record<string, string>;
  delay: number;
  pulseDelay: number;
}

export const hero = {
  badge: "Call Now. We can be there today",
  heading: "Commercial Air Conditioning",
  headingHighlight: " Repair & Maintenance",
  headingEnd: ": Keeping Your Cold Chain Unbroken 24/7",
  subheading:
    "Breakdowns don't wait — neither do we. Fast emergency repairs, preventative maintenance plans, and expert servicing for all commercial air conditioning systems.",
  primaryCta: { label: "Get a Quote", href: "/contact" },
  secondaryCta: { label: "Book Site Inspection", href: "/contact" },
  floatingStats: [
    {
      value: "HACCP-Certified",
      label: "HACCP Certified",
      className: "absolute top-14 -right-10",
      motionStyle: { translateY: "-50%" },
      delay: 0.9,
      pulseDelay: 0.9,
    },
    {
      value: "50+",
      label: "Years Experience",
      className: "absolute left-2",
      motionStyle: { top: "50%", translateX: "-50%", translateY: "-50%" },
      delay: 0.7,
      pulseDelay: 0,
    },
    {
      value: "24/7 Support",
      label: "Emergency Response",
      className: "absolute bottom-16 -right-10",
      motionStyle: { translateY: "50%" },
      delay: 1.1,
      pulseDelay: 1.8,
    },
  ] as HeroStat[],
};

// ─── Trust Bar ────────────────────────────────────────────────────────────────

export interface TrustBadge {
  icon: LucideIcon;
  label: string;
  desc: string;
}

export const trustBar: TrustBadge[] = [
  { icon: Clock, label: "Since 1972", desc: "50+ years of expertise" },
  { icon: Shield, label: "HACCP Compliant", desc: "Certified systems" },
  { icon: Wrench, label: "98% First-Visit Fix", desc: "Get back online fast" },
  { icon: Headphones, label: "24/7 Support", desc: "Emergency response" },
];

// ─── Problem Section ──────────────────────────────────────────────────────────

export interface Problem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const problemSection = {
  heading: "What Happens When Your Refrigeration Fails?",
  subheading:
    "Every hour of downtime costs Australian businesses hundreds — sometimes thousands — in lost revenue and stock.",
  problems: [
    {
      icon: AlertTriangle,
      title: "Unexpected Breakdowns",
      desc: "A failed compressor at 2am means thousands in spoiled stock by morning.",
    },
    {
      icon: ThermometerSnowflake,
      title: "Temperature Drift",
      desc: "Gradual temperature creep goes unnoticed until a health inspector flags it.",
    },
    {
      icon: Clock,
      title: "Slow Response Times",
      desc: "Most contractors take 24–48 hours. Your cold chain can't wait that long.",
    },
    {
      icon: TrendingDown,
      title: "Rising Energy Bills",
      desc: "Poorly maintained systems consume up to 40% more power than they should.",
    },
  ] as Problem[],
};

// ─── Solution Section ─────────────────────────────────────────────────────────

export interface SolutionStep {
  icon: LucideIcon;
  step: string;
  title: string;
  desc: string;
}

export const solutionSection = {
  badge: "How We Work",
  heading: "One Team for Every Refrigeration Need",
  subheading:
    "From 2am breakdowns to long-term maintenance plans — and new builds when you're ready to grow.",
  steps: [
    {
      icon: ClipboardList,
      step: "01",
      title: "Emergency Repairs",
      desc: "24/7 call-out service with an average 2-hour response time. We diagnose and fix on the first visit — 98% of the time.",
    },
    {
      icon: Wrench,
      step: "02",
      title: "Preventative Maintenance",
      desc: "Scheduled servicing plans that catch issues before they become costly breakdowns. Extend system life and cut energy costs.",
    },
    {
      icon: Settings,
      step: "03",
      title: "Cold Room Builds",
      desc: "When you need new capacity, our in-house team designs, fabricates and installs HACCP-compliant cold rooms built to last.",
    },
  ] as SolutionStep[],
};

// ─── Capabilities Grid ────────────────────────────────────────────────────────

export interface Capability {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const capabilitiesGrid = {
  heading: "Why Businesses Trust Shelair",
  subheading:
    "Reliable service, fast response, and proactive monitoring that keeps your cold chain running.",
  capabilities: [
    {
      icon: Clock,
      title: "24/7 Emergency Call-Outs",
      desc: "Round-the-clock availability for breakdowns — average 2-hour response across Brisbane, Gold Coast and SE Queensland.",
    },
    {
      icon: Wrench,
      title: "All Brands & Systems",
      desc: "We service and repair all major commercial air conditioning brands, compressors, and control systems.",
    },
    {
      icon: ShieldCheck,
      title: "Compliance & Certification",
      desc: "Post-repair compliance checks and documentation for HACCP and food safety audits.",
    },
    {
      icon: Zap,
      title: "Energy Optimisation",
      desc: "Tune-ups and upgrades that reduce energy consumption by up to 30% on ageing systems.",
    },
    {
      icon: Wifi,
      title: "Smart Monitoring",
      desc: "Remote temperature and performance monitoring to catch issues before they cause downtime.",
    },
    {
      icon: Bell,
      title: "Instant Alerts",
      desc: "SMS and email alerts when temperatures deviate — so you know before your stock is at risk.",
    },
  ] as Capability[],
};

// ─── Workmanship Guarantee ────────────────────────────────────────────────────

export const workmanshipGuarantee = {
  heading: "Backed by a 5-Year Workmanship Guarantee",
  subheading: "Most contractors move on once the job is done. We don’t.",
  bodyCopy: [
    "At Shelair, the specific installation and repair work performed by our technicians is backed by our 5-Year Workmanship Guarantee.",
    "Where defective workmanship is confirmed in the specific work performed by Shelair, we return and rectify that workmanship at no labour cost.",
    "This guarantee applies only to the specific work performed by Shelair. It does not extend beyond that scope.",
  ],
  covered: {
    title: "What’s Covered",
    items: [
      "Defective workmanship in the specific installation or repair work performed by Shelair",
      "Labour to inspect and determine whether an issue relates to our workmanship",
      "Labour to rectify confirmed defective workmanship in the work we carried out",
      "Return attendance required to rectify confirmed defective workmanship in our work",
    ],
  },
  labourGuarantee: {
    title: "5-Year Labour Guarantee",
    body: "We cover the labour required to rectify confirmed defective workmanship in the specific work performed by Shelair, for five full years from completion.",
  },
  meansForYou: {
    title: "What This Means for You",
    items: [
      "You won’t pay again to rectify confirmed defective workmanship in the specific work performed by Shelair",
      "The workmanship in the work we perform is backed for five full years from completion",
      "You’re dealing with a contractor that stands behind the specific work it performs",
    ],
  },
  notCovered: {
    title: "What’s Not Covered",
    intro: "This guarantee does not apply to:",
    items: [
      "Any part of a system not installed, repaired, or worked on by Shelair",
      "Any issue not caused by defective workmanship in the specific work performed by Shelair",
      "Damage caused by misuse, neglect, external factors, or third-party interference",
      "Any issue arising after our work has been altered, adjusted, or modified by others",
      "Equipment or systems not maintained in accordance with normal operating and maintenance requirements",
    ],
  },
  accountability: {
    title: "Built on Accountability",
    body: "Our technicians are trained, experienced, and held to a high standard. All work is carried out in line with applicable requirements and documented appropriately. Where defective workmanship is confirmed in the specific work we performed, we rectify that workmanship.",
  },
  cta: {
    heading: "Need Work Done Properly the First Time?",
    body: "If you want a contractor that stands behind the specific work it performs, Shelair is ready to help.",
    primary: { label: "Book a Free Compliance Audit", href: "/contact" },
    finePrint:
      "Effective 1 June 2025. Applies to all labour performed by Shelair technicians. Terms and conditions apply.",
  },
  blogStrip: {
    prefix: "WANT TO KNOW MORE?",
    headline:
      "We’ve written the full breakdown so you know exactly what you’re covered for.",
    links: [
      {
        label: "Why Our Guarantee Gives You Total Peace of Mind",
        href: "/resources/5-year-workmanship-guarantee",
      },
      {
        label: "Warranty vs. Workmanship — What’s the Difference?",
        href: "/resources/refrigeration-warranty-vs-workmanship-guarantee",
      },
      {
        label: "Read the Official Guarantee Terms",
        href: "/terms",
      },
    ],
  },
};

// ─── Process Timeline ─────────────────────────────────────────────────────────

export interface ProcessTimelineStep {
  num: string;
  title: string;
  desc: string;
}

export const processTimeline = {
  heading: "How Our Emergency Repair Process Works",
  subheading:
    "From your call to a fully operational system — fast, transparent, and guaranteed.",
  steps: [
    {
      num: "1",
      title: "You Call",
      desc: "24/7 hotline — speak to a real technician, not a call centre.",
    },
    {
      num: "2",
      title: "We Dispatch",
      desc: "Nearest qualified tech dispatched within minutes.",
    },
    {
      num: "3",
      title: "Diagnose",
      desc: "On-site fault diagnosis with full transparency on costs.",
    },
    {
      num: "4",
      title: "Repair",
      desc: "Fix completed on first visit 98% of the time.",
    },
    {
      num: "5",
      title: "Test & Certify",
      desc: "System tested to spec with compliance documentation.",
    },
    {
      num: "6",
      title: "Monitor",
      desc: "Optional smart monitoring to prevent future breakdowns.",
    },
  ] as ProcessTimelineStep[],
};

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export const testimonialsSection = {
  heading: "Trusted by Industry Leaders",
  subheading: "See what our clients say about working with Shelair.",
  testimonials: [
    {
      name: "Mark Thompson",
      role: "Operations Manager, FreshMart",
      quote:
        "Shelair delivered our 200sqm cold storage facility two weeks ahead of schedule. The smart monitoring system has already prevented two potential temperature events.",
    },
    {
      name: "Sarah Chen",
      role: "Head Chef, Harbour Kitchen",
      quote:
        "Finally a contractor who understands compliance. Our new walk-in coolroom passed HACCP inspection on the first visit. The team was professional from day one.",
    },
    {
      name: "David Russo",
      role: "Warehouse Director, PharmaLogix",
      quote:
        "We needed pharmaceutical-grade cold storage with zero tolerance for temperature deviation. Shelair engineered a system that's been flawless for 18 months.",
    },
  ] as Testimonial[],
};

// ─── Clients Section ──────────────────────────────────────────────────────────

export const clientsSection = {
  eyebrow: "Trusted By",
  heading: "Proudly Serving Queensland's Best",
};

// ─── Locations Section ────────────────────────────────────────────────────────

export const locationsSection = {
  badge: "Service Areas",
  heading: "Commercial Air Conditioning Repairs Near You",
  subheading:
    "24/7 emergency repairs and maintenance across South-East Queensland. Find your local team.",
  viewAllLabel: "View all service areas",
};

// ─── CTA Banner ───────────────────────────────────────────────────────────────

export const ctaBanner = {
  heading: "Refrigeration Emergency? We're On Call 24/7.",
  subheading:
    "Don't lose stock to a breakdown. Call now or book a maintenance plan to prevent it happening in the first place.",
  primaryCta: { label: "Get a Free Quote", href: "/contact" },
  secondaryCta: { label: "Call 1300 227 600", phone: "1300227600" },
};

// ─── Projects Home Section ────────────────────────────────────────────────

export const projectsHomeSection = {
  badge: "Our Work",
  heading: "Projects We're Proud Of",
  subheading:
    "From emergency repairs to large-scale cold room builds — here's a snapshot of what we've delivered for Australian businesses.",
  viewMoreLabel: "View all projects",
  viewMoreHref: "/projects",
};

// ─── FAQ Section ──────────────────────────────────────────────────────────────

export interface FAQ {
  q: string;
  a: string;
}

export const faqSection = {
  heading: "Frequently Asked Questions",
  subheading: "Common questions about our refrigeration services.",
  faqs: [
    {
      q: "How quickly can you respond to an emergency breakdown?",
      a: "We offer 24/7 emergency call-outs with an average response time of 2 hours across Brisbane, Gold Coast and SE Queensland. For critical systems, we prioritise same-hour dispatch.",
    },
    {
      q: "Do you service all refrigeration brands?",
      a: "Yes. Our technicians are trained and equipped to service, repair, and maintain all major commercial air conditioning brands including Bitzer, Copeland, Danfoss, Daikin, and more.",
    },
    {
      q: "What does a preventative maintenance plan include?",
      a: "Our plans include scheduled servicing visits, filter and component checks, refrigerant level monitoring, energy efficiency audits, 24/7 remote monitoring, and priority emergency response.",
    },
    {
      q: "Can you help us pass a HACCP or food safety audit?",
      a: "Yes. While most of our work is repairs and maintenance, we also design, fabricate, and install custom HACCP-compliant cold rooms. Contact us for a site inspection and quote.",
    },
    {
      q: "Do you also build new cold rooms?",
      a: "Yes. Our modular systems are designed for easy expansion. We can also retrofit existing cold rooms with upgraded insulation, compressors, and smart monitoring.",
    },
    {
      q: "What areas do you service?",
      a: "We service Brisbane, Gold Coast, Sunshine Coast and SE Queensland. For large-scale or national clients, we can mobilise teams across Australia.",
    },
  ] as FAQ[],
};

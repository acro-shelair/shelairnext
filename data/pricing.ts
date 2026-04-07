export interface PricingTier {
  name: string;
  description: string;
  price: string;
  unit: string;
  features: string[];
  popular?: boolean;
}

// ─── Page-level copy ──────────────────────────────────────────────────────────

export const pricingPage = {
  badge: "Pricing",
  heading: "Transparent Pricing",
  subheading:
    "Every project is unique. These guides give you a starting point — get a custom quote for accurate pricing.",
};

// ─── Pricing tiers ────────────────────────────────────────────────────────────

export const pricingTiers: PricingTier[] = [
  {
    name: "Emergency Call-Out",
    description: "For one-off breakdowns and urgent repairs.",
    price: "From $220",
    unit: "per call-out",
    features: [
      "24/7 availability",
      "2hr avg response",
      "On-site diagnosis",
      "Most repairs same visit",
      "Compliance documentation",
      "All brands serviced",
    ],
  },
  {
    name: "Maintenance Plan",
    description: "Scheduled servicing to prevent breakdowns.",
    price: "From $450",
    unit: "per month",
    features: [
      "Quarterly servicing visits",
      "Priority emergency response",
      "Filter & component checks",
      "Refrigerant monitoring",
      "Energy efficiency reports",
      "24/7 smart monitoring",
    ],
    popular: true,
  },
  {
    name: "Cold Room Build",
    description: "Custom cold room design, fabrication & install.",
    price: "From $15,000",
    unit: "project",
    features: [
      "Custom engineering",
      "HACCP compliance",
      "High-density insulation",
      "Smart monitoring included",
      "Up to 5yr warranty",
      "Maintenance plan option",
    ],
  },
];

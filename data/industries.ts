import { UtensilsCrossed, ShoppingCart, Pill, Warehouse, Factory } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Industry {
  icon: LucideIcon;
  slug: string;
  title: string;
  /** Short description used on the home IndustryCards section */
  shortDesc: string;
  /** Full description used on the Industries page */
  desc: string;
  features: string[];
}

// ─── Page-level copy ──────────────────────────────────────────────────────────

export const industriesPage = {
  badge: "Industries",
  heading: "Refrigeration Repair & Maintenance for Every Industry",
  subheading:
    "Specialist servicing, emergency repairs and maintenance plans tailored to the unique demands of your sector.",
};

export const industriesHomeSection = {
  heading: "Industries We Serve",
  subheading: "Tailored refrigeration solutions for every sector.",
};

// ─── Industry list ────────────────────────────────────────────────────────────

export const industries: Industry[] = [
  {
    icon: UtensilsCrossed,
    slug: "restaurants-hospitality",
    title: "Restaurants & Hospitality",
    shortDesc: "Walk-in coolrooms and freezers built for commercial kitchens.",
    desc: "Walk-in coolrooms, freezer rooms, and bar refrigeration designed for the demands of commercial kitchens. HACCP-compliant systems that keep your kitchen inspection-ready.",
    features: ["Walk-in coolrooms", "Blast chillers", "Bar fridges", "HACCP compliance"],
  },
  {
    icon: ShoppingCart,
    slug: "supermarkets-retail",
    title: "Supermarkets & Retail",
    shortDesc: "Display cases, cold rooms and multi-temperature zones.",
    desc: "Multi-temperature display cases, cold rooms, and energy-efficient refrigeration systems for retail environments. Maximise product visibility while minimising energy costs.",
    features: ["Display cases", "Multi-temp zones", "Night blinds", "Energy management"],
  },
  {
    icon: Pill,
    slug: "pharmaceuticals",
    title: "Pharmaceuticals",
    shortDesc: "Temperature-critical storage for vaccines and medicines.",
    desc: "Precision temperature-controlled storage for vaccines, medicines, and biological materials. Meets TGA and cold chain requirements with redundant monitoring systems.",
    features: ["Vaccine storage", "TGA compliance", "Redundant systems", "Audit trails"],
  },
  {
    icon: Warehouse,
    slug: "warehousing-logistics",
    title: "Warehousing & Logistics",
    shortDesc: "Large-scale cold storage for distribution centres.",
    desc: "Large-scale cold storage solutions for distribution centres and logistics hubs. Designed for high-throughput operations with dock-level integration.",
    features: ["Dock integration", "Pallet racking", "Rapid cycling", "Scale flexibility"],
  },
  {
    icon: Factory,
    slug: "food-production",
    title: "Food Production",
    shortDesc: "Processing and blast freezing rooms for manufacturers.",
    desc: "Processing rooms, blast freezers, and production-line refrigeration for food manufacturers. Engineered for continuous operation and regulatory compliance.",
    features: ["Blast freezing", "Processing rooms", "Clean rooms", "Continuous ops"],
  },
];

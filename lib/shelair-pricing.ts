import type { PricingTier } from "@/lib/supabase/content";

const INSTALLATION_TIER: PricingTier = {
  id: "commercial-hvac-installation",
  position: 3,
  name: "Commercial HVAC Installation",
  description: "Commercial replacements, upgrades and new air conditioning installations.",
  price: "Quoted",
  unit: "per project",
  features: [
    "Site inspection and scope",
    "System design and equipment selection",
    "Supply and installation",
    "Commissioning and handover",
    "5-year workmanship guarantee",
    "Ongoing maintenance available",
  ],
  popular: false,
};

export function shelairPricing(tiers: PricingTier[]): PricingTier[] {
  const clean = tiers.filter((tier) => !/cold\s*room|refrigeration/i.test(`${tier.name} ${tier.description ?? ""}`));
  const hasInstall = clean.some((tier) => /install|replacement|upgrade/i.test(`${tier.name} ${tier.description ?? ""}`));
  if (!hasInstall) clean.push(INSTALLATION_TIER);
  return clean.slice(0, 3);
}

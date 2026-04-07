import { createAdminClient } from "@/lib/supabase/admin";
import { getAllPricingTiers } from "@/lib/supabase/content";
import PricingClient from "./PricingClient";

export const revalidate = 30;

export default async function PricingAdminPage() {
  const supabase = createAdminClient();
  const tiers = await getAllPricingTiers(supabase);
  return <PricingClient initialTiers={tiers} />;
}

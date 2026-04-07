import { createClient } from "@/lib/supabase/server";
import { getAllIndustries } from "@/lib/supabase/content";
import IndustriesClient from "./IndustriesClient";

export const dynamic = "force-dynamic";

export default async function AdminIndustriesPage() {
  const supabase = await createClient();
  const industries = await getAllIndustries(supabase);
  return <IndustriesClient initialIndustries={industries} />;
}

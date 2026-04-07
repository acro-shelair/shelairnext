import { createClient } from "@/lib/supabase/server";
import { getAllIndustries } from "@/lib/supabase/content";
import IndustryEditor from "../IndustryEditor";

export default async function NewIndustryPage() {
  const supabase = await createClient();
  const industries = await getAllIndustries(supabase);
  return <IndustryEditor nextPosition={industries.length} />;
}

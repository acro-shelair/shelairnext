import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getIndustryById } from "@/lib/supabase/content";
import IndustryEditor from "../../IndustryEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditIndustryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const industry = await getIndustryById(supabase, id);
  if (!industry) notFound();
  return <IndustryEditor industry={industry} />;
}

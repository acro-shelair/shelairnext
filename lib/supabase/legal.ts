import type { SupabaseClient } from "@supabase/supabase-js";

export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalPage {
  id: string;
  type: string;
  title: string;
  intro: string;
  effective_date: string;
  qbcc: string;
  abn: string;
  sections: LegalSection[];
  updated_at: string;
}

export async function getLegalPage(
  supabase: SupabaseClient,
  type: "terms" | "privacy" | "guarantee"
): Promise<LegalPage | null> {
  const { data, error } = await supabase
    .from("legal_pages")
    .select("*")
    .eq("type", type)
    .single();
  if (error) return null;
  return data ?? null;
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBrandById } from "@/lib/supabase/content";
import BrandEditor from "../../BrandEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditBrandPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const brand = await getBrandById(supabase, id);
  if (!brand) notFound();
  return <BrandEditor brand={brand} />;
}

import { createClient } from "@/lib/supabase/server";
import { getAllBrands, getAllOtherBrands } from "@/lib/supabase/content";
import BrandsClient from "./BrandsClient";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const supabase = await createClient();
  const [brands, otherBrands] = await Promise.all([
    getAllBrands(supabase),
    getAllOtherBrands(supabase),
  ]);
  return <BrandsClient initialBrands={brands} initialOtherBrands={otherBrands} />;
}

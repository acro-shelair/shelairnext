import { createClient } from "@/lib/supabase/server";
import { getAllBrands } from "@/lib/supabase/content";
import BrandEditor from "../BrandEditor";

export default async function NewBrandPage() {
  const supabase = await createClient();
  const brands = await getAllBrands(supabase);
  return <BrandEditor nextPosition={brands.length} />;
}

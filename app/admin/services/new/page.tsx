import { createClient } from "@/lib/supabase/server";
import { getAllServices } from "@/lib/supabase/content";
import ServiceEditor from "../ServiceEditor";

export default async function NewServicePage() {
  const supabase = await createClient();
  const services = await getAllServices(supabase);
  return <ServiceEditor nextPosition={services.length} />;
}

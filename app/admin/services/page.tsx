import { createClient } from "@/lib/supabase/server";
import { getAllServices } from "@/lib/supabase/content";
import ServicesClient from "./ServicesClient";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const supabase = await createClient();
  const services = await getAllServices(supabase);
  return <ServicesClient initialServices={services} />;
}

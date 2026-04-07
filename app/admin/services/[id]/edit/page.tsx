import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServiceById } from "@/lib/supabase/content";
import ServiceEditor from "../../ServiceEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const service = await getServiceById(supabase, id);
  if (!service) notFound();
  return <ServiceEditor service={service} />;
}

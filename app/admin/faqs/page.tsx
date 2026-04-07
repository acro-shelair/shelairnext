import { createClient } from "@/lib/supabase/server";
import { getAllFaqs } from "@/lib/supabase/content";
import FaqsClient from "./FaqsClient";

export const dynamic = "force-dynamic";

export default async function FaqsAdminPage() {
  const supabase = await createClient();
  const faqs = await getAllFaqs(supabase);
  return <FaqsClient initialFaqs={faqs} />;
}

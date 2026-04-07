import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllServices } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";
import Services from "@/components/pages/Services";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Commercial air conditioning installation, service & repairs, cold room hire and preventative maintenance across Brisbane, Gold Coast and Sunshine Coast.",
  alternates: { canonical: "https://shelair.com.au/services" },
  openGraph: { url: "https://shelair.com.au/services" },
};

export default async function ServicesPage() {
  const supabase = createAdminClient();
  const services = await withRetry(() => getAllServices(supabase));
  return <Services services={services} />;
}

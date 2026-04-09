import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllIndustries } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";
import Industries from "@/components/pages/Industries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Specialist commercial refrigeration repairs and maintenance for restaurants, supermarkets, pharmaceuticals, warehousing and food production. HACCP and TGA compliant. Brisbane & SE Queensland.",
  alternates: { canonical: "https://shelair.com.au/industries" },
  openGraph: { url: "https://shelair.com.au/industries" },
};

export default async function IndustriesPage() {
  const supabase = createAdminClient();
  const industries = await withRetry(() => getAllIndustries(supabase));
  return <Industries industries={industries} />;
}

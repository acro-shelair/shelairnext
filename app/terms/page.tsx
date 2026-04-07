import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLegalPage } from "@/lib/supabase/legal";
import TermsOfService from "@/components/pages/TermsOfService";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Terms & Conditions | Shelair – Brisbane Commercial Air Conditioning",
  description:
    "Terms & Conditions for all quotations, work orders, repairs, maintenance, and installations performed by Shelair. QBCC #15413155.",
  alternates: { canonical: "https://shelair.com.au/terms" },
  openGraph: { url: "https://shelair.com.au/terms" },
};

export default async function TermsOfServicePage() {
  const supabase = createAdminClient();
  const legalData = await getLegalPage(supabase, "terms");
  return <TermsOfService legalData={legalData} />;
}

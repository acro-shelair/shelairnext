import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLegalPage } from "@/lib/supabase/legal";
import PrivacyPolicy from "@/components/pages/PrivacyPolicy";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Privacy Policy | Shelair – Brisbane Commercial Air Conditioning",
  description:
    "Shelair's Privacy Policy outlines how we collect, use, and protect your personal information in accordance with the Australian Privacy Act 1988. Serving Brisbane, Gold Coast & SE Queensland.",
  alternates: { canonical: "https://shelair.com.au/privacy" },
  openGraph: { url: "https://shelair.com.au/privacy" },
};

export default async function PrivacyPolicyPage() {
  const supabase = createAdminClient();
  const legalData = await getLegalPage(supabase, "privacy");
  return <PrivacyPolicy legalData={legalData} />;
}

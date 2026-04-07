import { createClient } from "@/lib/supabase/server";
import { getLegalPage } from "@/lib/supabase/legal";
import LegalEditor from "./LegalEditor";

export const dynamic = "force-dynamic";

export default async function LegalAdminPage() {
  const supabase = await createClient();
  const [termsData, privacyData] = await Promise.all([
    getLegalPage(supabase, "terms"),
    getLegalPage(supabase, "privacy"),
  ]);

  return (
    <div className="space-y-6 pb-16 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Legal Pages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Edit the Terms &amp; Conditions and Privacy Policy pages.
        </p>
      </div>
      <LegalEditor termsData={termsData} privacyData={privacyData} />
    </div>
  );
}

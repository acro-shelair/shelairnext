import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/lib/rbac";
import PortalClient from "./PortalClient";

export const dynamic = "force-dynamic";

export default async function AdminPortalPage() {
  const supabase = await createClient();

  const [{ data: { user } }, { data: sections }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("portal_sections")
      .select("*, portal_resources(*)")
      .order("position")
      .order("position", { referencedTable: "portal_resources" }),
  ]);

  const { data: profile } = user
    ? await supabase
        .from("user_profiles")
        .select("user_id, role, permissions")
        .eq("user_id", user.id)
        .single()
    : { data: null };

  const userProfile = profile as UserProfile | null;
  const canEdit =
    !userProfile ||
    userProfile.role === "admin" ||
    userProfile.permissions.includes("portal");

  return <PortalClient initialSections={sections ?? []} canEdit={canEdit} />;
}

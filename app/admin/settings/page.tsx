import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/supabase/content";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const settings = await getSiteSettings(supabase);
  return <SettingsClient settings={settings} />;
}

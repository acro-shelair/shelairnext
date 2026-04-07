"use server";

import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";

export async function signOutAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fire-and-forget log — don't block sign-out
  logActivity("logout", "auth", `Logged out: ${user?.email ?? "unknown"}`).catch(() => {});

  await supabase.auth.signOut();
}

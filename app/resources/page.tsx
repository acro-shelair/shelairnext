import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublishedPosts } from "@/lib/supabase/posts";
import { withRetry } from "@/lib/retry";
import Resources from "@/components/pages/Resources";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Guides, Articles & Resources",
  description:
    "Expert guides and articles on commercial air conditioning, energy efficiency and HVAC maintenance. Free resources from Shelair.",
  alternates: { canonical: "https://shelair.com.au/resources" },
  openGraph: { url: "https://shelair.com.au/resources" },
};

export default async function ResourcesPage() {
  const supabase = createAdminClient();
  const posts = await withRetry(() => getPublishedPosts(supabase));
  return <Resources posts={posts} />;
}

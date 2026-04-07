import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllProjects } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";
import Projects from "@/components/pages/Projects";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Featured Projects",
  description:
    "Browse our portfolio of commercial cold room and refrigeration projects across Brisbane, SE Queensland and Australia — from restaurant coolrooms to large-scale pharmaceutical cold storage.",
  alternates: { canonical: "https://shelair.com.au/projects" },
  openGraph: { url: "https://shelair.com.au/projects" },
};

export default async function ProjectsPage() {
  const supabase = createAdminClient();
  const projects = await withRetry(() => getAllProjects(supabase));
  return <Projects projects={projects} />;
}

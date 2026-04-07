import { createClient } from "@/lib/supabase/server";
import { getAllProjects } from "@/lib/supabase/content";
import ProjectsClient from "./ProjectsClient";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const projects = await getAllProjects(supabase).catch(() => []);
  return <ProjectsClient initialProjects={projects} />;
}

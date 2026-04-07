import { createClient } from "@/lib/supabase/server";
import { getAllProjects } from "@/lib/supabase/content";
import ProjectEditor from "../ProjectEditor";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const projects = await getAllProjects(supabase).catch(() => []);
  return <ProjectEditor nextPosition={projects.length} />;
}

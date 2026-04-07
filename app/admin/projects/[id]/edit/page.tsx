import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProjectById } from "@/lib/supabase/content";
import ProjectEditor from "../../ProjectEditor";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const project = await getProjectById(supabase, id);
  if (!project) notFound();
  return <ProjectEditor project={project} />;
}

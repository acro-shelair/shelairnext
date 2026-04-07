import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllProjects, getProjectBySlug } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";
import ProjectPage from "@/components/pages/ProjectPage";

export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const supabase = createAdminClient();
    const projects = await withRetry(() => getAllProjects(supabase));
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();
  const project = await withRetry(() => getProjectBySlug(supabase, slug));
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `https://shelair.com.au/projects/${slug}` },
    openGraph: { url: `https://shelair.com.au/projects/${slug}` },
  };
}

export default async function ProjectPageRoute({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const project = await withRetry(() => getProjectBySlug(supabase, slug));
  if (!project) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://shelair.com.au" },
      { "@type": "ListItem", position: 2, name: "Projects", item: "https://shelair.com.au/projects" },
      { "@type": "ListItem", position: 3, name: project.title, item: `https://shelair.com.au/projects/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ProjectPage project={project} />
    </>
  );
}

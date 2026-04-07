import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllIndustries, getIndustryBySlug } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";
import IndustryPage from "@/components/pages/IndustryPage";

export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: Promise<{ industrySlug: string }> };

export async function generateStaticParams() {
  try {
    const supabase = createAdminClient();
    const industries = await withRetry(() => getAllIndustries(supabase));
    return industries.map((i) => ({ industrySlug: i.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industrySlug } = await params;
  const supabase = createAdminClient();
  const industry = await withRetry(() => getIndustryBySlug(supabase, industrySlug));
  if (!industry) return {};
  return {
    title: industry.title,
    description: industry.meta_description || industry.description,
    alternates: { canonical: `https://shelair.com.au/industries/${industrySlug}` },
    openGraph: { url: `https://shelair.com.au/industries/${industrySlug}` },
  };
}

export default async function IndustryPageRoute({ params }: Props) {
  const { industrySlug } = await params;
  const supabase = createAdminClient();
  const industry = await withRetry(() => getIndustryBySlug(supabase, industrySlug));
  if (!industry) notFound();

  const relatedSlugs = industry.related_industry_slugs ?? [];
  const relatedIndustries = relatedSlugs.length > 0
    ? (await withRetry(() =>
        supabase.from("industries").select("slug, title, description")
          .in("slug", relatedSlugs)
      )).data ?? []
    : [];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://shelair.com.au" },
      { "@type": "ListItem", position: 2, name: "Industries", item: "https://shelair.com.au/industries" },
      { "@type": "ListItem", position: 3, name: industry.title, item: `https://shelair.com.au/industries/${industrySlug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <IndustryPage industry={industry} relatedIndustries={relatedIndustries} />
    </>
  );
}

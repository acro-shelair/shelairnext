import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { withRetry } from "@/lib/retry";

const BASE_URL = "https://shelair.com.au";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  const [
    { data: posts },
    { data: services },
    { data: industries },
    { data: brands },
    { data: projects },
    { data: cities },
  ] = await Promise.all([
    withRetry(() =>
      supabase.from("posts").select("slug, updated_at").eq("published", true)
    ),
    withRetry(() =>
      supabase.from("services").select("slug, updated_at").not("slug", "is", null)
    ),
    withRetry(() =>
      supabase.from("industries").select("slug, updated_at")
    ),
    withRetry(() =>
      supabase.from("brands").select("slug, updated_at")
    ),
    withRetry(() =>
      supabase.from("projects").select("slug, updated_at")
    ),
    withRetry(() =>
      supabase
        .from("location_cities")
        .select("slug, updated_at, location_suburbs(slug, updated_at)")
        .order("position")
    ),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/` },
    { url: `${BASE_URL}/services` },
    { url: `${BASE_URL}/industries` },
    { url: `${BASE_URL}/projects` },
    { url: `${BASE_URL}/pricing` },
    { url: `${BASE_URL}/resources` },
    { url: `${BASE_URL}/contact` },
    { url: `${BASE_URL}/brands` },
    { url: `${BASE_URL}/locations` },
  ];

  const serviceRoutes = (services ?? []).map((s: any) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    lastModified: s.updated_at,
  }));

  const industryRoutes = (industries ?? []).map((i: any) => ({
    url: `${BASE_URL}/industries/${i.slug}`,
    lastModified: i.updated_at,
  }));

  const brandRoutes = (brands ?? []).map((b: any) => ({
    url: `${BASE_URL}/brands/${b.slug}`,
    lastModified: b.updated_at,
  }));

  const resourceRoutes = (posts ?? []).map((p: any) => ({
    url: `${BASE_URL}/resources/${p.slug}`,
    lastModified: p.updated_at,
  }));

  const projectRoutes = (projects ?? []).map((p: any) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: p.updated_at,
  }));

  const cityRoutes = (cities ?? []).map((city: any) => ({
    url: `${BASE_URL}/locations/${city.slug}`,
    lastModified: city.updated_at,
  }));

  const suburbRoutes = (cities ?? []).flatMap((city: any) =>
    (city.location_suburbs ?? []).map((suburb: any) => ({
      url: `${BASE_URL}/locations/${city.slug}/${suburb.slug}`,
      lastModified: suburb.updated_at,
    }))
  );

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...brandRoutes,
    ...resourceRoutes,
    ...projectRoutes,
    ...cityRoutes,
    ...suburbRoutes,
  ];
}

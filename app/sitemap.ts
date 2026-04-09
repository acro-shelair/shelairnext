import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

const BASE_URL = "https://shelair.com.au";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  async function query<T>(label: string, q: PromiseLike<{ data: T; error: any }>) {
    const { data, error } = await q;
    if (error) console.error(`[sitemap] ${label} query failed:`, error.message);
    return data;
  }

  const [posts, services, industries, brands, projects, cities] =
    await Promise.all([
      query("posts", supabase.from("posts").select("slug, updated_at").eq("published", true)),
      query("services", supabase.from("services").select("slug, updated_at").not("slug", "is", null)),
      query("industries", supabase.from("industries").select("slug, updated_at")),
      query("brands", supabase.from("brands").select("slug, updated_at")),
      query("projects", supabase.from("projects").select("slug, updated_at")),
      query("cities", supabase.from("location_cities").select("slug, updated_at, location_suburbs(slug, updated_at)").order("position")),
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
    { url: `${BASE_URL}/process` },
    { url: `${BASE_URL}/privacy` },
    { url: `${BASE_URL}/terms` },
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

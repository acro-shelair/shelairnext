import type { SupabaseClient } from "@supabase/supabase-js";

export interface ServiceStat   { value: string; label: string }
export interface ServiceStep   { step: string; title: string; desc: string }
export interface ServiceFaq    { q: string; a: string }
export interface ServiceRelated { slug: string; title: string; desc: string }

export interface Service {
  id: string;
  icon_name: string;
  title: string;
  description: string;
  position: number;
  // Detail page fields (null until set in admin)
  slug: string | null;
  subtitle: string;
  hero_desc: string;
  meta_description: string;
  overview: string;
  benefits: string[];
  stats: ServiceStat[];
  process_steps: ServiceStep[];
  faqs: ServiceFaq[];
  related_service_slugs: string[];
  highlighted: boolean;
}

export async function getAllServices(supabase: SupabaseClient): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("position");
  if (error) throw error;
  return data ?? [];
}

export async function getServiceById(supabase: SupabaseClient, id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getServiceBySlug(supabase: SupabaseClient, slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

// ── Industries ────────────────────────────────────────────────────────────────

export interface IndustryChallenge { title: string; desc: string }
export interface IndustryService   { icon_name: string; title: string; desc: string }
export interface IndustryCaseStudy { company: string; challenge: string; solution: string; result: string }

export interface Industry {
  id: string;
  slug: string;
  icon_name: string;
  title: string;
  short_desc: string;
  description: string;
  features: string[];
  position: number;
  // Detail page
  subtitle: string;
  hero_desc: string;
  meta_description: string;
  stats: ServiceStat[];
  challenges: IndustryChallenge[];
  industry_services: IndustryService[];
  case_study: IndustryCaseStudy | null;
  related_industry_slugs: string[];
  image_url: string | null;
}

export async function getAllIndustries(supabase: SupabaseClient): Promise<Industry[]> {
  const { data, error } = await supabase
    .from("industries").select("*").order("position");
  if (error) throw error;
  return data ?? [];
}

export async function getIndustryById(supabase: SupabaseClient, id: string): Promise<Industry | null> {
  const { data, error } = await supabase
    .from("industries").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getIndustryBySlug(supabase: SupabaseClient, slug: string): Promise<Industry | null> {
  const { data, error } = await supabase
    .from("industries").select("*").eq("slug", slug).single();
  if (error) return null;
  return data;
}

// ── Brands ───────────────────────────────────────────────────────────────────

export interface BrandIssue   { title: string; desc: string }
export interface BrandRelated { slug: string; name: string; desc: string }

export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string;
  speciality: string;
  detail: string;
  tagline: string;
  hero_desc: string;
  about: string;
  stats: ServiceStat[];
  common_issues: BrandIssue[];
  services_offered: string[];
  product_types: string[];
  related_brands: BrandRelated[];
  position: number;
}

export interface OtherBrand {
  id: string;
  name: string;
  category: string;
  position: number;
}

export async function getAllBrands(supabase: SupabaseClient): Promise<Brand[]> {
  const { data, error } = await supabase.from("brands").select("*").order("position");
  if (error) throw error;
  return data ?? [];
}

export async function getBrandById(supabase: SupabaseClient, id: string): Promise<Brand | null> {
  const { data, error } = await supabase.from("brands").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getBrandBySlug(supabase: SupabaseClient, slug: string): Promise<Brand | null> {
  const { data, error } = await supabase.from("brands").select("*").eq("slug", slug).single();
  if (error) return null;
  return data;
}

export async function getAllOtherBrands(supabase: SupabaseClient): Promise<OtherBrand[]> {
  const { data, error } = await supabase.from("other_brands").select("*").order("position");
  if (error) return [];
  return data ?? [];
}

// ── Locations ────────────────────────────────────────────────────────────────

export interface LocationStat { label: string; value: string }

export interface LocationCity {
  id: string;
  slug: string;
  name: string;
  region_description: string;
  stats: LocationStat[];
  zones: string[];
  sample_suburbs: string[];
  position: number;
  location_suburbs?: LocationSuburb[];
}

export interface LocationSuburb {
  id: string;
  city_id: string;
  slug: string;
  name: string;
  zone: string;
  business_types: string;
  venue_types: string[];
  local_context_text: string;
  nearby_suburbs: string[];
  stats: LocationStat[];
  position: number;
}

export async function getAllCities(supabase: SupabaseClient): Promise<LocationCity[]> {
  const { data, error } = await supabase
    .from("location_cities").select("*").order("position");
  if (error) return [];
  return data ?? [];
}

export async function getCityWithSuburbs(supabase: SupabaseClient, slug: string): Promise<LocationCity | null> {
  const { data, error } = await supabase
    .from("location_cities")
    .select("*, location_suburbs(*)")
    .eq("slug", slug)
    .single();
  if (error) return null;
  if (data?.location_suburbs) {
    data.location_suburbs = [...data.location_suburbs].sort(
      (a: LocationSuburb, b: LocationSuburb) => a.position - b.position
    );
  }
  return data;
}

export async function getSuburbWithCity(
  supabase: SupabaseClient,
  citySlug: string,
  suburbSlug: string
): Promise<{ city: LocationCity; suburb: LocationSuburb } | null> {
  const city = await getCityWithSuburbs(supabase, citySlug);
  if (!city) return null;
  const suburb = city.location_suburbs?.find((s) => s.slug === suburbSlug);
  if (!suburb) return null;
  return { city, suburb };
}

// ── Site Settings ────────────────────────────────────────────────────────────

export interface FooterLink { label: string; href: string }

export interface SiteSettings {
  id: string;
  phone: string;
  email: string;
  address: string;
  abn: string;
  tagline: string;
  facebook_url: string;
  linkedin_url: string;
  instagram_url: string;
  footer_company_links: FooterLink[];
  business_hours: string;
  emergency_text: string;
  updated_at: string;
}

export async function getSiteSettings(supabase: SupabaseClient): Promise<SiteSettings | null> {
  const { data } = await supabase.from("site_settings").select("*").limit(1).single();
  return data ?? null;
}

// ── FAQs ─────────────────────────────────────────────────────────────────────

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  position: number;
}

export async function getAllFaqs(supabase: SupabaseClient): Promise<FAQ[]> {
  const { data } = await supabase.from("faqs").select("*").order("position");
  return data ?? [];
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  position: number;
}

export async function getAllTestimonials(supabase: SupabaseClient): Promise<Testimonial[]> {
  const { data, error } = await supabase.from("testimonials").select("*").order("position");
  if (error) return [];
  return data ?? [];
}

// ── Pricing Tiers ────────────────────────────────────────────────────────────

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: string;
  unit: string;
  features: string[];
  popular: boolean;
  position: number;
}

export async function getAllPricingTiers(supabase: SupabaseClient): Promise<PricingTier[]> {
  const { data } = await supabase.from("pricing_tiers").select("*").order("position");
  return data ?? [];
}

// ── Projects ──────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  slug: string;
  title: string;
  type: string;
  size: string;
  description: string;
  location: string;
  client: string;
  challenge: string;
  solution: string;
  outcomes: string[];
  image_url: string | null;
  images: string[];
  featured: boolean;
  position: number;
}

export async function getAllProjects(supabase: SupabaseClient): Promise<Project[]> {
  const { data, error } = await supabase.from("projects").select("*").order("position");
  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedProjects(supabase: SupabaseClient): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("position")
    .limit(3);
  if (error) return [];
  return data ?? [];
}

export async function getProjectById(supabase: SupabaseClient, id: string): Promise<Project | null> {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getProjectsByLocation(
  supabase: SupabaseClient,
  cityName: string,
  limit = 3
): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .ilike("location", `%${cityName}%`)
    .order("position")
    .limit(limit);
  if (error) return [];
  return data ?? [];
}

export async function getProjectBySlug(supabase: SupabaseClient, slug: string): Promise<Project | null> {
  const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).single();
  if (error) return null;
  return data;
}

// ── Service slugs ─────────────────────────────────────────────────────────────

export async function getPublishedServiceSlugs(supabase: SupabaseClient): Promise<string[]> {
  const { data } = await supabase
    .from("services")
    .select("slug")
    .not("slug", "is", null);
  return (data ?? []).map((s) => s.slug).filter(Boolean);
}

import type { Metadata } from "next";
import Index from "@/components/pages/Index";
import { createAdminClient } from "@/lib/supabase/admin";
import { withRetry } from "@/lib/retry";
import { faqSection, testimonialsSection } from "@/data/home";
import { getAllIndustries, getAllBrands, getAllOtherBrands, getAllCities } from "@/lib/supabase/content";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Air Conditioning Installation & Service Brisbane, Gold Coast & Sunshine Coast",
  description:
    "Expert commercial air conditioning installation, service and maintenance across Brisbane, Gold Coast and Sunshine Coast. 30+ years experience. 5-year workmanship guarantee. Licensed HVAC technicians.",
  alternates: {
    canonical: "https://shelair.com.au/",
  },
  openGraph: {
    url: "https://shelair.com.au/",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Shelair",
  description:
    "Brisbane's trusted HVAC & air conditioning experts. Commercial air conditioning installation, service and maintenance across Brisbane, the Gold Coast and the Sunshine Coast. Part of the HVACR Group.",
  url: "https://shelair.com.au",
  telephone: "0732049511",
  email: "info@shelair.com.au",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Unit 3, 9-11 Imboon Street",
    addressLocality: "Deception Bay",
    addressRegion: "QLD",
    postalCode: "4508",
    addressCountry: "AU",
  },
  openingHours: "Mo-Fr 07:30-16:30",
  areaServed: ["Brisbane", "Gold Coast", "Sunshine Coast", "SE Queensland"],
  priceRange: "$$",
};

export default async function Home() {
  const supabase = createAdminClient();
  const [{ data: faqs }, { data: testimonials }, { data: pricingTiersData }, featuredProjects, industries, brands, otherBrands, cities] =
    await Promise.all([
      withRetry(() => supabase.from("faqs").select("*").order("position")),
      withRetry(() => supabase.from("testimonials").select("*").order("position")),
      withRetry(() => supabase.from("pricing_tiers").select("*").order("position")),
      withRetry(() =>
        supabase.from("projects").select("*").eq("featured", true).order("position").limit(3)
      ).then((r) => r.data ?? []).catch(() => []),
      withRetry(() => getAllIndustries(supabase)).catch(() => []),
      withRetry(() => getAllBrands(supabase)).catch(() => []),
      withRetry(() => getAllOtherBrands(supabase)).catch(() => []),
      withRetry(() => getAllCities(supabase)).catch(() => []),
    ]);

  const faqItems = faqs?.length
    ? faqs.map((f: { question: string; answer: string }) => ({ q: f.question, a: f.answer }))
    : faqSection.faqs;

  const reviewItems = testimonials?.length
    ? testimonials.map((t: { name: string; role: string; quote: string; rating?: number }) => ({ name: t.name, role: t.role, quote: t.quote, rating: t.rating ?? 5 }))
    : testimonialsSection.testimonials.map((t) => ({ ...t, rating: 5 }));

  const avgRating = reviewItems.reduce((sum: number, t: { rating: number }) => sum + t.rating, 0) / reviewItems.length;

  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Shelair",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviewItems.length,
      bestRating: 5,
    },
    review: reviewItems.map((t: { name: string; quote: string; rating: number }) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewBody: t.quote,
      reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f: { q: string; a: string }) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Index
        faqItems={faqItems}
        reviewItems={reviewItems}
        pricingTiers={pricingTiersData ?? []}
        featuredProjects={featuredProjects}
        industries={industries}
        brands={brands}
        otherBrands={otherBrands}
        cities={cities}
      />
    </>
  );
}

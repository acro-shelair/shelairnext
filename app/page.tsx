import type { Metadata } from "next";
import Index from "@/components/pages/Index";
import { createAdminClient } from "@/lib/supabase/admin";
import { withRetry } from "@/lib/retry";
import { getAllIndustries, getAllBrands, getAllOtherBrands } from "@/lib/supabase/content";

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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How quickly can you respond to an emergency breakdown?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer 24/7 emergency response and aim to have a technician on-site within 2–4 hours for urgent breakdowns across Brisbane, Gold Coast and Sunshine Coast.",
      },
    },
    {
      "@type": "Question",
      name: "Do you service all air conditioning brands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our ARC-licensed technicians are experienced with all major brands including Daikin, Mitsubishi Electric, Fujitsu, Actron, Samsung, LG, Panasonic, Hitachi and more.",
      },
    },
    {
      "@type": "Question",
      name: "What does a preventative maintenance plan include?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our maintenance plans include scheduled inspections, filter cleaning, coil checks, refrigerant level assessment, electrical checks and a full service report — typically twice yearly.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer a workmanship guarantee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All Shelair installations come with a 5-year workmanship guarantee in addition to any manufacturer warranty on parts and equipment.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide free quotes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We provide free, no-obligation quotes for all new installations and major works. Contact us to arrange a site visit.",
      },
    },
    {
      "@type": "Question",
      name: "What areas do you service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We service Brisbane, the Gold Coast and the Sunshine Coast, including surrounding suburbs across South East Queensland.",
      },
    },
  ],
};

export const revalidate = 600;

export default async function Home() {
  const supabase = createAdminClient();
  const [{ data: pricingTiersData }, featuredProjects, industries, brands, otherBrands] = await Promise.all([
    withRetry(() => supabase.from("pricing_tiers").select("*").order("position")),
    withRetry(() =>
      supabase.from("projects").select("*").eq("featured", true).order("position").limit(3)
    ).then((r) => r.data ?? []).catch(() => []),
    withRetry(() => getAllIndustries(supabase)).catch(() => []),
    withRetry(() => getAllBrands(supabase)).catch(() => []),
    withRetry(() => getAllOtherBrands(supabase)).catch(() => []),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Index
        pricingTiers={pricingTiersData ?? []}
        featuredProjects={featuredProjects}
        industries={industries}
        brands={brands}
        otherBrands={otherBrands}
      />
    </>
  );
}

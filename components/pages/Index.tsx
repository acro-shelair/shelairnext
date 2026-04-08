"use client";

import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import CredentialsStrip from "@/components/home/CredentialsStrip";
import type { PricingTier, Project, Industry, Brand, OtherBrand } from "@/lib/supabase/content";

const ProblemSection = dynamic(
  () => import("@/components/home/ProblemSection")
);
const SolutionSection = dynamic(
  () => import("@/components/home/SolutionSection")
);
const CapabilitiesGrid = dynamic(
  () => import("@/components/home/CapabilitiesGrid")
);
const WorkmanshipGuarantee = dynamic(
  () => import("@/components/home/WorkmanshipGuarantee")
);
const ProcessTimeline = dynamic(
  () => import("@/components/home/ProcessTimeline")
);
const IndustryCards = dynamic(() => import("@/components/home/IndustryCards"));
const BrandsSection = dynamic(() => import("@/components/home/BrandsSection"));
const ProjectsSection = dynamic(
  () => import("@/components/home/ProjectsSection")
);
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  ssr: false,
});
const ClientsSection = dynamic(
  () => import("@/components/home/ClientsSection")
);
const LocationsSection = dynamic(
  () => import("@/components/home/LocationsSection")
);
const PricingSection = dynamic(
  () => import("@/components/home/PricingSection")
);
const CTABanner = dynamic(() => import("@/components/home/CTABanner"));
const FAQSection = dynamic(() => import("@/components/home/FAQSection"), {
  ssr: false,
});

interface IndexProps {
  pricingTiers: PricingTier[];
  featuredProjects: Project[];
  industries: Industry[];
  brands: Brand[];
  otherBrands: OtherBrand[];
}

const Index = ({ pricingTiers, featuredProjects, industries, brands, otherBrands }: IndexProps) => (
  <Layout>
    <Hero />
    <TrustBar />
    <ProblemSection />
    <SolutionSection />
    <CapabilitiesGrid />
    <CredentialsStrip />
    <WorkmanshipGuarantee />
    <ProcessTimeline />
    <IndustryCards industries={industries} />
    <BrandsSection brands={brands} otherBrands={otherBrands} />
    <ProjectsSection projects={featuredProjects} />
    <Testimonials />
    <ClientsSection />
    <LocationsSection />
    <PricingSection initialTiers={pricingTiers} />
    <CTABanner />
    <FAQSection />
  </Layout>
);

export default Index;

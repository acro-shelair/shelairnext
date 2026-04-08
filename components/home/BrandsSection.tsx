"use client";

import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { featuredBrands as fallbackBrands, otherBrandNames as fallbackOtherBrands, brandsHomeSection } from "@/data/brands";
import type { Brand, OtherBrand } from "@/lib/supabase/content";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.08 },
  }),
};

interface BrandsSectionProps {
  brands?: Brand[];
  otherBrands?: OtherBrand[];
}

const BrandsSection = ({ brands, otherBrands }: BrandsSectionProps) => {
  const featured = brands?.length
    ? brands.map((b) => ({ slug: b.slug, name: b.name, desc: b.description, speciality: b.speciality }))
    : fallbackBrands;
  const others = otherBrands?.length
    ? otherBrands.map((b) => b.name)
    : fallbackOtherBrands;

  return (
  <section className="section-padding bg-background">
    <div className="container-narrow">
      <motion.div
        className="text-center mb-12 md:mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4">
          <Wrench className="w-3 h-3" /> {brandsHomeSection.badge}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          {brandsHomeSection.heading}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {brandsHomeSection.subheading}
        </p>
      </motion.div>

      {/* Featured brand cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {featured.map((brand, i) => (
          <motion.div
            key={brand.slug}
            custom={i}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Link
              href={`/brands/${brand.slug}`}
              className="block bg-card rounded-xl p-7 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group h-full"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Wrench className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                  {brand.speciality}
                </span>
              </div>
              <h3 className="text-xl font-extrabold mb-2 group-hover:text-primary transition-colors duration-200">
                {brand.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {brand.desc}
              </p>
              <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                View {brand.name} Services <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Other brands */}
      <motion.div
        className="bg-background rounded-xl border border-border px-8 py-6 text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Also Servicing
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {others.map((brand) => (
            <span
              key={brand}
              className="px-3 py-1.5 bg-secondary border border-border rounded-full text-sm font-medium text-muted-foreground"
            >
              {brand}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
  );
};

export default BrandsSection;

"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { LocationCity } from "@/lib/supabase/content";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
  }),
};

const LocationsSection = ({ cities }: { cities: LocationCity[] }) => (
  <section className="section-padding bg-secondary">
    <div className="container-narrow">
      <motion.div
        className="text-center mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
          <MapPin className="w-3.5 h-3.5" /> Service Areas
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Air Conditioning Service Near You
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          24/7 emergency service and installation across Brisbane, the Gold
          Coast, and the Sunshine Coast. Find your local team.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {cities.map((city, i) => (
          <motion.div
            key={city.slug}
            custom={i}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Link
              href={`/locations/${city.slug}`}
              className="block bg-card rounded-2xl p-8 border border-border shadow-sm group hover:border-primary/20 h-full"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-extrabold mb-2">{city.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {city.region_description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {city.sample_suburbs.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
              <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                View {city.name} areas <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center mt-12"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Link
          href="/locations"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
        >
          View all service areas <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default LocationsSection;

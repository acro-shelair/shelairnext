"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import type { PricingTier } from "@/lib/supabase/content";
import { pricingTiers as fallbackTiers, pricingPage } from "@/data/pricing";

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.1 },
  }),
};

const PricingSection = ({ initialTiers }: { initialTiers: PricingTier[] }) => {
  const items: PricingTier[] = initialTiers.length
    ? initialTiers
    : fallbackTiers.map((t, i) => ({
        id: String(i),
        position: i,
        name: t.name,
        description: t.description,
        price: t.price,
        unit: t.unit,
        features: t.features,
        popular: t.popular ?? false,
      }));

  return (
    <section className="section-padding bg-secondary">
      <div className="container-narrow">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4">
            {pricingPage.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {pricingPage.heading}
          </h2>
          <p className="text-muted-foreground text-lg">
            {pricingPage.subheading}
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.div
              key={t.id}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className={`bg-card rounded-xl p-8 border shadow-sm relative ${
                t.popular ? "border-primary shadow-md ring-1 ring-primary/20" : "border-border"
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 gradient-cta text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="font-bold text-xl mb-2">{t.name}</h3>
              {t.description && (
                <p className="text-sm text-muted-foreground mb-4">{t.description}</p>
              )}
              <div className="text-3xl font-extrabold mb-1">{t.price}</div>
              <p className="text-sm text-muted-foreground mb-6">{t.unit}</p>
              <ul className="space-y-3 mb-8">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="w-full cursor-pointer"
                variant={t.popular ? "default" : "outline"}
              >
                <Link href="/contact">
                  Get a Quote <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <ScrollReveal className="text-center mt-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4"
          >
            View full pricing details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PricingSection;

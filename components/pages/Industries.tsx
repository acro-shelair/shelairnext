"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import type { Industry } from "@/lib/supabase/content";
import { getIcon } from "@/app/admin/services/icons";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const featureVariant: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

const featureStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const Industries = ({ industries }: { industries: Industry[] }) => (
  <Layout>
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div
          className="max-w-3xl mb-14"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4"
          >
            Industries
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold mb-6">
            Commercial Refrigeration, HVAC & Beer Systems
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground">
            Repairs, maintenance, installation and design-and-construct
            solutions built around uptime, compliance, and the operational
            demands of your business.
          </motion.p>
        </motion.div>

        <div className="space-y-6">
          {industries.map((ind, i) => {
            const Icon = getIcon(ind.icon_name);
            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -32 : 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                {ind.image_url && (
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image
                      src={ind.image_url}
                      alt={ind.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="grid lg:grid-cols-2 gap-8 items-center p-8 md:p-10">
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-extrabold mb-3">{ind.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {ind.description || ind.short_desc}
                    </p>
                    <Button asChild className="cursor-pointer">
                      <Link href="/contact">
                        Get a Service Quote <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <motion.div
                    className="grid grid-cols-2 gap-3"
                    variants={featureStagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    {ind.features.map((f) => (
                      <motion.div
                        key={f}
                        variants={featureVariant}
                        className="bg-secondary rounded-lg px-4 py-3 text-sm font-medium text-center border border-border"
                      >
                        {f}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
    <CTABanner />
  </Layout>
);

export default Industries;

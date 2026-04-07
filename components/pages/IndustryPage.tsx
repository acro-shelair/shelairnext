"use client";

import React from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import type { Industry } from "@/lib/supabase/content";
import { getIcon } from "@/app/admin/services/icons";

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

type RelatedIndustry = { slug: string; title: string; description: string };

const IndustryPage = ({
  industry,
  relatedIndustries,
}: {
  industry: Industry;
  relatedIndustries: RelatedIndustry[];
}) => {
  const challenges       = (industry.challenges        ?? []) as { title: string; desc: string }[];
  const industryServices = (industry.industry_services ?? []) as { icon_name: string; title: string; desc: string }[];
  const stats            = (industry.stats             ?? []) as { value: string; label: string }[];
  const caseStudy        = industry.case_study as { company: string; challenge: string; solution: string; result: string } | null;

  return (
    <Layout>

      {/* Breadcrumb */}
      <section className="bg-secondary px-6 py-4">
        <div className="container-narrow">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link href="/industries">Industries</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{industry.subtitle || industry.title}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div className="max-w-3xl" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              {industry.subtitle || industry.title}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">{industry.title}</h1>
            <p className="text-lg text-muted-foreground mb-8">{industry.hero_desc || industry.description}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/contact">Get a Quote <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
              <Button asChild size="lg" variant="destructive" className="gradient-cta border-0">
                <a href="tel:0732049511"><Phone className="w-4 h-4 mr-2" /> 07 3204 9511</a>
              </Button>
            </div>
          </motion.div>

          {industry.image_url && (
            <motion.div
              className="relative mt-12 rounded-2xl overflow-hidden shadow-lg h-72 md:h-96"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Image
                src={industry.image_url}
                alt={industry.title}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover"
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="bg-secondary py-8 px-6">
          <div className="container-narrow grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Challenges */}
      {challenges.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-narrow">
            <motion.div className="mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold mb-4">Your Challenges</h2>
              <p className="text-muted-foreground">We understand the unique pressures facing {(industry.subtitle || industry.title).toLowerCase()} businesses.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {challenges.map((c, i) => (
                <motion.div
                  key={c.title}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-card rounded-2xl p-6 border border-border h-full"
                >
                  <h3 className="font-bold mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {industryServices.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.div className="text-center mb-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">How We Help</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industryServices.map((s, i) => {
                const ServiceIcon = getIcon(s.icon_name);
                return (
                  <motion.div
                    key={s.title}
                    custom={i}
                    variants={cardVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    whileHover={{ y: -4 }}
                    className="bg-card rounded-2xl p-6 border border-border h-full"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <ServiceIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Case Study */}
      {caseStudy?.company && (
        <section className="section-padding bg-background">
          <div className="container-narrow max-w-4xl">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="bg-card rounded-2xl border border-border p-8 md:p-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
                  Case Study
                </div>
                <h3 className="text-2xl font-extrabold mb-6">{caseStudy.company}</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Challenge</h4>
                    <p className="text-sm leading-relaxed">{caseStudy.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Solution</h4>
                    <p className="text-sm leading-relaxed">{caseStudy.solution}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Result</h4>
                    <p className="text-sm leading-relaxed font-medium">{caseStudy.result}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Related Industries */}
      {relatedIndustries.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.div className="mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold">Other Industries We Serve</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedIndustries.map((ri, i) => (
                <motion.div
                  key={ri.slug}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Link href={`/industries/${ri.slug}`} className="block bg-card rounded-2xl p-8 border border-border shadow-sm group hover:border-primary/20 h-full">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{ri.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{ri.description}</p>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </Layout>
  );
};

export default IndustryPage;

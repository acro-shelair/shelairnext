"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, CheckCircle, Wrench } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import type { Brand } from "@/lib/supabase/content";

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

const BrandPage = ({ brand }: { brand: Brand }) => {
  const stats         = (brand.stats          ?? []) as { value: string; label: string }[];
  const commonIssues  = (brand.common_issues  ?? []) as { title: string; desc: string }[];
  const relatedBrands = (brand.related_brands ?? []) as { slug: string; name: string; desc: string }[];

  return (
    <Layout>

      {/* Breadcrumb */}
      <section className="bg-secondary px-6 py-4">
        <div className="container-narrow">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link href="/brands">Brands</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{brand.name}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div className="max-w-3xl" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              {brand.name} Specialist
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">{brand.tagline || brand.name}</h1>
            <p className="text-lg text-muted-foreground mb-8">{brand.hero_desc || brand.description}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/contact">Book a {brand.name} Service <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
              <Button asChild size="lg" variant="destructive" className="gradient-cta border-0">
                <a href="tel:0732049511"><Phone className="w-4 h-4 mr-2" /> 07 3204 9511</a>
              </Button>
            </div>
          </motion.div>
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

      {/* About + Product Types */}
      {(brand.about || brand.product_types?.length > 0) && (
        <section className="section-padding bg-background">
          <div className="container-narrow grid lg:grid-cols-2 gap-12 items-start">
            {brand.about && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2 className="text-3xl font-extrabold mb-4">Why Choose a {brand.name} Specialist?</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{brand.about}</p>
                <Button asChild variant="outline"><Link href="/contact">Discuss Your {brand.name} System <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
              </motion.div>
            )}
            {brand.product_types?.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ delay: 0.1 }}>
                <div className="bg-card rounded-2xl border border-border p-8">
                  <h3 className="font-bold text-lg mb-5">{brand.name} Products We Service</h3>
                  <ul className="space-y-3">
                    {brand.product_types.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Common Issues */}
      {commonIssues.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.div className="text-center mb-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Common {brand.name} Issues We Fix</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Our technicians are trained to diagnose and resolve these common {brand.name} faults quickly and correctly.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commonIssues.map((issue, i) => (
                <motion.div
                  key={issue.title}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-card rounded-2xl p-6 border border-border h-full"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{issue.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{issue.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Offered */}
      {brand.services_offered?.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-narrow max-w-3xl">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold mb-8">Our {brand.name} Services</h2>
              <div className="bg-card rounded-2xl border border-border p-8">
                <ul className="space-y-3">
                  {brand.services_offered.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Related Brands */}
      {relatedBrands.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.div className="mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold">Other Brands We Service</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedBrands.map((rb, i) => (
                <motion.div
                  key={rb.slug}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Link href={`/brands/${rb.slug}`} className="block bg-card rounded-2xl p-8 border border-border shadow-sm group hover:border-primary/20 h-full">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{rb.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{rb.desc}</p>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      View {rb.name} Services <ArrowRight className="w-4 h-4" />
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

export default BrandPage;

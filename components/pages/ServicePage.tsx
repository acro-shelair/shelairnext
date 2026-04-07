"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, CheckCircle, Wrench } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import type { Service } from "@/lib/supabase/content";
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

type RelatedService = { slug: string | null; title: string; description: string };

const ServicePage = ({ service, relatedServices }: { service: Service; relatedServices: RelatedService[] }) => {
  const Icon = getIcon(service.icon_name);

  return (
    <Layout>

      {/* Breadcrumb */}
      <section className="bg-secondary px-6 py-4">
        <div className="container-narrow">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link href="/services">Services</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{service.subtitle || service.title}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div className="max-w-3xl" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Icon className="w-3.5 h-3.5" /> {service.subtitle || service.title}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">{service.title}</h1>
            <p className="text-lg text-muted-foreground mb-8">{service.hero_desc || service.description}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/contact">Get a Quote <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
              <Button asChild size="lg" variant="destructive" className="gradient-cta border-0">
                <a href="tel:0732049511"><Phone className="w-4 h-4 mr-2" /> 07 3204 9511</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {service.stats?.length > 0 && (
        <section className="bg-secondary py-8 px-6">
          <div className="container-narrow grid grid-cols-2 md:grid-cols-4 gap-6">
            {service.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Overview & Benefits */}
      {(service.overview || service.benefits?.length > 0) && (
        <section className="section-padding bg-background">
          <div className="container-narrow grid lg:grid-cols-2 gap-12 items-start">
            {service.overview && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2 className="text-3xl font-extrabold mb-4">What&apos;s Included</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{service.overview}</p>
                <Button asChild variant="outline"><Link href="/contact">Discuss Your Needs <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
              </motion.div>
            )}
            {service.benefits?.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ delay: 0.1 }}>
                <div className="bg-card rounded-2xl border border-border p-8">
                  <h3 className="font-bold text-lg mb-5">Key Benefits</h3>
                  <ul className="space-y-3">
                    {service.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Process */}
      {service.process_steps?.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.div className="text-center mb-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">How It Works</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process_steps.map((p, i) => (
                <motion.div
                  key={p.step}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-card rounded-2xl p-6 border border-border h-full"
                >
                  <div className="w-10 h-10 rounded-full gradient-cta text-primary-foreground flex items-center justify-center font-extrabold text-sm mb-4">{p.step}</div>
                  <h3 className="font-bold mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {service.faqs?.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-narrow max-w-3xl">
            <motion.div className="mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold mb-4">Frequently Asked Questions</h2>
            </motion.div>
            <div className="space-y-6">
              {service.faqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <h3 className="font-bold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.div className="mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold mb-4">Related Services</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedServices.map((rs, i) => (
                <motion.div
                  key={rs.slug}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Link href={`/services/${rs.slug}`} className="block bg-card rounded-2xl p-8 border border-border shadow-sm group hover:border-primary/20 h-full">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{rs.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{rs.description}</p>
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

export default ServicePage;

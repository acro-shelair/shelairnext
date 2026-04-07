"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, CheckCircle, MapPin, Building2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import type { Project } from "@/lib/supabase/content";

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

const ProjectPage = ({ project }: { project: Project }) => {
  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="bg-secondary px-6 py-4">
        <div className="container-narrow">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/projects">Projects</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{project.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div
            className="max-w-3xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              {project.type}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {project.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" /> {project.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-primary" /> {project.client}
              </span>
              {project.size && (
                <span className="bg-secondary px-3 py-1 rounded-full text-xs font-medium">
                  {project.size}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">
                  Discuss Your Project <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="destructive" className="gradient-cta border-0">
                <a href="tel:0732049511">
                  <Phone className="w-4 h-4 mr-2" /> 07 3204 9511
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover image */}
      {project.image_url && (
        <section className="px-6">
          <div className="container-narrow">
            <motion.div
              className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Challenge & Solution */}
      {(project.challenge || project.solution) && (
        <section className="section-padding bg-background">
          <div className="container-narrow grid lg:grid-cols-2 gap-12 items-start">
            {project.challenge && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-extrabold mb-4">The Challenge</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.challenge}
                </p>
              </motion.div>
            )}
            {project.solution && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-3xl font-extrabold mb-4">Our Solution</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.solution}
                </p>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Outcomes */}
      {project.outcomes?.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow max-w-3xl">
            <motion.div
              className="mb-8"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold mb-4">Key Outcomes</h2>
            </motion.div>
            <div className="bg-card rounded-2xl border border-border p-8">
              <ul className="space-y-4">
                {project.outcomes.map((outcome, i) => (
                  <motion.li
                    key={outcome}
                    custom={i}
                    variants={cardVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="flex items-start gap-3 text-sm"
                  >
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.images?.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-narrow">
            <motion.div
              className="mb-8"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold mb-4">Project Gallery</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((img, i) => (
                <motion.div
                  key={img}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="relative h-56 rounded-xl overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`${project.title} — image ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
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

export default ProjectPage;

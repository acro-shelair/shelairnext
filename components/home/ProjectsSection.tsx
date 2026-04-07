"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Briefcase } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { projectsHomeSection } from "@/data/home";
import type { Project } from "@/lib/supabase/content";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.1 },
  }),
};

const ProjectsSection = ({ projects }: { projects: Project[] }) => {
  if (projects.length === 0) return null;

  return (
    <section className="section-padding bg-secondary">
      <div className="container-narrow">
        <motion.div
          className="text-center mb-12 md:mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4">
            <Briefcase className="w-3 h-3" /> {projectsHomeSection.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {projectsHomeSection.heading}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {projectsHomeSection.subheading}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <Link
                href={`/projects/${p.slug}`}
                className="block bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden group h-full"
              >
                {/* Cover image */}
                {p.image_url && (
                  <div className="relative w-full h-44 overflow-hidden bg-muted">
                    <Image
                      src={p.image_url}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {p.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{p.size}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-200">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.description}</p>
                  <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                    View Project <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Link
            href={projectsHomeSection.viewMoreHref}
            className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-all duration-200"
          >
            {projectsHomeSection.viewMoreLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;

"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import Image from "next/image";
import { ArrowRight, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CTABanner from "@/components/home/CTABanner";
import heroImg from "@/assets/hero-airconditioning.webp";
import { motion, Variants } from "framer-motion";
import type { Project } from "@/lib/supabase/content";
import { useDebounce } from "@/hooks/use-debounce";

const PROJECTS_PAGE_SIZE = 6;

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

const Projects = ({ projects }: { projects: Project[] }) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return projects;
    const q = debouncedQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q)
    );
  }, [projects, debouncedQuery]);

  const totalPages = Math.ceil(filtered.length / PROJECTS_PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice(
    (currentPage - 1) * PROJECTS_PAGE_SIZE,
    currentPage * PROJECTS_PAGE_SIZE
  );

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div
            className="max-w-3xl mb-16"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4"
            >
              Our Work
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-extrabold mb-6"
            >
              Commercial HVACR Projects Delivered Across South East Queensland
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg text-muted-foreground"
            >
              See how Shelair delivers refrigeration, air conditioning,
              ventilation and cold room projects for schools, hospitals,
              hospitality venues, retail, food production and commercial
              facilities.
            </motion.p>
          </motion.div>

          {/* Search */}
          <div className="relative max-w-md mb-10">
            <Search className="absolute left-4 top-1/2 ml-3 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search projects..."
              style={{ paddingLeft: "2.75rem" }}
              className="w-full pr-10 py-2.5 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
            {query && (
              <button
                onClick={() => handleQueryChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {paginated.length === 0 ? (
            <p className="text-muted-foreground">
              {debouncedQuery
                ? "No projects match your search."
                : "No projects published yet."}
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((p, i) => (
                <motion.div
                  key={p.id}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden group"
                >
                  <Link href={`/projects/${p.slug}`} className="block h-full">
                    <div className="h-48 overflow-hidden">
                      <Image
                        src={p.image_url || heroImg}
                        alt={p.title}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {p.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {p.size}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {p.description}
                      </p>
                      <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Project <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-14">
              {currentPage > 1 ? (
                <button
                  onClick={() => setPage(currentPage - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
              ) : (
                <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium opacity-30 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" /> Previous
                </span>
              )}

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pg) => (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                        pg === currentPage
                          ? "gradient-cta text-primary-foreground"
                          : "border border-border bg-card hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {pg}
                    </button>
                  )
                )}
              </div>

              {currentPage < totalPages ? (
                <button
                  onClick={() => setPage(currentPage + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium opacity-30 cursor-not-allowed">
                  Next <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>
          )}

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/contact">
                Discuss Your Needs <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      <CTABanner />
    </Layout>
  );
};

export default Projects;

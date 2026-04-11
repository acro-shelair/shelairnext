"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Video,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Pin,
} from "lucide-react";
import type { Post } from "@/lib/supabase/posts";
import { RESOURCES_PAGE_SIZE } from "@/lib/supabase/posts";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import { useDebounce } from "@/hooks/use-debounce";

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

function TypeIcon({ type }: { type: string }) {
  if (type === "Guide") return <BookOpen className="w-3 h-3" />;
  if (type === "Video") return <Video className="w-3 h-3" />;
  return <FileText className="w-3 h-3" />;
}

const Resources = ({ posts }: { posts: Post[] }) => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, 300);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => { if (p.category) set.add(p.category); });
    return Array.from(set).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    let list = posts;
    if (activeCategory) {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          (p.category?.toLowerCase().includes(q) ?? false)
      );
    }
    return [...list].sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));
  }, [posts, debouncedQuery, activeCategory]);

  const totalPages = Math.ceil(filtered.length / RESOURCES_PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice(
    (currentPage - 1) * RESOURCES_PAGE_SIZE,
    currentPage * RESOURCES_PAGE_SIZE
  );

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat);
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
              Resources
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-extrabold mb-6"
            >
              Guides, Articles & Insights
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg text-muted-foreground"
            >
              Expert advice on commercial refrigeration, air conditioning, beer
              systems, ventilation and cold room systems to help you make
              informed decisions.
            </motion.p>
          </motion.div>

          {/* Search */}
          <div className="relative max-w-md mb-10">
            <Search className="absolute left-4 top-1/2 ml-3 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search articles..."
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

          {/* Category filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  !activeCategory
                    ? "gradient-cta text-primary-foreground"
                    : "border border-border bg-card hover:border-primary/40 hover:text-primary"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? "gradient-cta text-primary-foreground"
                      : "border border-border bg-card hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {paginated.length === 0 ? (
            <p className="text-muted-foreground">
              {debouncedQuery
                ? "No articles match your search."
                : "No articles published yet."}
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((a, i) => (
                <motion.div
                  key={a.slug}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Link
                    href={`/resources/${a.slug}`}
                    className="block bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group h-full overflow-hidden"
                  >
                    {a.image_url && (
                      <div className="relative w-full h-40 overflow-hidden">
                        <Image
                          src={a.image_url}
                          alt={a.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        {a.pinned && (
                          <span className="text-xs font-semibold text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30 px-2 py-1 rounded-full flex items-center gap-1">
                            <Pin className="w-3 h-3" /> Pinned
                          </span>
                        )}
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full flex items-center gap-1">
                          <TypeIcon type={a.type} /> {a.type}
                        </span>
                        {a.category && (
                          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                            {a.category}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {a.date}
                        </span>
                      </div>
                      <h3 className="font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                        {a.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {a.description}
                      </p>
                      <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="w-4 h-4" />
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
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                        p === currentPage
                          ? "gradient-cta text-primary-foreground"
                          : "border border-border bg-card hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {p}
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
        </div>
      </section>
      <CTABanner />
    </Layout>
  );
};

export default Resources;

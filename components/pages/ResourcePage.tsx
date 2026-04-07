"use client";

import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { ArrowLeft, ArrowRight, Clock, BookOpen, FileText, Video } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import type { Post, ContentBlock } from "@/lib/supabase/posts";
import { normalizeContent } from "@/lib/supabase/posts";

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

function TypeIcon({ type, className }: { type: string; className?: string }) {
  if (type === "Guide") return <BookOpen className={className} />;
  if (type === "Video") return <Video className={className} />;
  return <FileText className={className} />;
}

type RelatedPost = {
  id: string;
  slug: string;
  type: string;
  title: string;
  description: string;
  date: string;
};

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-muted-foreground leading-relaxed">{block.text}</p>
      );

    case "image":
      return (
        <figure className="my-2">
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden">
            <Image
              src={block.src}
              alt={block.alt || ""}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "blockquote":
      return (
        <blockquote className="border-l-4 border-primary/30 pl-5 py-1 my-2">
          <p className="text-muted-foreground leading-relaxed italic">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.cite && (
            <cite className="text-xs text-muted-foreground mt-1 block not-italic">
              — {block.cite}
            </cite>
          )}
        </blockquote>
      );

    case "list": {
      const Tag = block.style === "bullet" ? "ul" : "ol";
      const listClass =
        block.style === "bullet"
          ? "list-disc"
          : block.style === "number"
          ? "list-decimal"
          : "list-[lower-alpha]";
      return (
        <Tag className={`${listClass} pl-6 space-y-1.5 text-muted-foreground leading-relaxed`}>
          {block.items.map((item, k) => (
            <li key={k}>{item}</li>
          ))}
        </Tag>
      );
    }

    case "faq":
      return (
        <div className="space-y-4">
          {block.items.map((item, k) => (
            <div key={k} className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-bold mb-2">{item.question}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

type PostLink = { slug: string; title: string } | null;

const ResourcePage = ({
  post,
  relatedPosts,
  prevPost,
  nextPost,
}: {
  post: Post;
  relatedPosts: RelatedPost[];
  prevPost?: PostLink;
  nextPost?: PostLink;
}) => {
  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary px-6 py-3">
        <div className="container-narrow">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link href="/resources">Resources</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <div className="max-w-3xl">
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                  <TypeIcon type={post.type} className="w-3.5 h-3.5" /> {post.type}
                </span>
                <span className="text-sm text-muted-foreground">{post.date}</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" /> {post.read_time}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {post.description}
              </p>
            </motion.div>

            {post.image_url && (
              <motion.div
                className="relative mt-10 rounded-2xl overflow-hidden shadow-lg h-64 md:h-96"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                  className="object-cover"
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="pb-16 bg-background">
        <div className="container-narrow">
          <div className="max-w-3xl">
            <div className="border-t border-border pt-12 space-y-12">
              {post.post_sections?.map((section, i) => (
                <motion.div
                  key={section.id}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <h2 className="text-xl md:text-2xl font-extrabold mb-4">
                    {section.heading}
                  </h2>
                  <div className="space-y-4">
                    {normalizeContent(section.content).map((block, j) => (
                      <ContentBlockRenderer key={j} block={block} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Inline CTA */}
            <motion.div
              className="mt-12 bg-secondary rounded-2xl p-8"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-extrabold mb-2">Need expert advice for your business?</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Our technicians are available 24/7 for emergency repairs, preventative maintenance and system installations across Brisbane, Gold Coast and the Sunshine Coast.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/contact">Get a Quote <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
                <Button asChild variant="outline">
                  <a href="tel:0732049511">Call 07 3204 9511</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.h2
              className="text-2xl font-extrabold mb-8"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Related Articles
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((rel, i) => (
                <motion.div
                  key={rel.slug}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    href={`/resources/${rel.slug}`}
                    className="block bg-card rounded-2xl p-6 border border-border shadow-sm group hover:border-primary/20 h-full"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        <TypeIcon type={rel.type} className="w-3 h-3" /> {rel.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{rel.date}</span>
                    </div>
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                      {rel.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {rel.description}
                    </p>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Prev / Next navigation */}
      {(prevPost || nextPost) && (
        <section className="bg-background border-t border-border">
          <div className="container-narrow py-8">
            <div className="max-w-3xl flex items-stretch gap-4">
              {prevPost ? (
                <Link
                  href={`/resources/${prevPost.slug}`}
                  className="flex items-center gap-3 flex-1 min-w-0 group"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Previous Article</p>
                    <p className="font-bold group-hover:text-primary transition-colors truncate">
                      {prevPost.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextPost ? (
                <Link
                  href={`/resources/${nextPost.slug}`}
                  className="flex items-center gap-3 flex-1 min-w-0 justify-end text-right group"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Next Article</p>
                    <p className="font-bold group-hover:text-primary transition-colors truncate">
                      {nextPost.title}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </Layout>
  );
};

export default ResourcePage;

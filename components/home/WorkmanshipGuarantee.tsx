"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, XCircle, ShieldCheck, BadgeCheck, Wrench, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { workmanshipGuarantee } from "@/data/home";
import guaranteeBadge from "@/assets/5-year-workmanship.png";

const meansIcons = [ShieldCheck, BadgeCheck, Handshake];

const WorkmanshipGuarantee = () => {
  const {
    heading,
    subheading,
    bodyCopy,
    covered,
    labourGuarantee,
    meansForYou,
    notCovered,
    accountability,
    cta,
    blogStrip,
  } = workmanshipGuarantee;

  return (
    <section
      aria-label="5-Year Workmanship Guarantee by Shelair"
      className="bg-secondary"
    >
      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 md:px-8 py-14 md:py-20">
        <div className="container-narrow">
          <ScrollReveal className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-125" aria-hidden="true" />
              <Image
                src={guaranteeBadge}
                alt="5 Years Workmanship Guarantee"
                className="relative w-36 md:w-44 h-auto drop-shadow-2xl"
              />
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-primary mb-2">
                Our Promise to You
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-3">
                {heading}
              </h2>
              <p className="text-lg text-muted-foreground font-medium">{subheading}</p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ── Intro Body Copy ─────────────────────────────────────────────────── */}
      <div className="bg-card border-y border-border px-4 sm:px-6 md:px-8 py-10">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="max-w-3xl border-l-4 border-primary pl-6 flex flex-col gap-4">
              {bodyCopy.map((para, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-base md:text-lg font-semibold text-foreground leading-relaxed"
                      : "text-sm text-muted-foreground leading-relaxed"
                  }
                >
                  {para}
                </p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ── What's Covered + What This Means ────────────────────────────────── */}
      <div className="px-4 sm:px-6 md:px-8 py-12">
        <div className="container-narrow grid lg:grid-cols-2 gap-6">
          {/* What's Covered */}
          <ScrollReveal>
            <div className="bg-card rounded-2xl border border-border shadow-card h-full overflow-hidden">
              <div className="gradient-cta px-5 py-4">
                <h3 className="font-bold text-sm text-primary-foreground tracking-wide uppercase">
                  {covered.title}
                </h3>
              </div>
              <ul className="flex flex-col divide-y divide-border">
                {covered.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-secondary/60 transition-colors duration-150">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" aria-hidden="true" />
                    <span className="text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* What This Means for You */}
          <ScrollReveal delay={80}>
            <div className="flex flex-col gap-4 h-full">
              <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground px-1">
                {meansForYou.title}
              </p>
              {meansForYou.items.map((item, i) => {
                const Icon = meansIcons[i];
                return (
                  <div
                    key={i}
                    className="bg-card rounded-2xl border border-border p-5 flex items-start gap-4 shadow-card hover-lift group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
                      <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <p className="text-sm leading-snug pt-1">{item}</p>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ── 5-Year Labour Guarantee Banner ──────────────────────────────────── */}
      <div className="px-4 sm:px-6 md:px-8 pb-12">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="gradient-cta rounded-2xl overflow-hidden relative">
              {/* Decorative large number */}
              <span
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[160px] font-black leading-none text-white/5 select-none pointer-events-none"
                aria-hidden="true"
              >
                5
              </span>
              <div className="relative px-7 py-8 max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-4 h-4 text-primary-foreground/70" aria-hidden="true" />
                  <p className="text-xs font-bold tracking-widest uppercase text-primary-foreground/70">
                    {labourGuarantee.title}
                  </p>
                </div>
                <p className="text-primary-foreground text-base md:text-lg font-semibold leading-relaxed">
                  {labourGuarantee.body}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ── What's Not Covered ───────────────────────────────────────────────── */}
      <div className="bg-card border-y border-border px-4 sm:px-6 md:px-8 py-12">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <h3 className="font-extrabold text-xl mb-1">{notCovered.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">{notCovered.intro}</p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {notCovered.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 bg-secondary rounded-xl px-4 py-3 border border-border"
                  >
                    <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" aria-hidden="true" />
                    <span className="text-sm text-muted-foreground leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ── Built on Accountability ──────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 md:px-8 py-12">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto bg-card rounded-2xl border border-border shadow-card px-7 py-8 relative overflow-hidden">
              {/* Decorative accent strip */}
              <div className="absolute left-0 top-0 bottom-0 w-1 gradient-cta rounded-l-2xl" aria-hidden="true" />
              <h3 className="font-extrabold text-xl mb-4 pl-4">{accountability.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed pl-4">{accountability.body}</p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ── CTA Block ───────────────────────────────────────────────────────── */}
      <div className="bg-card border-t border-border px-4 sm:px-6 md:px-8 py-14">
        <div className="container-narrow">
          <ScrollReveal className="text-center">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-3">{cta.heading}</h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">{cta.body}</p>
            <Button asChild size="lg" className="mb-3">
              <Link href={cta.primary.href}>{cta.primary.label}</Link>
            </Button>
            <p className="text-xs text-muted-foreground/60 mt-4 mb-8">{cta.finePrint}</p>

            {/* ── Blog Callout Strip ──────────────────────────────────── */}
            <div className="border border-border bg-secondary rounded-xl px-5 py-5 max-w-3xl mx-auto text-left">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold mb-1">
                {blogStrip.prefix}
              </p>
              <strong className="block text-sm font-medium text-foreground mb-4">
                {blogStrip.headline}
              </strong>
              <nav aria-label="Workmanship guarantee related articles">
                <ul className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-2 gap-x-0">
                  {blogStrip.links.map((link, i) => (
                    <li key={link.href} className="flex items-center">
                      {i > 0 && (
                        <span className="hidden sm:inline-block mx-3 text-border select-none" aria-hidden="true">
                          ·
                        </span>
                      )}
                      <a
                        href={link.href}
                        className="text-xs text-primary hover:underline underline-offset-4 font-medium"
                      >
                        {link.label} →
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default WorkmanshipGuarantee;

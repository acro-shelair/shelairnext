"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-coldroom.jpg";
import { hero } from "@/data/home";

const trustItems = [
  "30+ Years Experience",
  "ARC Licensed",
  "5-Year Workmanship Guarantee",
  "24/7 Emergency Response",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          opacity: 0.45,
        }}
      />
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] gradient-cta" />

      <div className="container-narrow relative z-10 py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-5">
              <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-primary border border-primary/40 bg-primary/5 px-3 py-1.5 rounded">
                {hero.badge}
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] tracking-tight mb-4"
            >
              {hero.heading}
              <span className="text-primary">{hero.headingHighlight}</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg font-medium text-foreground/70 mb-2"
            >
              {hero.headingEnd}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-base text-muted-foreground leading-relaxed mb-7 max-w-lg"
            >
              {hero.subheading}
            </motion.p>

            <motion.ul
              variants={itemVariants}
              className="flex flex-col gap-2 mb-8"
            >
              {trustItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm font-medium text-foreground/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                asChild
                size="lg"
                className="text-base px-8 w-full sm:w-auto cursor-pointer"
              >
                <Link href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8 w-full sm:w-auto cursor-pointer"
              >
                <Link href={hero.secondaryCta.href}>
                  <Phone className="w-4 h-4 mr-2" />
                  {hero.secondaryCta.label}
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right column — image (desktop) */}
          <div className="relative hidden lg:block">
            {/* Offset decorative border */}
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border-2 border-primary/25 pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-foreground/10">
              <div className="relative w-full h-[520px]">
                <Image
                  src={heroImg}
                  alt="Commercial air conditioning installation by Shelair"
                  fill
                  className="object-cover"
                  priority
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent" />
              </div>
            </div>

            {/* Floating badge — top right */}
            <motion.div
              className="absolute -top-5 -right-6 gradient-cta text-primary-foreground rounded-xl px-4 py-3 shadow-xl"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: [0, -5, 0, 5, 0] }}
              transition={{
                opacity: { delay: 1.0, duration: 0.45 },
                y: { delay: 1.5, duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="text-sm font-bold">ARC Licensed</div>
              <div className="text-xs opacity-75">Licence 61340</div>
            </motion.div>

            {/* Floating badge — center left, pulsing */}
            <motion.div
              className="absolute top-1/2 -left-10 -translate-y-1/2 bg-background border border-border rounded-xl px-4 py-3 shadow-xl flex items-center gap-2"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: [0, -4, 0, 4, 0] }}
              transition={{
                opacity: { delay: 1.15, duration: 0.45 },
                x: { delay: 1.6, duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <div>
                <div className="text-sm font-bold text-foreground leading-none">24/7 Support</div>
                <div className="text-xs text-muted-foreground mt-0.5">Emergency Response</div>
              </div>
            </motion.div>

            {/* Floating credential — bottom right */}
            <motion.div
              className="absolute -bottom-6 -right-8 bg-background border border-border rounded-xl px-5 py-4 shadow-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: [0, 5, 0, -5, 0] }}
              transition={{
                opacity: { delay: 0.85, duration: 0.45 },
                y: { delay: 1.5, duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="text-3xl font-extrabold text-primary leading-none">
                30+
              </div>
              <div className="text-xs text-muted-foreground font-medium mt-1">
                Years of Excellence
              </div>
            </motion.div>
          </div>

          {/* Mobile image */}
          <div className="lg:hidden rounded-2xl overflow-hidden shadow-xl">
            <div className="relative w-full h-[240px] sm:h-[320px]">
              <Image
                src={heroImg}
                alt="Commercial air conditioning installation by Shelair"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

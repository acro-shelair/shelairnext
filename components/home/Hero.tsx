"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-coldroom.jpg";

const floatingStats = [
  {
    value: "5-Year",
    label: "Workmanship Guarantee",
    className: "absolute top-14 -right-10",
    motionStyle: { translateY: "-50%" },
    delay: 0.9,
    pulseDelay: 0.9,
  },
  {
    value: "30+",
    label: "Years Experience",
    className: "absolute left-2",
    motionStyle: { top: "50%", translateX: "-50%", translateY: "-50%" },
    delay: 0.7,
    pulseDelay: 0,
  },
  {
    value: "24/7",
    label: "Emergency Service",
    className: "absolute bottom-16 -right-10",
    motionStyle: { translateY: "50%" },
    delay: 1.1,
    pulseDelay: 1.8,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const Hero = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <motion.div
            className="max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 cursor-default"
            >
              Australia's Trusted HVAC & Air Conditioning Experts
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6"
            >
              Air Conditioning Installation & Service –
              <span className="text-primary">
                {" "}
                Brisbane, Gold Coast & Sunshine Coast
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md"
            >
              Design, installation, and maintenance across Brisbane, the Gold
              Coast & the Sunshine Coast. Backed by a 5-year workmanship
              guarantee.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row flex-wrap gap-3"
            >
              <Button
                asChild
                size="lg"
                className="text-base px-8 w-full sm:w-auto"
              >
                <Link href="/contact">
                  Get a Free Quote <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8 w-full sm:w-auto"
              >
                <Link href="/contact">
                  <Calendar className="w-4 h-4 mr-2" /> Book Site Inspection
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right column — image + floating stat cards */}
          <motion.div
            className="relative pt-4 pb-6 lg:pt-8 lg:pb-10 lg:pr-16"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-foreground/5 h-[240px] sm:h-[320px] lg:h-[500px]">
              <Image
                src={heroImg}
                alt="Commercial air conditioning installation by Shelair"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {floatingStats.map((stat) => (
              <motion.div
                key={stat.label}
                className={`hidden lg:block ${stat.className} z-10`}
                style={stat.motionStyle}
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: stat.delay,
                  ease: "backOut",
                }}
              >
                <motion.div
                  className="bg-background/85 backdrop-blur-md rounded-xl border border-border px-4 py-3 shadow-elevated text-center min-w-[110px]"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: stat.pulseDelay,
                  }}
                >
                  <span className="block text-2xl font-extrabold text-primary">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium mt-0.5 block whitespace-nowrap">
                    {stat.label}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

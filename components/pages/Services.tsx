"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Phone,
  CheckCircle,
  Wrench,
  Search,
  Monitor,
  FileText,
} from "lucide-react";
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

const steps = [
  {
    icon: Phone,
    num: "01",
    title: "You Call — 24/7",
    desc: "Speak to a real HVAC technician on our 24/7 emergency hotline. No call centres, no waiting. We triage your issue immediately.",
  },
  {
    icon: Search,
    num: "02",
    title: "We Dispatch & Diagnose",
    desc: "The nearest qualified technician is dispatched promptly. On-site fault diagnosis with full cost transparency before any work begins.",
  },
  {
    icon: Wrench,
    num: "03",
    title: "Repair or Install",
    desc: "We carry common parts and components on every truck. Most repairs and installations are completed on the first visit — minimising your downtime.",
  },
  {
    icon: CheckCircle,
    num: "04",
    title: "Test & Certify",
    desc: "System tested to manufacturer specifications. All work signed off by a licensed technician with full compliance documentation.",
  },
  {
    icon: Monitor,
    num: "05",
    title: "Workmanship Guarantee",
    desc: "Every installation is backed by our 5-year workmanship guarantee — so you can have complete confidence in the quality of our work.",
  },
  {
    icon: FileText,
    num: "06",
    title: "Ongoing Maintenance",
    desc: "Move from reactive to proactive with a scheduled maintenance plan. Extend system life, cut energy costs, and keep your business comfortable year-round.",
  },
];

const Services = ({ services }: { services: Service[] }) => (
  <Layout>
    {/* Hero */}
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
            <Wrench className="w-3.5 h-3.5" /> Our Services
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Air Conditioning Installation, Service & Repairs
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-muted-foreground"
          >
            From emergency callouts to full commercial installations and
            ongoing maintenance plans — one expert HVAC team for every need
            across Brisbane, Gold Coast & Sunshine Coast.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = getIcon(s.icon_name);
            return (
              <motion.div
                key={s.id}
                custom={i}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                <div className="flex flex-col h-full bg-card rounded-2xl p-8 border border-border shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-extrabold mb-3">{s.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {s.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Emergency Callout Banner */}
    <section className="bg-primary py-12 px-6">
      <div className="container-narrow flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-primary-foreground mb-2">
            Air Conditioning Emergency?
          </h2>
          <p className="text-primary-foreground/80">
            Call now for priority dispatch — fast response, 24/7 across
            South East Queensland.
          </p>
        </div>
        <Button asChild size="lg" variant="secondary" className="shrink-0">
          <a href="tel:0732049511">
            <Phone className="w-4 h-4 mr-2" /> 07 3204 9511
          </a>
        </Button>
      </div>
    </section>

    {/* All Brands Prose Block */}
    <section className="section-padding bg-background">
      <div className="container-narrow grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground leading-relaxed mb-4">
            We install and service all major air conditioning brands —
            Panasonic (our preferred supplier), Daikin, Mitsubishi Electric,
            Fujitsu, Samsung, LG, Toshiba and more. Whether it&apos;s a
            split system, ducted unit, VRV/VRF system or cassette —
            we&apos;ve installed it and we can fix it.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            When you need new HVAC capacity, we also design, supply and
            install complete systems for commercial buildings, offices,
            retail spaces, and industrial environments.
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="rounded-2xl overflow-hidden aspect-video bg-muted">
            <Image
              src="/hero.jpg"
              alt="Commercial air conditioning installation by Shelair"
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>

    {/* How We Deliver */}
    <section className="section-padding bg-secondary">
      <div className="container-narrow">
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            Our Process
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            How We Deliver Your Project
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A transparent, structured process that keeps you informed at
            every stage — from first call to final sign-off.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-card rounded-2xl p-6 border border-border h-full"
            >
              <div className="w-10 h-10 rounded-full gradient-cta text-primary-foreground flex items-center justify-center font-extrabold text-sm mb-4">
                {step.num}
              </div>
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <CTABanner />
  </Layout>
);

export default Services;

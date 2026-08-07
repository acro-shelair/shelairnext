"use client";

import { ShieldCheck, Zap, Star, Building2, Wrench, Clock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const capabilities = [
  {
    icon: Clock,
    title: "24/7 Emergency Service",
    desc: "Round-the-clock availability across Brisbane, Gold Coast and Sunshine Coast.",
  },
  {
    icon: Wrench,
    title: "All Major AC Brands",
    desc: "We install and service Panasonic, Daikin, Mitsubishi, Samsung, Fujitsu, LG, Toshiba, and more.",
  },
  {
    icon: ShieldCheck,
    title: "Licensed & ARC Approved",
    desc: "All work completed by licensed HVAC technicians; fully ARC authorised.",
  },
  {
    icon: Zap,
    title: "Energy Efficiency",
    desc: "System tune-ups and upgrades that cut energy costs and improve performance.",
  },
  {
    icon: Star,
    title: "5-Year Workmanship Guarantee",
    desc: "Every installation backed by a certified workmanship warranty for total peace of mind.",
  },
  {
    icon: Building2,
    title: "Commercial Focus",
    desc: "Built around the needs of facilities, hospitality, retail, education, healthcare and commercial property operators.",
  },
];

const CapabilitiesGrid = () => (
  <section className="section-padding bg-secondary">
    <div className="container-narrow">
      <ScrollReveal className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Why Businesses Trust Shelair
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Reliable service, fast response, and expert HVAC solutions that keep
          your business comfortable year-round.
        </p>
      </ScrollReveal>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((c, i) => (
          <ScrollReveal key={c.title} delay={i * 80}>
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover-lift h-full group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <c.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {c.desc}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default CapabilitiesGrid;

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, CheckCircle2 } from "lucide-react";
import heroImg from "@/assets/hero-airconditioning.webp";
import { hero } from "@/data/home";
import HeroBadges from "@/components/home/HeroBadges";

const trustItems = [
  "30+ Years Experience",
  "ARC Licensed",
  "5-Year Workmanship Guarantee",
  "24/7 Emergency Response",
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          opacity: 0.45,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-[3px] gradient-cta" />

      <div className="container-narrow relative z-10 py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="mb-5">
              <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-primary border border-primary/40 bg-primary/5 px-3 py-1.5 rounded">
                {hero.badge}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] tracking-tight mb-4">
              {hero.heading}
              <span className="text-primary">{hero.headingHighlight}</span>
            </h1>

            <p className="text-base md:text-lg font-medium text-foreground/70 mb-2">
              {hero.headingEnd}
            </p>

            <p className="text-base text-muted-foreground leading-relaxed mb-7 max-w-lg">
              {hero.subheading}
            </p>

            <ul className="flex flex-col gap-2 mb-8">
              {trustItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm font-medium text-foreground/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
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
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border-2 border-primary/25 pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-foreground/10">
              <div className="relative w-full h-[520px]">
                <Image
                  src={heroImg}
                  alt="Commercial air conditioning installation by Shelair"
                  fill
                  className="object-cover"
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 1px, 50vw"
                  placeholder="blur"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent" />
              </div>
            </div>

            <HeroBadges />
          </div>

          <div className="lg:hidden rounded-2xl overflow-hidden shadow-xl">
            <div className="relative w-full h-[240px] sm:h-[320px]">
              <Image
                src={heroImg}
                alt="Commercial air conditioning installation by Shelair"
                fill
                className="object-cover"
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 1px, 100vw"
                placeholder="blur"
                quality={75}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

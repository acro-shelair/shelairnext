"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const DEFAULT_HEADING = "Need Refrigeration, HVAC or Beer System Help?";
const DEFAULT_DESCRIPTION = "Fast Repairs, servicing and installations across Brisbane, the Gold Coast and Sunshine Coast.";
const DEFAULT_BUTTON_TEXT = "Get a Free Quote";
const DEFAULT_BUTTON_LINK = "/contact";

const CTABanner = ({ heading, description, buttonText, buttonLink }: { heading?: string; description?: string; buttonText?: string; buttonLink?: string }) => (
  <section className="section-padding">
    <div className="container-narrow">
      <ScrollReveal>
        <div className="gradient-cta rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-16 text-center text-primary-foreground hover-lift">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            {heading || DEFAULT_HEADING}
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
            {description || DEFAULT_DESCRIPTION}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-base px-8 font-semibold hover-scale w-full sm:w-auto"
            >
              <Link href={buttonLink || DEFAULT_BUTTON_LINK}>
                {buttonText || DEFAULT_BUTTON_TEXT} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground hover-scale w-full sm:w-auto"
            >
              <a href="tel:0732049511">
                <Phone className="w-4 h-4 mr-2" /> Call 07 3204 9511
              </a>
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default CTABanner;

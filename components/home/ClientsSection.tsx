"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { clientsSection } from "@/data/home";

import brisbanClub from "@/assets/clients/brisbane-club.webp";
import marriott from "@/assets/clients/client-marriot.webp";
import gambaro from "@/assets/clients/gambaro.webp";
import geebungRsl from "@/assets/clients/geebungrsl-logo-3.webp";
import kedron from "@/assets/clients/kedron-wavell.webp";
import norths from "@/assets/clients/norths.webp";
import orford from "@/assets/clients/orford.webp";
import stamford from "@/assets/clients/stamford-1.webp";
import Queensland from "@/assets/clients/queensland.webp";
import RoyalGolf from "@/assets/clients/royal-golf.webp";
import Brt from "@/assets/clients/brt-bg.webp";
import Churchie from "@/assets/clients/churchie.webp";
import HSW from "@/assets/clients/hsw-padded.webp";
import Sofitel from "@/assets/clients/sofitel-black.webp";

const clients = [
  { src: brisbanClub, alt: "Brisbane Club" },
  { src: marriott, alt: "Marriott" },
  { src: gambaro, alt: "Gambaro" },
  { src: geebungRsl, alt: "Geebung RSL" },
  { src: kedron, alt: "Kedron" },
  { src: norths, alt: "Norths" },
  { src: orford, alt: "Orford" },
  { src: stamford, alt: "Stamford" },
  { src: Queensland, alt: "Queensland" },
  { src: RoyalGolf, alt: "Royal Gold QLD" },
  { src: Brt, alt: "BRT" },
  { src: Churchie, alt: "Churchie" },
  { src: HSW, alt: "HSW" },
  { src: Sofitel, alt: "Sofitel" },
];

const ClientsSection = () => (
  <section className="bg-secondary py-12 sm:py-16">
    <div className="container-narrow px-4 sm:px-6">
      <ScrollReveal className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
          {clientsSection.eyebrow}
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold">
          {clientsSection.heading}
        </h2>
      </ScrollReveal>
    </div>
    <div
      className="marquee-wrapper relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, white 8%, white 92%, transparent)",
      }}
    >
      <div className="flex gap-4 animate-scroll w-max">
        {[...clients, ...clients].map((client, i) => (
          <div
            key={`${client.alt}-${i}`}
            className="flex items-center justify-center p-3 rounded-xl bg-background border border-border h-28 w-48 shrink-0 hover:border-primary/25 hover:shadow-sm transition-all duration-300"
          >
            <div className="relative w-full h-14">
              <Image
                src={client.src}
                alt={client.alt}
                fill
                className="object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                loading="lazy"
                sizes="192px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ClientsSection;

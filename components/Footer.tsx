"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Linkedin } from "lucide-react";
import shelairLogo from "@/assets/shelair-logo-web.png";

const Footer = () => (
  <footer className="bg-dark text-dark-foreground">
    <div className="container-narrow section-padding">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-xl mb-4">
            <Image
              src={shelairLogo}
              alt="Shelair"
              width={40}
              height={40}
              className="object-contain"
            />
            Shelair
          </div>
          <p className="text-dark-foreground/60 text-sm leading-relaxed mb-6">
            Shelair provides commercial air conditioning installation, service
            and maintenance across Brisbane, the Gold Coast, and the Sunshine
            Coast. Part of the HVACR Group.
          </p>
          <div className="flex flex-col gap-3 text-sm text-dark-foreground/60">
            <a
              href="tel:0732049511"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" /> 07 3204 9511
            </a>
            <a
              href="mailto:info@shelair.com.au"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" /> info@shelair.com.au
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Unit 3, 9–11 Imboon Street,
              Deception Bay QLD 4508
            </span>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <a
              href="https://www.facebook.com/shelair/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-lg bg-dark-foreground/10 flex items-center justify-center text-dark-foreground/60 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/shelair/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-lg bg-dark-foreground/10 flex items-center justify-center text-dark-foreground/60 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-dark-foreground/60">
            Services
          </h4>
          <ul className="space-y-2.5 text-sm text-dark-foreground/60">
            <li>
              <Link
                href="/services/air-conditioning-installation"
                className="hover:text-primary transition-colors"
              >
                Air Conditioning Installation
              </Link>
            </li>
            <li>
              <Link
                href="/services/air-conditioning-service-repairs"
                className="hover:text-primary transition-colors"
              >
                Air Conditioning Service & Repairs
              </Link>
            </li>
            <li>
              <a
                href="https://acrorefrigeration.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Commercial Refrigeration
              </a>
            </li>
            <li>
              <Link
                href="/services"
                className="hover:text-primary transition-colors"
              >
                Preventative Maintenance Plans
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-dark-foreground/60">
            Company
          </h4>
          <ul className="space-y-2.5 text-sm text-dark-foreground/60">
            <li>
              <Link
                href="/about"
                className="hover:text-primary transition-colors"
              >
                About Shelair
              </Link>
            </li>
            <li>
              <Link
                href="/resources"
                className="hover:text-primary transition-colors"
              >
                Shelair Insights
              </Link>
            </li>
            {/* <li>
              <Link href="/careers" className="hover:text-primary transition-colors">
                Careers
              </Link>
            </li> */}
            <li>
              <a
                href="https://hvacrgroup.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                HVACR Group
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-dark-foreground/60">
            Service Areas
          </h4>
          <ul className="space-y-2.5 text-sm text-dark-foreground/60">
            <li>
              <Link
                href="/locations/brisbane"
                className="hover:text-primary transition-colors"
              >
                Brisbane
              </Link>
            </li>
            <li>
              <Link
                href="/locations/gold-coast"
                className="hover:text-primary transition-colors"
              >
                Gold Coast
              </Link>
            </li>
            <li>
              <Link
                href="/locations/sunshine-coast"
                className="hover:text-primary transition-colors"
              >
                Sunshine Coast
              </Link>
            </li>
            <li>
              <Link
                href="/locations"
                className="hover:text-primary transition-colors"
              >
                All Locations
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-dark-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-dark-foreground/60">
        <p>
          © {new Date().getFullYear()} HVACR Pty Ltd. All rights reserved. ABN
          43 672 578 264
        </p>
        <div className="flex gap-6">
          <Link
            href="/privacy"
            className="hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";
import shelairLogo from "@/assets/shelair-logo-web.webp";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings, FooterLink } from "@/lib/supabase/content";

// ─── Admin login link (smart redirect) ────────────────────────────────────────

function AdminLink() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        setIsLoggedIn(!!user);
        setChecking(false);
      });
  }, []);

  if (checking) return null;

  return (
    <button
      onClick={() => router.push(isLoggedIn ? "/admin" : "/admin/login")}
      className="text-dark-foreground/30 hover:text-dark-foreground/60 transition-colors text-xs"
    >
      {isLoggedIn ? "Dashboard" : "Staff Login"}
    </button>
  );
}

// ─── Fallback while loading ────────────────────────────────────────────────────

const DEFAULTS = {
  phone: "0732049511",
  email: "info@shelair.com.au",
  address: "Unit 3, 9–11 Imboon Street, Deception Bay QLD 4508",
  abn: "43 672 578 264",
  tagline:
    "Shelair provides commercial air conditioning installation, service and maintenance across Brisbane, the Gold Coast, and the Sunshine Coast. Part of the HVACR Group.",
  facebook_url: "https://www.facebook.com/shelair/",
  linkedin_url: "https://www.linkedin.com/company/shelair/",
  instagram_url: "",
  footer_credentials:
    "ARCtick AU61340 · QBCC 15413155 · Electrical Contractor 92536 · NSW Contractor 479925C · NECA Member · Veteran Community Business",
  footer_partner_label: "HVACR Group",
  footer_partner_url: "https://hvacrgroup.com.au",
  footer_services_partner_label: "Commercial Refrigeration",
  footer_services_partner_url: "https://acrorefrigeration.com.au",
  footer_brand_name: "HVACR Pty Ltd",
  footer_heading_services: "Services",
  footer_heading_industries: "Service Areas",
  footer_heading_company: "Company",
  footer_brands_heading: "Our Brands",
  footer_brands_links: [
    { label: "Acro Refrigeration", href: "https://acrorefrigeration.com.au" },
    { label: "Koolacube", href: "https://koolacube.com.au" },
    { label: "HVACR Group", href: "https://hvacrgroup.com.au" },
  ] as FooterLink[],
  footer_company_links: [
    { label: "About Shelair", href: "/about" },
    { label: "Shelair Insights", href: "/resources" },
    { label: "Projects", href: "/projects" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact Us", href: "/contact" },
  ] as FooterLink[],
  footer_service_links: [
    {
      label: "Air Conditioning Installation",
      href: "/services/air-conditioning-installation",
    },
    {
      label: "Air Conditioning Service & Repairs",
      href: "/services/air-conditioning-service-repairs",
    },
    { label: "Preventative Maintenance Plans", href: "/services" },
  ] as FooterLink[],
  footer_industry_links: [
    { label: "Brisbane", href: "/locations/brisbane" },
    { label: "Gold Coast", href: "/locations/gold-coast" },
    { label: "Sunshine Coast", href: "/locations/sunshine-coast" },
    { label: "All Locations", href: "/locations" },
  ] as FooterLink[],
};

// ─── Footer ────────────────────────────────────────────────────────────────────

const Footer = () => {
  const [settings, setSettings] = useState<Partial<SiteSettings>>(DEFAULTS);
  const [services, setServices] = useState<
    { slug: string | null; title: string }[]
  >([]);
  const [industries, setIndustries] = useState<
    { slug: string; title: string }[]
  >([]);
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setSettings(data);
      });
    supabase
      .from("services")
      .select("slug, title")
      .not("slug", "is", null)
      .order("position")
      .limit(6)
      .then(({ data }) => {
        if (data) setServices(data);
      });
    supabase
      .from("industries")
      .select("slug, title")
      .order("position")
      .then(({ data }) => {
        if (data) setIndustries(data);
      });
  }, []);

  const phone = settings.phone ?? DEFAULTS.phone;
  const email = settings.email ?? DEFAULTS.email;
  const address = settings.address ?? DEFAULTS.address;
  const abn = settings.abn ?? DEFAULTS.abn;
  const tagline = settings.tagline ?? DEFAULTS.tagline;
  const fbUrl = settings.facebook_url ?? DEFAULTS.facebook_url;
  const liUrl = settings.linkedin_url ?? DEFAULTS.linkedin_url;
  const igUrl = settings.instagram_url ?? "";
  const companyLinks =
    (settings.footer_company_links as FooterLink[] | undefined) ??
    DEFAULTS.footer_company_links;
  const credentials = settings.footer_credentials ?? DEFAULTS.footer_credentials;
  const partnerLabel =
    settings.footer_partner_label ?? DEFAULTS.footer_partner_label;
  const partnerUrl = settings.footer_partner_url ?? DEFAULTS.footer_partner_url;
  const servicesPartnerLabel =
    settings.footer_services_partner_label ??
    DEFAULTS.footer_services_partner_label;
  const servicesPartnerUrl =
    settings.footer_services_partner_url ??
    DEFAULTS.footer_services_partner_url;
  const brandName = settings.footer_brand_name ?? DEFAULTS.footer_brand_name;
  const headingServices =
    settings.footer_heading_services ?? DEFAULTS.footer_heading_services;
  const headingIndustries =
    settings.footer_heading_industries ?? DEFAULTS.footer_heading_industries;
  const headingCompany =
    settings.footer_heading_company ?? DEFAULTS.footer_heading_company;
  const brandsHeading =
    settings.footer_brands_heading ?? DEFAULTS.footer_brands_heading;
  const brandsLinks =
    (settings.footer_brands_links as FooterLink[] | undefined) ??
    DEFAULTS.footer_brands_links;

  const serviceLinks =
    services.length > 0
      ? services.map((s) => ({
          label: s.title,
          href: s.slug ? `/services/${s.slug}` : "/services",
        }))
      : DEFAULTS.footer_service_links;

  const industryLinks =
    industries.length > 0
      ? industries.map((i) => ({
          label: i.title,
          href: `/industries/${i.slug}`,
        }))
      : DEFAULTS.footer_industry_links;

  return (
    <footer className="bg-dark text-dark-foreground">
      <div className="container-narrow section-padding">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-16 ${
            brandsLinks.length > 0 ? "lg:grid-cols-5" : "lg:grid-cols-4"
          }`}
        >
          {/* Brand + Contact */}
          <div>
            <div className="flex items-center gap-2 font-extrabold text-xl mb-4">
              <Image
                src={shelairLogo}
                alt="Shelair"
                width={240}
                height={96}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-dark-foreground/60 text-sm leading-relaxed mb-6">
              {tagline}
            </p>
            <div className="flex flex-col gap-3 text-sm text-dark-foreground/60">
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                {phone.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3")}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" /> {email}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {address}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {fbUrl && (
                <a
                  href={fbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-lg bg-dark-foreground/10 flex items-center justify-center text-dark-foreground/60 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {liUrl && (
                <a
                  href={liUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-lg bg-dark-foreground/10 flex items-center justify-center text-dark-foreground/60 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {igUrl && (
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg bg-dark-foreground/10 flex items-center justify-center text-dark-foreground/60 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-dark-foreground/40">
              {headingServices}
            </h4>
            <ul className="space-y-2.5 text-sm text-dark-foreground/60">
              {serviceLinks.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    className="hover:text-primary transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
              {servicesPartnerUrl && servicesPartnerLabel && (
                <li>
                  <a
                    href={servicesPartnerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {servicesPartnerLabel}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-dark-foreground/40">
              {headingIndustries}
            </h4>
            <ul className="space-y-2.5 text-sm text-dark-foreground/60">
              {industryLinks.map((i) => (
                <li key={i.label}>
                  <Link
                    href={i.href}
                    className="hover:text-primary transition-colors"
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-dark-foreground/40">
              {headingCompany}
            </h4>
            <ul className="space-y-2.5 text-sm text-dark-foreground/60">
              {companyLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {partnerUrl && partnerLabel && (
                <li>
                  <a
                    href={partnerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {partnerLabel}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Our Brands (external backlinks) */}
          {brandsLinks.length > 0 && (
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-dark-foreground/40">
                {brandsHeading}
              </h4>
              <ul className="space-y-2.5 text-sm text-dark-foreground/60">
                {brandsLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Credentials line */}
        <div className="border-t border-dark-foreground/10 pt-6 pb-4 text-center">
          <p className="text-[11px] text-dark-foreground/30 leading-relaxed">
            {credentials}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-foreground/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-dark-foreground/40">
          <p>
            © {new Date().getFullYear()} {brandName}. All rights reserved. ABN{" "}
            {abn}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <AdminLink />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

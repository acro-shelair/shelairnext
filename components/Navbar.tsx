"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  MapPin,
  Wrench,
  Building2,
  Tag,
  LayoutGrid,
  Briefcase,
  BookOpen,
  DollarSign,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import shelairLogo from "@/assets/shelair-logo-web.webp";

type DropdownKey = "services" | "industries" | "brands" | "locations" | "more";
type MenuItem = {
  label: string;
  href: string;
  topLink?: true;
  icon?: React.ReactNode;
  highlighted?: boolean;
  external?: true;
};
type DynamicItem = { slug: string; title: string; highlighted?: boolean };

const moreMenu: MenuItem[] = [
  {
    label: "Projects",
    href: "/projects",
    topLink: true,
    icon: <Briefcase className="w-3.5 h-3.5 text-primary shrink-0" />,
  },
  {
    label: "Shelair Insights",
    href: "/resources",
    topLink: true,
    icon: <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />,
  },
  {
    label: "Pricing",
    href: "/pricing",
    topLink: true,
    icon: <DollarSign className="w-3.5 h-3.5 text-primary shrink-0" />,
  },
];

const dropdownKeys: { key: DropdownKey; label: string }[] = [
  { key: "services", label: "Services" },
  { key: "industries", label: "Industries" },
  { key: "brands", label: "Brands" },
  { key: "locations", label: "Service Areas" },
  { key: "more", label: "More" },
];

const topIcon: Record<DropdownKey, React.ReactNode> = {
  services: <Wrench className="w-3.5 h-3.5 text-primary shrink-0" />,
  industries: <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />,
  brands: <Tag className="w-3.5 h-3.5 text-primary shrink-0" />,
  locations: <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />,
  more: <LayoutGrid className="w-3.5 h-3.5 text-primary shrink-0" />,
};

const morePaths = ["/projects", "/resources", "/pricing"];

function formatPhone(raw: string) {
  return raw.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3");
}

const Navbar = ({
  phone = "0732049511",
  serviceItems = [],
  industryItems = [],
  brandItems = [],
  cityItems = [],
}: {
  phone?: string;
  serviceItems?: DynamicItem[];
  industryItems?: DynamicItem[];
  brandItems?: DynamicItem[];
  cityItems?: DynamicItem[];
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(
    null
  );
  const [mobileExpanded, setMobileExpanded] = useState<DropdownKey | null>(
    null
  );
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  const serviceMenu: MenuItem[] = [
    { label: "All Services", href: "/services", topLink: true },
    ...serviceItems.map((s) => ({
      label: s.title,
      href: `/services/${s.slug}`,
      highlighted: s.highlighted,
    })),
  ];

  const industryMenu: MenuItem[] = [
    { label: "All Industries", href: "/industries", topLink: true },
    ...industryItems.map((i) => ({
      label: i.title,
      href: `/industries/${i.slug}`,
    })),
  ];

  const brandMenu: MenuItem[] = [
    { label: "All Brands", href: "/brands", topLink: true },
    ...brandItems.map((b) => ({ label: b.title, href: `/brands/${b.slug}` })),
  ];

  const locationMenu: MenuItem[] = [
    { label: "All Service Areas", href: "/locations", topLink: true },
    ...cityItems.map((c) => ({ label: c.title, href: `/locations/${c.slug}` })),
  ];

  const getMenu = (key: DropdownKey): MenuItem[] => {
    if (key === "services") return serviceMenu;
    if (key === "industries") return industryMenu;
    if (key === "brands") return brandMenu;
    if (key === "locations") return locationMenu;
    if (key === "more") return moreMenu;
    return [];
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileExpanded(null);
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (key: DropdownKey) => {
    if (key === "more") return morePaths.some((p) => pathname.startsWith(p));
    const prefix = `/${
      key === "services"
        ? "services"
        : key === "industries"
        ? "industries"
        : key === "brands"
        ? "brands"
        : "locations"
    }`;
    return pathname.startsWith(prefix);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container-narrow flex items-center justify-between h-16 md:h-20 px-6">
        <Link href="/" className="flex items-center">
          <Image
            src={shelairLogo}
            alt="Shelair"
            width={160}
            height={64}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-1">
          {dropdownKeys.map(({ key, label }) => (
            <div key={key} className="relative">
              <button
                onClick={() =>
                  setActiveDropdown((prev) => (prev === key ? null : key))
                }
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-secondary ${
                  isActive(key)
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground"
                }`}
              >
                {label}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === key ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === key && (
                <div className="absolute top-full left-0 mt-1.5 w-52 bg-background border border-border rounded-xl shadow-lg py-1.5 z-50">
                  {getMenu(key).map((item, i) => (
                    <div key={item.href}>
                      {item.topLink && i > 0 && (
                        <div className="mx-3 my-1 border-t border-border" />
                      )}
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-secondary text-muted-foreground"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-secondary ${
                            item.topLink ? "font-medium" : ""
                          } ${
                            pathname === item.href
                              ? "text-primary bg-primary/5 font-semibold"
                              : item.highlighted === true
                              ? "text-foreground font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.topLink && (item.icon ?? topIcon[key])}
                          {item.highlighted === true ? (
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                          ) : null}
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Contact — sole plain link */}
          <Link
            href="/contact"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-secondary ${
              pathname === "/contact"
                ? "text-foreground bg-secondary"
                : "text-muted-foreground"
            }`}
          >
            Contact
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="w-4 h-4" /> {formatPhone(phone)}
          </a>
          <Button asChild>
            <Link href="/contact">Get a Quote</Link>
          </Button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="lg:hidden p-2.5 -mr-1"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-b border-border px-6 pb-6">
          <nav className="flex flex-col gap-1">
            {dropdownKeys.map(({ key, label }) => (
              <div key={key}>
                <button
                  onClick={() =>
                    setMobileExpanded((prev) => (prev === key ? null : key))
                  }
                  className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(key)
                      ? "text-foreground bg-secondary"
                      : "text-muted-foreground"
                  }`}
                >
                  {label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      mobileExpanded === key ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileExpanded === key && (
                  <div className="ml-3 flex flex-col gap-0.5 border-l border-border pl-3 mb-1">
                    {getMenu(key).map((item) =>
                      item.external ? (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-muted-foreground"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            item.topLink ? "font-medium" : ""
                          } ${
                            pathname === item.href
                              ? "text-primary bg-primary/5 font-semibold"
                              : item.highlighted === true
                              ? "text-foreground font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.topLink && (item.icon ?? topIcon[key])}
                          {item.highlighted === true ? (
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                          ) : null}
                          {item.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                pathname === "/contact"
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground"
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="mt-4 flex flex-col gap-2">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" /> {formatPhone(phone)}
            </a>
            <Button asChild className="w-full">
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                Get a Quote
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

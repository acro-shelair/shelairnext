import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  FileText, Wrench, Building2, Tag, MessageSquare,
  MapPin, CheckCircle, Circle, ArrowRight, Settings, DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

async function getSectionCounts(supabase: SupabaseClient) {
  const [posts, services, industries, brands, testimonials, cities, faqs, pricing] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("industries").select("*", { count: "exact", head: true }),
    supabase.from("brands").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("location_cities").select("*", { count: "exact", head: true }),
    supabase.from("faqs").select("*", { count: "exact", head: true }),
    supabase.from("pricing_tiers").select("*", { count: "exact", head: true }),
  ]);
  return {
    posts: posts.count ?? 0,
    services: services.count ?? 0,
    industries: industries.count ?? 0,
    brands: brands.count ?? 0,
    testimonials: testimonials.count ?? 0,
    cities: cities.count ?? 0,
    faqs: faqs.count ?? 0,
    pricing: pricing.count ?? 0,
  };
}

export default async function AdminHomePage() {
  const supabase = await createClient();
  const counts = await getSectionCounts(supabase);

  const connected = [
    { label: "Industry Cards",  icon: Building2,    href: "/admin/industries",   count: counts.industries,  desc: "Shown on the home page industry section" },
    { label: "Brands Section",  icon: Tag,          href: "/admin/brands",       count: counts.brands,      desc: "Featured brands shown on home page" },
    { label: "Testimonials",    icon: MessageSquare, href: "/admin/testimonials", count: counts.testimonials, desc: "Client testimonials carousel" },
    { label: "Locations",       icon: MapPin,        href: "/admin/locations",   count: counts.cities,      desc: "Service area cities" },
    { label: "FAQs",            icon: FileText,      href: "/admin/faqs",          count: counts.faqs,      desc: "FAQ accordion on home page" },
    { label: "Pricing",         icon: DollarSign,    href: "/admin/pricing",       count: counts.pricing,   desc: "Pricing tiers on /pricing page" },
  ];

  const staticSections = [
    "Hero (headline, subheading, CTAs)",
    "Trust Bar (Since 1972, HACCP, 98% fix rate, 24/7)",
    "Problem Section (4 pain points)",
    "Solution Section (3 steps)",
    "Capabilities Grid (6 trust items)",
    "Process Timeline (6 steps)",
    "Clients Section (logo images)",
    "CTA Banner",
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Home Page</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage home page sections. Connected sections update live; static sections require a code change.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/settings"><Settings className="w-4 h-4 mr-1.5" /> Site Settings</Link>
        </Button>
      </div>

      {/* Connected sections */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" /> Connected to Supabase
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {connected.map(({ label, icon: Icon, href, count, desc }) => (
            <Link key={href} href={href} className="flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-3.5 hover:border-primary/30 transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">{label}</p>
                  <Badge variant="secondary" className="text-xs">{count}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* Static sections */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Circle className="w-4 h-4 text-muted-foreground" /> Static Sections
          <span className="text-xs font-normal text-muted-foreground">(edit in code → data/home.ts)</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {staticSections.map((s) => (
            <div key={s} className="flex items-center gap-2.5 px-4 py-2.5 bg-secondary rounded-lg text-sm text-muted-foreground">
              <Circle className="w-3 h-3 flex-shrink-0" />
              {s}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

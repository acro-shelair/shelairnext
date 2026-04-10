import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { headers } from "next/headers";
import { Providers } from "@/components/providers";
import Navbar from "@/components/Navbar";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/supabase/content";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import NavigationProgress from "@/components/NavigationProgress";
import PublicShell from "@/components/PublicShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shelair.com.au"),
  icons: { icon: "/favicon.png" },
  title: {
    template: "%s | Shelair",
    default:
      "Shelair | Air Conditioning Installation & Service Brisbane, Gold Coast & Sunshine Coast",
  },
  description:
    "Expert commercial air conditioning installation, service and maintenance across Brisbane, Gold Coast and Sunshine Coast. 30+ years experience. 5-year workmanship guarantee. Licensed HVAC technicians.",
  authors: [{ name: "Shelair" }],
  openGraph: {
    type: "website",
    siteName: "Shelair",
    images: [{ url: "/api/og?title=Shelair&description=Air+Conditioning+Installation+%26+Service+Brisbane%2C+Gold+Coast+%26+Sunshine+Coast&type=default", width: 1200, height: 630, alt: "Shelair" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: "/api/og?title=Shelair&description=Air+Conditioning+Installation+%26+Service+Brisbane%2C+Gold+Coast+%26+Sunshine+Coast&type=default", width: 1200, height: 630, alt: "Shelair" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/auth");

  const supabase = createAdminClient();
  const [settings, navServices, navIndustries, navBrands, navCities] = isAdmin
    ? [null, [], [], [], []]
    : await Promise.all([
        getSiteSettings(supabase),
        supabase
          .from("services")
          .select("slug, title, highlighted")
          .not("slug", "is", null)
          .order("position")
          .then((r) => r.data ?? []),
        supabase
          .from("industries")
          .select("slug, title")
          .order("position")
          .then((r) => r.data ?? []),
        supabase
          .from("brands")
          .select("slug, name")
          .order("position")
          .then((r) =>
            (r.data ?? []).map((b: { slug: string; name: string }) => ({
              slug: b.slug,
              title: b.name,
            }))
          ),
        supabase
          .from("location_cities")
          .select("slug, name")
          .order("position")
          .then((r) =>
            (r.data ?? []).map((c: { slug: string; name: string }) => ({
              slug: c.slug,
              title: c.name,
            }))
          ),
      ]);
  const phone = (settings as { phone?: string } | null)?.phone ?? "0732049511";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18078612334"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18078612334');
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {!isAdmin && <LoadingScreen />}
          <NavigationProgress />
          <PublicShell
            navbar={
              <Navbar
                phone={phone}
                serviceItems={navServices as { slug: string; title: string; highlighted?: boolean }[]}
                industryItems={
                  navIndustries as { slug: string; title: string }[]
                }
                brandItems={navBrands as { slug: string; title: string }[]}
                cityItems={navCities as { slug: string; title: string }[]}
              />
            }
            footer={<Footer />}
          >
            {children}
          </PublicShell>
        </Providers>
      </body>
    </html>
  );
}

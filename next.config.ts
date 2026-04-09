import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zlddrnkpxpilszbnkkok.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/process",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/contact-commercial-air-conditioning-brisbane",
        destination: "/contact",
        permanent: true,
      },
      // Old WP root-level service pages → /services/
      {
        source: "/cold-room-hire",
        destination: "/services/cold-room-hire",
        permanent: true,
      },
      {
        source: "/commercial-air-conditioning-installation",
        destination: "/services/commercial-air-conditioning-installation",
        permanent: true,
      },
      {
        source: "/commercial-refrigeration",
        destination: "/services/commercial-refrigeration",
        permanent: true,
      },
      {
        source: "/commercial-refrigeration-service",
        destination: "/services/commercial-refrigeration-service",
        permanent: true,
      },
      {
        source: "/air-conditioning-service-and-repairs",
        destination: "/services/air-conditioning-service-and-repairs",
        permanent: true,
      },
      // Old WP suburb typo (north-lake → north-lakes) — must be before the dynamic catch-all
      {
        source: "/air-conditioning-north-lake",
        destination: "/locations/brisbane-northside/air-conditioning-north-lakes",
        permanent: true,
      },
      // Old WP suburb pages → /locations/brisbane-northside/
      {
        source: "/air-conditioning-:suburb",
        destination: "/locations/brisbane-northside/air-conditioning-:suburb",
        permanent: true,
      },
      // Old WP blog index
      {
        source: "/explore-shelairs-commercial-air-conditioning-blog-for-expert-hvac-tips-maintenance-advice-and-industry-updates-across-brisbane-gold-coast-and-sunshine-coast",
        destination: "/resources",
        permanent: true,
      },
      // Old WP date-based blog posts → /resources/
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug",
        destination: "/resources/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

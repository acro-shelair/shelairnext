/**
 * Serves /llms.txt — a Markdown summary of the site for LLMs and AI agents,
 * following the https://llmstxt.org convention (H1 title, blockquote summary,
 * then link sections). Mirrors the static routes in app/sitemap.ts.
 */

export const dynamic = "force-static";

const BASE_URL = "https://shelair.com.au";

const LLMS_TXT = `# Shelair

> Expert commercial air conditioning installation, service and maintenance across Brisbane, Gold Coast and Sunshine Coast. 30+ years experience. 5-year workmanship guarantee. Licensed HVAC technicians.

Shelair is part of the HVACR Group. For enquiries, use the contact page below.

## Services
- [Services](${BASE_URL}/services): air conditioning installation, service and maintenance
- [Pricing](${BASE_URL}/pricing)
- [Our process](${BASE_URL}/process)

## Industries & work
- [Industries served](${BASE_URL}/industries)
- [Projects](${BASE_URL}/projects)
- [Brands serviced](${BASE_URL}/brands)
- [Locations](${BASE_URL}/locations)

## Company
- [Resources](${BASE_URL}/resources)
- [Contact](${BASE_URL}/contact)
- [Privacy policy](${BASE_URL}/privacy)
- [Terms](${BASE_URL}/terms)
- [Sitemap](${BASE_URL}/sitemap.xml)
`;

export function GET() {
  return new Response(LLMS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

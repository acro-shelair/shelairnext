import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const BASE_URL = "https://shelair.com.au";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "Shelair";
  const description = searchParams.get("description") || "";
  const type = searchParams.get("type") || "default";

  // Map page types to accent colours & icons
  const typeConfig: Record<string, { label: string; color: string }> = {
    default:   { label: "",                  color: "#0066CC" },
    services:  { label: "Services",          color: "#0066CC" },
    service:   { label: "Service",           color: "#0066CC" },
    industries:{ label: "Industries",        color: "#1B7A4A" },
    industry:  { label: "Industry",          color: "#1B7A4A" },
    brands:    { label: "Brands",            color: "#7C3AED" },
    brand:     { label: "Brand Specialist",  color: "#7C3AED" },
    locations: { label: "Service Area",      color: "#DC2626" },
    location:  { label: "Service Area",      color: "#DC2626" },
    pricing:   { label: "Pricing",           color: "#D97706" },
    resources: { label: "Resources",         color: "#0891B2" },
    resource:  { label: "Article",           color: "#0891B2" },
    projects:  { label: "Projects",          color: "#6D28D9" },
    project:   { label: "Case Study",        color: "#6D28D9" },
    contact:   { label: "Contact",           color: "#0066CC" },
  };

  const config = typeConfig[type] || typeConfig.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: 28,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: config.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              S
            </div>
            Shelair
          </div>
          {config.label && (
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: config.color,
                background: `${config.color}18`,
                padding: "6px 16px",
                borderRadius: 20,
                border: `1px solid ${config.color}40`,
              }}
            >
              {config.label}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, justifyContent: "center" }}>
          <div
            style={{
              fontSize: title.length > 50 ? 42 : 52,
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxWidth: "90%",
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 22,
                color: "#94A3B8",
                lineHeight: 1.4,
                maxWidth: "80%",
              }}
            >
              {description.length > 120 ? description.slice(0, 117) + "..." : description}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 18, color: "#64748B" }}>
            shelair.com.au
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: 16,
              color: "#94A3B8",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22C55E",
              }}
            />
            24/7 Emergency Service
          </div>
        </div>

        {/* Accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${config.color}, ${config.color}00)`,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

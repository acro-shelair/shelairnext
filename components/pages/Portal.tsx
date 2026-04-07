"use client";

import {
  FileText,
  FileSpreadsheet,
  File,
  ExternalLink,
  Download,
  Calendar,
  FolderOpen,
} from "lucide-react";

type FileType = "pdf" | "excel" | "word" | "other";
type ResourceType = "file" | "link";

interface PortalResource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  file_type: FileType | null;
  expires_at: string | null;
  position: number;
}

interface PortalSection {
  id: string;
  name: string;
  description: string | null;
  position: number;
  portal_resources: PortalResource[];
}

const FILE_ICON: Record<FileType, { icon: typeof File; color: string }> = {
  pdf:   { icon: FileText,        color: "text-red-500"   },
  excel: { icon: FileSpreadsheet, color: "text-green-600" },
  word:  { icon: FileText,        color: "text-blue-600"  },
  other: { icon: File,            color: "text-muted-foreground" },
};

const FILE_LABEL: Record<FileType, string> = {
  pdf: "PDF", excel: "Excel", word: "Word", other: "File",
};

function ResourceIcon({ type, fileType }: { type: ResourceType; fileType: FileType | null }) {
  if (type === "link") return <ExternalLink className="w-5 h-5 text-primary" />;
  const { icon: Icon, color } = FILE_ICON[fileType ?? "other"];
  return <Icon className={`w-5 h-5 ${color}`} />;
}

function ExpiryBadge({ expiresAt }: { expiresAt: string }) {
  const expiry = new Date(expiresAt);
  const now = new Date();
  const days = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  const expired = days < 0;
  const soon = days >= 0 && days <= 30;

  return (
    <span className={`flex items-center gap-1 text-xs ${expired ? "text-red-500" : soon ? "text-amber-500" : "text-muted-foreground"}`}>
      <Calendar className="w-3 h-3" />
      {expired
        ? "Expired"
        : `Expires ${expiry.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}`}
    </span>
  );
}

export default function Portal({ sections }: { sections: PortalSection[] }) {
  if (sections.length === 0) {
    return (
      <div className="section-padding">
        <div className="container-narrow text-center py-24 text-muted-foreground">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>No resources available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-narrow">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Employee Portal</h1>
          <p className="text-muted-foreground text-lg">
            Company documents, forms, and resources for Shelair staff.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.id}>
              <div className="mb-5 pb-3 border-b border-border">
                <h2 className="text-xl font-bold">{section.name}</h2>
                {section.description && (
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    {section.description}
                  </p>
                )}
              </div>

              {section.portal_resources.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No resources in this section yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.portal_resources.map((resource) => {
                    const expired = resource.expires_at
                      ? new Date(resource.expires_at) < new Date()
                      : false;

                    return (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-start gap-3 p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group ${expired ? "opacity-50" : ""}`}
                      >
                        <div className="shrink-0 mt-0.5">
                          <ResourceIcon type={resource.type} fileType={resource.file_type} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {resource.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-xs text-muted-foreground">
                              {resource.type === "link" ? "Link" : FILE_LABEL[resource.file_type ?? "other"]}
                            </span>
                            {resource.expires_at && (
                              <ExpiryBadge expiresAt={resource.expires_at} />
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 mt-0.5">
                          {resource.type === "link"
                            ? <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            : <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          }
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

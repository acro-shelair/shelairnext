"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/supabase/logging";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plus, Pencil, Trash2, ArrowUp, ArrowDown,
  FileText, FileSpreadsheet, File, ExternalLink, Link as LinkIcon,
  Upload, X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FileType = "pdf" | "excel" | "word" | "other";
type ResourceType = "file" | "link";

interface PortalResource {
  id: string;
  section_id: string;
  title: string;
  url: string;
  type: ResourceType;
  file_type: FileType | null;
  position: number;
}

interface PortalSection {
  id: string;
  name: string;
  description: string | null;
  position: number;
  portal_resources: PortalResource[];
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const FILE_ICON: Record<FileType, { icon: typeof File; color: string }> = {
  pdf:   { icon: FileText,        color: "text-red-500"   },
  excel: { icon: FileSpreadsheet, color: "text-green-600" },
  word:  { icon: FileText,        color: "text-blue-600"  },
  other: { icon: File,            color: "text-muted-foreground" },
};

function ResourceIcon({ type, fileType }: { type: ResourceType; fileType: FileType | null }) {
  if (type === "link") return <LinkIcon className="w-4 h-4 text-primary" />;
  const { icon: Icon, color } = FILE_ICON[fileType ?? "other"];
  return <Icon className={`w-4 h-4 ${color}`} />;
}

// ─── Section Dialog ───────────────────────────────────────────────────────────

const sectionSchema = z.object({
  name:        z.string().min(1, "Required"),
  description: z.string().optional(),
});
type SectionFormData = z.infer<typeof sectionSchema>;

function SectionDialog({
  section,
  position,
  onSuccess,
}: {
  section?: PortalSection;
  position?: number;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!section;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<SectionFormData>({
      resolver: zodResolver(sectionSchema),
      defaultValues: {
        name:        section?.name        ?? "",
        description: section?.description ?? "",
      },
    });

  const onSubmit = async (data: SectionFormData) => {
    setError(null);
    const supabase = createClient();
    try {
      if (isEdit) {
        const { error } = await supabase.from("portal_sections").update(data).eq("id", section.id);
        if (error) throw error;
        await logActivity("update", "portal_sections", `Updated section: ${data.name}`);
      } else {
        const { error } = await supabase.from("portal_sections").insert({ ...data, position: position ?? 0 });
        if (error) throw error;
        await logActivity("create", "portal_sections", `Created section: ${data.name}`);
      }
      reset();
      setOpen(false);
      onSuccess();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed."); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button size="sm" variant="ghost"><Pencil className="w-3.5 h-3.5" /></Button>
        ) : (
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Section</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Section" : "New Section"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input {...register("name")} placeholder="e.g. SWMS, Safety Policy" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea {...register("description")} rows={3} className="resize-none"
              placeholder="Brief description shown under the section heading…" />
          </div>
          {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectFileType(filename: string): FileType {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["xlsx", "xls", "csv"].includes(ext ?? "")) return "excel";
  if (["docx", "doc"].includes(ext ?? "")) return "word";
  return "other";
}

// ─── Resource Dialog ──────────────────────────────────────────────────────────

const resourceSchema = z.object({
  title:      z.string().min(1, "Required"),
  url:        z.string().url("Must be a valid URL"),
  type:       z.enum(["file", "link"]),
  file_type:  z.enum(["pdf", "excel", "word", "other"]).optional(),
});
type ResourceFormData = z.infer<typeof resourceSchema>;

function ResourceDialog({
  resource,
  sectionId,
  position,
  onSuccess,
}: {
  resource?: PortalResource;
  sectionId: string;
  position?: number;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const isEdit = !!resource;

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<ResourceFormData>({
      resolver: zodResolver(resourceSchema),
      defaultValues: {
        title:      resource?.title      ?? "",
        url:        resource?.url        ?? "",
        type:       resource?.type       ?? "file",
        file_type:  resource?.file_type  ?? "pdf",
      },
    });

  const resourceType = watch("type");
  const currentUrl = watch("url");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const path = `${sectionId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("portal-files")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("portal-files").getPublicUrl(path);
      setValue("url", data.publicUrl);
      setValue("file_type", detectFileType(file.name));
      setUploadedName(file.name);

      // Auto-fill title if empty
      const currentTitle = (document.querySelector('input[name="title"]') as HTMLInputElement)?.value;
      if (!currentTitle) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setValue("title", nameWithoutExt);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ResourceFormData) => {
    setError(null);
    const supabase = createClient();
    const payload = {
      ...data,
      file_type:  data.type === "link" ? null : (data.file_type ?? "other"),
      section_id: sectionId,
    };
    try {
      if (isEdit) {
        const { error } = await supabase.from("portal_resources").update(payload).eq("id", resource.id);
        if (error) throw error;
        await logActivity("update", "portal_resources", `Updated resource: ${data.title}`);
      } else {
        const { error } = await supabase.from("portal_resources").insert({ ...payload, position: position ?? 0 });
        if (error) throw error;
        await logActivity("create", "portal_resources", `Created resource: ${data.title}`);
      }
      reset();
      setUploadedName(null);
      setOpen(false);
      onSuccess();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed."); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setUploadedName(null); }}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button size="sm" variant="ghost"><Pencil className="w-3.5 h-3.5" /></Button>
        ) : (
          <Button size="sm" variant="outline"><Plus className="w-3.5 h-3.5 mr-1" /> Add Resource</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Resource" : "New Resource"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input {...register("title")} placeholder="e.g. General Trade SWMS" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Type selector */}
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={resourceType} onValueChange={(v) => { setValue("type", v as ResourceType); setUploadedName(null); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="file">File (upload)</SelectItem>
                <SelectItem value="link">Link (external URL)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File upload */}
          {resourceType === "file" && (
            <>
              <div className="space-y-1.5">
                <Label>File</Label>
                {uploadedName || currentUrl ? (
                  <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg border border-border min-w-0">
                    <File className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm flex-1 truncate min-w-0">
                      {uploadedName ?? decodeURIComponent(currentUrl.split("/").pop()?.split("?")[0] ?? currentUrl).replace(/^\d+-/, "")}
                    </span>
                    <label className="cursor-pointer text-xs text-primary hover:underline shrink-0">
                      Change
                      <input type="file" className="hidden" onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx" />
                    </label>
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {uploading ? "Uploading…" : "Click to upload a file"}
                    </span>
                    <span className="text-xs text-muted-foreground">PDF, Word, Excel and more</span>
                    <input type="file" className="hidden" onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx" disabled={uploading} />
                  </label>
                )}
                {errors.url && <p className="text-xs text-destructive">Please upload a file</p>}
              </div>
              <div className="space-y-1.5">
                <Label>File Type</Label>
                <Select value={watch("file_type") ?? "pdf"} onValueChange={(v) => setValue("file_type", v as FileType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="word">Word</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* External link */}
          {resourceType === "link" && (
            <div className="space-y-1.5">
              <Label>URL</Label>
              <Input {...register("url")} placeholder="https://…" />
              {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
            </div>
          )}

          {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || uploading}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PortalClient({ initialSections, canEdit }: { initialSections: PortalSection[]; canEdit: boolean }) {
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  const refresh = () => router.refresh();

  const deleteSection = async (s: PortalSection) => {
    if (!confirm(`Delete section "${s.name}" and all its resources?`)) return;
    const supabase = createClient();
    await supabase.from("portal_sections").delete().eq("id", s.id);
    await logActivity("delete", "portal_sections", `Deleted section: ${s.name}`);
    setSections((prev) => prev.filter((x) => x.id !== s.id));
  };

  const deleteResource = async (r: PortalResource) => {
    if (!confirm(`Delete "${r.title}"?`)) return;
    const supabase = createClient();
    await supabase.from("portal_resources").delete().eq("id", r.id);
    await logActivity("delete", "portal_resources", `Deleted resource: ${r.title}`);
    setSections((prev) =>
      prev.map((s) =>
        s.id === r.section_id
          ? { ...s, portal_resources: s.portal_resources.filter((x) => x.id !== r.id) }
          : s
      )
    );
  };

  const moveSection = async (index: number, direction: "up" | "down") => {
    const updated = [...sections];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= updated.length) return;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    const supabase = createClient();
    await Promise.all([
      supabase.from("portal_sections").update({ position: swapIndex }).eq("id", updated[swapIndex].id),
      supabase.from("portal_sections").update({ position: index   }).eq("id", updated[index].id),
    ]);
    setSections(updated.map((s, pos) => ({ ...s, position: pos })));
  };

  const moveResource = async (sectionId: string, index: number, direction: "up" | "down") => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const updated = [...section.portal_resources];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= updated.length) return;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    const supabase = createClient();
    await Promise.all([
      supabase.from("portal_resources").update({ position: swapIndex }).eq("id", updated[swapIndex].id),
      supabase.from("portal_resources").update({ position: index    }).eq("id", updated[index].id),
    ]);
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, portal_resources: updated.map((r, pos) => ({ ...r, position: pos })) }
          : s
      )
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Employee Portal</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {canEdit ? "Manage sections and resources for the employee portal." : "Company documents, forms, and resources."}
          </p>
        </div>
        {canEdit && <SectionDialog position={sections.length} onSuccess={refresh} />}
      </div>

      {sections.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">
          No sections yet. Create your first one.
        </p>
      ) : (
        <div className="space-y-5">
          {sections.map((section, si) => (
            <div key={section.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Section header */}
              <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{section.name}</p>
                  {section.description && (
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{section.description}</p>
                  )}
                </div>
                {canEdit && (
                  <div className="flex items-center gap-1 shrink-0">
                    <SectionDialog section={section} onSuccess={refresh} />
                    <Button size="sm" variant="ghost" onClick={() => deleteSection(section)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                    <div className="flex flex-col gap-0.5 ml-1">
                      <button onClick={() => moveSection(si, "up")} disabled={si === 0}
                        className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => moveSection(si, "down")} disabled={si === sections.length - 1}
                        className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Resources */}
              <div className="divide-y divide-border">
                {section.portal_resources.length === 0 ? (
                  <p className="text-sm text-muted-foreground px-5 py-3 italic">No resources yet.</p>
                ) : (
                  section.portal_resources.map((resource, ri) => (
                    <div key={resource.id} className="flex items-center gap-3 px-5 py-3">
                      <ResourceIcon type={resource.type} fileType={resource.file_type} />
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-0 group"
                      >
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{resource.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{resource.url}</p>
                      </a>
                      <div className="flex items-center gap-1 shrink-0">
                        {canEdit && (
                          <>
                            <ResourceDialog resource={resource} sectionId={section.id} onSuccess={refresh} />
                            <Button size="sm" variant="ghost" onClick={() => deleteResource(resource)}>
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </Button>
                            <div className="flex flex-col gap-0.5 ml-1">
                              <button onClick={() => moveResource(section.id, ri, "up")} disabled={ri === 0}
                                className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors">
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button onClick={() => moveResource(section.id, ri, "down")} disabled={ri === section.portal_resources.length - 1}
                                className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors">
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add resource */}
              {canEdit && (
                <div className="px-5 py-3 bg-secondary/30">
                  <ResourceDialog sectionId={section.id} position={section.portal_resources.length} onSuccess={refresh} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

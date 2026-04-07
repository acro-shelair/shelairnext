"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/supabase/content";
import { logActivity } from "@/lib/supabase/logging";
import { convertToWebp } from "@/lib/convertToWebp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Upload, X, ImageIcon } from "lucide-react";

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const schema = z.object({
  title:     z.string().min(1, "Required"),
  slug:      z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  type:      z.string().min(1, "Required"),
  size:      z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  location:  z.string().min(1, "Required"),
  client:    z.string().min(1, "Required"),
  challenge: z.string().min(1, "Required"),
  solution:  z.string().min(1, "Required"),
  outcomes:  z.array(z.object({ text: z.string() })),
  featured:  z.boolean(),
  position:  z.coerce.number().int().min(0),
});

type FormData = z.infer<typeof schema>;

export default function ProjectEditor({
  project,
  nextPosition,
}: {
  project?: Project;
  nextPosition?: number;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(() => {
    const arr = project?.images ?? [];
    if (project?.image_url && !arr.includes(project.image_url)) {
      return [project.image_url, ...arr];
    }
    return arr;
  });
  const isEdit = !!project;

  const { register, handleSubmit, control, setValue, formState: { errors } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        title:     project?.title     ?? "",
        slug:      project?.slug      ?? "",
        type:      project?.type      ?? "",
        size:      project?.size      ?? "",
        description: project?.description ?? "",
        location:  project?.location  ?? "",
        client:    project?.client    ?? "",
        challenge: project?.challenge ?? "",
        solution:  project?.solution  ?? "",
        outcomes:  (project?.outcomes ?? []).map((t) => ({ text: t })),
        featured:  project?.featured  ?? false,
        position:  project?.position  ?? nextPosition ?? 0,
      },
    });

  const outcomes = useFieldArray({ control, name: "outcomes" });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const urls: string[] = [];
      for (const raw of files) {
        const file = await convertToWebp(raw);
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("project-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      setImages((prev) => [...prev, ...urls]);
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url));
  };

  const moveImage = (from: number, to: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setServerError(null);
    const supabase = createClient();
    const payload = {
      title:     data.title,
      slug:      data.slug,
      type:      data.type,
      size:      data.size,
      description: data.description,
      location:  data.location,
      client:    data.client,
      challenge: data.challenge,
      solution:  data.solution,
      outcomes:  data.outcomes.map((o) => o.text).filter(Boolean),
      images:    images,
      image_url: images[0] ?? null,
      featured:  data.featured,
      position:  data.position,
    };
    try {
      if (isEdit) {
        const { error } = await supabase.from("projects").update(payload).eq("id", project.id);
        if (error) throw error;
        await logActivity("update", "projects", `Updated project: ${data.title}`);
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
        await logActivity("create", "projects", `Created project: ${data.title}`);
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Project" : "New Project"}</h1>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || uploading}>
            {saving ? "Saving…" : uploading ? "Uploading…" : "Save Project"}
          </Button>
        </div>
      </div>

      {serverError && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{serverError}</p>
      )}

      {/* ── Card info ──────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">Card Info</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Title</Label>
            <Input
              {...register("title")}
              placeholder="e.g. FreshMart National Fleet"
              onBlur={(e) => { if (!isEdit) setValue("slug", toSlug(e.target.value)); }}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Slug <span className="text-muted-foreground font-normal text-xs">(URL path)</span></Label>
            <Input {...register("slug")} placeholder="freshmart-national-fleet" />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Type <span className="text-muted-foreground font-normal text-xs">(badge on card)</span></Label>
            <Input {...register("type")} placeholder="e.g. Maintenance Contract" />
            {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Size / Scope</Label>
            <Input {...register("size")} placeholder="e.g. 48 stores" />
            {errors.size && <p className="text-xs text-destructive">{errors.size.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input {...register("location")} placeholder="e.g. Brisbane, QLD" />
            {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Client Name</Label>
            <Input {...register("client")} placeholder="e.g. FreshMart Supermarkets" />
            {errors.client && <p className="text-xs text-destructive">{errors.client.message}</p>}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Short Description <span className="text-muted-foreground font-normal text-xs">(shown on card)</span></Label>
            <Textarea {...register("description")} rows={2} className="resize-none" placeholder="Brief summary of the project…" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
        </div>
      </section>

      {/* ── Detail page ────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">Detail Page</h2>
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label>The Challenge</Label>
            <Textarea {...register("challenge")} rows={4} className="resize-none" placeholder="What problem did the client face?" />
            {errors.challenge && <p className="text-xs text-destructive">{errors.challenge.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Our Solution</Label>
            <Textarea {...register("solution")} rows={4} className="resize-none" placeholder="How did Shelair solve it?" />
            {errors.solution && <p className="text-xs text-destructive">{errors.solution.message}</p>}
          </div>
        </div>
      </section>

      {/* ── Outcomes ────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">Results & Outcomes</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => outcomes.append({ text: "" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
        {outcomes.fields.length === 0 && (
          <p className="text-sm text-muted-foreground">No outcomes yet. Add bullet points for results.</p>
        )}
        {outcomes.fields.map((f, i) => (
          <div key={f.id} className="flex gap-2">
            <Input {...register(`outcomes.${i}.text`)} placeholder={`e.g. 60% reduction in emergency call-outs`} className="flex-1" />
            <Button type="button" size="sm" variant="ghost" onClick={() => outcomes.remove(i)}>
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </Button>
          </div>
        ))}
      </section>

      {/* ── Settings ────────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">Settings</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label>
                Project Images
                <span className="text-muted-foreground font-normal text-xs ml-2">(optional — first image is the cover)</span>
              </Label>
              {images.length > 0 && (
                <span className="text-xs text-muted-foreground">{images.length} photo{images.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            {/* Existing images grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((url, i) => (
                  <div key={url} className="relative group rounded-xl overflow-hidden border border-border aspect-video bg-muted">
                    <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                    {/* Cover badge */}
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                    {/* Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage(i, i - 1)}
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white text-xs font-bold"
                          title="Move left"
                        >
                          ←
                        </button>
                      )}
                      {i < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImage(i, i + 1)}
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white text-xs font-bold"
                          title="Move right"
                        >
                          →
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white transition-colors"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload dropzone */}
            <label className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
              {uploading ? (
                <span className="text-sm text-muted-foreground">Uploading…</span>
              ) : (
                <>
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Click to upload photos</span>
                  <span className="text-xs text-muted-foreground">Select multiple — JPG, PNG, WebP</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div className="space-y-1.5 max-w-[120px]">
            <Label>Position</Label>
            <Input type="number" min={0} {...register("position")} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              id="featured"
              type="checkbox"
              {...register("featured")}
              className="w-4 h-4 accent-primary"
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Show on home page <span className="text-muted-foreground font-normal text-xs">(Featured — max 3)</span>
            </Label>
          </div>
        </div>
      </section>
    </form>
  );
}

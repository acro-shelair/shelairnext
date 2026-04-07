"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { Industry } from "@/lib/supabase/content";
import { logActivity } from "@/lib/supabase/logging";
import { ICON_OPTIONS, getIcon } from "@/app/admin/services/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2, Upload, X, ImageIcon } from "lucide-react";
import { convertToWebp } from "@/lib/convertToWebp";

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const schema = z.object({
  icon_name:    z.string().min(1),
  title:        z.string().min(1, "Required"),
  slug:         z.string().min(1, "Required").regex(/^[a-z0-9-]+$/),
  short_desc:   z.string().min(1, "Required"),
  description:  z.string().min(1, "Required"),
  features:     z.array(z.object({ text: z.string() })),
  position:     z.coerce.number().int().min(0),
  // Detail page
  subtitle:          z.string(),
  hero_desc:         z.string(),
  meta_description:  z.string(),
  related_industry_slugs: z.string(),
  stats:             z.array(z.object({ value: z.string(), label: z.string() })),
  challenges:        z.array(z.object({ title: z.string(), desc: z.string() })),
  industry_services: z.array(z.object({ icon_name: z.string(), title: z.string(), desc: z.string() })),
  case_study_company:   z.string(),
  case_study_challenge: z.string(),
  case_study_solution:  z.string(),
  case_study_result:    z.string(),
});

type FormData = z.infer<typeof schema>;

export default function IndustryEditor({ industry, nextPosition }: { industry?: Industry; nextPosition?: number }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(industry?.image_url ?? "");
  const isEdit = !!industry;

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      icon_name:    industry?.icon_name    ?? "Building2",
      title:        industry?.title        ?? "",
      slug:         industry?.slug         ?? "",
      short_desc:   industry?.short_desc   ?? "",
      description:  industry?.description  ?? "",
      features:     industry?.features?.map((t) => ({ text: t })) ?? [],
      position:     industry?.position     ?? nextPosition ?? 0,
      subtitle:          industry?.subtitle          ?? "",
      hero_desc:         industry?.hero_desc          ?? "",
      meta_description:  industry?.meta_description   ?? "",
      related_industry_slugs: industry?.related_industry_slugs?.join(", ") ?? "",
      stats:             (industry?.stats as any[])?.map((s) => ({ value: s.value, label: s.label })) ?? [],
      challenges:        (industry?.challenges as any[])?.map((c) => ({ title: c.title, desc: c.desc })) ?? [],
      industry_services: (industry?.industry_services as any[])?.map((s) => ({ icon_name: s.icon_name, title: s.title, desc: s.desc })) ?? [],
      case_study_company:   (industry?.case_study as any)?.company   ?? "",
      case_study_challenge: (industry?.case_study as any)?.challenge ?? "",
      case_study_solution:  (industry?.case_study as any)?.solution  ?? "",
      case_study_result:    (industry?.case_study as any)?.result    ?? "",
    },
  });

  const selectedIcon = watch("icon_name");
  const PreviewIcon = getIcon(selectedIcon);

  const features   = useFieldArray({ control, name: "features" });
  const stats      = useFieldArray({ control, name: "stats" });
  const challenges = useFieldArray({ control, name: "challenges" });
  const services   = useFieldArray({ control, name: "industry_services" });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const converted = await convertToWebp(file);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(path, converted, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("project-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setServerError(null);
    const supabase = createClient();

    const hasCaseStudy = data.case_study_company.trim();
    const payload = {
      icon_name:    data.icon_name,
      title:        data.title,
      slug:         data.slug,
      short_desc:   data.short_desc,
      description:  data.description,
      features:     data.features.map((f) => f.text).filter(Boolean),
      position:     data.position,
      subtitle:          data.subtitle,
      hero_desc:         data.hero_desc,
      meta_description:  data.meta_description,
      related_industry_slugs: data.related_industry_slugs.split(",").map((s) => s.trim()).filter(Boolean),
      stats:             data.stats,
      challenges:        data.challenges,
      industry_services: data.industry_services,
      image_url: imageUrl || null,
      case_study: hasCaseStudy ? {
        company:   data.case_study_company,
        challenge: data.case_study_challenge,
        solution:  data.case_study_solution,
        result:    data.case_study_result,
      } : null,
    };

    try {
      if (isEdit) {
        const { error } = await supabase.from("industries").update(payload).eq("id", industry.id);
        if (error) throw error;
        await logActivity("update", "industries", `Updated industry: ${data.title}`);
      } else {
        const { error } = await supabase.from("industries").insert(payload);
        if (error) throw error;
        await logActivity("create", "industries", `Created industry: ${data.title}`);
      }
      router.push("/admin/industries");
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
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Industry" : "New Industry"}</h1>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>Cancel</Button>
          <Button type="submit" disabled={saving || uploading}>{saving ? "Saving…" : uploading ? "Uploading…" : "Save Industry"}</Button>
        </div>
      </div>

      {serverError && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{serverError}</p>}

      {/* ── Card Info ────────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">Card Info</h2>

        {/* Icon picker */}
        <div className="space-y-3">
          <Label>Icon</Label>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <PreviewIcon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Selected: <span className="font-medium text-foreground">{selectedIcon}</span></span>
          </div>
          <Controller control={control} name="icon_name" render={({ field }) => (
            <div className="grid grid-cols-8 gap-2">
              {ICON_OPTIONS.map(({ name, icon: Icon }) => (
                <button key={name} type="button" title={name} onClick={() => field.onChange(name)}
                  className={`aspect-square rounded-lg flex items-center justify-center transition-colors border ${
                    field.value === name
                      ? "bg-primary text-white border-primary"
                      : "bg-secondary text-muted-foreground border-transparent hover:border-border hover:text-foreground"
                  }`}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          )} />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Title</Label>
            <Input {...register("title")}
              onBlur={(e) => { if (!isEdit) setValue("slug", toSlug(e.target.value)); }}
              placeholder="Restaurants & Hospitality" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input {...register("slug")} placeholder="restaurants-hospitality" />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="space-y-1.5 max-w-[120px]">
            <Label>Position</Label>
            <Input type="number" min={0} {...register("position")} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Short Description <span className="text-muted-foreground font-normal text-xs">(shown on home section card)</span></Label>
            <Input {...register("short_desc")} placeholder="Walk-in coolrooms and freezers built for commercial kitchens." />
            {errors.short_desc && <p className="text-xs text-destructive">{errors.short_desc.message}</p>}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Full Description <span className="text-muted-foreground font-normal text-xs">(shown on industries listing page)</span></Label>
            <Textarea {...register("description")} rows={3} className="resize-none" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Features <span className="text-muted-foreground font-normal text-xs">(shown as pills on the card)</span></Label>
            <Button type="button" size="sm" variant="outline" onClick={() => features.append({ text: "" })}>
              <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {features.fields.map((f, i) => (
              <div key={f.id} className="flex gap-2">
                <Input {...register(`features.${i}.text`)} placeholder={`Feature ${i + 1}`} />
                <Button type="button" size="sm" variant="ghost" onClick={() => features.remove(i)}>
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        {/* Image */}
        <div className="space-y-3">
          <Label>Cover Image <span className="text-muted-foreground font-normal text-xs">(optional — shown on the industries listing page)</span></Label>
          {imageUrl ? (
            <div className="relative w-full rounded-xl overflow-hidden border border-border">
              <img src={imageUrl} alt="Industry" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
              {uploading ? (
                <span className="text-sm text-muted-foreground">Uploading…</span>
              ) : (
                <>
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Click to upload image</span>
                  <span className="text-xs text-muted-foreground">JPG, PNG, WebP — converted to WebP</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>
      </section>

      {/* ── Detail Page ───────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">Detail Page</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label>Subtitle <span className="text-muted-foreground font-normal text-xs">(badge text)</span></Label>
            <Input {...register("subtitle")} placeholder="Restaurants & Hospitality" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Hero Description</Label>
            <Textarea {...register("hero_desc")} rows={2} className="resize-none" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Meta Description <span className="text-muted-foreground font-normal text-xs">SEO — under 160 chars</span></Label>
            <Textarea {...register("meta_description")} rows={2} className="resize-none" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Related Industry Slugs <span className="text-muted-foreground font-normal text-xs">comma-separated</span></Label>
            <Input {...register("related_industry_slugs")} placeholder="supermarkets-retail, food-production" />
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">Stats</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => stats.append({ value: "", label: "" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
        {stats.fields.map((f, i) => (
          <div key={f.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div className="space-y-1.5">
              {i === 0 && <Label>Value</Label>}
              <Input {...register(`stats.${i}.value`)} placeholder="2hr" />
            </div>
            <div className="space-y-1.5">
              {i === 0 && <Label>Label</Label>}
              <Input {...register(`stats.${i}.label`)} placeholder="Avg Response" />
            </div>
            <Button type="button" size="sm" variant="ghost" onClick={() => stats.remove(i)}>
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </Button>
          </div>
        ))}
      </section>

      {/* ── Challenges ────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">Challenges</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => challenges.append({ title: "", desc: "" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
        {challenges.fields.map((f, i) => (
          <div key={f.id} className="bg-secondary rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Challenge {i + 1}</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => challenges.remove(i)}>
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </Button>
            </div>
            <Input {...register(`challenges.${i}.title`)} placeholder="Title" />
            <Textarea {...register(`challenges.${i}.desc`)} rows={2} className="resize-none" placeholder="Description" />
          </div>
        ))}
      </section>

      {/* ── Services on Page ──────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">How We Help <span className="text-muted-foreground font-normal text-sm">(services shown on this industry page)</span></h2>
          <Button type="button" size="sm" variant="outline" onClick={() => services.append({ icon_name: "Wrench", title: "", desc: "" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
        {services.fields.map((f, i) => (
          <div key={f.id} className="bg-secondary rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Service {i + 1}</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => services.remove(i)}>
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </Button>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-3 items-end">
              <div className="space-y-1.5">
                <Label className="text-xs">Icon</Label>
                <Controller control={control} name={`industry_services.${i}.icon_name`} render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map(({ name }) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Title</Label>
                <Input {...register(`industry_services.${i}.title`)} placeholder="Service title" />
              </div>
            </div>
            <Textarea {...register(`industry_services.${i}.desc`)} rows={2} className="resize-none" placeholder="Service description" />
          </div>
        ))}
      </section>

      {/* ── Case Study ────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold border-b border-border pb-2">
          Case Study <span className="text-muted-foreground font-normal text-sm">(leave company blank to hide)</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Company Name</Label>
            <Input {...register("case_study_company")} placeholder="e.g. FreshMart Supermarkets" />
          </div>
          <div className="space-y-1.5">
            <Label>Challenge</Label>
            <Textarea {...register("case_study_challenge")} rows={3} className="resize-none" placeholder="What problem did they have?" />
          </div>
          <div className="space-y-1.5">
            <Label>Solution</Label>
            <Textarea {...register("case_study_solution")} rows={3} className="resize-none" placeholder="What did you do?" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Result</Label>
            <Textarea {...register("case_study_result")} rows={2} className="resize-none" placeholder="What was the outcome?" />
          </div>
        </div>
      </section>
    </form>
  );
}

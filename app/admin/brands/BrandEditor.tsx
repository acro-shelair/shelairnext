"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { Brand } from "@/lib/supabase/content";
import { logActivity } from "@/lib/supabase/logging";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const schema = z.object({
  name:         z.string().min(1, "Required"),
  slug:         z.string().min(1, "Required").regex(/^[a-z0-9-]+$/),
  description:  z.string().min(1, "Required"),
  speciality:   z.string().min(1, "Required"),
  detail:       z.string().min(1, "Required"),
  position:     z.coerce.number().int().min(0),
  // Detail page
  tagline:      z.string(),
  hero_desc:    z.string(),
  about:        z.string(),
  stats:        z.array(z.object({ value: z.string(), label: z.string() })),
  common_issues: z.array(z.object({ title: z.string(), desc: z.string() })),
  services_offered: z.array(z.object({ text: z.string() })),
  product_types:    z.array(z.object({ text: z.string() })),
  related_brands:   z.array(z.object({ slug: z.string(), name: z.string(), desc: z.string() })),
});

type FormData = z.infer<typeof schema>;

export default function BrandEditor({ brand, nextPosition }: { brand?: Brand; nextPosition?: number }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!brand;

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:        brand?.name        ?? "",
      slug:        brand?.slug        ?? "",
      description: brand?.description ?? "",
      speciality:  brand?.speciality  ?? "",
      detail:      brand?.detail      ?? "",
      position:    brand?.position    ?? nextPosition ?? 0,
      tagline:     brand?.tagline     ?? "",
      hero_desc:   brand?.hero_desc   ?? "",
      about:       brand?.about       ?? "",
      stats:            (brand?.stats            as any[])?.map((s) => ({ value: s.value, label: s.label })) ?? [],
      common_issues:    (brand?.common_issues    as any[])?.map((i) => ({ title: i.title, desc: i.desc })) ?? [],
      services_offered: brand?.services_offered?.map((t) => ({ text: t })) ?? [],
      product_types:    brand?.product_types?.map((t) => ({ text: t })) ?? [],
      related_brands:   (brand?.related_brands   as any[])?.map((r) => ({ slug: r.slug, name: r.name, desc: r.desc })) ?? [],
    },
  });

  const stats      = useFieldArray({ control, name: "stats" });
  const issues     = useFieldArray({ control, name: "common_issues" });
  const services   = useFieldArray({ control, name: "services_offered" });
  const products   = useFieldArray({ control, name: "product_types" });
  const related    = useFieldArray({ control, name: "related_brands" });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setServerError(null);
    const supabase = createClient();
    const payload = {
      name:        data.name,
      slug:        data.slug,
      description: data.description,
      speciality:  data.speciality,
      detail:      data.detail,
      position:    data.position,
      tagline:     data.tagline,
      hero_desc:   data.hero_desc,
      about:       data.about,
      stats:            data.stats,
      common_issues:    data.common_issues,
      services_offered: data.services_offered.map((s) => s.text).filter(Boolean),
      product_types:    data.product_types.map((p) => p.text).filter(Boolean),
      related_brands:   data.related_brands,
    };
    try {
      if (isEdit) {
        const { error } = await supabase.from("brands").update(payload).eq("id", brand.id);
        if (error) throw error;
        await logActivity("update", "brands", `Updated brand: ${data.name}`);
      } else {
        const { error } = await supabase.from("brands").insert(payload);
        if (error) throw error;
        await logActivity("create", "brands", `Created brand: ${data.name}`);
      }
      router.push("/admin/brands");
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
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Brand" : "New Brand"}</h1>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Brand"}</Button>
        </div>
      </div>

      {serverError && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{serverError}</p>}

      {/* ── Listing card info ─────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">Listing Card</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Brand Name</Label>
            <Input {...register("name")}
              onBlur={(e) => { if (!isEdit) setValue("slug", toSlug(e.target.value)); }}
              placeholder="e.g. Bitzer" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input {...register("slug")} placeholder="bitzer" />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Speciality <span className="text-muted-foreground font-normal text-xs">(badge on card)</span></Label>
            <Input {...register("speciality")} placeholder="Compressors" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Detail <span className="text-muted-foreground font-normal text-xs">(one-liner on card)</span></Label>
            <Input {...register("detail")} placeholder="One of the world's leading compressor manufacturers…" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Description <span className="text-muted-foreground font-normal text-xs">(full description on card)</span></Label>
            <Textarea {...register("description")} rows={2} className="resize-none" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <div className="space-y-1.5 max-w-[120px]">
            <Label>Position</Label>
            <Input type="number" min={0} {...register("position")} />
          </div>
        </div>
      </section>

      {/* ── Detail page ────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">Detail Page</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Tagline <span className="text-muted-foreground font-normal text-xs">(page H1)</span></Label>
            <Input {...register("tagline")} placeholder="Authorised Bitzer Compressor Repairs & Servicing" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Hero Description</Label>
            <Textarea {...register("hero_desc")} rows={2} className="resize-none" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>About <span className="text-muted-foreground font-normal text-xs">(Why Choose a Specialist section)</span></Label>
            <Textarea {...register("about")} rows={4} className="resize-none" />
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">Stats</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => stats.append({ value: "", label: "" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
        {stats.fields.map((f, i) => (
          <div key={f.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div className="space-y-1.5">{i === 0 && <Label>Value</Label>}<Input {...register(`stats.${i}.value`)} placeholder="500+" /></div>
            <div className="space-y-1.5">{i === 0 && <Label>Label</Label>}<Input {...register(`stats.${i}.label`)} placeholder="Bitzer Repairs" /></div>
            <Button type="button" size="sm" variant="ghost" onClick={() => stats.remove(i)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
          </div>
        ))}
      </section>

      {/* ── Common Issues ──────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">Common Issues</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => issues.append({ title: "", desc: "" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
        {issues.fields.map((f, i) => (
          <div key={f.id} className="bg-secondary rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Issue {i + 1}</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => issues.remove(i)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
            </div>
            <Input {...register(`common_issues.${i}.title`)} placeholder="e.g. Compressor Burnout" />
            <Textarea {...register(`common_issues.${i}.desc`)} rows={2} className="resize-none" placeholder="Description" />
          </div>
        ))}
      </section>

      {/* ── Services Offered ───────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">Services Offered</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => services.append({ text: "" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
        {services.fields.map((f, i) => (
          <div key={f.id} className="flex gap-2">
            <Input {...register(`services_offered.${i}.text`)} placeholder={`Service ${i + 1}`} className="flex-1" />
            <Button type="button" size="sm" variant="ghost" onClick={() => services.remove(i)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
          </div>
        ))}
      </section>

      {/* ── Product Types ──────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">Product Types</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => products.append({ text: "" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
        {products.fields.map((f, i) => (
          <div key={f.id} className="flex gap-2">
            <Input {...register(`product_types.${i}.text`)} placeholder={`e.g. Scroll Compressors`} className="flex-1" />
            <Button type="button" size="sm" variant="ghost" onClick={() => products.remove(i)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
          </div>
        ))}
      </section>

      {/* ── Related Brands ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">Related Brands</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => related.append({ slug: "", name: "", desc: "" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
        {related.fields.map((f, i) => (
          <div key={f.id} className="bg-secondary rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Related Brand {i + 1}</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => related.remove(i)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input {...register(`related_brands.${i}.slug`)} placeholder="Slug (e.g. copeland)" />
              <Input {...register(`related_brands.${i}.name`)} placeholder="Name (e.g. Copeland)" />
            </div>
            <Input {...register(`related_brands.${i}.desc`)} placeholder="Short description" />
          </div>
        ))}
      </section>
    </form>
  );
}

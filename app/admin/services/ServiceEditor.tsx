"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { Service } from "@/lib/supabase/content";
import { logActivity } from "@/lib/supabase/logging";
import { ICON_OPTIONS, getIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";

// ─── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  icon_name:   z.string().min(1),
  title:       z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  position:    z.coerce.number().int().min(0),
  // Detail page
  slug:                 z.string().regex(/^[a-z0-9-]*$/, "Lowercase, numbers, hyphens only").optional().or(z.literal("")),
  subtitle:             z.string(),
  hero_desc:            z.string(),
  meta_description:     z.string(),
  overview:             z.string(),
  benefits:             z.array(z.object({ text: z.string() })),
  stats:                z.array(z.object({ value: z.string(), label: z.string() })),
  process_steps:        z.array(z.object({ step: z.string(), title: z.string(), desc: z.string() })),
  faqs:                 z.array(z.object({ q: z.string(), a: z.string() })),
  related_service_slugs: z.string(),
  cta_heading:     z.string(),
  cta_description: z.string(),
  cta_button_text: z.string(),
  cta_button_link: z.string(),
});

type FormData = z.infer<typeof schema>;

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ServiceEditor({ service, nextPosition }: { service?: Service; nextPosition?: number }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!service;

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      icon_name:            service?.icon_name            ?? "Wrench",
      title:                service?.title                ?? "",
      description:          service?.description          ?? "",
      position:             service?.position             ?? nextPosition ?? 0,
      slug:                 service?.slug                 ?? "",
      subtitle:             service?.subtitle             ?? "",
      hero_desc:            service?.hero_desc            ?? "",
      meta_description:     service?.meta_description     ?? "",
      overview:             service?.overview             ?? "",
      benefits:             service?.benefits?.map((t) => ({ text: t }))        ?? [],
      stats:                (service?.stats               as any[])?.map((s) => ({ value: s.value, label: s.label })) ?? [],
      process_steps:        (service?.process_steps       as any[])?.map((s) => ({ step: s.step, title: s.title, desc: s.desc })) ?? [],
      faqs:                 (service?.faqs                as any[])?.map((f) => ({ q: f.q, a: f.a })) ?? [],
      related_service_slugs: service?.related_service_slugs?.join(", ") ?? "",
      cta_heading:           service?.cta_heading      ?? "",
      cta_description:       service?.cta_description  ?? "",
      cta_button_text:       service?.cta_button_text  ?? "",
      cta_button_link:       service?.cta_button_link  ?? "",
    },
  });

  const selectedIcon = watch("icon_name");
  const PreviewIcon = getIcon(selectedIcon);

  const benefits      = useFieldArray({ control, name: "benefits" });
  const stats         = useFieldArray({ control, name: "stats" });
  const processSteps  = useFieldArray({ control, name: "process_steps" });
  const faqs          = useFieldArray({ control, name: "faqs" });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setServerError(null);
    const supabase = createClient();

    const payload = {
      icon_name:             data.icon_name,
      title:                 data.title,
      description:           data.description,
      position:              data.position,
      slug:                  data.slug || null,
      subtitle:              data.subtitle,
      hero_desc:             data.hero_desc,
      meta_description:      data.meta_description,
      overview:              data.overview,
      benefits:              data.benefits.map((b) => b.text).filter(Boolean),
      stats:                 data.stats,
      process_steps:         data.process_steps,
      faqs:                  data.faqs,
      related_service_slugs: data.related_service_slugs.split(",").map((s) => s.trim()).filter(Boolean),
      cta_heading:           data.cta_heading,
      cta_description:       data.cta_description,
      cta_button_text:       data.cta_button_text,
      cta_button_link:       data.cta_button_link,
    };

    try {
      if (isEdit) {
        const { error } = await supabase.from("services").update(payload).eq("id", service.id);
        if (error) throw error;
        await logActivity("update", "services", `Updated service: ${data.title}`);
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
        await logActivity("create", "services", `Created service: ${data.title}`);
      }
      router.push("/admin/services");
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
        <h1 className="text-2xl font-bold">{isEdit ? "Edit Service" : "New Service"}</h1>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Service"}</Button>
        </div>
      </div>

      {serverError && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{serverError}</p>
      )}

      {/* ── Card fields ────────────────────────────────────────────────────── */}
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
            <Input {...register("title")} onBlur={(e) => { if (!isEdit) setValue("slug", toSlug(e.target.value)); }} placeholder="e.g. 24/7 Emergency Repairs" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Description <span className="text-muted-foreground font-normal text-xs">(shown on service card)</span></Label>
            <Textarea {...register("description")} rows={2} className="resize-none" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <div className="space-y-1.5 max-w-[120px]">
            <Label>Position</Label>
            <Input type="number" min={0} {...register("position")} />
          </div>
        </div>
      </section>

      {/* ── Detail page fields ─────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">Detail Page</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label>Slug <span className="text-muted-foreground font-normal text-xs">(auto-generated, editable)</span></Label>
            <Input {...register("slug")} placeholder="emergency-refrigeration-repairs" />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Subtitle <span className="text-muted-foreground font-normal text-xs">(badge text on detail page)</span></Label>
            <Input {...register("subtitle")} placeholder="Emergency Repairs" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Hero Description</Label>
            <Textarea {...register("hero_desc")} rows={2} className="resize-none" placeholder="Introductory paragraph shown in the hero section." />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Meta Description <span className="text-muted-foreground font-normal text-xs">SEO — under 160 chars</span></Label>
            <Textarea {...register("meta_description")} rows={2} className="resize-none" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Overview <span className="text-muted-foreground font-normal text-xs">(What's Included section)</span></Label>
            <Textarea {...register("overview")} rows={4} className="resize-none" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Related Service Slugs <span className="text-muted-foreground font-normal text-xs">comma-separated</span></Label>
            <Input {...register("related_service_slugs")} placeholder="emergency-refrigeration-repairs, cold-room-construction" />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">CTA Banner <span className="text-muted-foreground font-normal text-xs">Leave blank for default</span></h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <Label>CTA Heading</Label>
            <Input {...register("cta_heading")} placeholder="Need Refrigeration, HVAC or Beer System Help?" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>CTA Description</Label>
            <Textarea {...register("cta_description")} rows={2} className="resize-none" placeholder="Fast Repairs, servicing and installations across Brisbane, the Gold Coast and Sunshine Coast." />
          </div>
          <div className="space-y-1.5">
            <Label>CTA Button Text</Label>
            <Input {...register("cta_button_text")} placeholder="Get a Free Quote" />
          </div>
          <div className="space-y-1.5">
            <Label>CTA Button Link</Label>
            <Input {...register("cta_button_link")} placeholder="/contact" />
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">Stats</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => stats.append({ value: "", label: "" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Stat
          </Button>
        </div>
        {stats.fields.map((f, i) => (
          <div key={f.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div className="space-y-1.5">
              {i === 0 && <Label>Value</Label>}
              <Input {...register(`stats.${i}.value`)} placeholder="e.g. 2hr" />
            </div>
            <div className="space-y-1.5">
              {i === 0 && <Label>Label</Label>}
              <Input {...register(`stats.${i}.label`)} placeholder="e.g. Avg Response" />
            </div>
            <Button type="button" size="sm" variant="ghost" onClick={() => stats.remove(i)}>
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </Button>
          </div>
        ))}
      </section>

      {/* ── Benefits ───────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">Key Benefits</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => benefits.append({ text: "" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Benefit
          </Button>
        </div>
        {benefits.fields.map((f, i) => (
          <div key={f.id} className="flex gap-3 items-center">
            <Input {...register(`benefits.${i}.text`)} placeholder={`Benefit ${i + 1}`} className="flex-1" />
            <Button type="button" size="sm" variant="ghost" onClick={() => benefits.remove(i)}>
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </Button>
          </div>
        ))}
      </section>

      {/* ── Process Steps ──────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">Process Steps</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => processSteps.append({ step: String(processSteps.fields.length + 1), title: "", desc: "" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Step
          </Button>
        </div>
        {processSteps.fields.map((f, i) => (
          <div key={f.id} className="bg-secondary rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Step {i + 1}</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => processSteps.remove(i)}>
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Input {...register(`process_steps.${i}.title`)} placeholder="Step title" />
              <Input {...register(`process_steps.${i}.step`)} placeholder="Step number" />
            </div>
            <Textarea {...register(`process_steps.${i}.desc`)} rows={2} className="resize-none" placeholder="Step description" />
          </div>
        ))}
      </section>

      {/* ── FAQs ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">FAQs</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => faqs.append({ q: "", a: "" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add FAQ
          </Button>
        </div>
        {faqs.fields.map((f, i) => (
          <div key={f.id} className="bg-secondary rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">FAQ {i + 1}</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => faqs.remove(i)}>
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </Button>
            </div>
            <Input {...register(`faqs.${i}.q`)} placeholder="Question" />
            <Textarea {...register(`faqs.${i}.a`)} rows={2} className="resize-none" placeholder="Answer" />
          </div>
        ))}
      </section>

    </form>
  );
}

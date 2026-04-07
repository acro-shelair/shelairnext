"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/supabase/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Phone, Mail, MapPin, Globe, Building2, Clock } from "lucide-react";
import { logActivity } from "@/lib/supabase/logging";

const schema = z.object({
  phone:        z.string().min(1, "Required"),
  email:        z.string().email("Valid email required"),
  address:      z.string().min(1, "Required"),
  abn:          z.string(),
  tagline:      z.string().min(1, "Required"),
  facebook_url: z.string(),
  linkedin_url: z.string(),
  instagram_url: z.string(),
  business_hours: z.string().min(1, "Required"),
  emergency_text: z.string().min(1, "Required"),
  footer_company_links: z.array(z.object({
    label: z.string().min(1),
    href:  z.string().min(1),
  })),
});

type FormData = z.infer<typeof schema>;

const DEFAULT_LINKS = [
  { label: "Our Process", href: "/process" },
  { label: "Projects",    href: "/projects" },
  { label: "Pricing",     href: "/pricing" },
  { label: "Resources",   href: "/resources" },
  { label: "Contact",     href: "/contact" },
];

export default function SettingsClient({ settings }: { settings: SiteSettings | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone:         settings?.phone         ?? "1300227600",
      email:         settings?.email         ?? "info@shelair.com.au",
      address:       settings?.address       ?? "Brisbane, SE Queensland",
      abn:           settings?.abn           ?? "43 672 578 264",
      tagline:       settings?.tagline       ?? "",
      facebook_url:  settings?.facebook_url  ?? "",
      linkedin_url:  settings?.linkedin_url  ?? "",
      instagram_url: settings?.instagram_url ?? "",
      business_hours: settings?.business_hours ?? "Mon–Fri: 7am – 5pm AEST",
      emergency_text: settings?.emergency_text ?? "24/7 Emergency Service Available",
      footer_company_links: (settings?.footer_company_links as any[]) ?? DEFAULT_LINKS,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "footer_company_links" });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setServerError(null);
    setSavedMsg(false);
    const supabase = createClient();
    try {
      const payload = { ...data, updated_at: new Date().toISOString() };
      if (settings?.id) {
        const { error } = await supabase.from("site_settings").update(payload).eq("id", settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_settings").insert(payload);
        if (error) throw error;
      }
      await logActivity("update", "site_settings", "Updated site settings");
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
      router.refresh();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 pb-16 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Business info used across the site and footer.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && <span className="text-sm text-green-600 font-medium">Saved ✓</span>}
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Settings"}</Button>
        </div>
      </div>

      {serverError && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{serverError}</p>}

      {/* ── Business Info ────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold border-b border-border pb-2 flex items-center gap-2">
          <Building2 className="w-4 h-4" /> Business Info
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</Label>
            <Input {...register("phone")} placeholder="1300227600" />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</Label>
            <Input {...register("email")} placeholder="info@example.com.au" />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Address</Label>
            <Input {...register("address")} placeholder="Brisbane, SE Queensland" />
          </div>
          <div className="space-y-1.5">
            <Label>ABN</Label>
            <Input {...register("abn")} placeholder="43 672 578 264" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Footer Tagline</Label>
            <Textarea {...register("tagline")} rows={2} className="resize-none" placeholder="Short description shown in the footer." />
            {errors.tagline && <p className="text-xs text-destructive">{errors.tagline.message}</p>}
          </div>
        </div>
      </section>

      {/* ── Social Links ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold border-b border-border pb-2 flex items-center gap-2">
          <Globe className="w-4 h-4" /> Social Links
        </h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Facebook URL</Label>
            <Input {...register("facebook_url")} placeholder="https://www.facebook.com/yourpage/" />
          </div>
          <div className="space-y-1.5">
            <Label>LinkedIn URL</Label>
            <Input {...register("linkedin_url")} placeholder="https://www.linkedin.com/company/yourcompany/" />
          </div>
          <div className="space-y-1.5">
            <Label>Instagram URL <span className="text-muted-foreground font-normal text-xs">(optional)</span></Label>
            <Input {...register("instagram_url")} placeholder="https://www.instagram.com/yourpage/" />
          </div>
        </div>
      </section>

      {/* ── Business Hours ───────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold border-b border-border pb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Business Hours
        </h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Hours</Label>
            <Input {...register("business_hours")} placeholder="Mon–Fri: 7am – 5pm AEST" />
            {errors.business_hours && <p className="text-xs text-destructive">{errors.business_hours.message}</p>}
            <p className="text-xs text-muted-foreground">Shown on the contact page and footer.</p>
          </div>
          <div className="space-y-1.5">
            <Label>Emergency Text</Label>
            <Input {...register("emergency_text")} placeholder="24/7 Emergency Service Available" />
            {errors.emergency_text && <p className="text-xs text-destructive">{errors.emergency_text.message}</p>}
          </div>
        </div>
      </section>

      {/* ── Footer Company Links ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">Footer — Company Links</h2>
          <Button type="button" size="sm" variant="outline" onClick={() => append({ label: "", href: "/" })}>
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Link
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">These appear in the "Company" column of the footer.</p>
        {fields.map((f, i) => (
          <div key={f.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center">
            <Input {...register(`footer_company_links.${i}.label`)} placeholder="Label" />
            <Input {...register(`footer_company_links.${i}.href`)} placeholder="/page-path" />
            <Button type="button" size="sm" variant="ghost" onClick={() => remove(i)}>
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </Button>
          </div>
        ))}
      </section>
    </form>
  );
}

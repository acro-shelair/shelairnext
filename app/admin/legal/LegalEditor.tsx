"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { LegalPage } from "@/lib/supabase/legal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, GripVertical } from "lucide-react";
import { logActivity } from "@/lib/supabase/logging";
import { termsContent } from "@/data/legal";

// ── Schema ─────────────────────────────────────────────────────────────────

const schema = z.object({
  title: z.string().min(1, "Required"),
  intro: z.string(),
  effective_date: z.string(),
  qbcc: z.string(),
  abn: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      body: z.string().min(1, "Required"),
    })
  ),
});

type FormData = z.infer<typeof schema>;

// ── Default data helpers ────────────────────────────────────────────────────

function termsToFormSections(): FormData["sections"] {
  return termsContent.sections.map((section) => {
    let body = "";
    if (section.bodies && section.bodies.length > 0) {
      body = section.bodies.join("\n\n");
    }
    if (section.numberedItems && section.numberedItems.length > 0) {
      const itemsText = section.numberedItems
        .map((item) => `${item.id} — ${item.text}`)
        .join("\n\n");
      body = body ? `${body}\n\n${itemsText}` : itemsText;
    }
    return {
      heading: section.heading,
      body,
    };
  });
}

const DEFAULT_PRIVACY_SECTIONS: FormData["sections"] = [
  {
    heading: "",
    body: "Shelair is Brisbane and South-East Queensland's trusted commercial air conditioning specialist, providing 24/7 emergency repairs, preventative maintenance, and cold room construction since 1972. We are committed to handling your personal information responsibly and transparently. This Privacy Policy explains how Shelair collects, uses, stores, and discloses personal information in accordance with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).",
  },
  {
    heading: "1. Introduction",
    body: 'Shelair ("we", "us", "our") is committed to protecting the privacy of our clients, website visitors, and business partners. If you have questions about this policy or how we handle your data, please contact us using the details in Section 11.',
  },
  {
    heading: "2. Information We Collect",
    body: "We may collect the following types of personal information:\n\nContact details: Name, phone number, email address, and business address.\n\nBusiness information: Company name, ABN, site location, and equipment details.\n\nService records: Details of equipment serviced, maintenance history, and job reports.\n\nWebsite usage data: IP address, browser type, pages visited, and cookies (see Section 7).\n\nCommunication records: Emails, phone call notes, and form submissions.",
  },
  {
    heading: "3. How We Collect Information",
    body: "We collect personal information through:\n\nContact and quote request forms on this website.\n\nPhone calls and emails with our team.\n\nService visits and on-site inspections.\n\nThird-party referrals and supplier networks.\n\nAutomated website analytics tools.",
  },
  {
    heading: "4. How We Use Your Information",
    body: "We use personal information to:\n\nProvide, schedule, and manage commercial air conditioning and cold room services.\n\nPrepare quotes, invoices, and service reports.\n\nCommunicate about appointments, maintenance schedules, and follow-ups.\n\nComply with licensing, safety, and regulatory obligations (QBCC, ARC).\n\nImprove our website, services, and customer experience.\n\nSend relevant service updates or promotional information (with your consent).",
  },
  {
    heading: "5. Disclosure of Information",
    body: "We may share your personal information with:\n\nEquipment suppliers and manufacturers (e.g., Bitzer, Copeland, Danfoss) for warranty and service purposes.\n\nSubcontractors engaged to perform services on our behalf.\n\nRegulatory authorities where required by law (e.g., QBCC, ARC, electrical safety regulators).\n\nProfessional advisors such as accountants or legal counsel.\n\nWe do not sell or rent your personal information to third parties for marketing purposes.",
  },
  {
    heading: "6. Data Security",
    body: "We take reasonable steps to protect personal information from misuse, interference, loss, and unauthorised access or disclosure. This includes secure digital storage, access controls, and staff training on privacy obligations.",
  },
  {
    heading: "7. Cookies & Analytics",
    body: "Our website uses cookies and analytics tools to understand how visitors interact with our site. This data is collected anonymously and used to improve website performance and user experience. You can manage cookie preferences through your browser settings.",
  },
  {
    heading: "8. Your Rights",
    body: "Under the Australian Privacy Principles, you have the right to:\n\nRequest access to the personal information we hold about you.\n\nRequest correction of inaccurate or outdated information.\n\nOpt out of marketing communications at any time.\n\nLodge a complaint if you believe your privacy has been breached.\n\nTo exercise any of these rights, please contact us using the details below.",
  },
  {
    heading: "9. Retention",
    body: "We retain personal information for as long as necessary to fulfil the purposes for which it was collected, comply with legal obligations, and support ongoing service relationships. Service records may be retained for the lifespan of installed equipment to support warranty and maintenance history.",
  },
  {
    heading: "10. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.",
  },
  {
    heading: "11. Contact Us",
    body: "If you have questions or concerns about this Privacy Policy or how we handle your personal information, please contact us:\n\nPhone: 1300 227 600\n\nEmail: admin@shelair.com.au\n\nAddress: Brisbane, SE Queensland",
  },
];

// ── Per-tab form ────────────────────────────────────────────────────────────

function LegalForm({
  pageType,
  initialData,
  defaultValues,
  showQbccAbn,
  saveLabel,
  logMsg,
}: {
  pageType: "terms" | "privacy";
  initialData: LegalPage | null;
  defaultValues: FormData;
  showQbccAbn: boolean;
  saveLabel: string;
  logMsg: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setServerError(null);
    setSavedMsg(false);
    const supabase = createClient();
    try {
      const payload = {
        type: pageType,
        title: data.title,
        intro: data.intro,
        effective_date: data.effective_date,
        qbcc: data.qbcc,
        abn: data.abn,
        sections: data.sections,
        updated_at: new Date().toISOString(),
      };
      if (initialData?.id) {
        const { error } = await supabase
          .from("legal_pages")
          .update(payload)
          .eq("id", initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("legal_pages").insert(payload);
        if (error) throw error;
      }
      await logActivity("update", "legal_pages", logMsg);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Changes are published immediately on save.
        </p>
        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className="text-sm text-green-600 font-medium">Saved ✓</span>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : saveLabel}
          </Button>
        </div>
      </div>

      {serverError && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
          {serverError}
        </p>
      )}

      {/* ── Header fields ──────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold border-b border-border pb-2">
          Page Header
        </h2>
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input {...register("title")} placeholder="Terms & Conditions" />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Intro paragraph</Label>
          <Textarea
            {...register("intro")}
            rows={3}
            className="resize-none"
            placeholder="These Terms & Conditions apply to…"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Effective Date</Label>
            <Input
              {...register("effective_date")}
              placeholder="1 January 2026"
            />
          </div>
          {showQbccAbn && (
            <>
              <div className="space-y-1.5">
                <Label>QBCC Licence #</Label>
                <Input {...register("qbcc")} placeholder="15413155" />
              </div>
              <div className="space-y-1.5">
                <Label>ABN</Label>
                <Input {...register("abn")} placeholder="43 672 578 264" />
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Sections ───────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold">Sections</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => append({ heading: "", body: "" })}
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Section
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          In the Body field, use a blank line between paragraphs — each blank
          line creates a new paragraph on the public page.
        </p>

        <div className="space-y-6">
          {fields.map((field, i) => (
            <div
              key={field.id}
              className="border border-border rounded-lg p-4 space-y-3 relative"
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex-1">
                  Section {i + 1}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => remove(i)}
                  className="h-7 px-2"
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label>Heading</Label>
                <Input
                  {...register(`sections.${i}.heading`)}
                  placeholder="1. Definitions & Precedence"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Body</Label>
                <Textarea
                  {...register(`sections.${i}.body`)}
                  rows={6}
                  className="resize-y font-mono text-sm"
                  placeholder="Section content… Use a blank line between paragraphs."
                />
                {errors.sections?.[i]?.body && (
                  <p className="text-xs text-destructive">
                    {errors.sections[i]!.body!.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">
            No sections yet. Click &ldquo;Add Section&rdquo; to get started.
          </p>
        )}
      </section>

      {/* Bottom save bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        {savedMsg && (
          <span className="text-sm text-green-600 font-medium">Saved ✓</span>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : saveLabel}
        </Button>
      </div>
    </form>
  );
}

// ── Root component ──────────────────────────────────────────────────────────

export default function LegalEditor({
  termsData,
  privacyData,
}: {
  termsData: LegalPage | null;
  privacyData: LegalPage | null;
}) {
  const termsDefaults: FormData = {
    title: termsData?.title ?? termsContent.title,
    intro: termsData?.intro ?? termsContent.intro,
    effective_date: termsData?.effective_date ?? termsContent.effectiveDate,
    qbcc: termsData?.qbcc ?? termsContent.qbcc,
    abn: termsData?.abn ?? termsContent.abn,
    sections: termsData?.sections ?? termsToFormSections(),
  };

  const privacyDefaults: FormData = {
    title: privacyData?.title ?? "Privacy Policy",
    intro: privacyData?.intro ?? "",
    effective_date: privacyData?.effective_date ?? "March 2026",
    qbcc: privacyData?.qbcc ?? "",
    abn: privacyData?.abn ?? "",
    sections: privacyData?.sections ?? DEFAULT_PRIVACY_SECTIONS,
  };

  return (
    <Tabs defaultValue="terms">
      <TabsList className="mb-6">
        <TabsTrigger value="terms">Terms &amp; Conditions</TabsTrigger>
        <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
      </TabsList>

      <TabsContent value="terms">
        <LegalForm
          pageType="terms"
          initialData={termsData}
          defaultValues={termsDefaults}
          showQbccAbn={true}
          saveLabel="Save Terms & Conditions"
          logMsg="Updated terms & conditions"
        />
      </TabsContent>

      <TabsContent value="privacy">
        <LegalForm
          pageType="privacy"
          initialData={privacyData}
          defaultValues={privacyDefaults}
          showQbccAbn={false}
          saveLabel="Save Privacy Policy"
          logMsg="Updated privacy policy"
        />
      </TabsContent>
    </Tabs>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { PricingTier } from "@/lib/supabase/content";
import { logActivity } from "@/lib/supabase/logging";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, PlusCircle, Star } from "lucide-react";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name:     z.string().min(1, "Required"),
  description: z.string(),
  price:    z.string().min(1, "Required"),
  unit:     z.string().min(1, "Required"),
  popular:  z.boolean(),
  features: z.array(z.object({ text: z.string() })),
});
type FormData = z.infer<typeof schema>;

// ─── Add / Edit dialog ────────────────────────────────────────────────────────

function TierDialog({
  tier,
  position,
  onSuccess,
}: {
  tier?: PricingTier;
  position?: number;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!tier;

  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors, isSubmitting } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        name:        tier?.name        ?? "",
        description: tier?.description ?? "",
        price:       tier?.price       ?? "",
        unit:        tier?.unit        ?? "",
        popular:     tier?.popular     ?? false,
        features:    tier?.features?.map((t) => ({ text: t })) ?? [{ text: "" }],
      },
    });

  const features = useFieldArray({ control, name: "features" });
  const popular = watch("popular");

  const onSubmit = async (data: FormData) => {
    setError(null);
    const supabase = createClient();
    const payload = {
      name:        data.name,
      description: data.description,
      price:       data.price,
      unit:        data.unit,
      popular:     data.popular,
      features:    data.features.map((f) => f.text).filter(Boolean),
    };
    try {
      if (isEdit) {
        const { error } = await supabase.from("pricing_tiers").update(payload).eq("id", tier.id);
        if (error) throw error;
        await logActivity("update", "pricing_tiers", `Updated pricing tier: ${data.name}`);
      } else {
        const { error } = await supabase.from("pricing_tiers").insert({ ...payload, position: position ?? 0 });
        if (error) throw error;
        await logActivity("create", "pricing_tiers", `Created pricing tier: ${data.name}`);
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
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Tier</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Pricing Tier" : "New Pricing Tier"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input {...register("name")} placeholder="e.g. Maintenance Plan" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Description <span className="text-muted-foreground font-normal text-xs">(short subtitle)</span></Label>
            <Input {...register("description")} placeholder="Scheduled servicing to prevent breakdowns." />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Price</Label>
              <Input {...register("price")} placeholder="From $450" />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Input {...register("unit")} placeholder="per month" />
              {errors.unit && <p className="text-xs text-destructive">{errors.unit.message}</p>}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Features</Label>
              <Button type="button" size="sm" variant="outline" onClick={() => features.append({ text: "" })}>
                <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </div>
            {features.fields.map((f, i) => (
              <div key={f.id} className="flex gap-2">
                <Input {...register(`features.${i}.text`)} placeholder={`Feature ${i + 1}`} className="flex-1" />
                <Button type="button" size="sm" variant="ghost" onClick={() => features.remove(i)}>
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          {/* Popular toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setValue("popular", !popular)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                popular
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-border"
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              {popular ? "Most Popular (on)" : "Most Popular (off)"}
            </button>
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

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PricingClient({ initialTiers }: { initialTiers: PricingTier[] }) {
  const router = useRouter();
  const [tiers, setTiers] = useState(initialTiers);

  const refresh = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("pricing_tiers").select("*").order("position");
    if (data) setTiers(data);
    router.refresh();
  };

  const remove = async (tier: PricingTier) => {
    if (!confirm(`Delete pricing tier "${tier.name}"?`)) return;
    const supabase = createClient();
    await supabase.from("pricing_tiers").delete().eq("id", tier.id);
    await logActivity("delete", "pricing_tiers", `Deleted pricing tier: ${tier.name}`);
    setTiers((prev) => prev.filter((x) => x.id !== tier.id));
  };

  const move = async (index: number, direction: "up" | "down") => {
    const updated = [...tiers];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= updated.length) return;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    const supabase = createClient();
    await Promise.all([
      supabase.from("pricing_tiers").update({ position: swapIndex }).eq("id", updated[swapIndex].id),
      supabase.from("pricing_tiers").update({ position: index }).eq("id", updated[index].id),
    ]);
    setTiers(updated.map((t, pos) => ({ ...t, position: pos })));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pricing Tiers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Shown on the /pricing page.
          </p>
        </div>
        <TierDialog position={tiers.length} onSuccess={refresh} />
      </div>

      {tiers.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">
          No pricing tiers yet. Add your first one.
        </p>
      ) : (
        <div className="space-y-3">
          {tiers.map((tier, i) => (
            <div key={tier.id} className="bg-card border border-border rounded-2xl p-5 flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm">{tier.name}</p>
                  {tier.popular && <Badge className="text-xs">Most Popular</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{tier.description}</p>
                <p className="text-lg font-bold">
                  {tier.price} <span className="text-sm font-normal text-muted-foreground">/ {tier.unit}</span>
                </p>
                {tier.features.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {tier.features.map((f) => (
                      <li key={f} className="text-xs text-muted-foreground">• {f}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <TierDialog tier={tier} onSuccess={refresh} />
                  <Button size="sm" variant="ghost" onClick={() => remove(tier)}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => move(i, "up")}
                    disabled={i === 0}
                    className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => move(i, "down")}
                    disabled={i === tiers.length - 1}
                    className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

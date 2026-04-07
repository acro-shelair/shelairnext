"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { Brand, OtherBrand } from "@/lib/supabase/content";
import { logActivity } from "@/lib/supabase/logging";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Tag } from "lucide-react";

// ─── Other Brand dialog ────────────────────────────────────────────────────────

const otherSchema = z.object({
  name:     z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
});
type OtherData = z.infer<typeof otherSchema>;

function OtherBrandDialog({
  brand,
  position,
  onSuccess,
}: {
  brand?: OtherBrand;
  position?: number;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } =
    useForm<OtherData>({
      resolver: zodResolver(otherSchema),
      defaultValues: { name: brand?.name ?? "", category: brand?.category ?? "" },
    });

  const onSubmit = async (data: OtherData) => {
    setError(null);
    const supabase = createClient();
    try {
      if (brand) {
        const { error } = await supabase.from("other_brands").update(data).eq("id", brand.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("other_brands").insert({ ...data, position: position ?? 0 });
        if (error) throw error;
      }
      reset();
      setOpen(false);
      onSuccess();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed."); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {brand ? (
          <Button size="sm" variant="ghost"><Pencil className="w-3.5 h-3.5" /></Button>
        ) : (
          <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-1" /> Add Brand</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{brand ? "Edit Brand" : "Add Brand"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Brand Name</Label>
            <Input {...register("name")} placeholder="e.g. Daikin" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Input {...register("category")} placeholder="e.g. Refrigeration & HVAC" />
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
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

export default function BrandsClient({
  initialBrands,
  initialOtherBrands,
}: {
  initialBrands: Brand[];
  initialOtherBrands: OtherBrand[];
}) {
  const router = useRouter();
  const [brands, setBrands] = useState(initialBrands);
  const [otherBrands, setOtherBrands] = useState(initialOtherBrands);

  const refresh = () => router.refresh();

  const deleteBrand = async (brand: Brand) => {
    if (!confirm(`Delete "${brand.name}"?`)) return;
    const supabase = createClient();
    await supabase.from("brands").delete().eq("id", brand.id);
    await logActivity("delete", "brands", `Deleted brand: ${brand.name}`);
    setBrands((prev) => prev.filter((b) => b.id !== brand.id));
  };

  const deleteOtherBrand = async (brand: OtherBrand) => {
    if (!confirm(`Delete "${brand.name}"?`)) return;
    const supabase = createClient();
    await supabase.from("other_brands").delete().eq("id", brand.id);
    await logActivity("delete", "other_brands", `Deleted brand: ${brand.name}`);
    setOtherBrands((prev) => prev.filter((b) => b.id !== brand.id));
  };

  const moveBrand = async (index: number, direction: "up" | "down") => {
    const updated = [...brands];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= updated.length) return;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    const supabase = createClient();
    await Promise.all([
      supabase.from("brands").update({ position: swapIndex }).eq("id", updated[swapIndex].id),
      supabase.from("brands").update({ position: index }).eq("id", updated[index].id),
    ]);
    setBrands(updated.map((b, pos) => ({ ...b, position: pos })));
  };

  return (
    <div className="space-y-10">
      {/* ── Featured Brands ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Brands</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Featured brands with full detail pages.</p>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/brands/new"><Plus className="w-4 h-4 mr-1" /> New Brand</Link>
          </Button>
        </div>

        {brands.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No featured brands yet.</p>
        ) : (
          <div className="space-y-2">
            {brands.map((brand, i) => (
              <div key={brand.id} className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm">{brand.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{brand.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{brand.speciality} · /{brand.slug}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveBrand(i, "up")} disabled={i === 0} className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => moveBrand(i, "down")} disabled={i === brands.length - 1} className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/brands/${brand.id}/edit`}><Pencil className="w-3.5 h-3.5" /></Link>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteBrand(brand)}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Other Brands ────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Other Brands</h2>
            <p className="text-sm text-muted-foreground">Shown as pills on the brands page — no detail page.</p>
          </div>
          <OtherBrandDialog position={otherBrands.length} onSuccess={refresh} />
        </div>

        {otherBrands.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-6">No other brands yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {otherBrands.map((brand) => (
              <div key={brand.id} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{brand.name}</p>
                  <p className="text-xs text-muted-foreground">{brand.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  <OtherBrandDialog brand={brand} onSuccess={refresh} />
                  <Button size="sm" variant="ghost" onClick={() => deleteOtherBrand(brand)}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

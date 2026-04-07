"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { LocationCity, LocationSuburb, LocationStat } from "@/lib/supabase/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronRight, MapPin,
} from "lucide-react";

// ─── Stats Editor ─────────────────────────────────────────────────────────────

function StatsEditor({ stats, onChange }: { stats: LocationStat[]; onChange: (s: LocationStat[]) => void }) {
  const update = (i: number, field: "label" | "value", val: string) => {
    const next = [...stats];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };
  const add = () => onChange([...stats, { label: "", value: "" }]);
  const remove = (i: number) => onChange(stats.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <Label>Stats</Label>
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input placeholder="Label" value={stat.label} onChange={(e) => update(i, "label", e.target.value)} className="flex-1" />
          <Input placeholder="Value" value={stat.value} onChange={(e) => update(i, "value", e.target.value)} className="flex-1" />
          <Button type="button" size="sm" variant="ghost" onClick={() => remove(i)}>
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </Button>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={add}>
        <Plus className="w-3.5 h-3.5 mr-1" /> Add Stat
      </Button>
    </div>
  );
}

// ─── City dialog ──────────────────────────────────────────────────────────────

const citySchema = z.object({
  name:               z.string().min(1, "Required"),
  slug:               z.string().min(1).regex(/^[a-z0-9-]+$/),
  region_description: z.string().min(1, "Required"),
  zones:              z.string(),
  sample_suburbs:     z.string(),
});
type CityForm = z.infer<typeof citySchema>;

function CityDialog({ city, position, onSuccess }: { city?: LocationCity; position?: number; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<LocationStat[]>(city?.stats ?? []);
  const isEdit = !!city;

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<CityForm>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name:               city?.name               ?? "",
      slug:               city?.slug               ?? "",
      region_description: city?.region_description ?? "",
      zones:              city?.zones?.join(", ")  ?? "",
      sample_suburbs:     city?.sample_suburbs?.join(", ") ?? "",
    },
  });

  const onSubmit = async (data: CityForm) => {
    setError(null);
    const supabase = createClient();
    const cleanStats = stats.filter((s) => s.label.trim() && s.value.trim());
    const payload = {
      name:               data.name,
      slug:               data.slug,
      region_description: data.region_description,
      zones:              data.zones.split(",").map((s) => s.trim()).filter(Boolean),
      sample_suburbs:     data.sample_suburbs.split(",").map((s) => s.trim()).filter(Boolean),
      stats:              cleanStats,
    };
    try {
      if (isEdit) {
        const { error } = await supabase.from("location_cities").update(payload).eq("id", city.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("location_cities").insert({ ...payload, position: position ?? 0 });
        if (error) throw error;
      }
      reset(); setStats([]); setOpen(false); onSuccess();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed."); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v && city) setStats(city.stats ?? []); }}>
      <DialogTrigger asChild>
        {isEdit
          ? <Button size="sm" variant="ghost"><Pencil className="w-3.5 h-3.5" /></Button>
          : <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New City</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isEdit ? "Edit City" : "New City"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>City Name</Label>
              <Input {...register("name")} placeholder="Brisbane" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input {...register("slug")} placeholder="brisbane" />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Region Description</Label>
            <Textarea {...register("region_description")} rows={2} className="resize-none" />
            {errors.region_description && <p className="text-xs text-destructive">{errors.region_description.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Zones <span className="text-muted-foreground text-xs font-normal">comma-separated</span></Label>
            <Input {...register("zones")} placeholder="CBD, Northside, Southside" />
          </div>
          <div className="space-y-1.5">
            <Label>Sample Suburbs <span className="text-muted-foreground text-xs font-normal">shown on hub page, comma-separated</span></Label>
            <Input {...register("sample_suburbs")} placeholder="Fortitude Valley, Chermside" />
          </div>
          <StatsEditor stats={stats} onChange={setStats} />
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

// ─── Suburb dialog ────────────────────────────────────────────────────────────

const suburbSchema = z.object({
  name:               z.string().min(1, "Required"),
  slug:               z.string().min(1).regex(/^[a-z0-9-]+$/),
  zone:               z.string().min(1, "Required"),
  business_types:     z.string().min(1, "Required"),
  venue_types:        z.string(),
  local_context_text: z.string().min(1, "Required"),
  nearby_suburbs:     z.string(),
});
type SuburbForm = z.infer<typeof suburbSchema>;

function SuburbDialog({
  cityId, suburb, position, onSuccess,
}: { cityId: string; suburb?: LocationSuburb; position?: number; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<LocationStat[]>(suburb?.stats ?? []);
  const isEdit = !!suburb;

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<SuburbForm>({
    resolver: zodResolver(suburbSchema),
    defaultValues: {
      name:               suburb?.name               ?? "",
      slug:               suburb?.slug               ?? "",
      zone:               suburb?.zone               ?? "",
      business_types:     suburb?.business_types     ?? "",
      venue_types:        suburb?.venue_types?.join(", ")     ?? "",
      local_context_text: suburb?.local_context_text ?? "",
      nearby_suburbs:     suburb?.nearby_suburbs?.join(", ")  ?? "",
    },
  });

  const onSubmit = async (data: SuburbForm) => {
    setError(null);
    const supabase = createClient();
    const cleanStats = stats.filter((s) => s.label.trim() && s.value.trim());
    const payload = {
      city_id:            cityId,
      name:               data.name,
      slug:               data.slug,
      zone:               data.zone,
      business_types:     data.business_types,
      venue_types:        data.venue_types.split(",").map((s) => s.trim()).filter(Boolean),
      local_context_text: data.local_context_text,
      nearby_suburbs:     data.nearby_suburbs.split(",").map((s) => s.trim()).filter(Boolean),
      stats:              cleanStats,
    };
    try {
      if (isEdit) {
        const { error } = await supabase.from("location_suburbs").update(payload).eq("id", suburb.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("location_suburbs").insert({ ...payload, position: position ?? 0 });
        if (error) throw error;
      }
      reset(); setStats([]); setOpen(false); onSuccess();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed."); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v && suburb) setStats(suburb.stats ?? []); }}>
      <DialogTrigger asChild>
        {isEdit
          ? <Button size="sm" variant="ghost"><Pencil className="w-3.5 h-3.5" /></Button>
          : <Button size="sm" variant="outline"><Plus className="w-3.5 h-3.5 mr-1" /> Add Suburb</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isEdit ? "Edit Suburb" : "Add Suburb"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Suburb Name</Label>
              <Input {...register("name")} placeholder="Fortitude Valley" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input {...register("slug")} placeholder="fortitude-valley" />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Zone</Label>
              <Input {...register("zone")} placeholder="CBD" />
              {errors.zone && <p className="text-xs text-destructive">{errors.zone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Business Types</Label>
              <Input {...register("business_types")} placeholder="Bars, restaurants & nightlife" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Venue Types <span className="text-muted-foreground text-xs font-normal">comma-separated</span></Label>
            <Input {...register("venue_types")} placeholder="Cocktail Bars, Nightclubs, Fine Dining" />
          </div>
          <div className="space-y-1.5">
            <Label>Local Context Text</Label>
            <Textarea {...register("local_context_text")} rows={3} className="resize-none" placeholder="Describe the local business landscape and why Shelair is the right choice..." />
            {errors.local_context_text && <p className="text-xs text-destructive">{errors.local_context_text.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Nearby Suburbs <span className="text-muted-foreground text-xs font-normal">comma-separated</span></Label>
            <Input {...register("nearby_suburbs")} placeholder="South Brisbane, Newstead, Bowen Hills" />
          </div>
          <StatsEditor stats={stats} onChange={setStats} />
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

type CityWithSuburbs = LocationCity & { location_suburbs: LocationSuburb[] };

export default function LocationsClient({ initialCities }: { initialCities: CityWithSuburbs[] }) {
  const router = useRouter();
  const [cities, setCities] = useState(initialCities);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const refresh = () => router.refresh();

  const toggleExpand = (id: string) =>
    setExpanded((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

  const deleteCity = async (city: CityWithSuburbs) => {
    if (!confirm(`Delete "${city.name}" and all its suburbs? This cannot be undone.`)) return;
    const supabase = createClient();
    await supabase.from("location_cities").delete().eq("id", city.id);
    setCities((prev) => prev.filter((c) => c.id !== city.id));
  };

  const deleteSuburb = async (suburb: LocationSuburb) => {
    if (!confirm(`Delete "${suburb.name}"?`)) return;
    const supabase = createClient();
    await supabase.from("location_suburbs").delete().eq("id", suburb.id);
    refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Locations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage service cities and suburbs. Each suburb gets its own SEO page.
          </p>
        </div>
        <CityDialog position={cities.length} onSuccess={refresh} />
      </div>

      <div className="space-y-3">
        {cities.map((city) => {
          const isOpen = expanded.has(city.id);
          return (
            <div key={city.id} className="border border-border rounded-xl overflow-hidden">
              {/* City row */}
              <div className="flex items-center gap-3 px-4 py-3 bg-card">
                <button
                  onClick={() => toggleExpand(city.id)}
                  className="flex items-center gap-2 flex-1 min-w-0 text-left"
                >
                  {isOpen
                    ? <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-semibold">{city.name}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {city.location_suburbs?.length ?? 0} suburbs
                  </Badge>
                </button>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <SuburbDialog cityId={city.id} position={city.location_suburbs?.length ?? 0} onSuccess={refresh} />
                  <CityDialog city={city} onSuccess={refresh} />
                  <Button size="sm" variant="ghost" onClick={() => deleteCity(city)}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </div>

              {/* Suburbs */}
              {isOpen && (
                <div className="border-t border-border divide-y divide-border bg-secondary/30">
                  {city.location_suburbs?.length === 0 ? (
                    <p className="px-8 py-4 text-sm text-muted-foreground">No suburbs yet. Add one above.</p>
                  ) : (
                    city.location_suburbs?.map((suburb) => (
                      <div key={suburb.id} className="flex items-center gap-3 px-8 py-2.5">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium">{suburb.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">· {suburb.zone}</span>
                        </div>
                        <span className="text-xs text-muted-foreground hidden md:block truncate max-w-[200px]">
                          {suburb.business_types}
                        </span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <SuburbDialog cityId={city.id} suburb={suburb} onSuccess={refresh} />
                          <Button size="sm" variant="ghost" onClick={() => deleteSuburb(suburb)}>
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

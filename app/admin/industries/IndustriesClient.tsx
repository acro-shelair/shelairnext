"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Industry } from "@/lib/supabase/content";
import { logActivity } from "@/lib/supabase/logging";
import { getIcon } from "@/app/admin/services/icons";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";

export default function IndustriesClient({ initialIndustries }: { initialIndustries: Industry[] }) {
  const [industries, setIndustries] = useState(initialIndustries);

  const deleteIndustry = async (industry: Industry) => {
    if (!confirm(`Delete "${industry.title}"?`)) return;
    const supabase = createClient();
    await supabase.from("industries").delete().eq("id", industry.id);
    await logActivity("delete", "industries", `Deleted industry: ${industry.title}`);
    setIndustries((prev) => prev.filter((i) => i.id !== industry.id));
  };

  const move = async (index: number, direction: "up" | "down") => {
    const updated = [...industries];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= updated.length) return;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    const supabase = createClient();
    await Promise.all([
      supabase.from("industries").update({ position: swapIndex }).eq("id", updated[swapIndex].id),
      supabase.from("industries").update({ position: index }).eq("id", updated[index].id),
    ]);
    setIndustries(updated.map((i, pos) => ({ ...i, position: pos })));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Industries</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage industry pages shown on your site.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/industries/new">
            <Plus className="w-4 h-4 mr-1" /> New Industry
          </Link>
        </Button>
      </div>

      {industries.length === 0 ? (
        <p className="text-muted-foreground text-sm py-12 text-center">
          No industries yet.{" "}
          <Link href="/admin/industries/new" className="text-primary underline">Add your first.</Link>
        </p>
      ) : (
        <div className="space-y-2">
          {industries.map((industry, i) => {
            const Icon = getIcon(industry.icon_name);
            return (
              <div key={industry.id} className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{industry.title}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">/{industry.slug}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => move(i, "up")} disabled={i === 0} className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => move(i, "down")} disabled={i === industries.length - 1} className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/industries/${industry.id}/edit`}><Pencil className="w-3.5 h-3.5" /></Link>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteIndustry(industry)}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Service } from "@/lib/supabase/content";
import { logActivity } from "@/lib/supabase/logging";
import { getIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Star } from "lucide-react";

export default function ServicesClient({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);

  const deleteService = async (service: Service) => {
    if (!confirm(`Delete "${service.title}"?`)) return;
    const supabase = createClient();
    await supabase.from("services").delete().eq("id", service.id);
    await logActivity("delete", "services", `Deleted service: ${service.title}`);
    setServices((prev) => prev.filter((s) => s.id !== service.id));
  };

  const toggleHighlight = async (service: Service) => {
    const supabase = createClient();
    const newValue = !service.highlighted;
    await supabase.from("services").update({ highlighted: newValue }).eq("id", service.id);
    await logActivity("update", "services", `${newValue ? "Highlighted" : "Unhighlighted"} service: ${service.title}`);
    setServices((prev) => prev.map((s) => s.id === service.id ? { ...s, highlighted: newValue } : s));
  };

  const move = async (index: number, direction: "up" | "down") => {
    const newServices = [...services];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newServices.length) return;

    [newServices[index], newServices[swapIndex]] = [newServices[swapIndex], newServices[index]];

    const supabase = createClient();
    await Promise.all([
      supabase.from("services").update({ position: swapIndex }).eq("id", newServices[swapIndex].id),
      supabase.from("services").update({ position: index }).eq("id", newServices[index].id),
    ]);

    setServices(newServices.map((s, i) => ({ ...s, position: i })));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage the services shown on your site.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/services/new">
            <Plus className="w-4 h-4 mr-1" /> New Service
          </Link>
        </Button>
      </div>

      {services.length === 0 ? (
        <p className="text-muted-foreground text-sm py-12 text-center">
          No services yet.{" "}
          <Link href="/admin/services/new" className="text-primary underline">
            Add your first one.
          </Link>
        </p>
      ) : (
        <div className="space-y-2">
          {services.map((service, i) => {
            const Icon = getIcon(service.icon_name);
            return (
              <div
                key={service.id}
                className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{service.title}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {service.description}
                  </p>
                </div>

                {/* Reorder */}
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
                    disabled={i === services.length - 1}
                    className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleHighlight(service)}
                    title={service.highlighted ? "Remove highlight" : "Highlight in navbar"}
                  >
                    <Star className={`w-3.5 h-3.5 ${service.highlighted ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/services/${service.id}/edit`}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteService(service)}
                  >
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

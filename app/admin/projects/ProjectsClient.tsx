"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/supabase/content";
import { logActivity } from "@/lib/supabase/logging";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Star } from "lucide-react";

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);

  const deleteProject = async (project: Project) => {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    const supabase = createClient();

    // Delete images from storage
    const allUrls = Array.from(new Set([
      ...(project.images ?? []),
      ...(project.image_url ? [project.image_url] : []),
    ]));
    const storagePaths = allUrls
      .map((url) => {
        const marker = "/project-images/";
        const idx = url.indexOf(marker);
        return idx !== -1 ? url.slice(idx + marker.length) : null;
      })
      .filter(Boolean) as string[];
    if (storagePaths.length > 0) {
      await supabase.storage.from("project-images").remove(storagePaths);
    }

    await supabase.from("projects").delete().eq("id", project.id);
    await logActivity("delete", "projects", `Deleted project: ${project.title}`);
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
  };

  const move = async (index: number, direction: "up" | "down") => {
    const updated = [...projects];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= updated.length) return;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    const supabase = createClient();
    await Promise.all([
      supabase.from("projects").update({ position: swapIndex }).eq("id", updated[swapIndex].id),
      supabase.from("projects").update({ position: index }).eq("id", updated[index].id),
    ]);
    setProjects(updated.map((p, pos) => ({ ...p, position: pos })));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Portfolio case studies. <Star className="inline w-3.5 h-3.5 mb-0.5" /> = shown on home page.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/projects/new">
            <Plus className="w-4 h-4 mr-1" /> New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">No projects yet.</p>
      ) : (
        <div className="space-y-2">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4"
            >
              {/* Colour dot */}
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">{project.title[0]}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">{project.title}</p>
                  {project.featured && (
                    <Star className="w-3.5 h-3.5 text-primary fill-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {project.type} · {project.size} · /{project.slug}
                </p>
              </div>

              <Badge variant="outline" className="text-xs hidden sm:flex">
                {project.location}
              </Badge>

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
                  disabled={i === projects.length - 1}
                  className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/admin/projects/${project.id}/edit`}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => deleteProject(project)}>
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

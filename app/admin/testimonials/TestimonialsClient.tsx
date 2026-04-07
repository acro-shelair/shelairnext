"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/supabase/content";
import { logActivity } from "@/lib/supabase/logging";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Star, Quote } from "lucide-react";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name:   z.string().min(1, "Required"),
  role:   z.string().min(1, "Required"),
  quote:  z.string().min(1, "Required"),
  rating: z.coerce.number().int().min(1).max(5),
});
type FormData = z.infer<typeof schema>;

// ─── Add / Edit dialog ────────────────────────────────────────────────────────

function TestimonialDialog({
  testimonial,
  position,
  onSuccess,
}: {
  testimonial?: Testimonial;
  position?: number;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!testimonial;

  const [rating, setRating] = useState(testimonial?.rating ?? 5);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        name:   testimonial?.name   ?? "",
        role:   testimonial?.role   ?? "",
        quote:  testimonial?.quote  ?? "",
        rating: testimonial?.rating ?? 5,
      },
    });

  const onSubmit = async (data: FormData) => {
    setError(null);
    const supabase = createClient();
    try {
      if (isEdit) {
        const { error } = await supabase.from("testimonials").update(data).eq("id", testimonial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert({ ...data, position: position ?? 0 });
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
        {isEdit ? (
          <Button size="sm" variant="ghost"><Pencil className="w-3.5 h-3.5" /></Button>
        ) : (
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Testimonial</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input {...register("name")} placeholder="Mark Thompson" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Role / Company</Label>
              <Input {...register("role")} placeholder="Operations Manager, FreshMart" />
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Quote</Label>
            <Textarea
              {...register("quote")}
              rows={4}
              className="resize-none"
              placeholder="What did they say about Shelair?"
            />
            {errors.quote && <p className="text-xs text-destructive">{errors.quote.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => { setRating(star); setValue("rating", star); }}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm text-muted-foreground ml-2">{rating} / 5</span>
            </div>
            <input type="hidden" {...register("rating")} />
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

export default function TestimonialsClient({
  initialTestimonials,
}: {
  initialTestimonials: Testimonial[];
}) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  const refresh = () => router.refresh();

  const remove = async (t: Testimonial) => {
    if (!confirm(`Delete testimonial from "${t.name}"?`)) return;
    const supabase = createClient();
    await supabase.from("testimonials").delete().eq("id", t.id);
    await logActivity("delete", "testimonials", `Deleted testimonial from: ${t.name}`);
    setTestimonials((prev) => prev.filter((x) => x.id !== t.id));
  };

  const move = async (index: number, direction: "up" | "down") => {
    const updated = [...testimonials];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= updated.length) return;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    const supabase = createClient();
    await Promise.all([
      supabase.from("testimonials").update({ position: swapIndex }).eq("id", updated[swapIndex].id),
      supabase.from("testimonials").update({ position: index  }).eq("id", updated[index].id),
    ]);
    setTestimonials(updated.map((t, pos) => ({ ...t, position: pos })));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Shown on the home page. Drag to reorder.
          </p>
        </div>
        <TestimonialDialog position={testimonials.length} onSuccess={refresh} />
      </div>

      {testimonials.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">
          No testimonials yet. Add your first one.
        </p>
      ) : (
        <div className="space-y-4">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="bg-card border border-border rounded-2xl p-5 flex gap-4"
            >
              {/* Stars */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-3.5 h-3.5 ${j < (t.rating ?? 5) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <TestimonialDialog testimonial={t} onSuccess={refresh} />
                  <Button size="sm" variant="ghost" onClick={() => remove(t)}>
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
                    disabled={i === testimonials.length - 1}
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

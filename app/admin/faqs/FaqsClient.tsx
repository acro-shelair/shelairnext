"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { FAQ } from "@/lib/supabase/content";
import { logActivity } from "@/lib/supabase/logging";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, HelpCircle } from "lucide-react";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  question: z.string().min(1, "Required"),
  answer:   z.string().min(1, "Required"),
});
type FormData = z.infer<typeof schema>;

// ─── Add / Edit dialog ────────────────────────────────────────────────────────

function FaqDialog({
  faq,
  position,
  onSuccess,
}: {
  faq?: FAQ;
  position?: number;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!faq;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        question: faq?.question ?? "",
        answer:   faq?.answer   ?? "",
      },
    });

  const onSubmit = async (data: FormData) => {
    setError(null);
    const supabase = createClient();
    try {
      if (isEdit) {
        const { error } = await supabase.from("faqs").update(data).eq("id", faq.id);
        if (error) throw error;
        await logActivity("update", "faqs", `Updated FAQ: ${data.question}`);
      } else {
        const { error } = await supabase.from("faqs").insert({ ...data, position: position ?? 0 });
        if (error) throw error;
        await logActivity("create", "faqs", `Created FAQ: ${data.question}`);
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
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New FAQ</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit FAQ" : "New FAQ"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Question</Label>
            <Input {...register("question")} placeholder="e.g. How quickly can you respond?" />
            {errors.question && <p className="text-xs text-destructive">{errors.question.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Answer</Label>
            <Textarea
              {...register("answer")}
              rows={5}
              className="resize-none"
              placeholder="Provide a clear, helpful answer…"
            />
            {errors.answer && <p className="text-xs text-destructive">{errors.answer.message}</p>}
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

export default function FaqsClient({ initialFaqs }: { initialFaqs: FAQ[] }) {
  const router = useRouter();
  const [faqs, setFaqs] = useState(initialFaqs);

  const refresh = () => router.refresh();

  const remove = async (faq: FAQ) => {
    if (!confirm(`Delete FAQ: "${faq.question}"?`)) return;
    const supabase = createClient();
    await supabase.from("faqs").delete().eq("id", faq.id);
    await logActivity("delete", "faqs", `Deleted FAQ: ${faq.question}`);
    setFaqs((prev) => prev.filter((x) => x.id !== faq.id));
  };

  const move = async (index: number, direction: "up" | "down") => {
    const updated = [...faqs];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= updated.length) return;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    const supabase = createClient();
    await Promise.all([
      supabase.from("faqs").update({ position: swapIndex }).eq("id", updated[swapIndex].id),
      supabase.from("faqs").update({ position: index  }).eq("id", updated[index].id),
    ]);
    setFaqs(updated.map((f, pos) => ({ ...f, position: pos })));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">FAQs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            FAQ accordion shown on the home page.
          </p>
        </div>
        <FaqDialog position={faqs.length} onSuccess={refresh} />
      </div>

      {faqs.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">
          No FAQs yet. Add your first one.
        </p>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.id}
              className="bg-card border border-border rounded-2xl p-5 flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1">{faq.question}</p>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{faq.answer}</p>
              </div>

              <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <FaqDialog faq={faq} onSuccess={refresh} />
                  <Button size="sm" variant="ghost" onClick={() => remove(faq)}>
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
                    disabled={i === faqs.length - 1}
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

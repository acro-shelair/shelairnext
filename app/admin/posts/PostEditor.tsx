"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { Post, ContentBlock } from "@/lib/supabase/posts";
import { normalizeContent } from "@/lib/supabase/posts";
import { logActivity } from "@/lib/supabase/logging";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusCircle,
  Trash2,
  Upload,
  X,
  Type,
  Image as ImageIcon,
  Quote,
  List,
  ListOrdered,
  HelpCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { convertToWebp } from "@/lib/convertToWebp";

// ─── Schema ────────────────────────────────────────────────────────────────

const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: z.string().min(1, "Cannot be empty") }),
  z.object({ type: z.literal("image"), src: z.string().min(1, "Image required"), alt: z.string().optional(), caption: z.string().optional() }),
  z.object({ type: z.literal("blockquote"), text: z.string().min(1, "Cannot be empty"), cite: z.string().optional() }),
  z.object({ type: z.literal("list"), style: z.enum(["bullet", "number", "letter"]), items: z.array(z.string().min(1, "Item cannot be empty")).min(1) }),
  z.object({ type: z.literal("faq"), items: z.array(z.object({ question: z.string().min(1, "Question required"), answer: z.string().min(1, "Answer required") })).min(1) }),
]);

const sectionSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  blocks: z.array(blockSchema).min(1, "At least one content block is required"),
});

const schema = z.object({
  title: z.string().min(1, "Required"),
  slug: z
    .string()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  type: z.enum(["Guide", "Article", "Case Study", "Video"]),
  description: z.string().min(1, "Required"),
  meta_description: z.string().min(1, "Required"),
  date: z.string().min(1, "Required"),
  read_time: z.string().min(1, "Required"),
  related_slugs: z.string(),
  category: z.string(),
  published: z.boolean(),
  pinned: z.boolean(),
  sections: z.array(sectionSchema).min(1, "At least one section is required"),
});

type FormData = z.infer<typeof schema>;
type BlockData = z.infer<typeof blockSchema>;

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function contentBlocksToFormBlocks(content: (string | ContentBlock)[]): BlockData[] {
  const normalized = normalizeContent(content);
  return normalized.map((b) => {
    if (b.type === "list") return { ...b, items: [...b.items] };
    return { ...b };
  }) as BlockData[];
}

// ─── Block Editor Component ───────────────────────────────────────────────

function BlockEditor({
  sectionIndex,
  blockIndex,
  control,
  register,
  setValue,
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
}: {
  sectionIndex: number;
  blockIndex: number;
  control: any;
  register: any;
  setValue: any;
  onRemove: () => void;
  onMove: (dir: "up" | "down") => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const prefix = `sections.${sectionIndex}.blocks.${blockIndex}` as const;
  const block = useWatch({ control, name: prefix }) as BlockData;
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const converted = await convertToWebp(file);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(path, converted, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("post-images").getPublicUrl(path);
      setValue(`${prefix}.src`, data.publicUrl);
    } catch {
      // silent — user can retry
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const blockLabel =
    block.type === "paragraph" ? "Paragraph" :
    block.type === "image" ? "Image" :
    block.type === "blockquote" ? "Blockquote" :
    block.type === "faq" ? "FAQ" :
    block.type === "list" && block.style === "bullet" ? "Bullet List" :
    block.type === "list" && block.style === "number" ? "Numbered List" :
    block.type === "list" && block.style === "letter" ? "Letter List" : "Block";

  const blockIcon =
    block.type === "paragraph" ? <Type className="w-3.5 h-3.5" /> :
    block.type === "image" ? <ImageIcon className="w-3.5 h-3.5" /> :
    block.type === "blockquote" ? <Quote className="w-3.5 h-3.5" /> :
    block.type === "faq" ? <HelpCircle className="w-3.5 h-3.5" /> :
    block.type === "list" && block.style === "bullet" ? <List className="w-3.5 h-3.5" /> :
    <ListOrdered className="w-3.5 h-3.5" />;

  return (
    <div className="border border-border rounded-lg p-4 bg-background space-y-3">
      {/* Block header */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">
          {blockIcon} {blockLabel}
        </span>
        <div className="flex-1" />
        <button type="button" onClick={() => onMove("up")} disabled={!canMoveUp} className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors">
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => onMove("down")} disabled={!canMoveDown} className="p-1 rounded hover:bg-secondary disabled:opacity-20 transition-colors">
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
          <Trash2 className="w-3.5 h-3.5 text-destructive" />
        </Button>
      </div>

      {/* Block body */}
      {block.type === "paragraph" && (
        <Textarea
          {...register(`${prefix}.text`)}
          rows={3}
          className="resize-none"
          placeholder="Write your paragraph…"
        />
      )}

      {block.type === "blockquote" && (
        <div className="space-y-2">
          <Textarea
            {...register(`${prefix}.text`)}
            rows={3}
            className="resize-none italic border-l-4 border-primary/30 pl-4"
            placeholder="Write the quote…"
          />
          <Input
            {...register(`${prefix}.cite`)}
            placeholder="Citation / source (optional)"
            className="text-sm"
          />
        </div>
      )}

      {block.type === "image" && (
        <div className="space-y-2">
          {block.src ? (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img src={block.src} alt={block.alt || ""} className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={() => setValue(`${prefix}.src`, "")}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className={`flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
              {uploading ? (
                <span className="text-sm text-muted-foreground">Uploading…</span>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">Click to upload image</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={handleImageUpload}
              />
            </label>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Input
              {...register(`${prefix}.alt`)}
              placeholder="Alt text (optional)"
              className="text-sm"
            />
            <Input
              {...register(`${prefix}.caption`)}
              placeholder="Caption (optional)"
              className="text-sm"
            />
          </div>
        </div>
      )}

      {block.type === "list" && (
        <ListBlockEditor
          prefix={prefix}
          control={control}
          register={register}
          setValue={setValue}
        />
      )}

      {block.type === "faq" && (
        <FaqBlockEditor
          prefix={prefix}
          control={control}
          register={register}
          setValue={setValue}
        />
      )}
    </div>
  );
}

// ─── List Block Editor ────────────────────────────────────────────────────

function ListBlockEditor({
  prefix,
  control,
  register,
  setValue,
}: {
  prefix: string;
  control: any;
  register: any;
  setValue: any;
}) {
  const items = (useWatch({ control, name: `${prefix}.items` }) as string[]) || [""];

  const addItem = () => setValue(`${prefix}.items`, [...items, ""]);
  const removeItem = (index: number) =>
    setValue(`${prefix}.items`, items.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      {items.map((_, i) => (
        <div key={i} className="flex gap-2 items-start">
          <span className="text-xs text-muted-foreground mt-2.5 w-5 text-right flex-shrink-0">
            {i + 1}.
          </span>
          <Input
            {...register(`${prefix}.items.${i}`)}
            placeholder={`Item ${i + 1}`}
            className="flex-1 text-sm"
          />
          {items.length > 1 && (
            <Button type="button" size="sm" variant="ghost" onClick={() => removeItem(i)} className="flex-shrink-0">
              <Trash2 className="w-3 h-3 text-destructive" />
            </Button>
          )}
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={addItem}>
        <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Item
      </Button>
    </div>
  );
}

// ─── FAQ Block Editor ─────────────────────────────────────────────────

function FaqBlockEditor({
  prefix,
  control,
  register,
  setValue,
}: {
  prefix: string;
  control: any;
  register: any;
  setValue: any;
}) {
  const items = (useWatch({ control, name: `${prefix}.items` }) as { question: string; answer: string }[]) || [{ question: "", answer: "" }];

  const addItem = () => setValue(`${prefix}.items`, [...items, { question: "", answer: "" }]);
  const removeItem = (index: number) =>
    setValue(`${prefix}.items`, items.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {items.map((_, i) => (
        <div key={i} className="border border-border rounded-lg p-3 space-y-2 bg-secondary/30">
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-primary mt-2 flex-shrink-0">Q{i + 1}</span>
            <Input
              {...register(`${prefix}.items.${i}.question`)}
              placeholder="Question"
              className="flex-1 text-sm font-medium"
            />
            {items.length > 1 && (
              <Button type="button" size="sm" variant="ghost" onClick={() => removeItem(i)} className="flex-shrink-0">
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            )}
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-muted-foreground mt-2 flex-shrink-0">A{i + 1}</span>
            <Textarea
              {...register(`${prefix}.items.${i}.answer`)}
              placeholder="Answer"
              rows={2}
              className="flex-1 text-sm resize-none"
            />
          </div>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={addItem}>
        <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add FAQ Item
      </Button>
    </div>
  );
}

// ─── Section Editor ───────────────────────────────────────────────────────

function SectionEditor({
  sectionIndex,
  control,
  register,
  setValue,
  onRemove,
  canRemove,
}: {
  sectionIndex: number;
  control: any;
  register: any;
  setValue: any;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.blocks`,
  });

  const addBlock = (block: BlockData) => append(block);

  return (
    <div className="border border-border rounded-xl p-5 space-y-4 bg-card">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-1.5">
          <Label>Section Heading</Label>
          <Input
            {...register(`sections.${sectionIndex}.heading`)}
            placeholder="e.g. Why This Matters"
          />
        </div>
        {canRemove && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onRemove}
            className="mt-6 flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <Label>Content Blocks</Label>
        {fields.map((field, bi) => (
          <BlockEditor
            key={field.id}
            sectionIndex={sectionIndex}
            blockIndex={bi}
            control={control}
            register={register}
            setValue={setValue}
            onRemove={() => remove(bi)}
            onMove={(dir) => {
              const target = dir === "up" ? bi - 1 : bi + 1;
              if (target >= 0 && target < fields.length) move(bi, target);
            }}
            canMoveUp={bi > 0}
            canMoveDown={bi < fields.length - 1}
          />
        ))}

        {/* Add block dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" size="sm" variant="outline">
              <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Block
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => addBlock({ type: "paragraph", text: "" })}>
              <Type className="w-4 h-4 mr-2" /> Paragraph
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock({ type: "image", src: "", alt: "", caption: "" })}>
              <ImageIcon className="w-4 h-4 mr-2" /> Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock({ type: "blockquote", text: "", cite: "" })}>
              <Quote className="w-4 h-4 mr-2" /> Blockquote
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock({ type: "list", style: "bullet", items: [""] })}>
              <List className="w-4 h-4 mr-2" /> Bullet List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock({ type: "list", style: "number", items: [""] })}>
              <ListOrdered className="w-4 h-4 mr-2" /> Numbered List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock({ type: "list", style: "letter", items: [""] })}>
              <ListOrdered className="w-4 h-4 mr-2" /> Letter List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock({ type: "faq", items: [{ question: "", answer: "" }] })}>
              <HelpCircle className="w-4 h-4 mr-2" /> FAQ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ─── Main editor ───────────────────────────────────────────────────────────

export default function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(post?.image_url ?? "");
  const isEdit = !!post;

  const defaultSections =
    post?.post_sections?.map((s) => ({
      heading: s.heading,
      blocks: contentBlocksToFormBlocks(s.content),
    })) ?? [{ heading: "", blocks: [{ type: "paragraph" as const, text: "" }] }];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      type: post?.type ?? "Article",
      description: post?.description ?? "",
      meta_description: post?.meta_description ?? "",
      date: post?.date ?? "",
      read_time: post?.read_time ?? "",
      related_slugs: post?.related_slugs?.join(", ") ?? "",
      category: post?.category ?? "",
      published: post?.published ?? false,
      pinned: post?.pinned ?? false,
      sections: defaultSections,
    },
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({ control, name: "sections" });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const converted = await convertToWebp(file);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(path, converted, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("post-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setServerError(null);
    const supabase = createClient();

    const postData = {
      slug: data.slug,
      type: data.type,
      title: data.title,
      description: data.description,
      meta_description: data.meta_description,
      date: data.date,
      read_time: data.read_time,
      related_slugs: data.related_slugs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      category: data.category || null,
      published: data.published,
      pinned: data.pinned,
      image_url: imageUrl || null,
      updated_at: new Date().toISOString(),
    };

    try {
      let postId = post?.id;

      if (isEdit) {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", postId!);
        if (error) throw error;
        await supabase.from("post_sections").delete().eq("post_id", postId!);
        await logActivity("update", "posts", `Updated post: ${data.title}`);
      } else {
        const { data: newPost, error } = await supabase
          .from("posts")
          .insert(postData)
          .select()
          .single();
        if (error) throw error;
        postId = newPost.id;
        await logActivity("create", "posts", `Created post: ${data.title}`);
      }

      const sections = data.sections.map((s, i) => ({
        post_id: postId!,
        heading: s.heading,
        content: s.blocks as ContentBlock[],
        position: i,
      }));

      const { error: sectionsError } = await supabase
        .from("post_sections")
        .insert(sections);
      if (sectionsError) throw sectionsError;

      router.push("/admin/posts");
      router.refresh();
    } catch (e: unknown) {
      setServerError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Post" : "New Post"}
        </h1>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving || uploading}>
            {saving ? "Saving…" : uploading ? "Uploading…" : "Save Post"}
          </Button>
        </div>
      </div>

      {serverError && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
          {serverError}
        </p>
      )}

      {/* Basic fields */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-1.5 md:col-span-2">
          <Label>Title</Label>
          <Input
            {...register("title")}
            onBlur={(e) => {
              if (!isEdit) setValue("slug", toSlug(e.target.value));
            }}
            placeholder="The Complete Guide to…"
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Slug{" "}
            <span className="text-muted-foreground font-normal text-xs">
              (auto-generated, editable)
            </span>
          </Label>
          <Input {...register("slug")} placeholder="my-post-title" />
          {errors.slug && (
            <p className="text-xs text-destructive">{errors.slug.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Guide", "Article", "Case Study", "Video"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label>
            Category{" "}
            <span className="text-muted-foreground font-normal text-xs">
              e.g. Refrigeration, Air Conditioning
            </span>
          </Label>
          <Input {...register("category")} placeholder="e.g. Refrigeration" />
        </div>

        <div className="space-y-1.5">
          <Label>
            Date{" "}
            <span className="text-muted-foreground font-normal text-xs">
              e.g. Mar 2026
            </span>
          </Label>
          <Input {...register("date")} placeholder="Mar 2026" />
          {errors.date && (
            <p className="text-xs text-destructive">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Read Time{" "}
            <span className="text-muted-foreground font-normal text-xs">
              e.g. 8 min read
            </span>
          </Label>
          <Input {...register("read_time")} placeholder="8 min read" />
          {errors.read_time && (
            <p className="text-xs text-destructive">
              {errors.read_time.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>
            Description{" "}
            <span className="text-muted-foreground font-normal text-xs">
              shown on the card
            </span>
          </Label>
          <Textarea
            {...register("description")}
            rows={2}
            className="resize-none"
          />
          {errors.description && (
            <p className="text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>
            Meta Description{" "}
            <span className="text-muted-foreground font-normal text-xs">
              SEO — keep under 160 chars
            </span>
          </Label>
          <Textarea
            {...register("meta_description")}
            rows={2}
            className="resize-none"
          />
          {errors.meta_description && (
            <p className="text-xs text-destructive">
              {errors.meta_description.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>
            Related Post Slugs{" "}
            <span className="text-muted-foreground font-normal text-xs">
              comma-separated
            </span>
          </Label>
          <Input
            {...register("related_slugs")}
            placeholder="slug-one, slug-two, slug-three"
          />
        </div>

        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="published"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id="published"
              />
            )}
          />
          <Label htmlFor="published" className="cursor-pointer">
            Published
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="pinned"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id="pinned"
              />
            )}
          />
          <Label htmlFor="pinned" className="cursor-pointer">
            Pin to top <span className="text-muted-foreground font-normal text-xs">(always shown first on the resources page)</span>
          </Label>
        </div>
      </div>

      {/* Cover image */}
      <div className="space-y-3">
        <Label>Cover Image <span className="text-muted-foreground font-normal text-xs">(optional — shown on card and article page)</span></Label>
        {imageUrl ? (
          <div className="relative w-full rounded-xl overflow-hidden border border-border">
            <img src={imageUrl} alt="Cover" className="w-full h-48 object-cover" />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
            {uploading ? (
              <span className="text-sm text-muted-foreground">Uploading…</span>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Click to upload cover image</span>
                <span className="text-xs text-muted-foreground">JPG, PNG, WebP — converted to WebP</span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={uploading}
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>

      {/* Sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Content Sections</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              appendSection({ heading: "", blocks: [{ type: "paragraph", text: "" }] })
            }
          >
            <PlusCircle className="w-4 h-4 mr-1" /> Add Section
          </Button>
        </div>
        {errors.sections && !Array.isArray(errors.sections) && (
          <p className="text-xs text-destructive mb-3">
            {errors.sections.message}
          </p>
        )}
        <div className="space-y-4">
          {sectionFields.map((section, si) => (
            <SectionEditor
              key={section.id}
              sectionIndex={si}
              control={control}
              register={register}
              setValue={setValue}
              onRemove={() => removeSection(si)}
              canRemove={sectionFields.length > 1}
            />
          ))}
        </div>
      </div>
    </form>
  );
}

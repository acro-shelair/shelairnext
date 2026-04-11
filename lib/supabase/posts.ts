import type { SupabaseClient } from "@supabase/supabase-js";

export type PostType = "Guide" | "Article" | "Case Study" | "Video";

// ── Content block types ─────────────────────────────────────────────────────

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "blockquote"; text: string; cite?: string }
  | { type: "list"; style: "bullet" | "number" | "letter"; items: string[] }
  | { type: "faq"; items: { question: string; answer: string }[] };

/**
 * Normalise raw DB content into ContentBlock[].
 * Handles legacy string[], JSON-stringified blocks, and new block objects.
 */
export function normalizeContent(raw: unknown): ContentBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    if (typeof item === "string") {
      // Try to parse JSON-stringified block objects
      if (item.startsWith("{")) {
        try {
          const parsed = JSON.parse(item);
          if (parsed && typeof parsed.type === "string") return parsed as ContentBlock;
        } catch {
          // not JSON — fall through to plain paragraph
        }
      }
      return { type: "paragraph", text: item } as ContentBlock;
    }
    return item as ContentBlock;
  });
}

export interface PostSection {
  id: string;
  post_id: string;
  heading: string;
  content: (string | ContentBlock)[];
  position: number;
}

export interface Post {
  id: string;
  slug: string;
  type: PostType;
  title: string;
  description: string;
  meta_description: string;
  date: string;
  read_time: string;
  related_slugs: string[];
  published: boolean;
  pinned: boolean;
  category: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  post_sections?: PostSection[];
}

export type PostPreview = Pick<Post, "id" | "slug" | "type" | "title" | "description" | "date">;

export async function getPublishedPosts(supabase: SupabaseClient): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export const RESOURCES_PAGE_SIZE = 12;

export async function getPublishedPostsPaginated(
  supabase: SupabaseClient,
  page: number
): Promise<{ posts: Post[]; total: number }> {
  const from = (page - 1) * RESOURCES_PAGE_SIZE;
  const to = from + RESOURCES_PAGE_SIZE - 1;
  const { data, error, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw error;
  return { posts: data ?? [], total: count ?? 0 };
}

export async function getRecentPosts(
  supabase: SupabaseClient,
  limit = 3
): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data ?? [];
}

export async function getPostBySlug(supabase: SupabaseClient, slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, post_sections(*)")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (error) return null;
  if (data?.post_sections) {
    data.post_sections = [...data.post_sections].sort(
      (a: PostSection, b: PostSection) => a.position - b.position
    );
  }
  return data;
}

export async function getAllPosts(supabase: SupabaseClient): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPostById(supabase: SupabaseClient, id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, post_sections(*)")
    .eq("id", id)
    .single();
  if (error) return null;
  if (data?.post_sections) {
    data.post_sections = [...data.post_sections].sort(
      (a: PostSection, b: PostSection) => a.position - b.position
    );
  }
  return data;
}

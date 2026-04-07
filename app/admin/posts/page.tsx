import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/supabase/posts";
import PostsClient from "./PostsClient";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const type = params.type ?? "all";
  const status = params.status ?? "all";
  const q = params.q ?? "";

  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });
  if (type !== "all") query = query.eq("type", type);
  if (status === "published") query = query.eq("published", true);
  if (status === "draft") query = query.eq("published", false);
  if (q) query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%,description.ilike.%${q}%`);
  query = query.range(from, to);

  const { data, count } = await query;

  return (
    <PostsClient
      posts={(data ?? []) as Post[]}
      totalCount={count ?? 0}
      page={page}
      pageSize={PAGE_SIZE}
      filters={{ type, status, q }}
    />
  );
}

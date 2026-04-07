"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Post, PostType } from "@/lib/supabase/posts";
import { logActivity } from "@/lib/supabase/logging";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight,
} from "lucide-react";

const POST_TYPES: PostType[] = ["Guide", "Article", "Case Study", "Video"];

interface PostsClientProps {
  posts: Post[];
  totalCount: number;
  page: number;
  pageSize: number;
  filters: { type: string; status: string; q: string };
}

export default function PostsClient({
  posts, totalCount, page, pageSize, filters,
}: PostsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(filters.q);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const pushParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if ((k === "page" && v === "1") || (k !== "page" && (v === "all" || v === ""))) {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });
    const qs = params.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
  };

  // Debounce search input → URL
  useEffect(() => {
    if (search === filters.q) return;
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("q", search); else params.delete("q");
      params.delete("page");
      const qs = params.toString();
      startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const togglePublish = async (post: Post) => {
    const supabase = createClient();
    await supabase
      .from("posts")
      .update({ published: !post.published })
      .eq("id", post.id);
    await logActivity("update", "posts", `${!post.published ? "Published" : "Unpublished"} post: ${post.title}`);
    startTransition(() => router.refresh());
  };

  const deletePost = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", post.id);
    await logActivity("delete", "posts", `Deleted post: ${post.title}`);
    startTransition(() => router.refresh());
  };

  return (
    <div className={isPending ? "opacity-60 pointer-events-none transition-opacity" : ""}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Button asChild size="sm">
          <Link href="/admin/posts/new">
            <Plus className="w-4 h-4 mr-1" /> New Post
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filters.type} onValueChange={(v) => pushParams({ type: v, page: "1" })}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {POST_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={(v) => pushParams({ status: v, page: "1" })}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {totalCount === 0 && !filters.q && filters.type === "all" && filters.status === "all" ? (
        <p className="text-muted-foreground text-sm py-12 text-center">
          No posts yet.{" "}
          <Link href="/admin/posts/new" className="text-primary underline">
            Create your first one.
          </Link>
        </p>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground text-sm py-12 text-center">
          No posts match your filters.
        </p>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr
                  key={post.id}
                  className={i < posts.length - 1 ? "border-b border-border" : ""}
                >
                  <td className="px-4 py-3 font-medium max-w-[220px] truncate">
                    {post.title}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="secondary">{post.type}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(post)}
                      className="focus:outline-none"
                      title="Toggle publish status"
                    >
                      <Badge
                        variant={post.published ? "default" : "outline"}
                        className="cursor-pointer"
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {post.date}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deletePost(post)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer with count + pagination */}
          <div className="flex items-center justify-between px-4 py-2 bg-secondary border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount} posts
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={page <= 1}
                  onClick={() => pushParams({ page: String(page - 1) })}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "ellipsis" ? (
                      <span key={`e-${idx}`} className="px-1 text-xs text-muted-foreground">…</span>
                    ) : (
                      <Button
                        key={item}
                        size="sm"
                        variant={item === page ? "default" : "ghost"}
                        className="w-8 h-8 p-0 text-xs"
                        onClick={() => pushParams({ page: String(item) })}
                      >
                        {item}
                      </Button>
                    )
                  )}
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={page >= totalPages}
                  onClick={() => pushParams({ page: String(page + 1) })}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

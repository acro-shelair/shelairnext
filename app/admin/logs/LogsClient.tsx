"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle, Pencil, Trash2, Search, ChevronLeft, ChevronRight,
} from "lucide-react";

interface ActivityLog {
  id: string;
  user_email: string;
  action: "create" | "update" | "delete";
  table_name: string;
  details: string;
  created_at: string;
}

const ACTION_COLORS = {
  create: "default",
  update: "secondary",
  delete: "destructive",
} as const;

const ACTION_ICONS = {
  create: PlusCircle,
  update: Pencil,
  delete: Trash2,
};

const TABLE_LABELS: Record<string, string> = {
  posts: "Posts", services: "Services", industries: "Industries",
  brands: "Brands", other_brands: "Other Brands", testimonials: "Testimonials",
  users: "Users", projects: "Projects", faqs: "FAQs",
};

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

interface LogsClientProps {
  logs: ActivityLog[];
  totalCount: number;
  page: number;
  pageSize: number;
  tables: string[];
  actionCounts: { create: number; update: number; delete: number };
  filters: { action: string; table: string; q: string };
}

export default function LogsClient({
  logs, totalCount, page, pageSize, tables, actionCounts, filters,
}: LogsClientProps) {
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

  return (
    <div className={isPending ? "opacity-60 pointer-events-none transition-opacity" : ""}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Activity Logs</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Admin actions — create, update, and delete events.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search logs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filters.action} onValueChange={(v) => pushParams({ action: v, page: "1" })}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Action" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.table} onValueChange={(v) => pushParams({ table: v, page: "1" })}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Table" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tables</SelectItem>
            {tables.map((t) => (
              <SelectItem key={t} value={t}>{TABLE_LABELS[t] ?? t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(["create", "update", "delete"] as const).map((action) => {
          const count = actionCounts[action];
          const Icon = ACTION_ICONS[action];
          return (
            <div key={action} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold">{count}</p>
                <p className="text-xs text-muted-foreground capitalize">{action}s</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log list */}
      {logs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          {totalCount === 0 && !filters.q && filters.action === "all" && filters.table === "all"
            ? "No activity logged yet. Actions will appear here as you use the admin panel."
            : "No logs match your filters."}
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Action</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Table</th>
                <th className="text-left px-4 py-3 font-medium">Details</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">User</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">When</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => {
                const Icon = ACTION_ICONS[log.action] ?? Pencil;
                return (
                  <tr key={log.id} className={i < logs.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-4 py-3">
                      <Badge variant={ACTION_COLORS[log.action] ?? "secondary"} className="gap-1">
                        <Icon className="w-3 h-3" />
                        <span className="capitalize">{log.action}</span>
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-md">
                        {TABLE_LABELS[log.table_name] ?? log.table_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[240px] truncate text-muted-foreground">
                      {log.details}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs truncate max-w-[160px]">
                      {log.user_email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs whitespace-nowrap">
                      {formatRelative(log.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer with count + pagination */}
          <div className="flex items-center justify-between px-4 py-2 bg-secondary border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount} entries
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

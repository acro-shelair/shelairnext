"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  X,
  Inbox,
} from "lucide-react";

interface ContactSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  service: string;
  details: string | null;
  created_at: string;
}

function formatDate(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface MessagesClientProps {
  messages: ContactSubmission[];
  totalCount: number;
  page: number;
  pageSize: number;
  services: string[];
  filters: { service: string; q: string };
}

export default function MessagesClient({
  messages,
  totalCount,
  page,
  pageSize,
  services,
  filters,
}: MessagesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(filters.q);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const pushParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (
        (k === "page" && v === "1") ||
        (k !== "page" && (v === "all" || v === ""))
      ) {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });
    const qs = params.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
  };

  useEffect(() => {
    if (search === filters.q) return;
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("q", search);
      else params.delete("q");
      params.delete("page");
      const qs = params.toString();
      startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div
      className={
        isPending ? "opacity-60 pointer-events-none transition-opacity" : ""
      }
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Contact form submissions — {totalCount} total
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search messages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={filters.service}
          onValueChange={(v) => pushParams({ service: v, page: "1" })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {services.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Message list */}
      {messages.length === 0 ? (
        <div className="text-center py-16">
          <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {totalCount === 0 && !filters.q && filters.service === "all"
              ? "No messages yet. Submissions will appear here."
              : "No messages match your filters."}
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                  Phone
                </th>
                <th className="text-left px-4 py-3 font-medium">Service</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                  Received
                </th>
                <th className="text-left px-4 py-3 font-medium w-16" />
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, i) => (
                <tr
                  key={msg.id}
                  className={`${
                    i < messages.length - 1 ? "border-b border-border" : ""
                  } hover:bg-secondary/50 cursor-pointer transition-colors`}
                  onClick={() => setSelected(msg)}
                >
                  <td className="px-4 py-3 font-medium">
                    {msg.first_name} {msg.last_name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell truncate max-w-[200px]">
                    {msg.email}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {msg.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{msg.service}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs whitespace-nowrap">
                    {formatDate(msg.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(msg);
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination footer */}
          <div className="flex items-center justify-between px-4 py-2 bg-secondary border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, totalCount)} of {totalCount}
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
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 1
                  )
                  .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                      acc.push("ellipsis");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "ellipsis" ? (
                      <span
                        key={`e-${idx}`}
                        className="px-1 text-xs text-muted-foreground"
                      >
                        …
                      </span>
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

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-card border border-border rounded-xl w-full max-w-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-bold text-lg">
                {selected.first_name} {selected.last_name}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-md hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="flex flex-wrap gap-4">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  {selected.email}
                </a>
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    {selected.phone}
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selected.service}</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(selected.created_at).toLocaleString("en-AU", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Details</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selected.details || "No details provided."}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

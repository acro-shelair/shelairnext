import { createClient } from "@/lib/supabase/server";
import LogsClient from "./LogsClient";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; action?: string; table?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const action = params.action ?? "all";
  const table = params.table ?? "all";
  const q = params.q ?? "";

  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // Build filtered query
  let query = supabase
    .from("activity_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });
  if (action !== "all") query = query.eq("action", action);
  if (table !== "all") query = query.eq("table_name", table);
  if (q) query = query.or(`details.ilike.%${q}%,user_email.ilike.%${q}%`);
  query = query.range(from, to);

  // Fetch main data + stats + table list in parallel
  const [
    { data, count },
    { count: createCount },
    { count: updateCount },
    { count: deleteCount },
    { data: tableRows },
  ] = await Promise.all([
    query,
    supabase.from("activity_logs").select("*", { count: "exact", head: true }).eq("action", "create"),
    supabase.from("activity_logs").select("*", { count: "exact", head: true }).eq("action", "update"),
    supabase.from("activity_logs").select("*", { count: "exact", head: true }).eq("action", "delete"),
    supabase.from("activity_logs").select("table_name"),
  ]);

  const tables = [...new Set((tableRows ?? []).map((r: { table_name: string }) => r.table_name))].sort();

  return (
    <LogsClient
      logs={data ?? []}
      totalCount={count ?? 0}
      page={page}
      pageSize={PAGE_SIZE}
      tables={tables}
      actionCounts={{
        create: createCount ?? 0,
        update: updateCount ?? 0,
        delete: deleteCount ?? 0,
      }}
      filters={{ action, table, q }}
    />
  );
}

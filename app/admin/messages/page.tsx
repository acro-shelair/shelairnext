import { createClient } from "@/lib/supabase/server";
import MessagesClient from "./MessagesClient";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; service?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const service = params.service ?? "all";
  const q = params.q ?? "";

  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("contact_submissions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (service !== "all") query = query.eq("service", service);
  if (q) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,details.ilike.%${q}%`
    );
  }
  query = query.range(from, to);

  const [{ data, count }, { data: serviceRows }] = await Promise.all([
    query,
    supabase.from("contact_submissions").select("service"),
  ]);

  const services = [
    ...new Set((serviceRows ?? []).map((r: { service: string }) => r.service)),
  ].sort();

  return (
    <MessagesClient
      messages={data ?? []}
      totalCount={count ?? 0}
      page={page}
      pageSize={PAGE_SIZE}
      services={services}
      filters={{ service, q }}
    />
  );
}

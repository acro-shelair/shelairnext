import { createClient } from "@/lib/supabase/server";
import { getAllCities } from "@/lib/supabase/content";
import LocationsClient from "./LocationsClient";

export const dynamic = "force-dynamic";

export default async function AdminLocationsPage() {
  const supabase = await createClient();
  const { data: cities } = await supabase
    .from("location_cities")
    .select("*, location_suburbs(*)")
    .order("position");

  const sorted = (cities ?? []).map((c: any) => ({
    ...c,
    location_suburbs: [...(c.location_suburbs ?? [])].sort(
      (a: any, b: any) => a.position - b.position
    ),
  }));

  return <LocationsClient initialCities={sorted} />;
}

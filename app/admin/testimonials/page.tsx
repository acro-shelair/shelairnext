import { createClient } from "@/lib/supabase/server";
import { getAllTestimonials } from "@/lib/supabase/content";
import TestimonialsClient from "./TestimonialsClient";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const supabase = await createClient();
  const testimonials = await getAllTestimonials(supabase);
  return <TestimonialsClient initialTestimonials={testimonials} />;
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPostById } from "@/lib/supabase/posts";
import PostEditor from "../../PostEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const post = await getPostById(supabase, id);
  if (!post) notFound();
  return <PostEditor post={post} />;
}

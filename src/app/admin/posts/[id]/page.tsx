import { notFound } from "next/navigation";
import { getPostByIdForAdmin, getCategories, getJourneys } from "@/lib/posts";
import PostEditor from "@/components/admin/PostEditor";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories, journeys] = await Promise.all([
    getPostByIdForAdmin(id),
    getCategories(),
    getJourneys(),
  ]);
  if (!post) notFound();

  return <PostEditor post={post} categories={categories} journeys={journeys} />;
}

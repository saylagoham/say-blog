import { notFound } from "next/navigation";
import { getPostByIdForAdmin } from "@/lib/posts";
import ArticleView from "@/components/site/ArticleView";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostByIdForAdmin(id);
  if (!post) notFound();

  return <ArticleView post={post} preview />;
}

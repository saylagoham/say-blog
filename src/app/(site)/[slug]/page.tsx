import { notFound } from "next/navigation";
import { getPostBySlug, getAdjacentPosts, getRelatedPosts } from "@/lib/posts";
import ArticleView from "@/components/site/ArticleView";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));
  if (!post) notFound();

  const [{ prev, next }, related] = await Promise.all([
    getAdjacentPosts(post.published_at ?? post.created_at),
    getRelatedPosts(post),
  ]);

  return <ArticleView post={post} prev={prev} next={next} related={related} />;
}

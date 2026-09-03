import { notFound } from "next/navigation";
import { getPostsByTag } from "@/lib/posts";
import PostCard from "@/components/site/PostCard";

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { tag, posts } = await getPostsByTag(slug);
  if (!tag) notFound();

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <p className="text-sm font-mono uppercase tracking-widest text-[var(--blue-ink)] mb-2">Tag</p>
      <h1 className="text-3xl font-bold mb-10">#{tag.name}</h1>

      {posts.length === 0 ? (
        <p className="text-[var(--ink-soft)]">아직 이 태그의 글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

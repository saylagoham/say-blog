import { notFound } from "next/navigation";
import { getPostsByCategory, getCategories } from "@/lib/posts";
import PostCard from "@/components/site/PostCard";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [posts, categories] = await Promise.all([getPostsByCategory(slug), getCategories()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <p className="text-sm font-mono uppercase tracking-widest text-[var(--blue-ink)] mb-2">Category</p>
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && <p className="text-[var(--ink-soft)] mb-10 max-w-xl">{category.description}</p>}

      {posts.length === 0 ? (
        <p className="text-[var(--ink-soft)] mt-10">아직 이 카테고리에 글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 mt-10">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

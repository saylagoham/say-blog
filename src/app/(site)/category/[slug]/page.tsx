import { notFound } from "next/navigation";
import { getPostsByCategory, getCategories } from "@/lib/posts";
import PostCard from "@/components/site/PostCard";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const [posts, categories] = await Promise.all([getPostsByCategory(slug), getCategories()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
      <p className="inline-block chip-blue text-sm font-mono uppercase tracking-widest px-2.5 py-1 rounded mb-2">Category</p>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-keep">{category.name}</h1>
      {category.description && <p className="text-[var(--ink-soft)] mb-8 sm:mb-10 max-w-xl break-keep">{category.description}</p>}

      {posts.length === 0 ? (
        <p className="text-[var(--ink-soft)] mt-10">아직 이 카테고리에 글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 sm:gap-x-6 gap-y-8 sm:gap-y-10 mt-8 sm:mt-10">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

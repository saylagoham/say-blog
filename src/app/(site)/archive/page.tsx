import { getPublishedPosts, getCategories, getAllTags } from "@/lib/posts";
import { formatDate } from "@/components/site/PostCard";
import Link from "next/link";

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; q?: string }>;
}) {
  const { category, tag, q } = await searchParams;
  const [allPosts, categories, tags] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
    getAllTags(),
  ]);

  const posts = allPosts.filter((p) => {
    if (category && p.categories?.slug !== category) return false;
    if (tag && !p.post_tags.some((t) => t.tags.slug === tag)) return false;
    if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const byYear = posts.reduce<Record<string, typeof posts>>((acc, p) => {
    const year = p.published_at ? new Date(p.published_at).getFullYear().toString() : "Undated";
    (acc[year] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Archive</h1>

      <form className="flex flex-wrap gap-3 mb-4" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search titles…"
          className="rounded-lg border border-black/15 px-3 py-2 text-sm flex-1 min-w-[160px]"
        />
        <select name="category" defaultValue={category ?? ""} className="rounded-lg border border-black/15 px-3 py-2 text-sm">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select name="tag" defaultValue={tag ?? ""} className="rounded-lg border border-black/15 px-3 py-2 text-sm">
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.slug}>#{t.name}</option>
          ))}
        </select>
        <button type="submit" className="rounded-lg btn-primary text-sm px-4 py-2">Filter</button>
        {(category || tag || q) && (
          <Link href="/archive" className="text-sm text-[var(--blue-ink)] self-center hover:underline">Clear</Link>
        )}
      </form>

      <p className="text-sm text-[var(--ink-soft)] mb-10">{posts.length}개의 글</p>

      {Object.entries(byYear)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([year, yearPosts]) => (
          <div key={year} className="mb-10">
            <h2 className="text-sm font-mono uppercase tracking-widest text-[var(--ink-soft)] mb-3">{year}</h2>
            <ul className="space-y-2">
              {yearPosts.map((p) => (
                <li key={p.id} className="flex justify-between gap-4 py-1 border-b border-black/5">
                  <Link href={`/${p.slug}`} className="hover:underline decoration-[var(--baby-blue)]">{p.title}</Link>
                  <time className="text-sm text-[var(--ink-soft)] whitespace-nowrap">{formatDate(p.published_at)}</time>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

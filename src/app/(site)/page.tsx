import Link from "next/link";
import { getPublishedPosts, getPostsByJourney, getCategories } from "@/lib/posts";
import PostCard from "@/components/site/PostCard";

// Plain constants for now -- ask to make these admin-editable once the site is live.
const STATUS_LINE = "서울에서, 런던으로 갈 준비를 하는 중입니다.";
const CURRENTLY = "워킹홀리데이 비자를 준비하면서 영어 공부와 사이드 프로젝트를 병행하고 있어요. 매주 새로운 걸 시도해보는 중입니다.";

export default async function HomePage() {
  const [latest, journeyPosts, categories] = await Promise.all([
    getPublishedPosts(6),
    getPostsByJourney("seoul-to-london"),
    getCategories(),
  ]);
  const journeyLatest = journeyPosts.slice(-4).reverse();

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8">
      {/* SAY */}
      <section className="pt-16 pb-10">
        <p className="text-sm font-mono uppercase tracking-widest text-[var(--blue-ink)] mb-3">Say</p>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight max-w-2xl">{STATUS_LINE}</h1>
      </section>

      {/* CURRENTLY */}
      <section className="py-8 border-t border-black/10">
        <p className="text-xs font-mono uppercase tracking-widest text-[var(--ink-soft)] mb-3">Currently</p>
        <p className="text-lg leading-relaxed max-w-2xl">{CURRENTLY}</p>
      </section>

      {/* SEOUL -> LONDON */}
      {journeyLatest.length > 0 && (
        <section className="py-12 border-t border-black/10">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xl font-bold">Seoul → London</h2>
            <Link href="/journeys/seoul-to-london" className="text-sm text-[var(--blue-ink)] hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0">
            {journeyLatest.map((post) => (
              <div key={post.id} className="w-56 flex-shrink-0">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LATEST */}
      <section className="py-12 border-t border-black/10">
        <h2 className="text-xl font-bold mb-6">Latest</h2>
        {latest.length === 0 ? (
          <p className="text-[var(--ink-soft)]">아직 게시된 글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            {latest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* THE ARCHIVE */}
      <section className="py-12 border-t border-black/10">
        <h2 className="text-xl font-bold mb-6">The Archive</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="px-4 py-2 rounded-full border border-black/15 text-sm font-medium hover:border-[var(--baby-blue)] hover:bg-[var(--blue-tint)] transition"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT SAY */}
      <section className="py-16 border-t border-black/10">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold mb-4">About Say</h2>
          <p className="text-[var(--ink-soft)] leading-relaxed mb-4">
            안녕하세요, Say입니다. 서울에서 런던으로 워킹홀리데이를 준비하며, 삶과 영어 공부, 돈, 새로운 도전에 대한 이야기를 기록합니다.
          </p>
          <Link href="/about" className="text-sm font-medium text-[var(--blue-ink)] hover:underline">
            더 알아보기 →
          </Link>
        </div>
      </section>
    </div>
  );
}

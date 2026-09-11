import Link from "next/link";
import { getPublishedPosts, getPostsByJourney, getCategories } from "@/lib/posts";
import { CATEGORY_LABELS } from "@/lib/categoryLabels";
import PostCard from "@/components/site/PostCard";

// Plain constant for now -- ask to make this admin-editable once the site is live.
const INTRO = "세계여행 이후 영국워홀 ing~";

export default async function HomePage() {
  const [latest, journeyPosts, categories] = await Promise.all([
    getPublishedPosts(6),
    getPostsByJourney("seoul-to-london"),
    getCategories(),
  ]);
  const journeyLatest = journeyPosts.slice(-4).reverse();

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8">
      {/* HERO */}
      <section className="pt-10 sm:pt-16 pb-8 sm:pb-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/59D22DD4-0493-4013-8FC2-41E94B3BB0B2.PNG"
              alt="세이 Celine"
              className="w-full h-full object-cover scale-125"
            />
          </div>
          <span className="text-base sm:text-2xl font-bold break-keep">
            <span className="chip-blue rounded-full px-1.5 py-0.5 sm:px-2">세이</span> Celine
          </span>
        </div>
        <p className="text-[var(--ink-soft)] break-keep">{INTRO}</p>
      </section>

      {/* LATEST */}
      <section className="section-rule py-10 sm:py-12">
        <h2 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6">최근 기록</h2>
        {latest.length === 0 ? (
          <p className="text-[var(--ink-soft)]">아직 게시된 글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 sm:gap-x-6 gap-y-8 sm:gap-y-10">
            {latest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* SEOUL -> LONDON */}
      {journeyLatest.length > 0 && (
        <section className="section-rule py-10 sm:py-12">
          <div className="flex items-baseline justify-between mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold">Seoul → London</h2>
            <Link href="/journeys/seoul-to-london" className="text-sm font-medium text-[var(--blue-ink)] hover:underline whitespace-nowrap">
              전체 보기 →
            </Link>
          </div>
          <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0">
            {journeyLatest.map((post) => (
              <div key={post.id} className="w-44 sm:w-56 flex-shrink-0">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* THE ARCHIVE */}
      <section className="section-rule py-10 sm:py-12">
        <h2 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6">The Archive</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
          {Object.entries(CATEGORY_LABELS).map(([slug, label], i) => {
            const c = categories.find((c) => c.slug === slug);
            if (!c) return null;
            return (
              <Link
                key={c.id}
                href={`/category/${slug}`}
                className={`px-4 py-2 rounded-full text-sm font-semibold border border-transparent transition hover:border-[var(--ink)] text-center sm:text-left ${
                  i % 2 === 0 ? "chip-blue" : "chip-yellow"
                }`}
              >
                {label.ko} <span className="text-xs font-normal opacity-70">{label.en}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ABOUT 세이 CELINE */}
      <section className="section-rule py-12 sm:py-16">
        <div className="max-w-xl">
          <h2 className="text-lg sm:text-xl font-bold mb-4 break-keep">
            About <span className="chip-blue rounded-full px-2 py-0.5">세이</span> Celine
          </h2>
          <p className="text-[var(--ink-soft)] leading-relaxed mb-4 break-keep">
            세이입니다. 272일간의 세계여행 이후, 영국 워홀의 과정을 기록합니다.
          </p>
          <Link href="/about" className="text-sm font-semibold text-[var(--blue-ink)] hover:underline">
            더 알아보기 →
          </Link>
        </div>
      </section>
    </div>
  );
}

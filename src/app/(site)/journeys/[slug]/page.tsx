import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPostsByJourney } from "@/lib/posts";
import { formatDate } from "@/components/site/PostCard";

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const supabase = await createClient();
  const { data: journey } = await supabase.from("journeys").select("*").eq("slug", slug).maybeSingle();
  if (!journey) notFound();

  const posts = await getPostsByJourney(slug);

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <p className="inline-block chip-blue text-sm font-mono uppercase tracking-widest px-2.5 py-1 rounded mb-2">Journey</p>
      <h1 className="text-3xl font-bold mb-3">{journey.name}</h1>
      {journey.description && <p className="text-[var(--ink-soft)] mb-12 max-w-xl">{journey.description}</p>}

      {posts.length === 0 ? (
        <p className="text-[var(--ink-soft)]">아직 이 여정에 글이 없습니다.</p>
      ) : (
        <ol className="relative border-l-2 border-[var(--baby-blue)] pl-8 space-y-10">
          {posts.map((post) => (
            <li key={post.id} className="relative">
              <span className="absolute -left-[38px] top-1 w-3.5 h-3.5 rounded-full bg-[var(--baby-blue)] border-2 border-white" />
              <time className="text-xs text-[var(--ink-soft)]">{formatDate(post.published_at)}</time>
              <Link href={`/${post.slug}`} className="block text-lg font-bold mt-1 hover:underline decoration-[var(--baby-blue)]">
                {post.title}
              </Link>
              {post.subtitle && <p className="text-sm text-[var(--ink-soft)] mt-1">{post.subtitle}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

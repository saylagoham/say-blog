import Link from "next/link";
import { formatDate } from "@/components/site/PostCard";
import TiptapRenderer from "@/components/editor/TiptapRenderer";
import PostCard from "@/components/site/PostCard";
import type { PostWithRelations } from "@/lib/types";

export default function ArticleView({
  post,
  prev,
  next,
  related = [],
  preview = false,
}: {
  post: PostWithRelations;
  prev?: { title: string; slug: string } | null;
  next?: { title: string; slug: string } | null;
  related?: PostWithRelations[];
  preview?: boolean;
}) {
  return (
    <article className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
      {preview && (
        <div className="max-w-[720px] mx-auto mb-6 bg-[var(--blonde-yellow)] text-[var(--yellow-ink)] text-sm font-medium px-4 py-2 rounded-lg">
          Preview — this is how the published article will look.
        </div>
      )}

      <div className="max-w-[720px] mx-auto mb-6 sm:mb-8">
        <div className="flex items-center gap-3 text-sm text-[var(--ink-soft)] mb-3">
          {post.categories && (
            <span className="chip-blue px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide">{post.categories.name}</span>
          )}
          <time>{formatDate(post.published_at ?? post.created_at)}</time>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold leading-tight mb-3 break-keep">{post.title || "(untitled)"}</h1>
        {post.subtitle && <p className="text-base sm:text-lg text-[var(--ink-soft)] leading-relaxed break-keep">{post.subtitle}</p>}
      </div>

      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="block w-full h-auto max-w-[900px] mx-auto rounded-xl mb-10"
        />
      )}

      <div className="prose-say mx-auto">
        <TiptapRenderer content={post.body_json} />
      </div>

      {post.post_tags.length > 0 && (
        <div className="max-w-[720px] mx-auto mt-10 flex flex-wrap gap-2">
          {post.post_tags.map(({ tags }) => (
            <span key={tags.id} className="chip-yellow px-3 py-1 rounded-full text-sm font-medium">
              #{tags.name}
            </span>
          ))}
        </div>
      )}

      {(prev || next) && (
        <div className="max-w-[720px] mx-auto mt-10 pt-6 border-t border-black/10 flex justify-between text-sm">
          {prev ? (
            <Link href={`/${prev.slug}`} className="text-[var(--blue-ink)] hover:underline">← {prev.title}</Link>
          ) : <span />}
          {next ? (
            <Link href={`/${next.slug}`} className="text-[var(--blue-ink)] hover:underline text-right">{next.title} →</Link>
          ) : <span />}
        </div>
      )}

      {related.length > 0 && (
        <div className="max-w-5xl mx-auto mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-black/10">
          <h2 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6">Related</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 sm:gap-x-6 gap-y-8 sm:gap-y-10">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

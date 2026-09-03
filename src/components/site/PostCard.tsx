import Link from "next/link";
import type { PostWithRelations } from "@/lib/types";

export function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostCard({ post }: { post: PostWithRelations }) {
  return (
    <Link href={`/${post.slug}`} className="group block">
      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[var(--line)] mb-3">
        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        )}
      </div>
      {post.categories && (
        <span className="text-xs font-medium text-[var(--blue-ink)] uppercase tracking-wide">
          {post.categories.name}
        </span>
      )}
      <h3 className="font-bold text-lg leading-snug mt-1 group-hover:underline decoration-[var(--baby-blue)]">
        {post.title}
      </h3>
      <p className="text-sm text-[var(--ink-soft)] mt-1">{formatDate(post.published_at)}</p>
    </Link>
  );
}

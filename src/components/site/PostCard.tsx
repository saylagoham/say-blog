import Link from "next/link";
import type { PostWithRelations } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_THUMB_BG } from "@/lib/categoryLabels";

export function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostCard({ post }: { post: PostWithRelations }) {
  const slug = post.categories?.slug;
  const label = slug ? CATEGORY_LABELS[slug] : undefined;
  const thumbBg = (slug && CATEGORY_THUMB_BG[slug]) || "var(--line)";

  return (
    <Link href={`/${post.slug}`} className="group block">
      <div
        className="aspect-[4/3] rounded-xl overflow-hidden mb-3"
        style={{ backgroundColor: post.cover_image_url ? undefined : thumbBg }}
      >
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/59D22DD4-0493-4013-8FC2-41E94B3BB0B2.PNG"
                alt=""
                className="w-full h-full object-cover scale-125"
              />
            </div>
            {label && (
              <span className="text-center leading-tight">
                <span className="block text-sm font-bold text-[var(--ink)]">{label.ko}</span>
                <span className="block text-[10px] font-normal text-[var(--ink-soft)] tracking-wider uppercase">
                  {label.en}
                </span>
              </span>
            )}
          </div>
        )}
      </div>
      {post.categories && (
        <span className="chip-blue inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
          {post.categories.name}
        </span>
      )}
      <h3 className="font-bold text-base sm:text-lg leading-snug mt-1 break-keep group-hover:underline decoration-[var(--baby-blue)]">
        {post.title}
      </h3>
      <p className="text-sm text-[var(--ink-soft)] mt-1">{formatDate(post.published_at)}</p>
    </Link>
  );
}

import Link from "next/link";
import { getAllPostsForAdmin } from "@/lib/posts";
import { formatDate } from "@/components/site/PostCard";
import PostRowActions from "@/components/admin/PostRowActions";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: "draft" | "published" }>;
}) {
  const { status } = await searchParams;
  const posts = await getAllPostsForAdmin(status);

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold mb-8">
        {status === "draft" ? "Drafts" : status === "published" ? "Published" : "Posts"}
      </h1>

      <div className="rounded-xl border border-black/10 bg-white divide-y divide-black/5">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-5 py-4 gap-4">
            <Link href={`/admin/posts/${p.id}`} className="min-w-0 flex-1">
              <p className="font-medium truncate">{p.title || "(untitled)"}</p>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                {p.categories?.name ?? "No category"} · {p.status} · updated {formatDate(p.updated_at)}
              </p>
            </Link>
            <PostRowActions id={p.id} status={p.status} />
          </div>
        ))}
        {posts.length === 0 && <p className="px-5 py-6 text-sm text-[var(--ink-soft)]">글이 없습니다.</p>}
      </div>
    </div>
  );
}

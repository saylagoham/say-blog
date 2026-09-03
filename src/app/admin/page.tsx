import Link from "next/link";
import { getAllPostsForAdmin } from "@/lib/posts";
import { formatDate } from "@/components/site/PostCard";

export default async function AdminDashboard() {
  const posts = await getAllPostsForAdmin();
  const drafts = posts.filter((p) => p.status === "draft");
  const published = posts.filter((p) => p.status === "published");

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <Link href="/admin/posts?status=draft" className="rounded-xl border border-black/10 bg-white p-5 hover:border-[var(--baby-blue)]">
          <p className="text-3xl font-bold">{drafts.length}</p>
          <p className="text-sm text-[var(--ink-soft)]">Drafts</p>
        </Link>
        <Link href="/admin/posts?status=published" className="rounded-xl border border-black/10 bg-white p-5 hover:border-[var(--baby-blue)]">
          <p className="text-3xl font-bold">{published.length}</p>
          <p className="text-sm text-[var(--ink-soft)]">Published</p>
        </Link>
      </div>

      <h2 className="text-sm font-mono uppercase tracking-widest text-[var(--ink-soft)] mb-3">Recently edited</h2>
      <div className="rounded-xl border border-black/10 bg-white divide-y divide-black/5">
        {posts.slice(0, 8).map((p) => (
          <Link key={p.id} href={`/admin/posts/${p.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-black/[0.02]">
            <div>
              <p className="font-medium">{p.title || "(untitled)"}</p>
              <p className="text-xs text-[var(--ink-soft)]">{p.status} · updated {formatDate(p.updated_at)}</p>
            </div>
          </Link>
        ))}
        {posts.length === 0 && <p className="px-5 py-6 text-sm text-[var(--ink-soft)]">아직 글이 없습니다. New Post로 시작하세요.</p>}
      </div>
    </div>
  );
}

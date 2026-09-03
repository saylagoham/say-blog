import Link from "next/link";
import { createPost, signOut } from "./actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/posts?status=draft", label: "Drafts" },
  { href: "/admin/posts?status=published", label: "Published" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/media", label: "Media" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex">
      <aside className="w-56 shrink-0 border-r-[3px] border-[var(--baby-blue)] bg-white flex flex-col">
        <div className="px-5 h-16 flex flex-col justify-center border-b border-black/10">
          <Link href="/" className="font-bold text-base leading-tight">Say no more</Link>
          <span className="text-[var(--ink-soft)] font-normal text-xs">/admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[var(--ink-soft)] hover:bg-[var(--blue-tint)] hover:text-[var(--blue-ink)]"
            >
              {item.label}
            </Link>
          ))}
          <form action={createPost}>
            <button
              type="submit"
              className="w-full mt-3 px-3 py-2 rounded-lg text-sm btn-primary"
            >
              + New Post
            </button>
          </form>
        </nav>
        <form action={signOut} className="p-3 border-t border-black/10">
          <button type="submit" className="w-full text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] px-3 py-2 text-left">
            Sign out
          </button>
        </form>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

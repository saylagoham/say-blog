import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-black/10">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Say
        </Link>
        <nav className="flex items-center gap-5 text-sm text-[var(--ink-soft)]">
          <Link href="/journeys/seoul-to-london" className="hover:text-[var(--ink)]">
            Seoul → London
          </Link>
          <Link href="/archive" className="hover:text-[var(--ink)]">
            Archive
          </Link>
          <Link href="/about" className="hover:text-[var(--ink)]">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

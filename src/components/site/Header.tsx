import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-[3px] border-[var(--baby-blue)]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg sm:text-xl font-bold tracking-tight">
          Say no more
        </Link>
        <nav className="flex items-center gap-4 sm:gap-5 text-sm text-[var(--ink-soft)]">
          <Link href="/journeys/seoul-to-london" className="hover:text-[var(--blue-ink)] hover:underline decoration-[var(--baby-blue)] decoration-2 underline-offset-4">
            Seoul → London
          </Link>
          <Link href="/archive" className="hover:text-[var(--blue-ink)] hover:underline decoration-[var(--baby-blue)] decoration-2 underline-offset-4">
            Archive
          </Link>
          <Link href="/about" className="hover:text-[var(--blue-ink)] hover:underline decoration-[var(--baby-blue)] decoration-2 underline-offset-4">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

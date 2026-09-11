import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-[3px] border-[var(--baby-blue)]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 min-h-16 flex items-center justify-between gap-2">
        <Link href="/" className="text-base sm:text-xl font-bold tracking-tight shrink-0">
          Say no more
        </Link>
        <nav className="flex items-center gap-2.5 sm:gap-5 text-xs sm:text-sm text-[var(--ink-soft)]">
          <Link href="/journeys/seoul-to-london" className="whitespace-nowrap hover:text-[var(--blue-ink)] hover:underline decoration-[var(--baby-blue)] decoration-2 underline-offset-4">
            Seoul → London
          </Link>
          <Link href="/archive" className="whitespace-nowrap hover:text-[var(--blue-ink)] hover:underline decoration-[var(--baby-blue)] decoration-2 underline-offset-4">
            Archive
          </Link>
          <Link href="/about" className="whitespace-nowrap hover:text-[var(--blue-ink)] hover:underline decoration-[var(--baby-blue)] decoration-2 underline-offset-4">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

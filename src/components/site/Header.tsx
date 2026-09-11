import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-[3px] border-[var(--baby-blue)]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-0">
        <div>
          <Link href="/" className="text-lg sm:text-xl font-bold tracking-tight inline-block">
            Say no more
          </Link>
          <svg viewBox="0 0 60 12" className="w-9 sm:w-6 h-auto block mt-0.5" fill="none" aria-hidden="true">
            <path
              d="M1,7 C6,2 11,2 16,7 C21,12 26,12 31,7 C36,2 41,2 46,7 C51,12 56,12 59,7"
              stroke="var(--baby-blue)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <nav className="flex items-center gap-5 text-sm text-[var(--ink-soft)]">
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

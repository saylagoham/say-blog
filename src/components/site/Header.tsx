import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-[3px] border-[var(--baby-blue)]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-0">
        <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight">
          <span className="sm:hidden w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/59D22DD4-0493-4013-8FC2-41E94B3BB0B2.PNG"
              alt=""
              className="w-full h-full object-cover scale-125"
            />
          </span>
          Say no more
        </Link>
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

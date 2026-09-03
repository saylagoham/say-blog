export default function Footer() {
  return (
    <footer className="border-t-[3px] border-[var(--blonde-yellow)] mt-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 text-sm text-[var(--ink-soft)] flex flex-col sm:flex-row justify-between gap-2">
        <span className="font-semibold text-[var(--ink)]">&copy; {new Date().getFullYear()} Say no more</span>
        <span>Seoul → London, and everything else</span>
      </div>
    </footer>
  );
}

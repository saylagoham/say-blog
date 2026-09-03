export default function Footer() {
  return (
    <footer className="border-t border-black/10 mt-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 text-sm text-[var(--ink-soft)] flex flex-col sm:flex-row justify-between gap-2">
        <span>&copy; {new Date().getFullYear()} Say</span>
        <span>Seoul → London, and everything else</span>
      </div>
    </footer>
  );
}

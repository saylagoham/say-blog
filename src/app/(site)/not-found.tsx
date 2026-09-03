import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-24 text-center">
      <p className="text-sm font-mono uppercase tracking-widest text-[var(--blue-ink)] mb-3">404</p>
      <h1 className="text-2xl font-bold mb-3">이 페이지를 찾을 수 없습니다.</h1>
      <Link href="/" className="text-[var(--blue-ink)] hover:underline">홈으로 돌아가기 →</Link>
    </div>
  );
}

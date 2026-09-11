"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setError("링크가 만료되었거나 이미 사용됐어요. 다시 요청해주세요.");
        else setReady(true);
      });
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/admin"), 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--warm-white)] px-6">
      <div className="w-full max-w-sm bg-white border-t-[3px] border-[var(--baby-blue)] rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">비밀번호 재설정</h1>
        <p className="text-sm text-black/50 mb-6">새 비밀번호를 입력해주세요.</p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {done ? (
          <p className="text-sm text-[var(--ink-soft)]">비밀번호가 변경됐어요. 관리자 페이지로 이동합니다…</p>
        ) : ready ? (
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              새 비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-6 rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--baby-blue)]"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg btn-primary text-sm py-2.5 transition disabled:opacity-50"
            >
              {submitting ? "변경 중…" : "비밀번호 변경"}
            </button>
          </form>
        ) : !error ? (
          <p className="text-sm text-[var(--ink-soft)]">링크 확인 중…</p>
        ) : (
          <a href="/login" className="text-sm text-[var(--blue-ink)] hover:underline">
            로그인으로 돌아가기
          </a>
        )}
      </div>
    </div>
  );
}

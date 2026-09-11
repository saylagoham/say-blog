"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--warm-white)] px-6">
      <div className="w-full max-w-sm bg-white border-t-[3px] border-[var(--baby-blue)] rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">비밀번호 찾기</h1>
        <p className="text-sm text-black/50 mb-6">가입한 이메일로 재설정 링크를 보내드려요.</p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {sent ? (
          <p className="text-sm text-[var(--ink-soft)]">
            이메일을 보냈어요. 받은편지함(또는 스팸함)을 확인해주세요.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-6 rounded-lg border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--baby-blue)]"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg btn-primary text-sm py-2.5 transition disabled:opacity-50"
            >
              {submitting ? "전송 중…" : "재설정 링크 보내기"}
            </button>
          </form>
        )}

        <a href="/login" className="block mt-4 text-sm text-[var(--blue-ink)] hover:underline">
          ← 로그인으로 돌아가기
        </a>
      </div>
    </div>
  );
}

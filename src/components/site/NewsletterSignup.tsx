"use client";

import { useState, useTransition, type FormEvent } from "react";
import { subscribeToNewsletter, type SubscribeResult } from "@/lib/newsletter";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULTS = {
  homepage: {
    title: "새 글 알림 받아보기",
    description: "세계여행, 영국 워홀, 영어, 돈과 여행에 대한 새로운 기록을 이메일로 받아보세요.",
  },
  post: {
    title: null as string | null,
    description: "여기까지 읽었다면,\n다음 기록도 놓치지 않게 이메일로 받아보세요.",
  },
};

const MESSAGES: Record<SubscribeResult["status"], string> = {
  empty: "이메일을 입력해주세요.",
  invalid: "올바른 이메일 형식이 아니에요.",
  duplicate: "이미 새 글 알림을 받고 있어요 :)",
  error: "잠시 후 다시 시도해주세요.",
  success: "", // rendered separately below
};

export default function NewsletterSignup({
  variant,
  title,
  description,
  source,
}: {
  variant: "homepage" | "post";
  title?: string;
  description?: string;
  source: string;
}) {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<SubscribeResult | null>(null);
  const [pending, startTransition] = useTransition();

  const defaults = DEFAULTS[variant];
  const resolvedTitle = title ?? defaults.title;
  const resolvedDescription = description ?? defaults.description;
  const inputId = `newsletter-email-${variant}`;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    const trimmed = email.trim();
    if (!trimmed) {
      setResult({ status: "empty" });
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setResult({ status: "invalid" });
      return;
    }
    startTransition(async () => {
      const res = await subscribeToNewsletter(trimmed, source);
      setResult(res);
      if (res.status === "success") setEmail("");
    });
  }

  const form = (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-2.5 w-full">
      <label htmlFor={inputId} className="sr-only">
        이메일 주소
      </label>
      <input
        id={inputId}
        type="email"
        inputMode="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        disabled={pending}
        aria-describedby={`${inputId}-message`}
        className="w-full sm:flex-1 min-w-0 rounded-lg border border-black/15 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--baby-blue)] disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto shrink-0 rounded-lg btn-primary text-sm font-semibold px-5 py-2.5 transition disabled:opacity-60"
      >
        {pending ? "등록 중..." : "새 글 알림 받기"}
      </button>
    </form>
  );

  const message = (
    <div id={`${inputId}-message`} aria-live="polite" className="min-h-[1.25em] mt-2.5 text-sm">
      {result?.status === "success" ? (
        <p className="text-[var(--blue-ink)]">
          구독 완료 💌
          <br />
          새 글이 올라오면 알려드릴게요.
        </p>
      ) : result?.status ? (
        <p className="text-[var(--ink-soft)]">{MESSAGES[result.status]}</p>
      ) : null}
    </div>
  );

  if (variant === "post") {
    return (
      <div className="max-w-[720px] mx-auto mt-10 pt-8 border-t border-black/10">
        {resolvedDescription && (
          <p className="text-[var(--ink-soft)] leading-relaxed mb-4 break-keep">
            {resolvedDescription.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
        )}
        {form}
        {message}
      </div>
    );
  }

  return (
    <section className="section-rule py-10 sm:py-12">
      <div className="max-w-2xl rounded-xl bg-[var(--blue-tint)] px-5 py-7 sm:px-8 sm:py-9">
        {resolvedTitle && (
          <h2 className="text-lg sm:text-xl font-bold mb-2 break-keep">{resolvedTitle}</h2>
        )}
        {resolvedDescription && (
          <p className="text-[var(--ink-soft)] leading-relaxed mb-5 break-keep">
            {resolvedDescription.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
        )}
        {form}
        {message}
      </div>
    </section>
  );
}

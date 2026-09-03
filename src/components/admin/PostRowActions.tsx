"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { publishPost, unpublishPost, deletePost } from "@/app/admin/actions";
import type { PostStatus } from "@/lib/types";

export default function PostRowActions({ id, status }: { id: string; status: PostStatus }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 text-sm">
      {status === "draft" ? (
        <button
          disabled={pending}
          onClick={() => startTransition(() => publishPost(id))}
          className="text-[var(--blue-ink)] hover:underline"
        >
          Publish
        </button>
      ) : (
        <button
          disabled={pending}
          onClick={() => startTransition(() => unpublishPost(id))}
          className="text-[var(--ink-soft)] hover:underline"
        >
          Unpublish
        </button>
      )}
      <button
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this post? This can't be undone.")) {
            startTransition(async () => {
              await deletePost(id);
              router.refresh();
            });
          }
        }}
        className="text-red-500 hover:underline"
      >
        Delete
      </button>
    </div>
  );
}

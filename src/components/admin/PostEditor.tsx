"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RichTextEditor, { uploadFile } from "@/components/editor/RichTextEditor";
import { savePost, publishPost, unpublishPost, deletePost, type SavePostInput } from "@/app/admin/actions";
import type { Category, Journey, PostWithRelations } from "@/lib/types";

export default function PostEditor({
  post,
  categories,
  journeys,
}: {
  post: PostWithRelations;
  categories: Category[];
  journeys: Journey[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [subtitle, setSubtitle] = useState(post.subtitle ?? "");
  const [slug, setSlug] = useState(post.slug);
  const [bodyJson, setBodyJson] = useState(post.body_json);
  const [coverImage, setCoverImage] = useState(post.cover_image_url ?? "");
  const [categoryId, setCategoryId] = useState(post.category_id ?? "");
  const [journeyId, setJourneyId] = useState(post.journey_id ?? "");
  const [journeyOrder, setJourneyOrder] = useState(post.journey_order?.toString() ?? "");
  const [tags, setTags] = useState(post.post_tags.map((t) => t.tags.name).join(", "));
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [slugTouched, setSlugTouched] = useState(false);

  const doSave = useCallback(async () => {
    setSaveState("saving");
    const input: SavePostInput = {
      id: post.id,
      title,
      subtitle,
      slug,
      body_json: bodyJson,
      cover_image_url: coverImage || null,
      category_id: categoryId || null,
      journey_id: journeyId || null,
      journey_order: journeyOrder ? Number(journeyOrder) : null,
      tags,
    };
    const result = await savePost(input);
    if (result.slug && result.slug !== slug) setSlug(result.slug);
    setSaveState("saved");
  }, [post.id, title, subtitle, slug, bodyJson, coverImage, categoryId, journeyId, journeyOrder, tags]);

  // autosave a couple seconds after the last edit
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSaveState("idle");
    const timer = setTimeout(doSave, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, subtitle, slug, bodyJson, coverImage, categoryId, journeyId, journeyOrder, tags]);

  async function onCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await uploadFile(file);
    setCoverImage(url);
  }

  async function onPublish() {
    await doSave();
    await publishPost(post.id);
    router.refresh();
  }

  async function onUnpublish() {
    await unpublishPost(post.id);
    router.refresh();
  }

  async function onDelete() {
    if (!confirm("Delete this post? This can't be undone.")) return;
    await deletePost(post.id);
    router.push("/admin/posts");
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/posts" className="text-sm text-[var(--ink-soft)] hover:underline">← All posts</Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[var(--ink-soft)]">
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : ""}
          </span>
          <Link href={`/admin/posts/${post.id}/preview`} target="_blank" className="text-[var(--blue-ink)] hover:underline">
            Preview
          </Link>
          {post.status === "published" ? (
            <>
              <Link href={`/${slug}`} target="_blank" className="text-[var(--blue-ink)] hover:underline">View live</Link>
              <button onClick={onUnpublish} className="text-[var(--ink-soft)] hover:underline">Unpublish</button>
            </>
          ) : (
            <button onClick={onPublish} className="px-3 py-1.5 rounded-lg bg-[var(--ink)] text-white font-medium hover:opacity-90">
              Publish
            </button>
          )}
          <button onClick={onDelete} className="text-red-500 hover:underline">Delete</button>
        </div>
      </div>

      <input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (!slugTouched) setSlug(e.target.value);
        }}
        placeholder="Title"
        className="w-full text-3xl font-bold mb-3 bg-transparent outline-none placeholder:text-black/25"
      />
      <input
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        placeholder="Subtitle (optional)"
        className="w-full text-lg text-[var(--ink-soft)] mb-4 bg-transparent outline-none placeholder:text-black/25"
      />

      <div className="flex items-center gap-2 mb-6 text-sm">
        <span className="text-[var(--ink-soft)]">say.blog/</span>
        <input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="flex-1 bg-transparent outline-none border-b border-dashed border-black/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1">Cover image</label>
          {coverImage ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="" className="w-full aspect-video object-cover rounded-lg" />
              <button
                onClick={() => setCoverImage("")}
                className="absolute top-2 right-2 bg-black/60 text-white text-xs w-6 h-6 rounded-full"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center aspect-video rounded-lg border-2 border-dashed border-black/15 text-sm text-[var(--ink-soft)] cursor-pointer hover:border-[var(--baby-blue)]">
              Upload cover
              <input type="file" accept="image/*" hidden onChange={onCoverPick} />
            </label>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1">Journey</label>
            <div className="flex gap-2">
              <select
                value={journeyId}
                onChange={(e) => setJourneyId(e.target.value)}
                className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm"
              >
                <option value="">None</option>
                {journeys.map((j) => (
                  <option key={j.id} value={j.id}>{j.name}</option>
                ))}
              </select>
              {journeyId && (
                <input
                  type="number"
                  value={journeyOrder}
                  onChange={(e) => setJourneyOrder(e.target.value)}
                  placeholder="order"
                  className="w-20 rounded-lg border border-black/15 px-2 py-2 text-sm"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1">Tags</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="comma, separated, tags"
              className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <RichTextEditor content={bodyJson} onChange={setBodyJson} />
    </div>
  );
}

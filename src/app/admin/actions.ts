"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

export type SavePostInput = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  body_json: object;
  cover_image_url: string | null;
  category_id: string | null;
  journey_id: string | null;
  journey_order: number | null;
  tags: string; // comma-separated, freeform
};

export async function savePost(input: SavePostInput) {
  const supabase = await createClient();
  const slug = input.slug ? slugify(input.slug) : slugify(input.title || "post");

  const { error } = await supabase
    .from("posts")
    .update({
      title: input.title,
      subtitle: input.subtitle || null,
      slug,
      body_json: input.body_json,
      cover_image_url: input.cover_image_url,
      category_id: input.category_id,
      journey_id: input.journey_id,
      journey_order: input.journey_order,
    })
    .eq("id", input.id);
  if (error) return { error: error.message };

  await syncTags(input.id, input.tags);

  revalidatePath("/admin/posts");
  revalidatePath(`/${slug}`);
  return { error: null, slug };
}

async function syncTags(postId: string, tagsCsv: string) {
  const supabase = await createClient();
  const names = Array.from(
    new Set(
      tagsCsv
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    )
  );

  const tagIds: string[] = [];
  for (const name of names) {
    const slug = slugify(name);
    const { data: existing } = await supabase.from("tags").select("id").eq("slug", slug).maybeSingle();
    if (existing) {
      tagIds.push(existing.id);
    } else {
      const { data: created } = await supabase.from("tags").insert({ name, slug }).select("id").single();
      if (created) tagIds.push(created.id);
    }
  }

  await supabase.from("post_tags").delete().eq("post_id", postId);
  if (tagIds.length > 0) {
    await supabase.from("post_tags").insert(tagIds.map((tag_id) => ({ post_id: postId, tag_id })));
  }
}

export async function createPost() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({ title: "", slug: `untitled-${Date.now()}` })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Could not create post");
  redirect(`/admin/posts/${data.id}`);
}

export async function publishPost(id: string) {
  const supabase = await createClient();
  await supabase
    .from("posts")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/posts");
}

export async function unpublishPost(id: string) {
  const supabase = await createClient();
  await supabase.from("posts").update({ status: "draft" }).eq("id", id);
  revalidatePath("/admin/posts");
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/admin/posts");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function upsertCategory(input: { id?: string; name: string; slug?: string; description?: string }) {
  const supabase = await createClient();
  const slug = input.slug ? slugify(input.slug) : slugify(input.name);
  if (input.id) {
    await supabase.from("categories").update({ name: input.name, slug, description: input.description || null }).eq("id", input.id);
  } else {
    await supabase.from("categories").insert({ name: input.name, slug, description: input.description || null });
  }
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
}

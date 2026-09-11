import { createClient } from "@/lib/supabase/server";
import type { PostWithRelations } from "@/lib/types";

const SELECT_WITH_RELATIONS =
  "*, categories(*), journeys(*), post_tags(tags(*))";

export async function getPublishedPosts(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select(SELECT_WITH_RELATIONS)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data ?? []) as unknown as PostWithRelations[];
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select(SELECT_WITH_RELATIONS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data as unknown as PostWithRelations | null;
}

export async function getAdjacentPosts(publishedAt: string) {
  const supabase = await createClient();
  const [{ data: prev }, { data: next }] = await Promise.all([
    supabase
      .from("posts")
      .select("title, slug")
      .eq("status", "published")
      .lt("published_at", publishedAt)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("posts")
      .select("title, slug")
      .eq("status", "published")
      .gt("published_at", publishedAt)
      .order("published_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);
  return { prev, next };
}

export async function getPostsByCategory(categorySlug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, categories!inner(*), journeys(*), post_tags(tags(*))")
    .eq("status", "published")
    .eq("categories.slug", categorySlug)
    .order("published_at", { ascending: false });
  return (data ?? []) as unknown as PostWithRelations[];
}

export async function getPostsByJourney(journeySlug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select(`${SELECT_WITH_RELATIONS}, journeys!inner(*)`)
    .eq("status", "published")
    .eq("journeys.slug", journeySlug)
    .order("journey_order", { ascending: true });
  return (data ?? []) as unknown as PostWithRelations[];
}

export async function getPostsByTag(tagSlug: string) {
  const supabase = await createClient();
  const { data: tag } = await supabase.from("tags").select("*").eq("slug", tagSlug).maybeSingle();
  if (!tag) return { tag: null, posts: [] };

  const { data } = await supabase
    .from("post_tags")
    .select(`posts!inner(${SELECT_WITH_RELATIONS})`)
    .eq("tag_id", tag.id)
    .eq("posts.status", "published");

  const posts = ((data ?? []) as unknown as { posts: PostWithRelations }[]).map((r) => r.posts);
  return { tag, posts };
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getPostByIdForAdmin(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select(SELECT_WITH_RELATIONS).eq("id", id).maybeSingle();
  return data as unknown as PostWithRelations | null;
}

export async function getJourneys() {
  const supabase = await createClient();
  const { data } = await supabase.from("journeys").select("*").order("name");
  return data ?? [];
}

export async function getAllPostsForAdmin(status?: "draft" | "published") {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select(SELECT_WITH_RELATIONS)
    .order("updated_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data } = await query;
  return (data ?? []) as unknown as PostWithRelations[];
}

export async function getAllTags() {
  const supabase = await createClient();
  const { data } = await supabase.from("tags").select("*").order("name");
  return data ?? [];
}

export async function getRelatedPosts(post: PostWithRelations) {
  const supabase = await createClient();
  if (!post.category_id) return [];
  const { data } = await supabase
    .from("posts")
    .select(SELECT_WITH_RELATIONS)
    .eq("status", "published")
    .eq("category_id", post.category_id)
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(3);
  return (data ?? []) as unknown as PostWithRelations[];
}

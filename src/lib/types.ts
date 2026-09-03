export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type Journey = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  body_json: object;
  cover_image_url: string | null;
  category_id: string | null;
  journey_id: string | null;
  journey_order: number | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PostWithRelations = Post & {
  categories: Category | null;
  journeys: Journey | null;
  post_tags: { tags: Tag }[];
};

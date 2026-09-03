-- Say blog schema. Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- Single-owner blog: the only Supabase Auth user you create IS the admin. No roles table needed.

create extension if not exists "pgcrypto";

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table journeys (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  subtitle text,
  slug text not null unique,
  body_json jsonb not null default '{}'::jsonb,
  cover_image_url text,
  category_id uuid references categories(id) on delete set null,
  journey_id uuid references journeys(id) on delete set null,
  journey_order int,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table post_tags (
  post_id uuid not null references posts(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create index posts_status_published_at_idx on posts (status, published_at desc);
create index posts_category_idx on posts (category_id);
create index posts_journey_idx on posts (journey_id, journey_order);

-- keep updated_at fresh
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_set_updated_at
before update on posts
for each row execute function set_updated_at();

-- Row Level Security: anyone can read published content; only the logged-in
-- owner (the one Supabase Auth user you create) can write, and can also read drafts.
alter table categories enable row level security;
alter table tags enable row level security;
alter table journeys enable row level security;
alter table posts enable row level security;
alter table post_tags enable row level security;

create policy "categories are publicly readable" on categories for select using (true);
create policy "owner manages categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "tags are publicly readable" on tags for select using (true);
create policy "owner manages tags" on tags for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "journeys are publicly readable" on journeys for select using (true);
create policy "owner manages journeys" on journeys for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "published posts are publicly readable" on posts for select
  using (status = 'published' or auth.role() = 'authenticated');
create policy "owner manages posts" on posts for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "post_tags are publicly readable" on post_tags for select using (true);
create policy "owner manages post_tags" on post_tags for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage bucket for post images
insert into storage.buckets (id, name, public) values ('images', 'images', true)
on conflict (id) do nothing;

create policy "images are publicly readable" on storage.objects for select
  using (bucket_id = 'images');
create policy "owner uploads images" on storage.objects for insert
  with check (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "owner manages images" on storage.objects for update using (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "owner deletes images" on storage.objects for delete using (bucket_id = 'images' and auth.role() = 'authenticated');

-- Starter categories -- rename/add/remove any time from /admin/categories, this is just a seed.
insert into categories (name, slug, sort_order) values
  ('Life', 'life', 1),
  ('London', 'london', 2),
  ('Money', 'money', 3),
  ('English', 'english', 4),
  ('Travel', 'travel', 5),
  ('Trying Things', 'trying-things', 6),
  ('Guides', 'guides', 7);

insert into journeys (name, slug, description) values
  ('Seoul → London', 'seoul-to-london', 'UK Working Holiday: visa, moving, flat hunting, job hunting, and building a new life in London.');

-- Migration: posts
-- Creates the posts and post_sections tables for the blog/resources CMS

create table posts (
  id               uuid default gen_random_uuid() primary key,
  slug             text unique not null,
  type             text not null check (type in ('Guide', 'Article', 'Case Study', 'Video')),
  title            text not null,
  description      text not null,
  meta_description text not null,
  date             text not null,
  read_time        text not null,
  related_slugs    text[] default '{}',
  published        boolean default false,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create table post_sections (
  id       uuid default gen_random_uuid() primary key,
  post_id  uuid references posts(id) on delete cascade not null,
  heading  text not null,
  content  text[] not null,
  position integer not null
);

-- Indexes
create index post_sections_post_id_idx on post_sections(post_id);
create index posts_slug_idx on posts(slug);

-- Row Level Security
alter table posts enable row level security;
alter table post_sections enable row level security;

-- Public: read published posts only
create policy "Public read published posts"
  on posts for select
  using (published = true);

-- Authenticated: full access
create policy "Auth manage posts"
  on posts for all
  using (auth.role() = 'authenticated');

-- Public: read sections of published posts only
create policy "Public read sections of published posts"
  on post_sections for select
  using (
    exists (
      select 1 from posts
      where posts.id = post_sections.post_id
        and posts.published = true
    )
  );

-- Authenticated: full access
create policy "Auth manage sections"
  on post_sections for all
  using (auth.role() = 'authenticated');

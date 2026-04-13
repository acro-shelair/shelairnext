-- Migration: posts category and pinned
-- Adds category (free-text filter) and pinned (sort-to-top) fields to posts.

alter table posts
  add column if not exists category text,
  add column if not exists pinned   boolean not null default false;

create index if not exists posts_pinned_idx   on posts(pinned);
create index if not exists posts_category_idx on posts(category);

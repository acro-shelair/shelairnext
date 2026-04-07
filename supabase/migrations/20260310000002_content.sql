-- Migration: content tables
-- Services, Industries, Brands, Projects, Pricing, Testimonials, FAQs

-- ── Services ────────────────────────────────────────────────────────────────
-- icon_name maps to a Lucide icon string (e.g. "Clock", "Wrench")

create table services (
  id        uuid default gen_random_uuid() primary key,
  icon_name text not null,
  title     text not null,
  description text not null,
  position  integer not null default 0
);

-- ── Industries ──────────────────────────────────────────────────────────────

create table industries (
  id         uuid default gen_random_uuid() primary key,
  slug       text unique not null,
  icon_name  text not null,
  title      text not null,
  short_desc text not null,
  description text not null,
  features   text[] default '{}',
  position   integer not null default 0
);

create index industries_slug_idx on industries(slug);

-- ── Featured Brands ─────────────────────────────────────────────────────────
-- Covers both the listing card (FeaturedBrand) and the detail page (BrandDetail)

create table brands (
  id             uuid default gen_random_uuid() primary key,
  slug           text unique not null,
  name           text not null,
  -- Listing card fields
  description    text not null,
  speciality     text not null,
  detail         text not null,
  -- Detail page fields
  tagline        text not null default '',
  hero_desc      text not null default '',
  about          text not null default '',
  stats          jsonb default '[]',
  -- e.g. [{"value": "500+", "label": "Bitzer Repairs"}]
  common_issues  jsonb default '[]',
  -- e.g. [{"title": "Compressor Burnout", "desc": "..."}]
  services_offered text[] default '{}',
  product_types  text[] default '{}',
  related_brands jsonb default '[]',
  -- e.g. [{"slug": "copeland", "name": "Copeland", "desc": "..."}]
  position       integer not null default 0
);

create index brands_slug_idx on brands(slug);

-- ── Other Brands ─────────────────────────────────────────────────────────────
-- Smaller brands shown as pills on the brands page

create table other_brands (
  id       uuid default gen_random_uuid() primary key,
  name     text not null,
  category text not null,
  position integer not null default 0
);

-- ── Projects ─────────────────────────────────────────────────────────────────

create table projects (
  id       uuid default gen_random_uuid() primary key,
  title    text not null,
  type     text not null,
  size     text not null,
  description text not null,
  position integer not null default 0
);

-- ── Pricing Tiers ────────────────────────────────────────────────────────────

create table pricing_tiers (
  id       uuid default gen_random_uuid() primary key,
  name     text not null,
  description text not null,
  price    text not null,
  unit     text not null,
  features text[] default '{}',
  popular  boolean default false,
  position integer not null default 0
);

-- ── Testimonials ─────────────────────────────────────────────────────────────

create table testimonials (
  id       uuid default gen_random_uuid() primary key,
  name     text not null,
  role     text not null,
  quote    text not null,
  position integer not null default 0
);

-- ── FAQs ─────────────────────────────────────────────────────────────────────

create table faqs (
  id       uuid default gen_random_uuid() primary key,
  question text not null,
  answer   text not null,
  position integer not null default 0
);

-- ── Row Level Security (all content tables) ──────────────────────────────────

alter table services enable row level security;
alter table industries enable row level security;
alter table brands enable row level security;
alter table other_brands enable row level security;
alter table projects enable row level security;
alter table pricing_tiers enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;

-- Public: read all (no published flag — all records are live)
create policy "Public read services"      on services      for select using (true);
create policy "Public read industries"    on industries    for select using (true);
create policy "Public read brands"        on brands        for select using (true);
create policy "Public read other_brands"  on other_brands  for select using (true);
create policy "Public read projects"      on projects      for select using (true);
create policy "Public read pricing_tiers" on pricing_tiers for select using (true);
create policy "Public read testimonials"  on testimonials  for select using (true);
create policy "Public read faqs"          on faqs          for select using (true);

-- Authenticated: full access
create policy "Auth manage services"      on services      for all using (auth.role() = 'authenticated');
create policy "Auth manage industries"    on industries    for all using (auth.role() = 'authenticated');
create policy "Auth manage brands"        on brands        for all using (auth.role() = 'authenticated');
create policy "Auth manage other_brands"  on other_brands  for all using (auth.role() = 'authenticated');
create policy "Auth manage projects"      on projects      for all using (auth.role() = 'authenticated');
create policy "Auth manage pricing_tiers" on pricing_tiers for all using (auth.role() = 'authenticated');
create policy "Auth manage testimonials"  on testimonials  for all using (auth.role() = 'authenticated');
create policy "Auth manage faqs"          on faqs          for all using (auth.role() = 'authenticated');

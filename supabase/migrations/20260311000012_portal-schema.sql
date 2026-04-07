-- Portal: employee-facing document/resource library

create table portal_sections (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  description text,
  position    int  not null default 0,
  created_at  timestamptz default now()
);

create table portal_resources (
  id          uuid default gen_random_uuid() primary key,
  section_id  uuid references portal_sections(id) on delete cascade not null,
  title       text not null,
  url         text not null,
  type        text not null check (type in ('file', 'link')) default 'file',
  file_type   text check (file_type in ('pdf', 'excel', 'word', 'other')),
  expires_at  date,
  position    int  not null default 0,
  created_at  timestamptz default now()
);

create index portal_resources_section_id_idx on portal_resources(section_id);

-- RLS: authenticated users only (employees + admins)
alter table portal_sections  enable row level security;
alter table portal_resources enable row level security;

create policy "Auth read portal sections"
  on portal_sections for select
  using (auth.role() = 'authenticated');

create policy "Auth manage portal sections"
  on portal_sections for all
  using (auth.role() = 'authenticated');

create policy "Auth read portal resources"
  on portal_resources for select
  using (auth.role() = 'authenticated');

create policy "Auth manage portal resources"
  on portal_resources for all
  using (auth.role() = 'authenticated');

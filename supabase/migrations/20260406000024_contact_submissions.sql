-- Contact form submissions
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  service text not null,
  details text,
  created_at timestamptz default now()
);

-- Anyone can insert (public form), only authenticated users can read
alter table public.contact_submissions enable row level security;

create policy "Anyone can submit contact form"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated users can view submissions"
  on public.contact_submissions for select
  to authenticated
  using (true);

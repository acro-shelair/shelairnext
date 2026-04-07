-- Run this in the Supabase SQL editor

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Authenticated users can upload and delete
create policy "Auth upload project images"
  on storage.objects for insert
  with check (bucket_id = 'project-images' and auth.role() = 'authenticated');

create policy "Auth delete project images"
  on storage.objects for delete
  using (bucket_id = 'project-images' and auth.role() = 'authenticated');

-- Public read so images display on the site
create policy "Public read project images"
  on storage.objects for select
  using (bucket_id = 'project-images');

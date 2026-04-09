insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- Authenticated users can upload and delete
create policy "Auth upload post images"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

create policy "Auth delete post images"
  on storage.objects for delete
  using (bucket_id = 'post-images' and auth.role() = 'authenticated');

-- Public read so images display on the site
create policy "Public read post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

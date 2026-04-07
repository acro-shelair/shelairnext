-- Portal file storage bucket
-- Run this in the Supabase SQL editor after portal-schema.sql

insert into storage.buckets (id, name, public)
values ('portal-files', 'portal-files', true)
on conflict (id) do nothing;

-- Authenticated users can upload/delete files
create policy "Auth upload portal files"
  on storage.objects for insert
  with check (bucket_id = 'portal-files' and auth.role() = 'authenticated');

create policy "Auth delete portal files"
  on storage.objects for delete
  using (bucket_id = 'portal-files' and auth.role() = 'authenticated');

-- Public read (so download links work for employees)
create policy "Public read portal files"
  on storage.objects for select
  using (bucket_id = 'portal-files');

-- Migration: activity logs for admin audit trail

create table activity_logs (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete set null,
  user_email text not null default '',
  action     text not null check (action in ('create', 'update', 'delete')),
  table_name text not null,
  record_id  text,
  details    text not null default '',
  created_at timestamptz default now()
);

create index activity_logs_created_at_idx on activity_logs(created_at desc);
create index activity_logs_table_name_idx on activity_logs(table_name);

alter table activity_logs enable row level security;

-- Authenticated users can read logs
create policy "Auth read logs"
  on activity_logs for select
  using (auth.role() = 'authenticated');

-- Only service role (admin actions) can insert
-- No insert policy needed — service role bypasses RLS

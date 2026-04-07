-- Migration: user profiles for RBAC

create table user_profiles (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid unique not null references auth.users(id) on delete cascade,
  role        text not null default 'employee' check (role in ('admin', 'employee')),
  permissions text[] default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index user_profiles_user_id_idx on user_profiles(user_id);

-- RLS
alter table user_profiles enable row level security;

-- Any authenticated user can read their own profile
create policy "Users read own profile"
  on user_profiles for select
  using (auth.uid() = user_id);

-- Admins can read all profiles
create policy "Admins read all profiles"
  on user_profiles for select
  using (
    exists (
      select 1 from user_profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );

-- Admins can manage all profiles
create policy "Admins manage profiles"
  on user_profiles for all
  using (
    exists (
      select 1 from user_profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );

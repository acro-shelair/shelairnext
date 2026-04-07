-- Fix: remove recursive RLS policies from user_profiles
-- Admin operations use the service role key which bypasses RLS entirely.
-- Only the self-read policy is needed for authenticated users.

drop policy if exists "Admins read all profiles"  on user_profiles;
drop policy if exists "Admins manage profiles"     on user_profiles;

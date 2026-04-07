-- Site-wide settings (single row)

create table site_settings (
  id                   uuid default gen_random_uuid() primary key,
  phone                text not null default '1300227600',
  email                text not null default 'info@shelair.com.au',
  address              text not null default 'Brisbane, SE Queensland',
  abn                  text not null default '43 672 578 264',
  tagline              text not null default 'Australia''s trusted commercial air conditioning contractor. 24/7 emergency repairs, maintenance plans and cold room builds across SE Queensland.',
  facebook_url         text not null default 'https://www.facebook.com/shelair/',
  linkedin_url         text not null default 'https://www.linkedin.com/company/shelair/',
  instagram_url        text not null default '',
  footer_company_links jsonb default '[{"label":"Our Process","href":"/process"},{"label":"Projects","href":"/projects"},{"label":"Pricing","href":"/pricing"},{"label":"Resources","href":"/resources"},{"label":"Contact","href":"/contact"}]',
  updated_at           timestamptz default now()
);

-- Seed the single settings row
insert into site_settings (phone, email, address, abn, tagline, facebook_url, linkedin_url)
values (
  '1300227600',
  'info@shelair.com.au',
  'Brisbane, SE Queensland',
  '43 672 578 264',
  'Australia''s trusted commercial air conditioning contractor. 24/7 emergency repairs, maintenance plans and cold room builds across SE Queensland.',
  'https://www.facebook.com/shelair/',
  'https://www.linkedin.com/company/shelair/'
);

alter table site_settings enable row level security;

create policy "Public read settings" on site_settings for select using (true);
create policy "Auth manage settings" on site_settings for all using (auth.role() = 'authenticated');

-- Add updated_at to content and location tables for sitemap <lastmod>

alter table services add column updated_at timestamptz default now();
alter table industries add column updated_at timestamptz default now();
alter table brands add column updated_at timestamptz default now();
alter table projects add column updated_at timestamptz default now();
alter table location_cities add column updated_at timestamptz default now();
alter table location_suburbs add column updated_at timestamptz default now();

-- Auto-update on row changes

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger services_updated_at before update on services for each row execute function set_updated_at();
create trigger industries_updated_at before update on industries for each row execute function set_updated_at();
create trigger brands_updated_at before update on brands for each row execute function set_updated_at();
create trigger projects_updated_at before update on projects for each row execute function set_updated_at();
create trigger location_cities_updated_at before update on location_cities for each row execute function set_updated_at();
create trigger location_suburbs_updated_at before update on location_suburbs for each row execute function set_updated_at();

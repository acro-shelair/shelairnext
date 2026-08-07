-- Make the remaining hardcoded footer strings editable from admin/settings:
-- the compliance/credentials line, the two partner links (Commercial
-- Refrigeration + HVACR Group), the copyright brand name, and the three footer
-- column headings.

alter table site_settings
  add column if not exists footer_credentials text not null default 'ARCtick AU61340 · QBCC 15413155 · Electrical Contractor 92536 · NSW Contractor 479925C · NECA Member · Veteran Community Business',
  add column if not exists footer_partner_label text not null default 'HVACR Group',
  add column if not exists footer_partner_url text not null default 'https://hvacrgroup.com.au',
  add column if not exists footer_services_partner_label text not null default 'Commercial Refrigeration',
  add column if not exists footer_services_partner_url text not null default 'https://acrorefrigeration.com.au',
  add column if not exists footer_brand_name text not null default 'HVACR Pty Ltd',
  add column if not exists footer_heading_services text not null default 'Services',
  add column if not exists footer_heading_industries text not null default 'Service Areas',
  add column if not exists footer_heading_company text not null default 'Company',
  add column if not exists footer_brands_heading text not null default 'Our Brands',
  add column if not exists footer_brands_links jsonb not null default '[{"label":"Acro Refrigeration","href":"https://acrorefrigeration.com.au"},{"label":"Koolacube","href":"https://koolacube.com.au"},{"label":"HVACR Group","href":"https://hvacrgroup.com.au"}]';

-- Backfill the existing single settings row where the new columns are blank.
update site_settings set
  footer_credentials             = coalesce(nullif(footer_credentials, ''), 'ARCtick AU61340 · QBCC 15413155 · Electrical Contractor 92536 · NSW Contractor 479925C · NECA Member · Veteran Community Business'),
  footer_partner_label           = coalesce(nullif(footer_partner_label, ''), 'HVACR Group'),
  footer_partner_url             = coalesce(nullif(footer_partner_url, ''), 'https://hvacrgroup.com.au'),
  footer_services_partner_label  = coalesce(nullif(footer_services_partner_label, ''), 'Commercial Refrigeration'),
  footer_services_partner_url    = coalesce(nullif(footer_services_partner_url, ''), 'https://acrorefrigeration.com.au'),
  footer_brand_name              = coalesce(nullif(footer_brand_name, ''), 'HVACR Pty Ltd'),
  footer_heading_services        = coalesce(nullif(footer_heading_services, ''), 'Services'),
  footer_heading_industries      = coalesce(nullif(footer_heading_industries, ''), 'Service Areas'),
  footer_heading_company         = coalesce(nullif(footer_heading_company, ''), 'Company'),
  footer_brands_heading          = coalesce(nullif(footer_brands_heading, ''), 'Our Brands');

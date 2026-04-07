-- Add business hours and emergency text to site_settings

alter table site_settings
  add column if not exists business_hours text not null default 'Mon–Fri: 7am – 5pm AEST',
  add column if not exists emergency_text text not null default '24/7 Emergency Service Available';

-- Update the existing row with defaults
update site_settings set
  business_hours = 'Mon–Fri: 7am – 5pm AEST',
  emergency_text = '24/7 Emergency Service Available'
where business_hours is null or business_hours = '';

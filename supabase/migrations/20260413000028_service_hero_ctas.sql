ALTER TABLE services
  ADD COLUMN IF NOT EXISTS hero_cta_primary_text text NOT NULL DEFAULT 'Get a Quote',
  ADD COLUMN IF NOT EXISTS hero_cta_primary_link text NOT NULL DEFAULT '/contact',
  ADD COLUMN IF NOT EXISTS hero_cta_phone_text   text NOT NULL DEFAULT '07 3204 9511',
  ADD COLUMN IF NOT EXISTS hero_cta_phone_link   text NOT NULL DEFAULT 'tel:0732049511',
  ADD COLUMN IF NOT EXISTS overview_cta_text     text NOT NULL DEFAULT 'Discuss Your Needs',
  ADD COLUMN IF NOT EXISTS overview_cta_link     text NOT NULL DEFAULT '/contact';

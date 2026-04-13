ALTER TABLE services
  ADD COLUMN IF NOT EXISTS related_post_slugs    text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS related_project_slugs text[] NOT NULL DEFAULT '{}';

CREATE TABLE legal_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL UNIQUE CHECK (type IN ('terms', 'privacy')),
  title text NOT NULL DEFAULT '',
  intro text DEFAULT '',
  effective_date text DEFAULT '',
  qbcc text DEFAULT '',
  abn text DEFAULT '',
  sections jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read legal_pages" ON legal_pages FOR SELECT USING (true);
CREATE POLICY "Auth write legal_pages" ON legal_pages FOR ALL TO authenticated USING (true) WITH CHECK (true);

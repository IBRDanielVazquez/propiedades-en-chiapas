-- ============================================================
-- Bella Vista Ocozocoautla - Migración de Tabla Leads
-- Ejecutar en: Supabase Dashboard > SQL Editor o CLI
-- ============================================================

ALTER TABLE leads 
  ADD COLUMN IF NOT EXISTS source_project text,
  ADD COLUMN IF NOT EXISTS profile_type text,
  ADD COLUMN IF NOT EXISTS landing_section text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS ad_id text,
  ADD COLUMN IF NOT EXISTS first_response_min integer,
  ADD COLUMN IF NOT EXISTS visit_date timestamptz;

CREATE INDEX IF NOT EXISTS idx_leads_source_project 
  ON leads(source_project);

CREATE INDEX IF NOT EXISTS idx_leads_profile 
  ON leads(profile_type) WHERE profile_type IS NOT NULL;

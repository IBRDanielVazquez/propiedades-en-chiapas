-- ============================================================
-- TABLA DE LOCALIZACIONES (SEPOMEX CHIAPAS)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

create table if not exists public.locations (
  id                uuid primary key default gen_random_uuid(),
  state             text not null default 'Chiapas',
  municipality      text not null,
  postal_code       text not null,
  colony            text not null,
  settlement_type   text,
  created_at        timestamptz not null default now()
);

-- Habilitar RLS
alter table public.locations enable row level security;

-- Política: lectura pública
create policy "Cualquiera puede leer localizaciones" on public.locations
  for select using (true);

-- Política: permitir inserción con la anon key (SOLO PARA LA IMPORTACIÓN INICIAL)
-- Una vez terminada la importación, se recomienda borrar esta política.
create policy "Permitir inserción inicial" on public.locations
  for insert with check (true);

-- Índices para optimizar las listas desplegables del Dashboard
create index if not exists idx_locations_municipality on public.locations(municipality);
create index if not exists idx_locations_postal_code on public.locations(postal_code);
create index if not exists idx_locations_colony on public.locations(colony);

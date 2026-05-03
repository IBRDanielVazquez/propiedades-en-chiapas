-- ============================================================
-- CRM ESTATE - PROPIEDADES EN CHIAPAS
-- Schema SQL para Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. TABLA DE USUARIOS / ASESORES
-- ============================================================
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text unique not null,
  position      text,
  phone         text,
  whatsapp      text,
  company       text,
  license       text,
  location      text,
  bio           text,
  avatar_url    text,
  plan          text not null default 'starter' check (plan in ('admin','developer','premium','basic','starter')),
  active        boolean not null default true,
  slug          text unique,
  trial_start_date timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

-- Habilitar RLS (Row Level Security)
alter table public.users enable row level security;

-- Política: cualquiera autenticado puede leer usuarios activos
create policy "Leer usuarios activos" on public.users
  for select using (active = true);

-- Política: solo admin puede insertar/actualizar/eliminar
create policy "Admin CRUD usuarios" on public.users
  for all using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.plan = 'admin'
    )
  );

-- ============================================================
-- 2. TABLA DE PROPIEDADES
-- ============================================================
create table if not exists public.properties (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid references public.users(id) on delete cascade,
  title                   text not null,
  description             text,
  operation_type          text not null default 'Venta' check (operation_type in ('Venta','Renta')),
  price                   numeric(14,2) not null,
  price_suffix            text default '',
  status                  text not null default 'Disponible' check (status in ('Disponible','Apartado','Vendido')),
  type                    text not null,
  size_m2                 numeric(10,2),
  size_land_m2            numeric(10,2),
  size_construction_m2    numeric(10,2),
  year_built              int,
  floors                  int,
  furnished               boolean default false,
  maid_room               boolean default false,
  bedrooms                int default 0,
  bathrooms               numeric(4,1) default 0,
  garages                 int default 0,
  municipality            text,
  colony                  text,
  postal_code             text,
  featured_image_url      text,
  images                  text[] default '{}',
  amenities               text[] default '{}',
  active                  boolean not null default true,
  views                   int default 0,
  leads                   int default 0,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Trigger para updated_at automático
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_properties_updated_at
  before update on public.properties
  for each row execute function update_updated_at();

-- Habilitar RLS
alter table public.properties enable row level security;

-- Política: portal público puede leer propiedades activas
create policy "Portal: leer propiedades activas" on public.properties
  for select using (active = true);

-- Política: asesor puede CRUD sus propias propiedades
create policy "Asesor: CRUD sus propiedades" on public.properties
  for all using (user_id = auth.uid());

-- Política: admin puede CRUD todas
create policy "Admin: CRUD todas las propiedades" on public.properties
  for all using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.plan = 'admin'
    )
  );

-- ============================================================
-- 3. TABLA DE LEADS (contactos del portal)
-- ============================================================
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  property_id   uuid references public.properties(id) on delete set null,
  user_id       uuid references public.users(id) on delete set null,
  name          text not null,
  email         text,
  phone         text,
  message       text,
  source        text default 'portal',
  created_at    timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Política: cualquiera puede insertar un lead (formulario de contacto)
create policy "Insertar lead público" on public.leads
  for insert with check (true);

-- Política: asesor ve sus propios leads, admin ve todos
create policy "Leer leads propios" on public.leads
  for select using (
    user_id = auth.uid() or
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.plan = 'admin'
    )
  );

-- ============================================================
-- 4. INSERTAR DATOS DE EJEMPLO (SAMPLE DATA)
-- NOTA: Ejecutar DESPUÉS de registrar al admin en Supabase Auth
-- y sustituir el UUID por el de tu cuenta
-- ============================================================

-- Ejemplo (descomentar y ajustar el UUID cuando tengas auth):
/*
insert into public.users (id, name, email, position, phone, whatsapp, company, license, location, bio, avatar_url, plan)
values
  ('00000000-0000-0000-0000-000000000001', 'Daniel Vázquez', 'daniel@propiedadesenchiapas.com', 'Asesor Inmobiliario Senior', '961 123 4567', '961 123 4567', 'Chiapas Premium Real Estate', 'LIC-CH-78291', 'TUXTLA GUTIERREZ', 'Especialista en desarrollo inmobiliario premium con más de 8 años de experiencia en Chiapas.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300', 'premium'),
  ('00000000-0000-0000-0000-000000000002', 'María Fernanda López', 'maria@inmochis.com', 'Directora Comercial', '961 987 6543', '961 987 6543', 'InmoChis Bienes Raíces', 'LIC-CH-45120', 'SAN CRISTOBAL DE LAS CASAS', 'Directora con 12 años en el mercado inmobiliario de Los Altos de Chiapas.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300', 'basic');
*/

-- ============================================================
-- PROPIEDADES EN CHIAPAS - FASE 1 MIGRACIÓN DE DATOS
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── PASO B: Vestir la cuenta admin como IBR (UPDATE, no cambia plan ni role) ──
UPDATE public.users 
SET
  name = 'IBR Agencia Digital',
  company = 'IBR Marketing Digital',
  whatsapp = '529612466204',
  phone = '9612466204',
  slug = COALESCE(NULLIF(slug, ''), 'ibr')
WHERE email = 'admin@propiedadesenchiapas.com';

-- ── PASO C: Agregar campo para vincular landings ──
ALTER TABLE public.properties 
  ADD COLUMN IF NOT EXISTS landing_slug text;

-- ── PASO D: Meter Bella Vista como propiedad ──
DO $$
DECLARE
  admin_uid uuid;
  bv_exists boolean;
BEGIN
  -- 1. Obtener el UUID de la cuenta admin (IBR)
  SELECT id INTO admin_uid FROM public.users WHERE email = 'admin@propiedadesenchiapas.com';
  
  -- Si el admin no existe, usar el UUID por defecto
  IF admin_uid IS NULL THEN
    admin_uid := '40d4d0ed-3f81-4ec9-99d0-cb53059f072e';
  END IF;

  -- 2. Limpiar la propiedad de prueba anónima si se quedó en base
  DELETE FROM public.properties WHERE title = 'Propiedad Test Anónima';

  -- 3. Verificar si ya existe una propiedad Bella Vista
  SELECT EXISTS(
    SELECT 1 FROM public.properties 
    WHERE title ILIKE '%Bella Vista%' OR landing_slug = 'bella-vista'
  ) INTO bv_exists;
  
  IF bv_exists THEN
    -- Si ya existe, actualizamos para vincular la landing sin duplicar
    UPDATE public.properties 
    SET 
      landing_slug = 'bella-vista',
      active = true,
      user_id = COALESCE(user_id, admin_uid)
    WHERE title ILIKE '%Bella Vista%' OR landing_slug = 'bella-vista';
  ELSE
    -- Si no existe, la insertamos con todos los datos extraídos de la landing
    INSERT INTO public.properties (
      user_id,
      title,
      description,
      type,
      operation_type,
      price,
      price_suffix,
      size_m2,
      city,
      featured_image_url,
      active,
      landing_slug
    ) VALUES (
      admin_uid,
      'Bella Vista Ocozocoautla',
      'Adquiere tu lote campestre en Bella Vista Ocozocoautla con certeza jurídica y financiamiento directo desde $450 semanales sin revisión de buró. ¡Agenda tu visita!',
      'terreno',
      'Venta',
      290000.00,
      'MXN (Lotes desde $450/semana)',
      200.00,
      'Ocozocoautla de Espinosa',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200',
      true,
      'bella-vista'
    );
  END IF;
END $$;

-- ── PASO E: Confirmar y Auditar Resultados ──
-- 1. Total propiedades activas (debe ser 9)
SELECT count(*) AS total_propiedades_activas 
FROM public.properties 
WHERE active = true;

-- 2. Listado de propiedades vinculadas a landings
SELECT title, landing_slug 
FROM public.properties 
WHERE landing_slug IS NOT NULL;

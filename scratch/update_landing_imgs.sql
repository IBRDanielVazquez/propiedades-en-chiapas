-- SQL para pegar en Supabase SQL Editor
-- Actualiza featured_image_url a rutas Vercel + asigna landing_slug

UPDATE public.properties SET 
  featured_image_url = '/landings/sima-park/La-Sima-Park-Aerea.webp',
  landing_slug       = 'sima-park'
WHERE id = '1506a4b0-a9c8-42e6-8b86-a7618b44c656';

UPDATE public.properties SET 
  featured_image_url = '/landings/sima-park/Sima-Park-14.png',
  landing_slug       = 'la-sima-park-terrenos-en-ocozocoautla'
WHERE id = 'e30d8fd4-28db-4b53-b503-be38bce73714';

UPDATE public.properties SET 
  featured_image_url = '/landings/la-canada/La-Canada-Desarrollo-Eco-Campestre-01.png',
  landing_slug       = 'la-canada-desarrollo-eco-campestre'
WHERE id = '32052daf-ad12-446d-932d-8473f60e9eac';

UPDATE public.properties SET 
  featured_image_url = '/landings/colinas-del-campestre/Colinas-del-Campestre-Venta-de-Terrenos.png',
  landing_slug       = 'colinas-del-campestre'
WHERE id = '0391a927-09c1-4492-9000-5ed1b09dd68e';

UPDATE public.properties SET 
  featured_image_url = '/landings/montecristo/Fraccionamiento-MonteCristo-001-1.png',
  landing_slug       = 'fraccionamiento-montecristo'
WHERE id = 'cf1cb44d-1b2c-451b-bca7-e30957d8aaec';

UPDATE public.properties SET 
  featured_image_url = '/landings/cuauhtli/Terrenos-en-Venta-El-Jobo-Cuauhtli-01.png',
  landing_slug       = 'cuauhtli-terrenos-en-venta-en-el-jobo'
WHERE id = '2819a927-1a41-459a-90cd-543ca3b913e9';

UPDATE public.properties SET 
  featured_image_url = '/landings/el-higo/Terrenos-en-Copoya-el-Higo-01.png',
  landing_slug       = 'el-higo-copoya-terrenos-10x20-en-copoya'
WHERE id = '3d78326e-685b-4d90-8d3d-ce08065ef7e8';

UPDATE public.properties SET 
  featured_image_url = '/landings/monte-de-los-olivos/Monte-Los-Olivos-1.png',
  landing_slug       = 'monte-de-los-olivos'
WHERE id = '4a7af210-1a72-4076-a9af-4db3b616dc6a';

UPDATE public.properties SET 
  featured_image_url = '/landings/quinta-berriozabal/Quinta-Berriozabal-1.png',
  landing_slug       = 'quinta-en-berriozabal'
WHERE id = 'e4cea7ec-50b9-476b-ad39-e131d7ec909d';

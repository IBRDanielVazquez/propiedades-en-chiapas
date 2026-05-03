import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const REAL_PROPERTIES = [
  {
    user_id: '731ce118-d513-4c21-bda5-4b15ef017ecc',
    title: 'Residencia Casa Premier',
    description: 'Casa de diseño contemporáneo con acabados residenciales, seguridad 24/7 y espacios amplios. Entrega inmediata. Aceptamos créditos Infonavit, Fovissste y Bancarios.',
    type: 'Casa',
    price: 2450000,
    price_suffix: 'Trato Directo',
    bedrooms: 3,
    bathrooms: 2,
    garages: 2,
    city: 'Tuxtla Gutiérrez',
    address: 'Zona Exclusiva',
    featured_image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    active: true,
    operation_type: 'Venta'
  },
  {
    user_id: '5efd0207-17cf-4315-81a2-e3d903e48328',
    title: 'Fraccionamiento Master - Lotes Residenciales',
    description: 'El macroproyecto residencial privado más importante de Chiapas. Lotes urbanizados con Casa Club, acceso controlado. Sin revisión de buró. Financiamiento directo.',
    type: 'Lote Residencial',
    price: 4900,
    price_suffix: 'Mensualidades desde',
    size_m2: 160,
    city: 'Chiapa de Corzo',
    address: 'Zona Metropolitana',
    featured_image_url: 'https://propiedadesenchiapas.com/landings/images/hero_fraccionamiento_maestro_chiapas_1772843166514.png',
    active: true,
    operation_type: 'Venta'
  },
  {
    user_id: '215637a9-5d6a-4e18-953f-510cfca9cd7f',
    title: 'Lotes de Inversión Premium',
    description: 'Invierte en lotes comerciales y residenciales de alta plusvalía en Chiapas. Enganche cero, mensualidades desde $3,500 MXN. Certeza jurídica garantizada.',
    type: 'Lote Residencial',
    price: 3500,
    price_suffix: 'Mensualidades desde',
    city: 'Tuxtla Gutiérrez',
    address: 'Alta Plusvalía',
    featured_image_url: 'https://propiedadesenchiapas.com/landings/images/hero_terrenos_chiapas_slate_1772843210730.png',
    active: true,
    operation_type: 'Venta'
  },
  {
    user_id: 'fa0858cc-fab2-49d6-977f-9c5ec2186409',
    title: 'Lote Comercial Estratégico',
    description: 'Lote con uso de suelo comercial en zona de alto flujo. Ideal para locales o plaza pequeña. Enganche cero y planes de financiamiento.',
    type: 'Local Comercial',
    price: 8500,
    price_suffix: 'Mensualidades desde',
    city: 'Tuxtla Gutiérrez',
    address: 'Zona Comercial',
    featured_image_url: 'https://propiedadesenchiapas.com/landings/images/lote_comercial_chiapas_slider_1772842904623.png',
    active: true,
    operation_type: 'Venta'
  }
];

async function run() {
  console.log('🌱 Insertando las 4 propiedades reales...');
  const { error: insertErr } = await supabase.from('properties').insert(REAL_PROPERTIES);
  
  if (insertErr) {
    console.error('❌ Error insertando propiedades reales:', insertErr);
  } else {
    console.log('✅ ¡Propiedades reales insertadas con éxito!');
  }
}

run();

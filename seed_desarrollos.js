import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://lfmbhdtrxmtxjwyfzdcz.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_Ne1rajOeqAJETBoXcIvA6A_l0-NBH1f";
const supabase = createClient(supabaseUrl, supabaseKey);

const desarrollos = [
  {
    title: 'Desarrollo Colinas del Campestre',
    description: 'Ficha Técnica del Desarrollo Colinas del Campestre. Lotes residenciales exclusivos.',
    type: 'Lote Residencial',
    status: 'Disponible',
    price: 850000,
    price_suffix: 'MXN',
    size_m2: 120,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    city: 'Tuxtla Gutiérrez',
    featured_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Cuauhtli - Terrenos en Venta en El Jobo',
    description: 'Ficha Técnica de Terrenos Cuauhtli ubicados en El Jobo.',
    type: 'Lote Residencial',
    status: 'Disponible',
    price: 450000,
    price_suffix: 'MXN',
    size_m2: 200,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    city: 'Tuxtla Gutiérrez',
    featured_image_url: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'El Higo Copoya - Terrenos 10x20',
    description: 'Ficha Técnica de Terrenos El Higo en Copoya, excelentes dimensiones de 10x20 metros.',
    type: 'Lote Residencial',
    status: 'Disponible',
    price: 350000,
    price_suffix: 'MXN',
    size_m2: 200,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    city: 'Tuxtla Gutiérrez',
    featured_image_url: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Fraccionamiento Montecristo',
    description: 'Ficha Técnica del Fraccionamiento Montecristo. Alta plusvalía.',
    type: 'Lote Residencial',
    status: 'Disponible',
    price: 950000,
    price_suffix: 'MXN',
    size_m2: 150,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    city: 'Tuxtla Gutiérrez',
    featured_image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'La Cañada - Desarrollo Eco Campestre',
    description: 'Ficha Técnica de La Cañada. Vive en armonía con la naturaleza.',
    type: 'Lote Residencial',
    status: 'Disponible',
    price: 600000,
    price_suffix: 'MXN',
    size_m2: 300,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    city: 'Berriozábal',
    featured_image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Sima Park - Terrenos en Ocozocoautla',
    description: 'Ficha Técnica de Sima Park. Excelente oportunidad de inversión en Ocozocoautla.',
    type: 'Lote Residencial',
    status: 'Disponible',
    price: 250000,
    price_suffix: 'MXN',
    size_m2: 150,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    city: 'Ocozocoautla',
    featured_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Monte de los Olivos',
    description: 'Ficha Técnica de Desarrollo Monte de los Olivos.',
    type: 'Lote Residencial',
    status: 'Disponible',
    price: 700000,
    price_suffix: 'MXN',
    size_m2: 250,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    city: 'Tuxtla Gutiérrez',
    featured_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Quinta en Berriozabal',
    description: 'Ficha Técnica de hermosa Quinta en Berriozábal.',
    type: 'Quinta',
    status: 'Disponible',
    price: 2500000,
    price_suffix: 'MXN',
    size_m2: 1000,
    bedrooms: 3,
    bathrooms: 2,
    garages: 4,
    city: 'Berriozábal',
    featured_image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600'
  }
];

async function seed() {
  console.log('Inyectando desarrollos como propiedades en el CRM...');
  const { data, error } = await supabase.from('properties').insert(desarrollos);
  
  if (error) {
    console.error('Error insertando:', error);
  } else {
    console.log('¡Desarrollos inyectados con éxito en la base de datos!');
  }
}

seed();

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 13 Categorías
const categories = [
  'Casa', 'Departamento', 'Lote Residencial', 'Terreno Comercial', 
  'Terreno Agrícola/Ejidal', 'Bodega', 'Local Comercial', 'Oficina', 
  'Edificio', 'Rancho', 'Quinta', 'Nave Industrial', 'Desarrollo en Preventa'
];

const cities = ['Tuxtla Gutiérrez', 'San Cristóbal de las Casas', 'Tapachula', 'Comitán', 'Palenque', 'Chiapa de Corzo'];

// Imágenes aleatorias bonitas de Unsplash para Real Estate
const unsplashImages = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
  'https://images.unsplash.com/photo-1527030280862-64139fba04ca'
];

async function seed() {
  console.log('🌱 Iniciando la creación de fichas de prueba...');

  const propertiesToInsert = [];

  for (const cat of categories) {
    console.log(`⏳ Generando 10 fichas para: ${cat}`);
    for (let i = 1; i <= 10; i++) {
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomImg = unsplashImages[Math.floor(Math.random() * unsplashImages.length)] + '?auto=format&fit=crop&q=80&w=600';
      const randomPrice = Math.floor(Math.random() * (12000000 - 500000 + 1)) + 500000;
      
      propertiesToInsert.push({
        title: `${cat} Premium en ${randomCity} #${i}`,
        description: `Excelente oportunidad. Esta propiedad tipo ${cat} cuenta con acabados de lujo y excelente ubicación en el estado de Chiapas.`,
        type: cat,
        status: 'Disponible',
        price: randomPrice,
        price_suffix: 'MXN',
        size_m2: Math.floor(Math.random() * 500) + 100,
        bedrooms: cat.toLowerCase().includes('casa') || cat.toLowerCase().includes('departamento') ? Math.floor(Math.random() * 4) + 1 : 0,
        bathrooms: cat.toLowerCase().includes('casa') || cat.toLowerCase().includes('departamento') ? Math.floor(Math.random() * 3) + 1 : 0,
        garages: cat.toLowerCase().includes('casa') || cat.toLowerCase().includes('departamento') ? Math.floor(Math.random() * 2) + 1 : 0,
        city: randomCity,
        featured_image_url: randomImg
      });
    }
  }

  // Insertar en Supabase en lotes
  const batchSize = 50;
  for (let i = 0; i < propertiesToInsert.length; i += batchSize) {
    const batch = propertiesToInsert.slice(i, i + batchSize);
    console.log(`Subiendo propiedades ${i} a ${i + batch.length}...`);
    const { error } = await supabase.from('properties').insert(batch);
    if (error) {
      console.error('❌ Error al subir propiedades:', error.message);
      break;
    }
  }

  console.log('🚀 ¡130 propiedades de prueba insertadas con éxito!');

  console.log('👤 Creando 5 usuarios de prueba para el CRM...');
  const testUsers = [
    { email: 'admin@propiedadesenchiapas.com', pass: 'Chiapas2026!' },
    { email: 'vendedor1@propiedadesenchiapas.com', pass: 'Ventas2026!' },
    { email: 'vendedor2@propiedadesenchiapas.com', pass: 'Ventas2026!' },
    { email: 'daniel@propiedadesenchiapas.com', pass: 'Daniel2026!' },
    { email: 'pruebas@propiedadesenchiapas.com', pass: 'Pruebas2026!' }
  ];

  for (const u of testUsers) {
    const { data, error } = await supabase.auth.signUp({
      email: u.email,
      password: u.pass
    });
    if (error) {
      console.log(`⚠️ Alerta con ${u.email}: ${error.message}`);
    } else {
      console.log(`✅ Usuario creado: ${u.email} (Clave: ${u.pass})`);
    }
  }

  console.log('🏁 Proceso finalizado.');
}

seed();

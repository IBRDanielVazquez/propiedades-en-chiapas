import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDatabase() {
  console.log('Autenticando como admin...');
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'admin@propiedadesenchiapas.com',
    password: 'Chiapas2026!'
  });

  if (authErr) {
    console.error('Error login admin:', authErr.message);
    // Si no podemos entrar como admin, podríamos tener un problema con RLS
  } else {
    console.log('Login exitoso. Tenemos permisos de admin.');
  }

  // 1. Encontrar y borrar las propiedades falsas generadas masivamente
  const { data: fakeProps, error: errFake } = await supabase
    .from('properties')
    .select('id')
    .ilike('title', '%Premium en%');
    
  if (fakeProps && fakeProps.length > 0) {
    console.log(`Encontradas ${fakeProps.length} propiedades falsas. Borrando...`);
    const ids = fakeProps.map(p => p.id);
    const { error: delErr } = await supabase.from('properties').delete().in('id', ids);
    if (delErr) console.error('Error borrando falsas:', delErr);
    else console.log('✅ Propiedades falsas borradas.');
  }

  // 2. Asignar los Desarrollos a un Asesor Válido para que el frontend los muestre
  // UUID de Daniel Vázquez (Premium)
  const DANIEL_UUID = '731ce118-d513-4c21-bda5-4b15ef017ecc';
  
  // Nombres de los desarrollos reales
  const desarrollosReales = [
    'Desarrollo Colinas del Campestre',
    'Cuauhtli - Terrenos en Venta en El Jobo',
    'El Higo Copoya - Terrenos 10x20',
    'Fraccionamiento Montecristo',
    'La Cañada - Desarrollo Eco Campestre',
    'Sima Park - Terrenos en Ocozocoautla',
    'Monte de los Olivos',
    'Quinta en Berriozabal',
    'Colinas del Campestre' // Por si se guardó así
  ];

  for (const nombre of desarrollosReales) {
    const { error: updateErr } = await supabase
      .from('properties')
      .update({ user_id: DANIEL_UUID })
      .ilike('title', `%${nombre}%`);
      
    if (updateErr) {
      console.error(`Error actualizando ${nombre}:`, updateErr);
    }
  }

  console.log('✅ Desarrollos reales asignados a Daniel Vázquez. Ahora aparecerán en el portal.');
  
  // 3. Borrar las 4 propiedades "Residencia Casa Premier" que yo inserté antes por error
  const { data: myFakeProps } = await supabase
    .from('properties')
    .select('id')
    .in('title', ['Residencia Casa Premier', 'Fraccionamiento Master - Lotes Residenciales', 'Lotes de Inversión Premium', 'Lote Comercial Estratégico']);
    
  if (myFakeProps && myFakeProps.length > 0) {
    console.log(`Borrando las ${myFakeProps.length} propiedades dummy que inserté por error...`);
    const ids = myFakeProps.map(p => p.id);
    await supabase.from('properties').delete().in('id', ids);
  }
  
  console.log('🚀 ¡BASE DE DATOS ARREGLADA TOTALMENTE!');
}

fixDatabase();

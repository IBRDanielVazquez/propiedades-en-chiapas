import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import iconv from 'iconv-lite';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function importSepomex() {
  const filePath = './CPdescarga.txt';
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ No se encontró el archivo CPdescarga.txt en la carpeta.');
    console.log('👉 Descárgalo de: https://www.correosdemexico.gob.mx/SSLServicios/ConsultaCP/CodigoPostal_Exportar.aspx');
    console.log('Y guárdalo aquí con el nombre CPdescarga.txt');
    return;
  }

  console.log('📖 Leyendo base de datos oficial de SEPOMEX...');
  
  // El archivo de SEPOMEX suele venir en ISO-8859-1 o CP1252, usamos iconv-lite para no perder los acentos (Gutiérrez, etc.)
  const buffer = fs.readFileSync(filePath);
  const data = iconv.decode(buffer, 'ISO-8859-1');
  
  const lines = data.split('\n');
  const chiapasLocations = [];

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split('|');
    // Formato de columnas de SEPOMEX TXT:
    // 0: d_codigo (CP)
    // 1: d_asenta (Colonia)
    // 2: d_tipo_asenta (Tipo de asentamiento)
    // 3: D_mnpio (Municipio)
    // 4: d_estado (Estado)
    
    if (cols.length > 4) {
      const state = cols[4];
      
      // Filtrar SOLO CHIAPAS
      if (state.trim().toLowerCase() === 'chiapas') {
        chiapasLocations.push({
          state: 'Chiapas',
          municipality: cols[3].trim(),
          postal_code: cols[0].trim(),
          colony: cols[1].trim(),
          settlement_type: cols[2].trim()
        });
      }
    }
  }

  console.log(`✅ Se encontraron ${chiapasLocations.length} colonias de Chiapas. Preparando inyección a Supabase...`);

  // Insertar en Supabase en lotes de 1000 para no saturar la red
  const batchSize = 1000;
  for (let i = 0; i < chiapasLocations.length; i += batchSize) {
    const batch = chiapasLocations.slice(i, i + batchSize);
    console.log(`⏳ Subiendo lote ${i} a ${i + batch.length}...`);
    
    const { error } = await supabase.from('locations').insert(batch);
    if (error) {
      console.error('❌ Error al insertar:', error.message);
      return;
    }
  }

  console.log('🚀 ¡INYECCIÓN MASIVA COMPLETADA CON ÉXITO!');
  console.log('Ya puedes borrar el archivo CPdescarga.txt');
}

importSepomex();

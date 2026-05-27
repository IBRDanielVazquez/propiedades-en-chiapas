/**
 * update_supabase_urls.js
 * Actualiza featured_image_url en Supabase para que apunten a /images/propiedades/
 * Tarea 3: También verifica/desactiva duplicado La Sima Park
 */
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const SUPABASE_URL = 'https://lfmbhdtrxmtxjwyfzdcz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ne1rajOeqAJETBoXcIvA6A_l0-NBH1f';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const LOCAL_IMG_DIR = path.join(__dirname, 'public', 'images', 'propiedades');

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  UPDATE SUPABASE URLs — Propiedades en Chiapas');
  console.log('═══════════════════════════════════════════════════════\n');

  // ── TAREA 3: Verificar/desactivar La Sima Park duplicado ───────
  console.log('🔴 [TAREA 3] Verificando La Sima Park...');
  const { data: simas } = await supabase
    .from('properties')
    .select('id, title, active, created_at')
    .ilike('title', '%sima park%')
    .order('created_at', { ascending: true });

  if (simas && simas.length > 0) {
    simas.forEach((s, i) => {
      console.log(`   ${i+1}. [${s.active ? 'ACTIVO  ' : 'inactivo'}] "${s.title}"`);
    });
    const duplicado = simas.find(s => s.id === 'e30d8fd4-28db-4b53-b503-be38bce73714');
    if (duplicado) {
      if (duplicado.active) {
        const { error } = await supabase.from('properties')
          .update({ active: false })
          .eq('id', 'e30d8fd4-28db-4b53-b503-be38bce73714');
        console.log(error ? `   ❌ ${error.message}` : '   ✅ Duplicado desactivado');
      } else {
        console.log('   ✅ Ya estaba desactivado');
      }
    } else {
      console.log('   ℹ️  ID específico no encontrado, verificar manualmente');
    }
  }

  // ── TAREA 2: Obtener todas las propiedades ─────────────────────
  console.log('\n─────────────────────────────────────────────────────');
  console.log('[TAREA 2] Obteniendo propiedades de Supabase...\n');

  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, title, featured_image_url');

  if (error) { console.error('❌', error.message); return; }

  console.log(`   Total propiedades: ${properties.length}\n`);

  // Archivos disponibles en disco
  const localFiles = fs.existsSync(LOCAL_IMG_DIR)
    ? fs.readdirSync(LOCAL_IMG_DIR).filter(f => fs.statSync(path.join(LOCAL_IMG_DIR, f)).size > 100)
    : [];
  console.log(`   Imágenes en disco (${localFiles.length}):`);
  localFiles.forEach(f => console.log(`     • ${f}`));

  // Construir mapa: nombre-de-archivo → nombre-local
  const fileMap = new Map();
  localFiles.forEach(f => {
    fileMap.set(f.toLowerCase(), f);
    // También sin extensión para búsqueda flexible
    fileMap.set(f.toLowerCase().replace(/\.[^.]+$/, ''), f);
  });

  console.log('\n─────────────────────────────────────────────────────');
  console.log('Procesando propiedades...\n');

  let updated = 0;
  let skipped = 0;
  let noMatch = 0;

  for (const prop of properties) {
    const url = prop.featured_image_url || '';

    // Ya apunta a /images/propiedades/
    if (url.startsWith('/images/propiedades/')) {
      console.log(`  ⏭️  "${prop.title}"\n     Ya correcta: ${url}`);
      skipped++;
      continue;
    }

    // No tiene imagen
    if (!url) {
      console.log(`  ⬜ "${prop.title}": sin imagen`);
      skipped++;
      continue;
    }

    // No es del dominio WP / no necesita migración
    const isWpUrl = url.includes('propiedadesenchiapas.com') ||
                    url.includes('wp-content/uploads') ||
                    url.includes('invierteenpropiedades.vip');
    if (!isWpUrl) {
      console.log(`  ⏭️  "${prop.title}"\n     URL externa (se mantiene): ${url.substring(0, 70)}`);
      skipped++;
      continue;
    }

    // Extraer nombre de archivo de la URL
    const fileName = url.split('/').pop().split('?')[0];
    const localFile = fileMap.get(fileName.toLowerCase()) || fileMap.get(fileName.toLowerCase().replace(/\.[^.]+$/, ''));

    if (!localFile) {
      console.log(`  ⚠️  "${prop.title}": no tenemos ${fileName} en disco`);
      noMatch++;
      continue;
    }

    const newUrl = `/images/propiedades/${localFile}`;
    const { error: updErr } = await supabase
      .from('properties')
      .update({ featured_image_url: newUrl })
      .eq('id', prop.id);

    if (updErr) {
      console.log(`  ❌ "${prop.title}": ${updErr.message}`);
    } else {
      console.log(`  ✅ "${prop.title}"\n     ${url.split('/').slice(-3).join('/')}\n     → ${newUrl}`);
      updated++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  RESUMEN');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`   Actualizadas:  ${updated}`);
  console.log(`   Sin cambio:    ${skipped}`);
  console.log(`   Sin coincid.:  ${noMatch}`);

  if (noMatch > 0) {
    console.log('\n  ⚠️  Propiedades sin imagen local:');
    console.log('     Revisar si falta descargar del FTP.');
  }

  console.log('\n✅ ¡Listo!\n');
}

main().catch(err => { console.error('Error:', err); process.exit(1); });

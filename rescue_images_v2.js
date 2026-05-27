/**
 * rescue_images_v2.js
 * Solo featured_image_url (la columna 'images' no existe en esta BD)
 */

import * as ftp from 'basic-ftp';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const SUPABASE_URL = 'https://lfmbhdtrxmtxjwyfzdcz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ne1rajOeqAJETBoXcIvA6A_l0-NBH1f';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FTP_HOST = '82.29.86.157';
const FTP_USER = 'u169590082.propiedadesenchiapas.com';
const FTP_PASS = 'AODvxdNvZR#y6]Ne';
const FTP_WP_BASE = '/public_html';

const LOCAL_IMG_DIR = path.join(__dirname, 'public', 'images', 'propiedades');

function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function downloadViaHttp(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    const req = proto.get(url, { timeout: 20000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(destPath, () => {});
        downloadViaHttp(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    });
    req.on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('timeout'));
    });
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  RESCUE IMAGES v2 — Propiedades en Chiapas');
  console.log('═══════════════════════════════════════════════════════\n');

  // ── TAREA 3: La Sima Park ──────────────────────────────────────
  console.log('🔴 [TAREA 3] Buscando duplicados de La Sima Park...\n');

  const { data: simas, error: simaListErr } = await supabase
    .from('properties')
    .select('id, title, active, created_at')
    .ilike('title', '%sima park%')
    .order('created_at', { ascending: true });

  if (simaListErr) {
    console.error('   Error:', simaListErr.message);
  } else {
    console.log(`   Registros encontrados: ${simas.length}`);
    simas.forEach((s, i) => {
      console.log(`   ${i+1}. [${s.active ? 'ACTIVO' : 'inactivo'}] ${s.id} | "${s.title}" | ${s.created_at?.split('T')[0]}`);
    });

    if (simas.length >= 2) {
      // El más antiguo (primero) es el original → desactivar el más nuevo (último)
      const duplicado = simas[simas.length - 1];
      console.log(`\n   → Desactivando duplicado más reciente: "${duplicado.title}" (${duplicado.id})`);
      
      const { error: updErr } = await supabase
        .from('properties')
        .update({ active: false })
        .eq('id', duplicado.id);
      
      if (updErr) console.error('   ❌', updErr.message);
      else console.log('   ✅ Desactivado correctamente');
    } else if (simas.length === 1) {
      // Solo hay uno — desactivar el ID específico si es el correcto
      const target = simas[0];
      console.log(`\n   Solo hay 1 registro. active=${target.active}`);
      if (target.active) {
        console.log('   (No es un duplicado, solo hay uno activo)');
      }
      // Intentar el ID exacto de todas formas
      const { error: updErr } = await supabase
        .from('properties')
        .update({ active: false })
        .eq('id', 'e30d8fd4-28db-4b53-b503-be38bce73714');
      
      if (updErr) {
        console.error('   ❌ ID exacto no encontrado:', updErr.message);
      } else {
        console.log('   ✅ UPDATE ejecutado con ID exacto');
      }
    }
  }

  // ── TAREA 2: Consultar columnas disponibles ────────────────────
  console.log('\n─────────────────────────────────────────────────────');
  console.log('[TAREA 2] Consultando featured_image_url en Supabase...\n');

  const { data: properties, error: propErr } = await supabase
    .from('properties')
    .select('id, title, featured_image_url');

  if (propErr) {
    console.error('❌ Error:', propErr.message);
    return;
  }

  console.log(`   ${properties.length} propiedades encontradas\n`);
  console.log('   URLs actuales de featured_image_url:');
  
  // Mostrar todas las URLs para diagnóstico
  const urlsToFix = [];
  for (const prop of properties) {
    const url = prop.featured_image_url || '';
    const needsFix = url && (
      url.includes('propiedadesenchiapas.com') ||
      url.includes('invierteenpropiedades.vip') ||
      url.includes('wp-content/uploads')
    ) && !url.startsWith('/images/');
    
    console.log(`   "${prop.title}"`);
    console.log(`     ${url || '(sin imagen)'}`);
    if (needsFix) urlsToFix.push(prop);
  }

  console.log(`\n   Propiedades que necesitan migración: ${urlsToFix.length}`);

  if (urlsToFix.length === 0) {
    console.log('\n✅ No hay imágenes que migrar desde el WP antiguo.');
    return;
  }

  // ── Crear directorio local ────────────────────────────────────
  if (!fs.existsSync(LOCAL_IMG_DIR)) {
    fs.mkdirSync(LOCAL_IMG_DIR, { recursive: true });
    console.log(`\n📁 Creado: ${LOCAL_IMG_DIR}`);
  }

  // ── Descargar imágenes ────────────────────────────────────────
  console.log('\n📥 Descargando imágenes...\n');
  
  const downloadedMap = new Map();
  const ftpNeeded = [];

  let i = 0;
  for (const prop of urlsToFix) {
    i++;
    const url = prop.featured_image_url;
    const fileName = url.split('/').pop().split('?')[0];
    const safeName = sanitizeName(fileName);
    const localPath = path.join(LOCAL_IMG_DIR, safeName);

    process.stdout.write(`  [${i}/${urlsToFix.length}] ${safeName}... `);

    if (fs.existsSync(localPath) && fs.statSync(localPath).size > 100) {
      console.log('⏭️  ya existe');
      downloadedMap.set(url, safeName);
      continue;
    }

    try {
      await downloadViaHttp(url, localPath);
      const size = fs.statSync(localPath).size;
      if (size > 100) {
        console.log(`✅ ${Math.round(size/1024)}KB`);
        downloadedMap.set(url, safeName);
      } else {
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        console.log('⚠️  vacío → FTP');
        ftpNeeded.push({ url, safeName, localPath, prop });
      }
    } catch (err) {
      console.log(`❌ ${err.message} → FTP`);
      ftpNeeded.push({ url, safeName, localPath, prop });
    }
  }

  // ── FTP fallback ─────────────────────────────────────────────
  if (ftpNeeded.length > 0) {
    console.log(`\n🔌 FTP: ${ftpNeeded.length} archivos pendientes...`);
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
      await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASS, secure: false });
      console.log('✅ Conectado al FTP\n');

      for (const { url, safeName, localPath, prop } of ftpNeeded) {
        let ftpPath = null;
        try {
          const parsed = new URL(url);
          ftpPath = FTP_WP_BASE + parsed.pathname;
        } catch { continue; }

        process.stdout.write(`  FTP: ${safeName}... `);
        try {
          await client.downloadTo(localPath, ftpPath);
          const size = fs.statSync(localPath).size;
          console.log(`✅ ${Math.round(size/1024)}KB`);
          downloadedMap.set(url, safeName);
        } catch (err) {
          console.log(`❌ ${err.message}`);
        }
      }
    } finally {
      client.close();
    }
  }

  // ── Actualizar Supabase ───────────────────────────────────────
  if (downloadedMap.size === 0) {
    console.log('\n⚠️  No se descargó ninguna imagen. Verificar URLs.');
    return;
  }

  console.log('\n─────────────────────────────────────────────────────');
  console.log('Actualizando URLs en Supabase...\n');

  let updated = 0;
  for (const prop of urlsToFix) {
    const url = prop.featured_image_url;
    const localName = downloadedMap.get(url);
    
    if (!localName) {
      console.log(`  ⚠️  "${prop.title}": no descargada, se mantiene URL original`);
      continue;
    }

    const newUrl = `/images/propiedades/${localName}`;
    const { error } = await supabase
      .from('properties')
      .update({ featured_image_url: newUrl })
      .eq('id', prop.id);

    if (error) {
      console.log(`  ❌ "${prop.title}": ${error.message}`);
    } else {
      console.log(`  ✅ "${prop.title}"`);
      console.log(`     → ${newUrl}`);
      updated++;
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   Propiedades migradas: ${updated}/${urlsToFix.length}`);
  console.log(`   Imágenes en: /public/images/propiedades/`);
  console.log('\n✅ ¡Listo!\n');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});

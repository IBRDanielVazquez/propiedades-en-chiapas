/**
 * rescue_images_smart.js
 * ─────────────────────────────────────────────────────────────────
 * Versión inteligente: solo descarga las imágenes referenciadas en Supabase
 * 
 * 1. Consulta Supabase → obtiene todas las URLs de imágenes
 * 2. Filtra las que apuntan al dominio WP antiguo
 * 3. Descarga SOLO esas imágenes desde el FTP
 * 4. Las guarda en /public/images/propiedades/
 * 5. Actualiza las URLs en Supabase
 * ─────────────────────────────────────────────────────────────────
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

// ── Supabase ──────────────────────────────────────────────────────
const SUPABASE_URL = 'https://lfmbhdtrxmtxjwyfzdcz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ne1rajOeqAJETBoXcIvA6A_l0-NBH1f';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── FTP ───────────────────────────────────────────────────────────
const FTP_HOST = '82.29.86.157';
const FTP_USER = 'u169590082.propiedadesenchiapas.com';
const FTP_PASS = 'AODvxdNvZR#y6]Ne';
const FTP_WP_BASE = '/public_html';

// ── Paths ─────────────────────────────────────────────────────────
const LOCAL_IMG_DIR = path.join(__dirname, 'public', 'images', 'propiedades');

function sanitizeName(name) {
  // Preservar el nombre original pero eliminar caracteres problemáticos
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Descarga un archivo vía HTTP/HTTPS (para imágenes con URL pública disponible)
 */
function downloadViaHttp(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    proto.get(url, { timeout: 30000 }, (res) => {
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
    }).on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  RESCUE IMAGES SMART — Propiedades en Chiapas');
  console.log('═══════════════════════════════════════════════════════\n');

  // ── TAREA 3: Desactivar duplicado La Sima Park ─────────────────
  console.log('🔴 [TAREA 3] Desactivando duplicado La Sima Park...');
  const { data: simaData, error: simaErr } = await supabase
    .from('properties')
    .update({ active: false })
    .eq('id', 'e30d8fd4-28db-4b53-b503-be38bce73714')
    .select('id, title, active');

  if (simaErr) {
    console.error('   ❌ Error:', simaErr.message);
  } else if (simaData && simaData.length > 0) {
    console.log(`   ✅ Desactivado: "${simaData[0].title}" → active = ${simaData[0].active}`);
  } else {
    // Verificar si existe con cualquier estado
    const { data: check } = await supabase
      .from('properties')
      .select('id, title, active')
      .eq('id', 'e30d8fd4-28db-4b53-b503-be38bce73714');
    
    if (check && check.length > 0) {
      console.log(`   ℹ️  Registro encontrado: "${check[0].title}" ya tiene active=${check[0].active}`);
    } else {
      console.log('   ⚠️  ID no encontrado en la base de datos.');
      
      // Buscar por nombre La Sima Park para ver si hay duplicados
      const { data: simas } = await supabase
        .from('properties')
        .select('id, title, active, created_at')
        .ilike('title', '%sima park%')
        .order('created_at', { ascending: false });
      
      if (simas && simas.length > 0) {
        console.log(`   📋 Encontrados ${simas.length} registros con "sima park":`);
        simas.forEach(s => {
          console.log(`      • ${s.id} | "${s.title}" | active=${s.active} | ${s.created_at}`);
        });
      }
    }
  }

  // ── TAREA 2: Rescatar imágenes ─────────────────────────────────
  console.log('\n─────────────────────────────────────────────────────');
  console.log('[TAREA 2] Consultando propiedades en Supabase...');
  
  const { data: properties, error: propErr } = await supabase
    .from('properties')
    .select('id, title, featured_image_url, images');

  if (propErr) {
    console.error('❌ Error al consultar Supabase:', propErr.message);
    return;
  }

  console.log(`   ${properties.length} propiedades encontradas\n`);

  // Recopilar todas las URLs únicas que necesitamos descargar
  const urlsToProcess = new Map(); // url → { propId, propTitle, field }

  for (const prop of properties) {
    const urls = [];
    
    // featured_image_url
    if (prop.featured_image_url) urls.push({ url: prop.featured_image_url, field: 'featured' });
    
    // URLs en el array de imágenes
    if (Array.isArray(prop.images)) {
      prop.images.forEach((imgUrl, idx) => {
        if (typeof imgUrl === 'string') {
          urls.push({ url: imgUrl, field: `images[${idx}]` });
        }
      });
    }

    for (const { url, field } of urls) {
      // Solo procesar URLs del dominio WP de Chiapas
      if (url && (
        url.includes('propiedadesenchiapas.com') ||
        url.includes('wp-content/uploads') ||
        (url.includes('invierteenpropiedades.vip') && url.includes('wp-content'))
      ) && !url.startsWith('/images/propiedades/')) {
        if (!urlsToProcess.has(url)) {
          urlsToProcess.set(url, []);
        }
        urlsToProcess.get(url).push({ propId: prop.id, propTitle: prop.title, field });
      }
    }
  }

  console.log(`📊 URLs del WP antiguo encontradas: ${urlsToProcess.size}`);
  
  if (urlsToProcess.size === 0) {
    console.log('✅ No hay URLs del WP antiguo que necesiten migración.');
    console.log('   (Las imágenes ya pueden estar en /images/propiedades/ o ser URLs externas)');
    
    // Mostrar un resumen de las URLs actuales
    console.log('\n📋 URLs actuales de featured_image_url:');
    properties.slice(0, 20).forEach(p => {
      if (p.featured_image_url) {
        console.log(`   "${p.title}": ${p.featured_image_url.substring(0, 80)}`);
      }
    });
    return;
  }

  // Crear directorio local
  if (!fs.existsSync(LOCAL_IMG_DIR)) {
    fs.mkdirSync(LOCAL_IMG_DIR, { recursive: true });
    console.log(`📁 Creado: ${LOCAL_IMG_DIR}`);
  }

  // ── Intentar descarga HTTP primero (más rápido si el sitio WP sigue activo) ─
  console.log('\n📥 Descargando imágenes vía HTTP (sitio WP)...\n');
  
  const downloadedMap = new Map(); // url → localName
  const ftpNeeded = [];

  let i = 0;
  for (const [url, refs] of urlsToProcess) {
    i++;
    const fileName = url.split('/').pop().split('?')[0];
    const safeName = sanitizeName(fileName);
    const localPath = path.join(LOCAL_IMG_DIR, safeName);

    process.stdout.write(`  [${i}/${urlsToProcess.size}] ${safeName}... `);

    if (fs.existsSync(localPath) && fs.statSync(localPath).size > 0) {
      console.log('⏭️  ya existe');
      downloadedMap.set(url, safeName);
      continue;
    }

    try {
      await downloadViaHttp(url, localPath);
      const size = fs.statSync(localPath).size;
      if (size > 0) {
        console.log(`✅ ${Math.round(size/1024)}KB`);
        downloadedMap.set(url, safeName);
      } else {
        fs.unlinkSync(localPath);
        console.log('⚠️  vacío, FTP');
        ftpNeeded.push({ url, safeName, localPath });
      }
    } catch (err) {
      console.log(`❌ ${err.message} → FTP`);
      ftpNeeded.push({ url, safeName, localPath });
    }
  }

  // ── Si hay archivos que no se pudieron descargar vía HTTP, usar FTP ──────
  if (ftpNeeded.length > 0) {
    console.log(`\n🔌 Descargando ${ftpNeeded.length} archivos vía FTP...`);
    const client = new ftp.Client();
    client.ftp.verbose = false;
    
    try {
      await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASS, secure: false });
      console.log('✅ Conectado al FTP\n');
      
      for (const { url, safeName, localPath } of ftpNeeded) {
        // Convertir URL a path FTP
        // Ej: https://propiedadesenchiapas.com/wp-content/uploads/2024/03/foto.jpg
        //  → /public_html/wp-content/uploads/2024/03/foto.jpg
        let ftpPath = null;
        try {
          const parsed = new URL(url);
          ftpPath = FTP_WP_BASE + parsed.pathname;
        } catch {
          console.log(`  ⚠️  URL inválida: ${url}`);
          continue;
        }

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

  // ── Actualizar URLs en Supabase ────────────────────────────────
  console.log('\n─────────────────────────────────────────────────────');
  console.log('Actualizando URLs en Supabase...\n');

  // Agrupar cambios por propiedad
  const propChanges = new Map(); // propId → { featured_image_url?, images? }

  for (const prop of properties) {
    let changed = false;
    const update = {};

    // featured_image_url
    if (prop.featured_image_url && downloadedMap.has(prop.featured_image_url)) {
      update.featured_image_url = `/images/propiedades/${downloadedMap.get(prop.featured_image_url)}`;
      changed = true;
    }

    // images array
    if (Array.isArray(prop.images) && prop.images.length > 0) {
      const newImages = prop.images.map(imgUrl => {
        if (typeof imgUrl === 'string' && downloadedMap.has(imgUrl)) {
          return `/images/propiedades/${downloadedMap.get(imgUrl)}`;
        }
        return imgUrl;
      });
      if (JSON.stringify(newImages) !== JSON.stringify(prop.images)) {
        update.images = newImages;
        changed = true;
      }
    }

    if (changed) {
      propChanges.set(prop.id, { prop, update });
    }
  }

  let updated = 0;
  for (const [propId, { prop, update }] of propChanges) {
    const { error } = await supabase
      .from('properties')
      .update(update)
      .eq('id', propId);

    if (error) {
      console.log(`  ❌ "${prop.title}": ${error.message}`);
    } else {
      console.log(`  ✅ "${prop.title}"`);
      if (update.featured_image_url) console.log(`     featured → ${update.featured_image_url}`);
      if (update.images) console.log(`     images[] → ${update.images.length} URLs actualizadas`);
      updated++;
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   URLs procesadas:    ${urlsToProcess.size}`);
  console.log(`   Imágenes descargadas: ${downloadedMap.size}`);
  console.log(`   Propiedades actualizadas en Supabase: ${updated}`);
  console.log('\n✅ ¡Listo!\n');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});

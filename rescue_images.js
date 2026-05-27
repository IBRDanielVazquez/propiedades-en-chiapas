/**
 * rescue_images.js
 * ─────────────────────────────────────────────────────────────────
 * 1. Conecta al FTP de Hostinger
 * 2. Descarga imágenes de /wp-content/uploads/ y /landings/
 * 3. Las guarda en /public/images/propiedades/
 * 4. Consulta Supabase para ver qué propiedades usan URLs del FTP
 * 5. Actualiza featured_image_url en Supabase
 * ─────────────────────────────────────────────────────────────────
 */

import * as ftp from 'basic-ftp';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js';

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

// ── Paths ─────────────────────────────────────────────────────────
const LOCAL_IMG_DIR = path.join(__dirname, 'public', 'images', 'propiedades');

// ── Extensiones de imagen a descargar ────────────────────────────
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];

function isImage(name) {
  return IMAGE_EXTS.some(ext => name.toLowerCase().endsWith(ext));
}

function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Lista recursivamente todos los archivos de imagen en un directorio FTP
 */
async function listImagesRecursive(client, remotePath, collected = []) {
  try {
    const items = await client.list(remotePath);
    for (const item of items) {
      const fullPath = remotePath + '/' + item.name;
      if (item.isDirectory) {
        // Limitar profundidad para wp-content/uploads (tiene año/mes)
        const depth = fullPath.split('/').length;
        if (depth <= 8) {
          await listImagesRecursive(client, fullPath, collected);
        }
      } else if (isImage(item.name)) {
        collected.push({ remotePath: fullPath, name: item.name, size: item.size });
      }
    }
  } catch (err) {
    console.log(`  ⚠️  No se pudo listar ${remotePath}: ${err.message}`);
  }
  return collected;
}

async function downloadImages() {
  // Crear directorio local si no existe
  if (!fs.existsSync(LOCAL_IMG_DIR)) {
    fs.mkdirSync(LOCAL_IMG_DIR, { recursive: true });
    console.log(`📁 Creado directorio: ${LOCAL_IMG_DIR}`);
  }

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    console.log('🔌 Conectando al FTP...');
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASS,
      secure: false,
    });
    console.log('✅ Conectado al FTP\n');

    // ── Listar imágenes en wp-content/uploads ─────────────────────
    console.log('📋 Listando imágenes en /public_html/wp-content/uploads/...');
    const wpImages = await listImagesRecursive(client, '/public_html/wp-content/uploads');
    console.log(`   Encontradas: ${wpImages.length} imágenes\n`);

    // ── Listar imágenes en /public_html/landings ──────────────────
    console.log('📋 Listando imágenes en /public_html/landings/...');
    const landingImages = await listImagesRecursive(client, '/public_html/landings');
    console.log(`   Encontradas: ${landingImages.length} imágenes\n`);

    const allImages = [...wpImages, ...landingImages];
    console.log(`📊 Total imágenes a descargar: ${allImages.length}\n`);

    if (allImages.length === 0) {
      console.log('⚠️  No se encontraron imágenes. Verificar FTP paths.');
      return [];
    }

    // ── Descargar cada imagen ─────────────────────────────────────
    const downloaded = [];
    let i = 0;
    for (const img of allImages) {
      i++;
      const safeName = sanitizeName(img.name);
      const localPath = path.join(LOCAL_IMG_DIR, safeName);

      // Verificar si ya existe localmente (evitar re-descarga)
      if (fs.existsSync(localPath)) {
        console.log(`  [${i}/${allImages.length}] ⏭️  Ya existe: ${safeName}`);
        downloaded.push({ remotePath: img.remotePath, localName: safeName });
        continue;
      }

      try {
        await client.downloadTo(localPath, img.remotePath);
        console.log(`  [${i}/${allImages.length}] ⬇️  ${safeName} (${Math.round((img.size||0)/1024)}KB)`);
        downloaded.push({ remotePath: img.remotePath, localName: safeName });
      } catch (err) {
        console.log(`  [${i}/${allImages.length}] ❌ Error descargando ${img.remotePath}: ${err.message}`);
      }
    }

    console.log(`\n✅ Descarga completada: ${downloaded.length} imágenes en /public/images/propiedades/\n`);
    return downloaded;

  } finally {
    client.close();
  }
}

async function updateSupabase(downloadedImages) {
  console.log('🔍 Consultando propiedades en Supabase...');

  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, title, featured_image_url');

  if (error) {
    console.error('❌ Error al consultar Supabase:', error.message);
    return;
  }

  console.log(`   ${properties.length} propiedades encontradas\n`);

  // Construir mapa de nombre de archivo → ruta local
  const fileMap = {};
  for (const img of downloadedImages) {
    fileMap[img.localName.toLowerCase()] = img.localName;
    // También mapear el nombre original sin sanitizar
    const origName = img.remotePath.split('/').pop().toLowerCase();
    fileMap[origName] = img.localName;
  }

  let updated = 0;
  let skipped = 0;

  for (const prop of properties) {
    const url = prop.featured_image_url || '';

    // Solo procesar URLs que vienen del dominio de WP o del FTP directamente
    const isWpUrl = url.includes('propiedadesenchiapas.com') || 
                    url.includes('wp-content/uploads') ||
                    url.includes('/landings/');

    if (!isWpUrl) {
      skipped++;
      continue;
    }

    // Extraer nombre de archivo de la URL
    const urlFileName = url.split('/').pop().split('?')[0];
    const safeName = sanitizeName(urlFileName);

    // Verificar si tenemos ese archivo localmente
    const localFile = fileMap[urlFileName.toLowerCase()] || fileMap[safeName.toLowerCase()];

    if (!localFile) {
      console.log(`  ⚠️  "${prop.title}": no se encontró ${urlFileName} descargado`);
      skipped++;
      continue;
    }

    // Verificar que el archivo realmente existe en disco
    const localPath = path.join(LOCAL_IMG_DIR, localFile);
    if (!fs.existsSync(localPath)) {
      console.log(`  ⚠️  "${prop.title}": archivo ${localFile} no existe en disco`);
      skipped++;
      continue;
    }

    const newUrl = `/images/propiedades/${localFile}`;

    if (url === newUrl) {
      skipped++;
      continue;
    }

    // Actualizar en Supabase
    const { error: updateErr } = await supabase
      .from('properties')
      .update({ featured_image_url: newUrl })
      .eq('id', prop.id);

    if (updateErr) {
      console.log(`  ❌ Error actualizando "${prop.title}": ${updateErr.message}`);
    } else {
      console.log(`  ✅ "${prop.title}"\n     ${url}\n     → ${newUrl}`);
      updated++;
    }
  }

  console.log(`\n📊 Resumen Supabase:`);
  console.log(`   Actualizadas: ${updated}`);
  console.log(`   Sin cambios:  ${skipped}`);
}

// ── TAREA 3: Desactivar duplicado La Sima Park ───────────────────
async function deactivateLaSimaPark() {
  console.log('\n🔴 Desactivando duplicado La Sima Park (ID: e30d8fd4-28db-4b53-b503-be38bce73714)...');
  const { data, error } = await supabase
    .from('properties')
    .update({ active: false })
    .eq('id', 'e30d8fd4-28db-4b53-b503-be38bce73714')
    .select('id, title, active');

  if (error) {
    console.error('❌ Error:', error.message);
  } else if (data && data.length > 0) {
    console.log(`✅ Desactivado: "${data[0].title}" → active = ${data[0].active}`);
  } else {
    console.log('⚠️  No se encontró ningún registro con ese ID (puede que ya estuviera desactivado).');
  }
}

// ── MAIN ─────────────────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  RESCUE IMAGES — Propiedades en Chiapas');
  console.log('═══════════════════════════════════════════════════════\n');

  // Tarea 3: desactivar duplicado (no depende del FTP)
  await deactivateLaSimaPark();

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  DESCARGA DE IMÁGENES DESDE FTP');
  console.log('═══════════════════════════════════════════════════════\n');

  // Tarea 2: descargar imágenes
  const downloaded = await downloadImages();

  // Actualizar URLs en Supabase
  if (downloaded.length > 0) {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  ACTUALIZAR URLs EN SUPABASE');
    console.log('═══════════════════════════════════════════════════════\n');
    await updateSupabase(downloaded);
  }

  console.log('\n✅ ¡Todo listo!\n');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});

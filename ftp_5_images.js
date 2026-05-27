/**
 * ftp_5_images.js
 * Solo descarga las 5 imágenes que fallaron + actualiza Supabase
 * Usa keepAlive y timeout extendido para FTP
 */

import * as ftp from 'basic-ftp';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const SUPABASE_URL = 'https://lfmbhdtrxmtxjwyfzdcz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ne1rajOeqAJETBoXcIvA6A_l0-NBH1f';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FTP_HOST = '82.29.86.157';
const FTP_USER = 'u169590082.propiedadesenchiapas.com';
const FTP_PASS = 'AODvxdNvZR#y6]Ne';

const LOCAL_IMG_DIR = path.join(__dirname, 'public', 'images', 'propiedades');

// Las 5 imágenes que fallaron con HTTP 403
const TARGETS = [
  {
    remotePath: '/public_html/wp-content/uploads/2025/12/Sima-Park-14.png',
    localName:  'Sima-Park-14.png',
    supabaseUrl: 'https://propiedadesenchiapas.com/wp-content/uploads/2025/12/Sima-Park-14.png',
  },
  {
    remotePath: '/public_html/wp-content/uploads/2025/09/Colinas-del-Campestre-Venta-de-Terrenos.png',
    localName:  'Colinas-del-Campestre-Venta-de-Terrenos.png',
    supabaseUrl: 'https://propiedadesenchiapas.com/wp-content/uploads/2025/09/Colinas-del-Campestre-Venta-de-Terrenos.png',
  },
  {
    remotePath: '/public_html/wp-content/uploads/2025/11/Terrenos-Venta-MonteCristo.png',
    localName:  'Terrenos-Venta-MonteCristo.png',
    supabaseUrl: 'https://propiedadesenchiapas.com/wp-content/uploads/2025/11/Terrenos-Venta-MonteCristo.png',
  },
  {
    remotePath: '/public_html/wp-content/uploads/2025/09/Terrenos-en-Venta-El-Jobo-Cuauhtli-01.png',
    localName:  'Terrenos-en-Venta-El-Jobo-Cuauhtli-01.png',
    supabaseUrl: 'https://propiedadesenchiapas.com/wp-content/uploads/2025/09/Terrenos-en-Venta-El-Jobo-Cuauhtli-01.png',
  },
  {
    remotePath: '/public_html/wp-content/uploads/2026/01/Terrenos-en-Copoya-el-Higo-02-scaled.png',
    localName:  'Terrenos-en-Copoya-el-Higo-02-scaled.png',
    supabaseUrl: 'https://propiedadesenchiapas.com/wp-content/uploads/2026/01/Terrenos-en-Copoya-el-Higo-02-scaled.png',
  },
];

async function downloadWithRetry(client, remotePath, localPath, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await client.downloadTo(localPath, remotePath);
      const size = fs.existsSync(localPath) ? fs.statSync(localPath).size : 0;
      if (size > 100) return size;
      if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
      throw new Error('Archivo vacío');
    } catch (err) {
      if (attempt < maxRetries) {
        console.log(`    Intento ${attempt} fallido: ${err.message}. Reintentando...`);
        await new Promise(r => setTimeout(r, 2000 * attempt));
        // Reconectar si fue timeout de socket
        if (err.message.includes('Timeout') || err.message.includes('socket')) {
          try {
            await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASS, secure: false });
          } catch {}
        }
      } else {
        throw err;
      }
    }
  }
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║  FTP 5 IMAGES — Propiedades en Chiapas               ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(LOCAL_IMG_DIR)) {
    fs.mkdirSync(LOCAL_IMG_DIR, { recursive: true });
  }

  const downloaded = new Map(); // localName → true

  // Verificar cuáles ya existen
  for (const t of TARGETS) {
    const p = path.join(LOCAL_IMG_DIR, t.localName);
    if (fs.existsSync(p) && fs.statSync(p).size > 100) {
      console.log(`⏭️  Ya existe: ${t.localName}`);
      downloaded.set(t.localName, true);
    }
  }

  const pending = TARGETS.filter(t => !downloaded.has(t.localName));
  console.log(`\n📋 ${pending.length} imágenes por descargar vía FTP\n`);

  if (pending.length > 0) {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    // Timeout más largo: 2 minutos por operación
    client.ftp.socket.setTimeout(120000);

    try {
      console.log('🔌 Conectando al FTP (modo pasivo)...');
      await client.access({
        host: FTP_HOST,
        user: FTP_USER,
        password: FTP_PASS,
        secure: false,
      });
      // Forzar modo pasivo
      await client.send('PASV');
      console.log('✅ Conectado\n');

      for (const t of pending) {
        const localPath = path.join(LOCAL_IMG_DIR, t.localName);
        process.stdout.write(`  ⬇️  ${t.localName}... `);
        try {
          const size = await downloadWithRetry(client, t.remotePath, localPath);
          console.log(`✅ ${Math.round(size/1024)}KB`);
          downloaded.set(t.localName, true);
        } catch (err) {
          console.log(`❌ ${err.message}`);
        }
      }
    } finally {
      client.close();
    }
  }

  // ── Actualizar Supabase ───────────────────────────────────────
  console.log('\n─────────────────────────────────────────────────────');
  console.log('Actualizando URLs en Supabase...\n');

  // Actualizar las 3 ya descargadas en corrida anterior también
  const allUpdates = [
    {
      supabaseUrl: 'https://propiedadesenchiapas.com/sima-park/images/La-Sima-Park-Aerea.webp',
      localName: 'La-Sima-Park-Aerea.webp',
    },
    {
      supabaseUrl: 'https://propiedadesenchiapas.com/la-canada-desarrollo-eco-campestre/images/La-Canada-Desarrollo-Eco-Campestre-01.png',
      localName: 'La-Canada-Desarrollo-Eco-Campestre-01.png',
    },
    {
      supabaseUrl: 'https://propiedadesenchiapas.com/monte-de-los-olivos/images/Monte-Los-Olivos-13.png',
      localName: 'Monte-Los-Olivos-13.png',
    },
    ...TARGETS,
  ];

  let updatedCount = 0;

  for (const upd of allUpdates) {
    const localPath = path.join(LOCAL_IMG_DIR, upd.localName);
    const fileExists = fs.existsSync(localPath) && fs.statSync(localPath).size > 100;

    if (!fileExists) {
      console.log(`  ⚠️  ${upd.localName}: no existe en disco, saltando`);
      continue;
    }

    const newUrl = `/images/propiedades/${upd.localName}`;

    const { data, error } = await supabase
      .from('properties')
      .update({ featured_image_url: newUrl })
      .eq('featured_image_url', upd.supabaseUrl)
      .select('id, title');

    if (error) {
      console.log(`  ❌ ${upd.localName}: ${error.message}`);
    } else if (data && data.length > 0) {
      data.forEach(p => {
        console.log(`  ✅ "${p.title}"`);
        console.log(`     → ${newUrl}`);
      });
      updatedCount += data.length;
    } else {
      // Intentar buscar por URL parcial
      console.log(`  ⚠️  ${upd.localName}: sin coincidencia exacta en Supabase`);
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   Imágenes en disco: ${[...downloaded.keys()].length + 3} archivos`);
  console.log(`   Propiedades actualizadas en Supabase: ${updatedCount}`);
  
  // Mostrar estado final
  console.log('\n📋 Estado final de imágenes en disco:');
  if (fs.existsSync(LOCAL_IMG_DIR)) {
    const files = fs.readdirSync(LOCAL_IMG_DIR);
    files.forEach(f => {
      const size = Math.round(fs.statSync(path.join(LOCAL_IMG_DIR, f)).size / 1024);
      console.log(`   ${f} (${size}KB)`);
    });
  }

  console.log('\n✅ ¡Listo!\n');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});

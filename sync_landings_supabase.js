/**
 * sync_landings_supabase.js
 * Lee las landings rescatadas en /public/{slug}/ y sincroniza Supabase.
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

const USER_ID = '40d4d0ed-3f81-4ec9-99d0-cb53059f072e';
const PUBLIC_DIR = path.join(__dirname, 'public');
const HOSTINGER_BASE = 'https://propiedadesenchiapas.com';

// NO tocar Bella Vista
const SKIP_SLUGS = ['bella-vista', 'bella-vista-ocozocoautla'];

// ── Landings a procesar ──────────────────────────────────────────
const LANDINGS = [
  {
    slug:  'colinas-del-campestre',
    title: 'Colinas del Campestre – El Futuro Exclusivo de Tuxtla',
    type:  'terreno',
    price: 3000,
    price_suffix: '/ semana',
    municipality: 'Tuxtla Gutiérrez',
    city: 'Tuxtla Gutiérrez',
    description: 'Colinas del Campestre es un exclusivo desarrollo de terrenos campestres en las afueras de Tuxtla Gutiérrez. Invierte en plusvalía real con lotes residenciales en una de las zonas de mayor crecimiento de Chiapas. Vialidades amplias, áreas verdes y seguridad privada. Financiamiento directo sin buró.',
  },
  {
    slug:  'cuauhtli-terrenos-en-venta-en-el-jobo',
    title: 'Cuauhtli – Desarrollo Campestre en El Jobo',
    type:  'terreno',
    price: 350000,
    price_suffix: 'MXN',
    municipality: 'Tuxtla Gutiérrez',
    city: 'El Jobo, Tuxtla Gutiérrez',
    description: 'Terrenos exclusivos en El Jobo: invierte antes que suban. Cuauhtli es un desarrollo campestre privado en El Jobo, Tuxtla Gutiérrez. Lotes con escritura, vialidades pavimentadas, áreas verdes y acceso controlado. Ideal para construir tu casa de campo o como inversión de plusvalía en Chiapas.',
  },
  {
    slug:  'el-higo-copoya-terrenos-10x20-en-copoya',
    title: 'El Higo Copoya – Terrenos 10×20 en Copoya',
    type:  'terreno',
    price: 3500,
    price_suffix: '/ semana',
    municipality: 'Tuxtla Gutiérrez',
    city: 'Copoya, Tuxtla Gutiérrez',
    description: 'Terrenos 10×20 metros en Copoya, una de las zonas con mayor plusvalía de Tuxtla Gutiérrez. El Higo Copoya ofrece lotes residenciales con certeza jurídica, financiamiento directo desde $3,500 semanales, sin buró de crédito. Cerca del Zoológico y zona turística de Copoya.',
  },
  {
    slug:  'fraccionamiento-montecristo',
    title: 'Fraccionamiento Montecristo – Terrenos Campestres con Escritura',
    type:  'terreno',
    price: 11143,
    price_suffix: '/ semana',
    municipality: 'Tuxtla Gutiérrez',
    city: 'Tuxtla Gutiérrez',
    description: 'Fraccionamiento Montecristo es un exclusivo desarrollo de terrenos campestres con escritura pública en Chiapas. Lotes desde 200 m², vialidades pavimentadas, alumbrado público, áreas verdes y seguridad. Financiamiento directo accesible. La inversión más segura para tu patrimonio familiar.',
  },
  {
    slug:  'la-canada-desarrollo-eco-campestre',
    title: 'La Cañada – Desarrollo Eco-Campestre Exclusivo',
    type:  'terreno',
    price: 244000,
    price_suffix: 'MXN',
    municipality: 'Chiapas',
    city: 'Chiapas',
    description: 'La Cañada es un desarrollo eco-campestre exclusivo en Chiapas. Lotes rodeados de naturaleza con áreas de preservación ecológica, senderos naturales, seguridad privada 24/7 y certeza jurídica total. Ideal para quienes buscan conectar con la naturaleza sin alejarse de la ciudad.',
  },
  {
    slug:  'la-sima-park-terrenos-en-ocozocoautla',
    title: 'La Sima Park – Terrenos en Ocozocoautla',
    type:  'terreno',
    price: 2100,
    price_suffix: '/ semana',
    municipality: 'Ocozocoautla',
    city: 'Ocozocoautla de Espinosa',
    description: 'La Sima Park ofrece terrenos campestres en Ocozocoautla con un entorno natural privilegiado. Amenidades de primer nivel: alberca, lago artificial, granja, huerto, ciclopista y club social. Financiamiento directo desde $2,100 semanales. Certeza jurídica garantizada.',
  },
  {
    slug:  'monte-de-los-olivos',
    title: 'Monte de los Olivos – Inversión Segura en Berriozábal',
    type:  'terreno',
    price: 2500,
    price_suffix: '/ semana',
    municipality: 'Berriozábal',
    city: 'Berriozábal',
    description: 'Monte de los Olivos es un desarrollo de terrenos campestres en Berriozábal, Chiapas. Ubicado en una zona de alto crecimiento, ofrece lotes con escritura, vialidades interiores, áreas verdes y acceso controlado. Financiamiento directo desde $2,500 semanales. Tu inversión más segura en el corazón de Chiapas.',
  },
  {
    slug:  'quinta-en-berriozabal',
    title: 'Quinta en Berriozábal – Vida de Campo a tu Alcance',
    type:  'quinta',
    price: 2200,
    price_suffix: '/ semana',
    municipality: 'Berriozábal',
    city: 'Berriozábal',
    description: 'Quinta en Berriozábal te ofrece la experiencia de vivir rodeado de naturaleza en el clima fresco de Berriozábal, Chiapas. Lotes tipo quinta con amplios espacios para construcción, jardín privado y vistas panorámicas al campo chiapaneco. Financiamiento directo desde $2,200 semanales.',
  },
  {
    slug:  'sima-park',
    title: 'La Sima Park – Naturaleza que da valor, inversión que da vida',
    type:  'terreno',
    price: 2100,
    price_suffix: '/ semana',
    municipality: 'Ocozocoautla',
    city: 'Ocozocoautla de Espinosa',
    description: 'La Sima Park es el desarrollo campestre más completo de Ocozocoautla, Chiapas. Naturaleza que da valor, inversión que da vida. Amenidades únicas: alberca infinity, lago artificial, granja orgánica, huerto comunitario, ciclopista y más. Lotes con escritura desde $2,100 semanales.',
  },
];

// ── Helpers ──────────────────────────────────────────────────────

function getFirstImage(slug) {
  const imgDir = path.join(PUBLIC_DIR, slug, 'images');
  if (!fs.existsSync(imgDir)) return null;
  const files = fs.readdirSync(imgDir)
    .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f) && !f.toLowerCase().includes('favicon') && !f.match(/^\d{5,}\.png$/))
    .sort();
  if (files.length === 0) return null;
  return `${HOSTINGER_BASE}/${slug}/images/${files[0]}`;
}

function getAllImages(slug) {
  const imgDir = path.join(PUBLIC_DIR, slug, 'images');
  if (!fs.existsSync(imgDir)) return [];
  return fs.readdirSync(imgDir)
    .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f) && !f.toLowerCase().includes('favicon') && !f.match(/^\d{5,}\.png$/))
    .sort()
    .map(f => `${HOSTINGER_BASE}/${slug}/images/${f}`);
}

// ── MAIN ─────────────────────────────────────────────────────────

async function main() {
  console.log('Obteniendo propiedades de Supabase...');
  const { data: existing, error: fetchErr } = await supabase
    .from('properties')
    .select('id, title, landing_slug, active');

  if (fetchErr) { console.error('Error fetch:', fetchErr.message); return; }

  const updated = [];
  const created = [];
  const errors  = [];

  for (const landing of LANDINGS) {
    if (SKIP_SLUGS.includes(landing.slug)) continue;

    const imgUrl = getFirstImage(landing.slug);

    // Buscar coincidencia en Supabase: por landing_slug o título similar
    const match = existing.find(p =>
      p.landing_slug === landing.slug ||
      p.title?.toLowerCase().includes(landing.slug.split('-').slice(0,3).join(' ').toLowerCase()) ||
      landing.title?.toLowerCase().split('–')[0].trim().split(' ').slice(0,3).every(w =>
        p.title?.toLowerCase().includes(w.toLowerCase())
      )
    );

    if (match) {
      // ── ACTUALIZAR ──────────────────────────────────────────
      const payload = {
        description:        landing.description,
        landing_slug:       landing.slug,
        ...(imgUrl && { featured_image_url: imgUrl }),
      };

      const { error } = await supabase
        .from('properties')
        .update(payload)
        .eq('id', match.id);

      if (error) {
        errors.push(`${landing.slug}: ${error.message}`);
        console.log(`  ❌ UPDATE "${landing.title}": ${error.message}`);
      } else {
        updated.push(landing.title);
        console.log(`  ✅ UPDATE "${landing.title}" (${match.id.slice(0,8)})`);
        if (imgUrl) console.log(`     img → ${imgUrl.split('/').slice(-1)[0]}`);
      }
    } else {
      // ── INSERTAR ─────────────────────────────────────────────
      const payload = {
        user_id:            USER_ID,
        title:              landing.title,
        description:        landing.description,
        type:               landing.type,
        price:              landing.price,
        price_suffix:       landing.price_suffix,
        municipality:       landing.municipality,
        city:               landing.city,
        landing_slug:       landing.slug,
        active:             true,
        operation_type:     'Venta',
        status:             'Disponible',
        featured_image_url: imgUrl || null,
        bedrooms:           0,
        bathrooms:          0,
        garages:            0,
      };

      const { error } = await supabase
        .from('properties')
        .insert(payload);

      if (error) {
        errors.push(`${landing.slug}: ${error.message}`);
        console.log(`  ❌ INSERT "${landing.title}": ${error.message}`);
      } else {
        created.push(landing.title);
        console.log(`  ✅ INSERT "${landing.title}"`);
        if (imgUrl) console.log(`     img → ${imgUrl.split('/').slice(-1)[0]}`);
      }
    }
  }

  console.log('\n════════════════════════════════════');
  console.log('PROPIEDADES ACTUALIZADAS:', updated.length ? updated.join(', ') : 'ninguna');
  console.log('PROPIEDADES NUEVAS:',      created.length ? created.join(', ') : 'ninguna');
  console.log('ERRORES:',                 errors.length  ? errors.join('; ')  : 'ninguno');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });

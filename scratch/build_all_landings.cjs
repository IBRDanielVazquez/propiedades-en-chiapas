const fs = require('fs');
const path = require('path');

const publicDir = './public';
const folders = fs.readdirSync(publicDir);

const rawLandings = [
  {
    id: 'bella-vista-ocozocoautla-app',
    titulo: 'Bella Vista Ocozocoautla',
    descripcion: 'Terrenos campestres de ensueño con Club Campestre exclusivo, piscina, senderos ecológicos y áreas wellness en Chiapas.',
    ciudad: 'Ocozocoautla',
    municipio: 'Ocozocoautla de Espinosa',
    tipo: 'terreno',
    slug: 'bella-vista',
    imagen: 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=800',
    galeria: [
      'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=800',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800',
    ],
    precio: 290000,
    precioTexto: 'Desde $290,000 MXN',
    precioSufijo: 'MXN · Desde $450/semana',
    pagoSemanal: 'Desde $450/semana',
    superficie: '200 m² (mínimo)',
    amenidades: ['Club Campestre con Piscina', 'Senderos Ecológicos', 'Acceso Controlado 24/7', 'Instalaciones Deportivas'],
    ubicacionNota: '25 min de Tuxtla Gutiérrez',
    whatsapp: 'https://wa.me/529612466204',
    esDesarrollo: true,
    status: 'Disponible',
    etiqueta: 'Lanzamiento Exclusivo',
  },
  {
    id: 'rioja-berriozabal-app',
    titulo: 'Rioja Berriozábal',
    descripcion: 'Lotes de 200 m² (10×20 m) con escritura pública en Berriozábal. Zona habitada, construcción inmediata y pagos quincenales accesibles.',
    ciudad: 'Berriozábal',
    municipio: 'Berriozábal',
    tipo: 'terreno',
    slug: 'rioja',
    imagen: '/rioja/fotos/optimizadas/rioja-foto-01.webp',
    galeria: [
      '/rioja/fotos/optimizadas/rioja-foto-01.webp',
      '/rioja/fotos/optimizadas/rioja-foto-02.webp',
      '/rioja/fotos/optimizadas/rioja-foto-03.webp',
      '/rioja/fotos/optimizadas/rioja-foto-04.webp',
      '/rioja/fotos/optimizadas/rioja-foto-05.webp',
      '/rioja/fotos/optimizadas/rioja-foto-06.webp',
      '/rioja/fotos/optimizadas/rioja-foto-07.webp',
      '/rioja/fotos/optimizadas/rioja-foto-08.webp',
    ],
    precio: 228000,
    precioTexto: '$228,000 MXN',
    precioSufijo: 'MXN · Enganche $3,000',
    pagoQuincenal: '$1,000 quincenal',
    superficie: '200 m² (10×20 m)',
    amenidades: ['Escritura Pública', 'Zona Habitada', 'Construcción Inmediata', 'Apartado $1,000'],
    ubicacionNota: 'Berriozábal · Crecimiento Habitacional',
    whatsapp: 'https://wa.link/02846w',
    esDesarrollo: true,
    status: 'Disponible',
    etiqueta: 'Lotes con Escritura',
  }
];

folders.forEach((folder) => {
  const indexPath = path.join(publicDir, folder, 'index.html');
  if (fs.existsSync(indexPath) && folder !== 'landings' && folder !== 'ibr-dashboard') {
    const html = fs.readFileSync(indexPath, 'utf8');

    // Título limpio
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    let title = titleMatch ? titleMatch[1].trim() : folder;
    title = title.replace(/\s*[–|-]\s*Propiedades en Chiapas.*/i, '').replace(/\|.*/, '').trim();

    // Descripción limpia
    const descMatch = html.match(/<meta\s+name=[\"']description[\"']\s+content=[\"'](.*?)[\"']/i);
    const desc = descMatch ? descMatch[1].trim() : title;

    // Imágenes de la landing
    const imgMatches = [...html.matchAll(/<img[^>]+src=[\"']([^\"']+)[\"']/gi)].map(m => m[1]);
    const bgMatches = [...html.matchAll(/url\([\"']?([^\"'\)]+)[\"']?\)/gi)].map(m => m[1]);

    const allImgs = [...new Set([...imgMatches, ...bgMatches])]
      .filter(url => !url.includes('data:image') && !url.includes('svg') && !url.includes('favicon') && !url.includes('google') && !url.includes('facebook') && !url.includes('pixel'))
      .map(url => {
        if (url.startsWith('http')) return url;
        if (url.startsWith('/')) return url;
        return '/' + folder + '/' + url.replace(/^\.\//, '');
      });

    let type = 'terreno';
    if (folder.includes('asesor') || title.toLowerCase().includes('asesor')) {
      type = 'asesor';
    } else if (title.toLowerCase().includes('casa') || title.toLowerCase().includes('quinta') || desc.toLowerCase().includes('casa') || desc.toLowerCase().includes('vivienda') || desc.toLowerCase().includes('prototipo')) {
      type = 'casa';
    } else if (title.toLowerCase().includes('departamento') || desc.toLowerCase().includes('departamento')) {
      type = 'departamento';
    } else if (title.toLowerCase().includes('local') || desc.toLowerCase().includes('local')) {
      type = 'local';
    }

    const priceMatch = html.match(/\$\s*[\d,]+(?:\.\d{2})?/g);
    let priceText = 'Consultar';
    let rawPrice = 0;
    if (priceMatch && priceMatch.length > 0) {
      priceText = priceMatch[0];
      const num = parseInt(priceMatch[0].replace(/[^\d]/g, ''), 10);
      if (num > 100) rawPrice = num;
    }

    rawLandings.push({
      id: folder,
      titulo: title,
      descripcion: desc,
      ciudad: title.includes('Ocozocoautla') ? 'Ocozocoautla' : (title.includes('Berriozábal') || title.includes('Berriozabal')) ? 'Berriozábal' : (title.includes('Copoya') ? 'Copoya' : 'Tuxtla Gutiérrez'),
      municipio: title.includes('Ocozocoautla') ? 'Ocozocoautla' : (title.includes('Berriozábal') || title.includes('Berriozabal')) ? 'Berriozábal' : 'Tuxtla Gutiérrez',
      tipo: type,
      slug: folder,
      imagen: allImgs[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800',
      galeria: allImgs.length > 0 ? allImgs : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800'],
      precio: rawPrice,
      precioTexto: priceText !== 'Consultar' ? priceText : 'Consultar Precio',
      precioSufijo: 'MXN · Venta Directa',
      superficie: '200 m²',
      amenidades: ['Escritura Pública', 'Ubicación Premium', 'Servicios Garantizados'],
      ubicacionNota: title.includes('Berriozábal') ? 'Berriozábal, Chiapas' : (title.includes('Ocozocoautla') ? 'Ocozocoautla, Chiapas' : 'Tuxtla Gutiérrez, Chiapas'),
      whatsapp: 'https://wa.me/529612466204',
      esDesarrollo: true,
      status: 'Disponible',
      etiqueta: type === 'asesor' ? 'Asesor IBR' : (type === 'casa' ? 'Residencial' : 'Desarrollo'),
    });
  }
});

const content = `// ─── Fichas completas de Landings (Alimentadas dinámicamente con todas sus imágenes) ────
// Generado automáticamente a partir de todas las landing pages del sistema

export const DESARROLLOS = ${JSON.stringify(rawLandings, null, 2)};
`;

const dest = path.join(__dirname, '../src/data/desarrollos.js');
fs.writeFileSync(dest, content, 'utf8');
console.log('Successfully wrote', rawLandings.length, 'landings to desarrollos.js');

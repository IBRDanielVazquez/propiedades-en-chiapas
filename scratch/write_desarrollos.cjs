const fs = require('fs');
const path = require('path');

// Datos extraídos de las landing pages de los desarrollos
// Fuente: bella-vista/ y rioja/ — NO modificar las landings
const developmentsData = `// ─── Datos de Desarrollos (extraídos de las landing pages) ─────────────────────
// SOLO LECTURA — Las landing pages originales NO fueron modificadas
// Fuente: /src/modules/developments/bella-vista/ y /src/modules/developments/rioja/

export const DESARROLLOS = [
  {
    id: 'bella-vista-ocozocoautla',
    titulo: 'Bella Vista Ocozocoautla',
    descripcion: 'Terrenos campestres de ensueño con Club Campestre exclusivo, piscina, senderos ecológicos y áreas wellness. El santuario residencial donde el lujo y la naturaleza coexisten en Chiapas.',
    ciudad: 'Ocozocoautla',
    municipio: 'Ocozocoautla de Espinosa',
    tipo: 'terreno',
    slug: 'bella-vista-ocozocoautla',
    imagen: 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=800',
    galeria: [
      'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=800',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800',
    ],
    precio: 290000,   // Precio base: 200 m2 × $1,450 MXN/m2
    precioTexto: 'Desde $290,000 MXN',
    precioSufijo: 'MXN · Financiamiento directo',
    pagoSemanal: 'Desde $450/semana',
    superficie: '200 m² (mínimo)',
    precioPorM2: 1450,
    amenidades: [
      'Club Campestre con Piscina',
      'Senderos Ecológicos',
      'Acceso Controlado 24/7',
      'Instalaciones Deportivas',
      'Espacios Wellness & Yoga',
      'Parque Rústico Infantil',
    ],
    caracteristicas: [
      'Terrenos campestres desde 200 m²',
      'Financiamiento directo sin buró de crédito',
      'Solo identificación oficial + enganche',
      'Sin penalización por pagos anticipados',
      'Clima templado, 25 min de Tuxtla Gutiérrez',
      'Pueblo Mágico Ocozocoautla a minutos',
    ],
    ubicacionNota: '25 min de Tuxtla Gutiérrez · 40 min del aeropuerto',
    whatsapp: 'https://wa.me/529612466204',
    esDesarrollo: true,
    status: 'En venta',
    etiqueta: 'Lanzamiento Exclusivo',
  },
  {
    id: 'rioja-berriozabal',
    titulo: 'Rioja Berriozábal',
    descripcion: 'Lotes de 200 m² con escritura pública en Berriozábal. Zona con construcciones habitadas, pagos quincenales accesibles desde $1,000. Construye tu patrimonio a tu ritmo.',
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
    ],
    precio: 228000,
    precioTexto: '$228,000 MXN',
    precioSufijo: 'MXN · Enganche $3,000',
    pagoQuincenal: '$1,000 quincenal',
    superficie: '200 m² (10×20 m)',
    amenidades: [
      'Escritura Pública garantizada',
      'Zona habitada con vecinos reales',
      'Construcción inmediata permitida',
      'Enganche desde $3,000',
      'Pagos quincenales desde $1,000',
      'Acceso a servicios básicos de la zona',
    ],
    caracteristicas: [
      'Lotes 10×20 metros (200 m²)',
      'Escritura Pública para cada lote',
      'Zona con construcciones habitadas cercanas',
      'Sin buró de crédito',
      'Puedes construir desde el día 1',
      'Reserva desde $1,000',
    ],
    ubicacionNota: 'Berriozábal · Zona de crecimiento habitacional',
    whatsapp: 'https://wa.link/02846w',
    esDesarrollo: true,
    status: 'En venta',
    etiqueta: 'Lotes con Escritura',
  },
];
`;

const outPath = path.join(__dirname, '../src/data/desarrollos.js');
// Crear el directorio si no existe
const dir = path.dirname(outPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
fs.writeFileSync(outPath, developmentsData, 'utf8');
console.log('Wrote:', outPath);
console.log('Lines:', developmentsData.split('\\n').length);

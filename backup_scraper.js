import scrape from 'website-scraper';
import fs from 'fs';
import path from 'path';

const urls = [
  "https://propiedadesenchiapas.com/colinas-del-campestre/",
  "https://propiedadesenchiapas.com/cuauhtli-terrenos-en-venta-en-el-jobo/",
  "https://propiedadesenchiapas.com/el-higo-copoya-terrenos-10x20-en-copoya/",
  "https://propiedadesenchiapas.com/fraccionamiento-montecristo/",
  "https://propiedadesenchiapas.com/carmen-jimenez-asesor-inmobiliario-de-ibr/",
  "https://propiedadesenchiapas.com/luis-garcia-asesor-inmobiliario-de-ibr/",
  "https://propiedadesenchiapas.com/lupyta-mendoza-asesor-inmobiliario-ibr/",
  "https://propiedadesenchiapas.com/la-canada-desarrollo-eco-campestre/",
  "https://propiedadesenchiapas.com/la-sima-park-terrenos-en-ocozocoautla/",
  "https://propiedadesenchiapas.com/monte-de-los-olivos/",
  "https://propiedadesenchiapas.com/quinta-en-berriozabal/",
  "https://propiedadesenchiapas.com/sima-park/"
];

async function start() {
  for (const url of urls) {
    // extract directory name
    const parts = url.split('/').filter(p => p);
    const dirName = parts[parts.length - 1];
    const dirPath = path.join(process.cwd(), 'public', dirName);
    
    console.log(`Descargando ${dirName}...`);
    
    if (fs.existsSync(dirPath)) {
      console.log(`El directorio ${dirPath} ya existe, omitiendo...`);
      continue;
    }
    
    try {
      await scrape({
        urls: [url],
        directory: dirPath,
        recursive: false,
        maxRecursiveDepth: 0,
        requestConcurrency: 4
      });
      console.log(`✅ ${dirName} guardado en public/${dirName}`);
    } catch (err) {
      console.error(`❌ Error con ${dirName}:`, err.message);
    }
  }
  console.log("¡Terminado!");
}

start();

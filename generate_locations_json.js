import fs from 'fs';
import iconv from 'iconv-lite';

const filePath = './CPdescarga.txt';
const outputPath = './src/data/chiapasLocations.json';

console.log('📖 Procesando base de datos oficial de SEPOMEX...');

const buffer = fs.readFileSync(filePath);
const data = iconv.decode(buffer, 'ISO-8859-1');

const lines = data.split('\n');
const chiapasData = {};

// Parsear el TXT
for (let i = 2; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const cols = line.split('|');
  if (cols.length > 4) {
    const cp = cols[0].trim();
    const colonia = cols[1].trim();
    const municipio = cols[3].trim();
    const estado = cols[4].trim();
    
    // Validar que sea Chiapas
    if (estado.toLowerCase() === 'chiapas') {
      if (!chiapasData[municipio]) {
        chiapasData[municipio] = {};
      }
      if (!chiapasData[municipio][cp]) {
        chiapasData[municipio][cp] = [];
      }
      chiapasData[municipio][cp].push(colonia);
    }
  }
}

// Ensure the directory exists
fs.mkdirSync('./src/data', { recursive: true });

fs.writeFileSync(outputPath, JSON.stringify(chiapasData));
console.log(`✅ ¡Éxito! Base de datos convertida a JSON y guardada en: ${outputPath}`);

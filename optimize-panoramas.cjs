const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectDir = '/Users/danielvazquez/IBR-MASTER/proyectos/Propiedades-en-Chiapas';

const files = [
  {
    src: '/Users/danielvazquez/Downloads/Montecristo 360 02.JPG',
    dest: path.join(projectDir, 'public/rioja/360/rioja-360-01.webp'),
    thumb: path.join(projectDir, 'public/rioja/360/miniaturas/rioja-360-01.webp'),
    orig: path.join(projectDir, 'public/rioja/360/originales/dji_fly_20260711_064238_0355_1783972256871_pano 2.JPG')
  },
  {
    src: '/Users/danielvazquez/Downloads/Montecristo 360 03.JPG',
    dest: path.join(projectDir, 'public/rioja/360/rioja-360-02.webp'),
    thumb: path.join(projectDir, 'public/rioja/360/miniaturas/rioja-360-02.webp'),
    orig: path.join(projectDir, 'public/rioja/360/originales/dji_fly_20260711_065056_0358_1783972156478_pano 2.JPG')
  },
  {
    src: '/Users/danielvazquez/Downloads/Montecristo 360 01.JPG',
    dest: path.join(projectDir, 'public/rioja/360/rioja-360-03.webp'),
    thumb: path.join(projectDir, 'public/rioja/360/miniaturas/rioja-360-03.webp'),
    orig: path.join(projectDir, 'public/rioja/360/originales/dji_fly_20260711_063732_0354_1783972154781_pano 2.JPG')
  }
];

// Asegurar directorios de destino
const dirsToCreate = [
  path.join(projectDir, 'public/rioja/360'),
  path.join(projectDir, 'public/rioja/360/miniaturas'),
  path.join(projectDir, 'public/rioja/360/originales')
];
dirsToCreate.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Creado directorio: ${dir}`);
  }
});

async function processFile(fileInfo, index) {
  const { src, dest, thumb, orig } = fileInfo;
  console.log(`\n--------------------------------------------`);
  console.log(`Procesando Escena ${index + 1}...`);
  console.log(`Origen: ${src}`);

  // 1. Validaciones de existencia y peso
  if (!fs.existsSync(src)) {
    throw new Error(`El archivo de origen no existe: ${src}`);
  }
  const stats = fs.statSync(src);
  if (stats.size === 0) {
    throw new Error(`El archivo está vacío (0 bytes): ${src}`);
  }
  console.log(`Tamaño original: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

  // 2. Copiar original como respaldo histórico
  fs.copyFileSync(src, orig);
  console.log(`Copiado original a: ${orig}`);

  // 3. Cargar con sharp y validar metadata
  const image = sharp(src);
  const metadata = await image.metadata();
  const { width, height, format } = metadata;
  console.log(`Resolución original: ${width}x${height} (${format})`);

  const aspect = width / height;
  console.log(`Relación de aspecto: ${aspect.toFixed(3)}`);
  if (aspect < 1.9 || aspect > 2.1) {
    console.warn(`[ADVERTENCIA] Relación de aspecto ${aspect.toFixed(2)} no es exactamente 2:1 (proyección equirectangular).`);
  }

  // 4. Optimizar Panorama Principal (8192x4096 WebP)
  console.log(`Generando panorama optimizado...`);
  await sharp(src)
    .resize(8192, 4096, { fit: 'fill' })
    .webp({ quality: 85, effort: 4 })
    .toFile(dest);
  console.log(`Guardado panorama optimizado en: ${dest}`);

  // 5. Generar Miniatura (1024x512 WebP)
  console.log(`Generando miniatura...`);
  await sharp(src)
    .resize(1024, 512, { fit: 'fill' })
    .webp({ quality: 80, effort: 3 })
    .toFile(thumb);
  console.log(`Guardada miniatura en: ${thumb}`);
}

async function main() {
  try {
    for (let i = 0; i < files.length; i++) {
      await processFile(files[i], i);
    }
    console.log(`\n============================================`);
    console.log(`¡Todas las imágenes procesadas correctamente!`);
  } catch (error) {
    console.error(`\n[ERROR DE PROCESAMIENTO]:`, error.message);
    process.exit(1);
  }
}

main();

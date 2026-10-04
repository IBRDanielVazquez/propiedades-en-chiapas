const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const downloads = '/Users/danielvazquez/Downloads';
const outputRoot = path.join(__dirname, '..', 'public', 'quinta-en-berriozabal', '360');

const scenes = [
  { group: 'interior', slug: '01-sala', source: 'Quinta en Chiapas Sala 01.JPG', brightness: 1.07, saturation: 0.98, contrast: 1.025 },
  { group: 'interior', slug: '02-estudio', source: 'Quinta en Chiapas Estudio R1.JPG', brightness: 1.09, saturation: 0.97, contrast: 1.02 },
  { group: 'interior', slug: '03-bano-recamara-1', source: 'Quinta en Chiapas Baño R1.JPG', brightness: 1.08, saturation: 0.96, contrast: 1.018 },
  { group: 'interior', slug: '04-recamara-2', source: 'Quinta en Chiapas Recamara 2.JPG', brightness: 1.08, saturation: 0.98, contrast: 1.02 },
  { group: 'interior', slug: '05-bano-recamara-2', source: 'Quinta en Chiapas Baño R-2.JPG', brightness: 1.09, saturation: 0.96, contrast: 1.018 },
  { group: 'interior', slug: '06-recamara-3', source: 'Quinta en Chiapas Recamara 3.JPG', brightness: 1.08, saturation: 0.98, contrast: 1.02 },
  { group: 'interior', slug: '07-bano-recamara-3', source: 'Quinta en Chiapas Baño R3.JPG', brightness: 1.09, saturation: 0.96, contrast: 1.018 },
  { group: 'interior', slug: '08-cocina', source: 'Quinta en Chiapas Cocina.JPG', brightness: 1.07, saturation: 0.97, contrast: 1.025 },
  { group: 'interior', slug: '09-sala-patio-trasero', source: 'Quinta en Chiapas Sala Salida al Patio Trasero.JPG', brightness: 1.075, saturation: 0.98, contrast: 1.02 },
  { group: 'exterior', slug: '01-acceso-principal', source: 'Quinta en Chiapas Acceso 01.JPG', brightness: 1.025, saturation: 1.025, contrast: 1.02 },
  { group: 'exterior', slug: '02-acceso-interior', source: 'Quinta en Chiapas Acceso 02.JPG', brightness: 1.03, saturation: 1.02, contrast: 1.02 },
  { group: 'exterior', slug: '03-jardin-frontal', source: 'Quinta en Chiapas Jardin Frontal.JPG', brightness: 1.015, saturation: 1.025, contrast: 1.025 },
  { group: 'exterior', slug: '04-jardin-frontal-2', source: 'Quinta en Chiapas Jardin Frontal 2.JPG', brightness: 1.015, saturation: 1.025, contrast: 1.025 },
  { group: 'exterior', slug: '05-acceso-corredor', source: 'Quinta en Chiapas Acceso al Corredor.JPG', brightness: 1.04, saturation: 1.015, contrast: 1.02 },
  { group: 'exterior', slug: '06-jardin-trasero', source: 'Quinta en Chiapas Jardin Trasero 2.JPG', brightness: 1.02, saturation: 1.025, contrast: 1.02 },
  { group: 'exterior', slug: '07-jardin-trasero-2a', source: 'Quinta en Chiapas Jardin Trasero 2a.JPG', brightness: 1.02, saturation: 1.025, contrast: 1.02 },
  { group: 'exterior', slug: '08-jardin-trasero-2b', source: 'Quinta en Chiapas Jardin trasero 2b.JPG', brightness: 1.02, saturation: 1.025, contrast: 1.02 },
  { group: 'exterior', slug: '09-jardin-trasero-3', source: 'Quinta en Chiapas Jardin Trasero 03.JPG', brightness: 1.02, saturation: 1.025, contrast: 1.02 },
];

function correctedPipeline(source, scene) {
  const offset = Math.round((1 - scene.contrast) * 128);
  return sharp(source, { sequentialRead: true })
    .rotate()
    .modulate({ brightness: scene.brightness, saturation: scene.saturation })
    .linear(scene.contrast, offset)
    .sharpen({ sigma: 0.65, m1: 0.28, m2: 0.9, x1: 2, y2: 10, y3: 20 });
}

async function processScene(scene) {
  const source = path.join(downloads, scene.source);
  const targetDir = path.join(outputRoot, scene.group);
  const posterDir = path.join(outputRoot, 'posters', scene.group);
  const thumbDir = path.join(outputRoot, 'miniaturas', scene.group);
  [targetDir, posterDir, thumbDir].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

  if (!fs.existsSync(source)) throw new Error(`Falta el archivo: ${source}`);
  const metadata = await sharp(source).metadata();
  if (metadata.width !== metadata.height * 2) {
    throw new Error(`${scene.source} no es equirectangular 2:1 (${metadata.width}x${metadata.height})`);
  }

  const panorama = path.join(targetDir, `${scene.slug}.webp`);
  const poster = path.join(posterDir, `${scene.slug}.webp`);
  const thumb = path.join(thumbDir, `${scene.slug}.webp`);

  if (process.env.QUINTA_360_SKIP_EXISTING === '1' && [panorama, poster, thumb].every((file) => fs.existsSync(file))) {
    console.log(`${scene.group}/${scene.slug}: salida existente validada`);
    return;
  }

  await correctedPipeline(source, scene)
    .resize(8192, 4096, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 87, alphaQuality: 100, effort: 3, smartSubsample: true })
    .toFile(panorama);

  await sharp(panorama, { sequentialRead: true })
    .resize(1600, 800, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 82, effort: 4, smartSubsample: true })
    .toFile(poster);

  await sharp(panorama, { sequentialRead: true })
    .resize(640, 320, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 78, effort: 4, smartSubsample: true })
    .toFile(thumb);

  const outputMetadata = await sharp(panorama).metadata();
  if (outputMetadata.width !== 8192 || outputMetadata.height !== 4096) {
    throw new Error(`Salida inválida para ${scene.slug}`);
  }
  console.log(`${scene.group}/${scene.slug}: ${metadata.width}x${metadata.height} -> 8192x4096`);
}

async function main() {
  sharp.cache(false);
  sharp.concurrency(2);
  const selected = process.env.QUINTA_360_FILTER
    ? scenes.filter((scene) => scene.group === process.env.QUINTA_360_FILTER || scene.slug === process.env.QUINTA_360_FILTER)
    : scenes;
  for (const scene of selected) await processScene(scene);
  console.log(`Procesadas ${selected.length} escenas sin modificar los originales.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

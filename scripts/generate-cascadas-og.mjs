import sharp from 'sharp';

const overlay = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#051f2b" stop-opacity="1"/><stop offset=".52" stop-color="#072a36" stop-opacity="1"/><stop offset=".78" stop-color="#072a36" stop-opacity=".38"/><stop offset="1" stop-color="#072a36" stop-opacity=".08"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="72" y="78" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="5" fill="#82ddd8">CASCADAS DEL SUR</text>
  <text x="72" y="198" font-family="Arial, sans-serif" font-size="64" font-weight="800" fill="white">Terrenos de</text>
  <text x="72" y="275" font-family="Arial, sans-serif" font-size="64" font-weight="800" fill="white">200 m²</text>
  <text x="72" y="344" font-family="Arial, sans-serif" font-size="38" font-weight="700" fill="#d8e8e9">en Berriozábal</text>
  <line x1="72" x2="570" y1="405" y2="405" stroke="#58c9c6" stroke-width="3"/>
  <text x="72" y="456" font-family="Arial, sans-serif" font-size="23" font-weight="600" fill="white">Escritura pública · Financiamiento</text>
  <text x="72" y="505" font-family="Arial, sans-serif" font-size="23" font-weight="600" fill="white">Galería y recorrido 360°</text>
  <rect x="72" y="548" width="240" height="7" rx="3.5" fill="#24a8a5"/>
</svg>`);

await sharp('public/cascadas/galeria/cds-05.webp')
  .resize(1200, 630, { fit: 'cover', position: 'center' })
  .composite([{ input: overlay }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile('public/cascadas/og-cascadas.jpg');

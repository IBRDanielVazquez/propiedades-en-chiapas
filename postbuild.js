import fs from 'fs';
import path from 'path';

// 1. Cargar el index.html original del build
const indexPath = path.resolve('dist/index.html');
let content = fs.readFileSync(indexPath, 'utf-8');

// Inyectar Cache Buster en comentario HTML (preservando integridad de ES modules)
if (!content.includes('<!-- v3.')) {
    content = content.replace('</body>', `<!-- v3.9.5-CACHEBUSTED --></body>`);
} else {
    content = content.replace(/<!-- v3\.[0-9\.\-A-Z]+ -->/g, `<!-- v3.9.5-CACHEBUSTED -->`);
}

// Guardar el dist/index.html principal optimizado
fs.writeFileSync(indexPath, content);
console.log('Cache buster injected into dist/index.html');

// ==========================================================================
// 2. PRERENDER MULTI-LANDING: Generar index.html específicos para RIOJA
// ==========================================================================

const buildRiojaLandingHTML = () => {
    let riojaContent = content;
    
    // Reemplazar Título
    riojaContent = riojaContent.replace(
        /<title>[^<]+<\/title>/,
        '<title>RIOJA | Terrenos en Berriozábal con Escritura Pública</title>'
    );
    
    // Reemplazar OG Title
    riojaContent = riojaContent.replace(
        /<meta property="og:title" content="[^"]+" \/>/,
        '<meta property="og:title" content="RIOJA | Terrenos en Berriozábal con Escritura Pública" />'
    );
    
    // Reemplazar OG Description
    riojaContent = riojaContent.replace(
        /<meta property="og:description" content="[^"]+" \/>/,
        '<meta property="og:description" content="Conoce RIOJA, un desarrollo ubicado en Berriozábal con terrenos de 200 m², escritura pública, financiamiento accesible y recorrido virtual 360°." />'
    );
    
    // Reemplazar OG Image
    riojaContent = riojaContent.replace(
        /<meta property="og:image" content="[^"]+" \/>/,
        '<meta property="og:image" content="https://www.propiedadesenchiapas.com/rioja/og-image-1200x630.jpg" />'
    );
    
    // Reemplazar OG URL
    riojaContent = riojaContent.replace(
        /<meta property="og:url" content="[^"]+" \/>/,
        '<meta property="og:url" content="https://www.propiedadesenchiapas.com/rioja/" />'
    );

    const destDir = path.resolve('dist/rioja');
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(destDir, 'index.html'), riojaContent);
    console.log('Successfully generated dist/rioja/index.html with specific Open Graph metadata.');
};

const buildRioja360HTML = () => {
    let rioja360Content = content;
    
    // Reemplazar Título
    rioja360Content = rioja360Content.replace(
        /<title>[^<]+<\/title>/,
        '<title>RIOJA 360° | Recorre el desarrollo como si estuvieras ahí</title>'
    );
    
    // Reemplazar OG Title
    rioja360Content = rioja360Content.replace(
        /<meta property="og:title" content="[^"]+" \/>/,
        '<meta property="og:title" content="RIOJA 360° | Recorre el desarrollo como si estuvieras ahí" />'
    );
    
    // Reemplazar OG Description
    rioja360Content = rioja360Content.replace(
        /<meta property="og:description" content="[^"]+" \/>/,
        '<meta property="og:description" content="Explora RIOJA en un recorrido virtual 360° y conoce su ubicación, accesos y entorno desde cualquier lugar." />'
    );
    
    // Reemplazar OG Image
    rioja360Content = rioja360Content.replace(
        /<meta property="og:image" content="[^"]+" \/>/,
        '<meta property="og:image" content="https://www.propiedadesenchiapas.com/rioja/og-image-360-1200x630.jpg" />'
    );
    
    // Reemplazar OG URL
    rioja360Content = rioja360Content.replace(
        /<meta property="og:url" content="[^"]+" \/>/,
        '<meta property="og:url" content="https://www.propiedadesenchiapas.com/rioja/360/" />'
    );

    const destDir = path.resolve('dist/rioja/360');
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(destDir, 'index.html'), rioja360Content);
    console.log('Successfully generated dist/rioja/360/index.html with specific 360 Open Graph metadata.');
};

// Ejecutar generadores
buildRiojaLandingHTML();
buildRioja360HTML();

// Metadata específica para la landing de Cascadas del Sur, servida por Vercel.
const cascadasContent = content
    .replace(/<title>[^<]+<\/title>/, '<title>Terrenos de 200 m² en Berriozábal | Cascadas del Sur</title>')
    .replace(/<meta property="og:title" content="[^"]+" \/>/, '<meta property="og:title" content="Terrenos de 200 m² en Berriozábal | Cascadas del Sur" />')
    .replace(/<meta property="og:description" content="[^"]+" \/>/, '<meta property="og:description" content="Escritura pública, financiamiento y recorrido 360°. Conoce el desarrollo y consulta las condiciones vigentes." />')
    .replace(/<meta property="og:image" content="[^"]+" \/>/, '<meta property="og:image" content="https://www.propiedadesenchiapas.com/cascadas/og-cascadas.jpg" /><meta property="og:image:secure_url" content="https://www.propiedadesenchiapas.com/cascadas/og-cascadas.jpg" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta property="og:image:alt" content="Terrenos en Cascadas del Sur Residencial, Berriozábal, Chiapas" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="https://www.propiedadesenchiapas.com/cascadas/og-cascadas.jpg" /><meta name="twitter:title" content="Terrenos de 200 m² en Berriozábal | Cascadas del Sur" /><meta name="twitter:description" content="Escritura pública, financiamiento y recorrido 360°. Conoce el desarrollo y consulta las condiciones vigentes." />')
    .replace(/<meta property="og:url" content="[^"]+" \/>/, '<meta property="og:url" content="https://www.propiedadesenchiapas.com/cascadas-del-sur/" />')
    .replace('</head>', '<meta name="description" content="Terrenos residenciales desde 200 m² en Berriozábal, Chiapas, con escritura pública y financiamiento. Explora fotos, recorrido 360° y agenda una visita." /><link rel="canonical" href="https://www.propiedadesenchiapas.com/cascadas-del-sur/" /><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Cascadas del Sur Residencial","description":"Terrenos residenciales desde 200 m² con escritura pública y opciones de financiamiento en Berriozábal, Chiapas.","url":"https://www.propiedadesenchiapas.com/cascadas-del-sur/","inLanguage":"es-MX"}</script></head>')
    .replace('<div id="root"></div>', '<div id="root"><main style="max-width:760px;margin:64px auto;padding:24px;font-family:system-ui;color:#18333a"><p>Berriozábal, Chiapas</p><h1>Terrenos de 200 m² en Cascadas del Sur</h1><p>Terrenos residenciales con escritura pública y opciones de financiamiento en el corredor Tuxtla–Berriozábal. Explora fotografías, recorrido 360°, master plan y ubicación, o agenda una visita.</p><h2>Información del desarrollo</h2><p>La superficie estándar comunicada es de 200 m², equivalente a 10 × 20 m. La disponibilidad, precio y condiciones vigentes se confirman con un asesor.</p></main></div>');
const cascadasDir = path.resolve('dist/cascadas-del-sur');
fs.mkdirSync(cascadasDir, { recursive: true });
fs.writeFileSync(path.join(cascadasDir, 'index.html'), cascadasContent);
console.log('Successfully generated dist/cascadas-del-sur/index.html with specific metadata.');

// Todas las landings registran aperturas de WhatsApp mediante un único punto.
const injectWhatsappCapture = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) injectWhatsappCapture(fullPath);
        if (entry.isFile() && entry.name === 'index.html') {
            let html = fs.readFileSync(fullPath, 'utf-8');
            if (!html.includes('/whatsapp-capture.js')) {
                html = html.replace('</body>', '<script src="/whatsapp-capture.js" defer></script></body>');
                fs.writeFileSync(fullPath, html);
            }
        }
    }
};
injectWhatsappCapture(path.resolve('dist'));
console.log('WhatsApp capture enabled for every generated landing.');

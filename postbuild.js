import fs from 'fs';
import path from 'path';

// 1. Cargar el index.html original del build
const indexPath = path.resolve('dist/index.html');
let content = fs.readFileSync(indexPath, 'utf-8');

const version = Date.now();
content = content.replace(/\/assets\/app\.js(\?v=[0-9]+)?/g, `/assets/app.js?v=${version}`);
content = content.replace(/\/assets\/index\.css(\?v=[0-9]+)?/g, `/assets/index.css?v=${version}`);

// Inyectar Cache Buster
if (!content.includes('<!-- v3.')) {
    content = content.replace('</body>', `<!-- v3.9.5-CACHEBUSTED --></body>`);
} else {
    content = content.replace(/<!-- v3\.[0-9\.\-A-Z]+ -->/g, `<!-- v3.9.5-CACHEBUSTED -->`);
}

// Guardar el dist/index.html principal optimizado
fs.writeFileSync(indexPath, content);
console.log(`Cache buster injected into dist/index.html (v=${version})`);

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

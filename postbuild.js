import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('dist/index.html');
let content = fs.readFileSync(indexPath, 'utf-8');

const version = Date.now();
content = content.replace(/\/assets\/app\.js(\?v=[0-9]+)?/g, `/assets/app.js?v=${version}`);
content = content.replace(/\/assets\/index\.css(\?v=[0-9]+)?/g, `/assets/index.css?v=${version}`);
// If no comment exists, we can just append it before </body>
if (!content.includes('<!-- v3.')) {
    content = content.replace('</body>', `<!-- v3.9.5-CACHEBUSTED --></body>`);
} else {
    content = content.replace(/<!-- v3\.[0-9\.\-A-Z]+ -->/g, `<!-- v3.9.5-CACHEBUSTED -->`);
}

fs.writeFileSync(indexPath, content);
console.log(`Cache buster injected into dist/index.html (v=${version})`);

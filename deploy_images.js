/**
 * deploy_images.js — Sube /public/images/propiedades/ al FTP
 */
import * as ftp from 'basic-ftp';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: '82.29.86.157',
      user: 'u169590082.propiedadesenchiapas.com',
      password: 'AODvxdNvZR#y6]Ne',
      secure: false,
    });
    console.log('Conectado al FTP\n');

    const localDir = path.join(__dirname, 'public', 'images', 'propiedades');
    const remoteDir = '/public_html/images/propiedades';

    await client.ensureDir(remoteDir);
    console.log(`Subiendo imágenes de ${localDir} → ${remoteDir}`);
    await client.uploadFromDir(localDir, remoteDir);
    console.log('\n✅ Imágenes subidas exitosamente.');
  } catch (err) {
    console.error('Error:', err.message);
  }
  client.close();
}

deploy();

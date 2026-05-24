import * as ftp from "basic-ftp"
import * as path from "path"
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deployPrivacidad() {
    const client = new ftp.Client()
    client.ftp.verbose = false
    try {
        await client.access({
            host: "82.29.86.157",
            user: "u169590082.invierteenpropiedades.vip",
            password: "InvienPropVIP2026DVIBR151280.",
            secure: false
        })
        console.log("✓ Conectado a FTP");

        // 1. Subir aviso-privacidad.html directo en public_html (no en subcarpeta)
        const localFile = path.join(__dirname, "aviso-privacidad-standalone.html");
        await client.uploadFrom(localFile, "/public_html/aviso-privacidad.html")
        console.log("✓ aviso-privacidad.html subido en /public_html/");

        // 2. Leer el .htaccess actual
        const { createWriteStream } = await import('fs');
        const tmpPath = path.join(__dirname, "_htaccess_backup.txt");
        try {
            await client.downloadTo(tmpPath, "/public_html/.htaccess");
            console.log("✓ .htaccess descargado para backup");
        } catch(e) {
            console.log("ℹ No existe .htaccess previo");
        }

        // 3. Nuevo .htaccess: regla ANTES del fallback del SPA
        // Redirige /privacidad y /privacidad/ al archivo estático
        const htaccessContent = `# ============================================================
# Hostinger SPA + Aviso de Privacidad estático
# ============================================================
<IfModule mod_rewrite.c>
  RewriteEngine On

  # Regla 1: /privacidad → aviso-privacidad.html (PRIORIDAD ALTA)
  RewriteRule ^privacidad/?$ /aviso-privacidad.html [L,NC]

  # Regla 2: SPA fallback para todo lo demás
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`;
        const buf = Buffer.from(htaccessContent, 'utf-8');
        await client.uploadFrom(Readable.from(buf), "/public_html/.htaccess")
        console.log("✓ .htaccess actualizado con regla /privacidad");

        console.log("\n🎉 LISTO → https://propiedadesenchiapas.com/privacidad");
    }
    catch(err) {
        console.error("Error:", err.message)
    }
    client.close()
}

deployPrivacidad()

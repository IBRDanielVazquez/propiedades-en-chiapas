import * as ftp from "basic-ftp"

const htaccessContent = `<IfModule mod_headers.c>
  <FilesMatch "index\\.html$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
  </FilesMatch>
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`;

async function fixHtaccess() {
    const client = new ftp.Client()
    client.ftp.verbose = false
    try {
        await client.access({
            host: "82.29.86.157",
            user: "u169590082.propiedadesenchiapas.com",
            password: "AODvxdNvZR#y6]Ne",
            secure: false
        })
        console.log("Connected to FTP");

        const { Readable } = await import('stream');
        const stream = Readable.from(Buffer.from(htaccessContent, 'utf-8'));
        
        await client.uploadFrom(stream, "/public_html/.htaccess");
        console.log("✓ .htaccess corregido con headers anti-caché y apuntando a /index.html");
    }
    catch(err) {
        console.error("Error:", err.message)
    }
    client.close()
}

fixHtaccess()

import * as ftp from "basic-ftp"
import * as path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deployPrivacidad() {
    const client = new ftp.Client()
    client.ftp.verbose = false
    try {
        await client.access({
            host: "82.29.86.157",
            user: "u169590082.propiedadesenchiapas.com",
            password: "AODvxdNvZR#y6]Ne",
            secure: false
        })
        console.log("✓ Conectado a FTP CORRECTO");

        await client.ensureDir("/public_html/privacidad")
        
        const localFile = path.join(__dirname, "aviso-privacidad-standalone.html");
        await client.uploadFrom(localFile, "/public_html/privacidad/index.html")
        console.log("✓ HTML standalone subido a /public_html/privacidad/index.html");

        console.log("\n🎉 LISTO");
    }
    catch(err) {
        console.error("Error:", err.message)
    }
    client.close()
}
deployPrivacidad()

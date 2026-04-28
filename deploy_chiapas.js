import * as ftp from "basic-ftp"
import * as path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: "82.29.86.157",
            user: "u169590082.propiedadesenchiapas.com",
            password: "PropenChiapas2026DVIBR151280.",
            secure: false
        })
        console.log("Connected to Propiedades en Chiapas FTP");
        const distDir = path.join(__dirname, "dist");
        
        // Creando una carpeta segura "nuevo" para no romper el WordPress en vivo
        await client.ensureDir("/public_html/nuevo")
        await client.uploadFromDir(distDir, "/public_html/nuevo")
        
        console.log("Deploy finished successfully.");
    }
    catch(err) {
        console.log("Error deploying: ", err)
    }
    client.close()
}

deploy()

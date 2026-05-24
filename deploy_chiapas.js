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
            password: "AODvxdNvZR#y6]Ne",
            secure: false
        })
        console.log("Connected to Propiedades en Chiapas FTP");
        const distDir = path.join(__dirname, "dist");
        
        // Subiendo selectivamente solo los archivos actualizados de la SPA y el nuevo módulo
        console.log("Uploading index.html...");
        await client.uploadFrom(path.join(distDir, "index.html"), "/public_html/index.html");

        console.log("Uploading assets...");
        await client.ensureDir("/public_html/assets");
        await client.uploadFromDir(path.join(distDir, "assets"), "/public_html/assets");

        // Removed ensuring development folders as it conflicts with React Router
        
        console.log("Deploy finished successfully.");
    }
    catch(err) {
        console.log("Error deploying: ", err)
    }
    client.close()
}

deploy()

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
        console.log("Connected to FTP");
        const distDir = path.join(__dirname, "dist");
        
        console.log("Uploading bella-vista landing...");
        await client.ensureDir("/public_html/bella-vista-terrenos-en-ocozocoautla-en-pagos");
        await client.uploadFromDir(path.join(distDir, "bella-vista-terrenos-en-ocozocoautla-en-pagos"), "/public_html/bella-vista-terrenos-en-ocozocoautla-en-pagos");
        
        console.log("Deploy finished successfully.");
    }
    catch(err) {
        console.log("Error deploying: ", err)
    }
    client.close()
}

deploy()

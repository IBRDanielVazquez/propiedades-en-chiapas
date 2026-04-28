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
            user: "u169590082.invierteenpropiedades.vip",
            password: "InvienPropVIP2026DVIBR151280.",
            secure: false
        })
        console.log("Connected to FTP server");
        const distDir = path.join(__dirname, "dist");
        
        // Hostinger public directory is typically "public_html" or similar, 
        // but the user's config says remotePath: "/". 
        // Often "/" maps directly to the public folder in Hostinger FTP for add-on domains.
        // Let's clear the destination folder first (optional, maybe just upload and overwrite)
        await client.ensureDir("/public_html")
        await client.uploadFromDir(distDir, "/public_html")
        
        console.log("Deploy finished successfully.");
    }
    catch(err) {
        console.log("Error deploying: ", err)
    }
    client.close()
}

deploy()

import * as ftp from "basic-ftp"
import * as path from "path"
import { fileURLToPath } from 'url';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function download() {
    const client = new ftp.Client()
    client.ftp.verbose = false
    try {
        await client.access({
            host: "82.29.86.157",
            user: "u169590082.propiedadesenchiapas.com",
            password: "PropenChiapas2026DVIBR151280.",
            secure: false
        })
        console.log("Connected to FTP server");
        
        const localDir = path.join(__dirname, "wpresidence_original");
        if (!fs.existsSync(localDir)) {
            fs.mkdirSync(localDir);
        }
        
        console.log("Downloading wpresidence theme folder. This might take a while...");
        await client.downloadToDir(localDir, "/public_html/wp-content/themes/wpresidence");
        
        console.log("Download complete!");
    }
    catch(err) {
        console.log("Error downloading: ", err)
    }
    client.close()
}

download()

import * as ftp from "basic-ftp"

async function deploy() {
    const client = new ftp.Client()
    // client.ftp.verbose = true
    try {
        await client.access({
            host: "82.29.86.157",
            user: "u169590082.propiedadesenchiapas.com",
            password: "AODvxdNvZR#y6]Ne",
            secure: false
        })
        console.log("Connected to Propiedades en Chiapas FTP");
        
        await client.ensureDir("/public_html/ibr-dashboard");
        await client.uploadFrom("/Users/danielvazquez/.gemini/antigravity/scratch/ibr-dashboard/index.html", "/public_html/ibr-dashboard/index.html");
        
        console.log("Deploy finished successfully.");
    }
    catch(err) {
        console.log("Error deploying: ", err)
    }
    client.close()
}

deploy()

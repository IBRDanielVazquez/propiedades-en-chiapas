import * as ftp from "basic-ftp"

async function cleanAndDeploy() {
    const client = new ftp.Client()
    try {
        await client.access({
            host: "82.29.86.157",
            user: "u169590082.propiedadesenchiapas.com",
            password: "AODvxdNvZR#y6]Ne",
            secure: false
        })
        console.log("Connected to FTP for cleanup");
        
        try { await client.remove("/public_html/ibr-dashboard/.in.logo-ibr.png."); } catch(e) {}
        try { await client.remove("/public_html/ibr-dashboard/.in.index.html."); } catch(e) {}
        try { await client.remove("/public_html/ibr-dashboard/.in.citas-historico.json."); } catch(e) {}
        try { await client.remove("/public_html/ibr-dashboard/.in.historico-ventas.html."); } catch(e) {}
        try { await client.remove("/public_html/ibr-dashboard/.in.ibr-historico-ventas.json."); } catch(e) {}

        console.log("Cleanup done. Now deploying...");
        
        await client.ensureDir("/public_html/ibr-dashboard");
        await client.uploadFrom("public/ibr-dashboard/index.html", "/public_html/ibr-dashboard/index.html");
        await client.uploadFrom("public/ibr-dashboard/logo-ibr.png", "/public_html/ibr-dashboard/logo-ibr.png");
        await client.uploadFrom("public/ibr-dashboard/citas-historico.json", "/public_html/ibr-dashboard/citas-historico.json");
        await client.uploadFrom("public/ibr-dashboard/historico-ventas.html", "/public_html/ibr-dashboard/historico-ventas.html");
        await client.uploadFrom("public/ibr-dashboard/ibr-historico-ventas.json", "/public_html/ibr-dashboard/ibr-historico-ventas.json");
        
        console.log("Deploy finished successfully.");
    }
    catch(err) {
        console.log("Error deploying: ", err)
    }
    client.close()
}

cleanAndDeploy()

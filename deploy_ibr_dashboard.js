import * as ftp from "basic-ftp"

// SEGURIDAD: las credenciales FTP ya NO van en el código.
// Definirlas en .env (no subir a Git) o exportarlas antes de ejecutar:
//   FTP_HOST, FTP_USER, FTP_PASSWORD
// La contraseña que estaba escrita aquí quedó expuesta en el historial de Git:
// hay que ROTARLA en el panel de hosting antes del próximo deploy.

// Archivos sensibles que existían en el servidor y deben borrarse en el próximo deploy
const REMOTE_FILES_TO_DELETE = [
    "/public_html/ibr-dashboard/citas-historico.json",
    "/public_html/ibr-dashboard/ibr-historico-ventas.json",
    "/public_html/ibr-dashboard/apps_script_completo.md",
    "/public_html/ibr-dashboard/test_script.js",
    "/public_html/ibr-dashboard/index.html.bak",
    "/public_html/ibr-dashboard/index.html.bak2",
    "/public_html/ibr-dashboard/index.html.bak3",
    "/public_html/ibr-dashboard/index_backup.html",
    "/public_html/ibr-dashboard/index_backup_before_embed.html",
];

async function deploy() {
    const { FTP_HOST, FTP_USER, FTP_PASSWORD } = process.env;
    if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
        console.error("Faltan variables de entorno: FTP_HOST, FTP_USER y FTP_PASSWORD son obligatorias.");
        process.exit(1);
    }

    const client = new ftp.Client()
    try {
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASSWORD,
            secure: false
        })
        console.log("Connected to Propiedades en Chiapas FTP");

        await client.ensureDir("/public_html/ibr-dashboard");
        // Solo se publican las pantallas bloqueadas y el logo — nada de datos
        await client.uploadFrom("public/ibr-dashboard/index.html", "/public_html/ibr-dashboard/index.html");
        await client.uploadFrom("public/ibr-dashboard/historico-ventas.html", "/public_html/ibr-dashboard/historico-ventas.html");
        await client.uploadFrom("public/ibr-dashboard/logo-ibr.png", "/public_html/ibr-dashboard/logo-ibr.png");

        // Limpieza: borrar del servidor los archivos con datos de clientes/PINs
        for (const remotePath of REMOTE_FILES_TO_DELETE) {
            try {
                await client.remove(remotePath);
                console.log("Eliminado del servidor:", remotePath);
            } catch {
                // El archivo ya no existe en el servidor — no es un error
            }
        }

        console.log("Deploy finished successfully.");
    }
    catch(err) {
        console.log("Error deploying: ", err)
    }
    client.close()
}

deploy()

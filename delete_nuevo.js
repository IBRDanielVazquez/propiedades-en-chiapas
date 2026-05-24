import * as ftp from "basic-ftp"

async function deleteFolder() {
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

        async function removeDirRecursive(dirPath) {
            console.log("Reading directory:", dirPath);
            const list = await client.list(dirPath).catch(() => []);
            for (const file of list) {
                const fullPath = `${dirPath}/${file.name}`;
                if (file.isDirectory) {
                    await removeDirRecursive(fullPath);
                } else {
                    console.log("Deleting file:", fullPath);
                    await client.remove(fullPath).catch(() => {});
                }
            }
            console.log("Deleting directory:", dirPath);
            await client.removeDir(dirPath).catch(() => {});
        }

        await removeDirRecursive("/public_html/nuevo");
        console.log("✓ Carpeta /public_html/nuevo eliminada exitosamente.");
    }
    catch(err) {
        console.error("Error:", err.message)
    }
    client.close()
}

deleteFolder()

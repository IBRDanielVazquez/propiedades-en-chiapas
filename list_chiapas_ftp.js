import * as ftp from "basic-ftp"

async function list() {
    const client = new ftp.Client()
    try {
        await client.access({
            host: "82.29.86.157",
            user: "u169590082.propiedadesenchiapas.com",
            password: "PropenChiapas2026DVIBR151280.",
            secure: false
        })
        const list = await client.list("/public_html")
        console.log("Files in public_html:")
        console.log(list.map(item => item.name).join("\n"))
        
        // Try to list wp-content/themes to see if WP Residence is there
        try {
            const themes = await client.list("/public_html/wp-content/themes")
            console.log("\nThemes installed:")
            console.log(themes.map(t => t.name).join("\n"))
        } catch (e) {
            console.log("No wp-content/themes found.")
        }
    }
    catch(err) {
        console.log("Error: ", err)
    }
    client.close()
}
list()

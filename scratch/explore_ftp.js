import * as ftp from "basic-ftp"

async function explore() {
    const client = new ftp.Client()
    try {
        await client.access({
            host: "82.29.86.157",
            user: "u169590082.invierteenpropiedades.vip",
            password: "InvienPropVIP2026DVIBR151280.",
            secure: false
        })
        console.log("Connected!")

        const targets = [
            "/domains",
            "/home",
            "/public_html/domains",
            "../domains",
            "../../",
            "../../../"
        ]

        for (const target of targets) {
            try {
                console.log(`Listing ${target}:`)
                const list = await client.list(target)
                console.log(list.map(item => `${item.name} (${item.type})`).join("\n"))
            } catch (e) {
                console.log(`Failed for ${target}:`, e.message)
            }
        }
    }
    catch(err) {
        console.log("Error: ", err)
    }
    client.close()
}
explore()

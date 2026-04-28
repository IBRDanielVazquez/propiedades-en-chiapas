import * as ftp from "basic-ftp"

async function list() {
    const client = new ftp.Client()
    try {
        await client.access({
            host: "82.29.86.157",
            user: "u169590082.invierteenpropiedades.vip",
            password: "InvienPropVIP2026DVIBR151280.",
            secure: false
        })
        const list = await client.list("/")
        console.log(list.map(item => item.name).join("\n"))
    }
    catch(err) {
        console.log("Error: ", err)
    }
    client.close()
}
list()

import * as ftp from "basic-ftp"

async function test() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: "82.29.86.157",
            user: "u169590082.propiedadesenchiapas.com",
            password: "AODvxdNvZR#y6]Ne",
            secure: false
        })
        console.log("Connected successfully!")
        
        console.log("Listing /public_html:")
        const listRoot = await client.list("/public_html")
        console.log(listRoot.map(item => `${item.name} (${item.type})`).join("\n"))
        
        try {
            console.log("Listing /public_html/nuevo:")
            const listNuevo = await client.list("/public_html/nuevo")
            console.log(listNuevo.map(item => `${item.name} (${item.type})`).join("\n"))
        } catch (e) {
            console.log("Failed to list /public_html/nuevo:", e.message)
        }
    }
    catch(err) {
        console.log("Error: ", err)
    }
    client.close()
}

test()

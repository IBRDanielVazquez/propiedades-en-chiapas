import * as ftp from "basic-ftp"

async function test() {
    const combinations = [
        { user: "u169590082.propiedadesenchiapas.com", pass: "PropenChiapas2026DVIBR151280." },
        { user: "u169590082.propiedadesenchiapas.com", pass: "InvienPropVIP2026DVIBR151280." },
        { user: "u169590082.propiedadesenchiapas.com", pass: "PropenChiapas2026DVIBR151280" },
        { user: "u169590082", pass: "PropenChiapas2026DVIBR151280." },
        { user: "u169590082", pass: "InvienPropVIP2026DVIBR151280." },
    ]

    for (const combo of combinations) {
        console.log(`Testing user: ${combo.user} with password: ${combo.pass}`)
        const client = new ftp.Client()
        try {
            await client.access({
                host: "82.29.86.157",
                user: combo.user,
                password: combo.pass,
                secure: false
            })
            console.log(`>>> SUCCESS: Connected with ${combo.user} / ${combo.pass}`)
            const list = await client.list("/")
            console.log("Root files:", list.map(item => item.name).join(", "))
            client.close()
            break
        } catch (err) {
            console.log(`Failed: ${err.message}`)
        }
        client.close()
    }
}

test()

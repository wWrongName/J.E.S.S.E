import eventEmitter from "./eventEmitter"


class Settings {
    constructor () {
        let glob = {
            privateKey : {
                name : "Private key",
                data : ""
            },
            language : {
                name : "Default language",
                data : ["English", "Русский"],
                active : 0
            },
            compiler : {
                name : "Compiler version",
                data : ["0.8.16", "0.8.17"],
                active : 0
            },
            defaultNetwork : {
                name : "Default network",
                data : ["localhost", "ropsten"],
                active : 0
            },
            defPath : {
                name : "Default work space",
                data : "",
                path : true
            }
        }
        
        const settingsOrder = ["privateKey", "defPath", "language", "compiler", "defaultNetwork"]
        
        this.glob = settingsOrder.reduce((prev, cur, i) => {
            prev[cur] = glob[cur]
            return prev
        }, {})

        eventEmitter.subscribe("settings", setting => {
            let globData = this.glob[setting.name].data
            if (typeof globData === "object" && Array.isArray(globData))
                this.glob[setting.name].active = setting.value
            else
                this.glob[setting.name].data = setting.value
        })
    }
}

const settings = new Settings()

export {
    settings
}

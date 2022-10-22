import eventEmitter from "./eventEmitter"


class Settings {
    constructor () {
        this.glob = {
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
                data : ""
            },
            defaultNetwork : {
                name : "Default network",
                data : ["localhost", "ropsten"],
                active : 0
            },
            defPath : {
                name : "Default work space",
                data : ""
            }
        }
        
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

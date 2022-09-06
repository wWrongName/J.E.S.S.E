const { ipcRenderer, contextBridge } = require("electron")


contextBridge.exposeInMainWorld(
    "ipc", {
        send: (channel, data) => {
            let validChannels = ["close", "minimize", "maximize"]
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data)
            }
        },
        receive: (channel, func) => {
            let validChannels = []
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args))
            }
        }
    }
)

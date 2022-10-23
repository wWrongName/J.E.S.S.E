const { ipcRenderer, contextBridge } = require("electron")


contextBridge.exposeInMainWorld(
    "ipc", {
        send: (channel, data) => {
            let validChannels = ["close", "minimize", "maximize", "open-dialog"]
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data)
            }
        },
        receive: (channel, func) => {
            let validChannels = ["open-dialog"]
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, func)
            }
        }
    }
)

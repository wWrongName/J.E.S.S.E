const { ipcRenderer, contextBridge } = require("electron")


window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

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

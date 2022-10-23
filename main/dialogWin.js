const { ipcMain, dialog } = require("electron")

module.exports = (mainWindow) => {
    ipcMain.addListener("open-dialog", (e, property) => {
        dialog.showOpenDialog({ properties: ["openDirectory"] }).then(res => {
            if (!res.canceled)
                mainWindow.webContents.send("open-dialog", {prop: property, path : res.filePaths[0]})
        })
    })
}

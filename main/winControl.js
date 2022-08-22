const { ipcMain } = require("electron")

let maximized = false

module.exports = (mainWindow) => {
    ipcMain.addListener("close", () => {
        mainWindow.close()
    })
    
    ipcMain.addListener("minimize", () => {
        mainWindow.minimize()
    })
    
    ipcMain.addListener("maximize", () => {
        maximized ? mainWindow.unmaximize() : mainWindow.maximize()
        maximized = !maximized
    })
}

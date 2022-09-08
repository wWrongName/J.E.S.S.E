const { ipcMain } = require("electron")

module.exports = (mainWindow) => {
    ipcMain.addListener("close", () => {
        mainWindow.close()
    })
    
    ipcMain.addListener("minimize", () => {
        mainWindow.minimize()
    })
    
    ipcMain.addListener("maximize", () => {
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
    })
}

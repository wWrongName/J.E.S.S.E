const { app, BrowserWindow } = require('electron')
const path = require('path')

const winControl = require("./winControl")

const config = require(path.join(__dirname, "../config"))


const createWindow = () => {
    const mainWindow = new BrowserWindow({
        frame: false,
        width: 800,
        height: 600,
        minWidth: config.window.minWAside + config.window.minWPages,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (config.mode === "development")
        mainWindow.loadURL(`http://localhost:${config.port}`)
    else
        mainWindow.loadFile(path.join(__dirname, "../public/index.html"))

    winControl(mainWindow)
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
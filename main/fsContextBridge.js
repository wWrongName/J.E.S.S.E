const { contextBridge } = require("electron")
const fs = require("fs")
const path = require("path")


let currentDir = __dirname

let changePath = function (folderName) {
    currentDir = path.join(currentDir, folderName)
}

let getFolderContent = function () {
    return new Promise((resolve, reject) => {
        fs.readdir(currentDir, {withFileTypes: true, encoding: "utf-8"}, (err, files) => {
            if (err) {
                console.log(err)
                reject({err: err, content: []})
                return
            }
            resolve({content: files.map(file => {
                let direntType
                if (file.isDirectory())
                    direntType = {isDir : true}
                if (file.isFile())
                    direntType = {isFile : true}
                return {
                    ...direntType,
                    name : file.name
                }
            })})
        })
    })
}

contextBridge.exposeInMainWorld(
    "fs", {
        getCurrentPath: () => currentDir,
        getCurrentFolderContent: () => getFolderContent(),
        openFolder: (folderName) => changePath(folderName),
        closeFolder: () => changePath(".."),
    }
)

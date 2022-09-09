const { contextBridge } = require("electron")
const fs = require("fs")
const path = require("path")


let currentDir = __dirname
let previousDir = currentDir

let changePath = function (folderName="") {
    previousDir = currentDir
    currentDir = path.join(currentDir, folderName)
}

let goBack = function () {
    [previousDir, currentDir] = [currentDir, previousDir]
}

let getFolderContent = function (dirPath=currentDir) {
    if (Array.isArray(dirPath))
        dirPath = dirPath.reduce((prev, cur) => path.join(prev, cur), "")
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, {withFileTypes: true, encoding: "utf-8"}, (err, files) => {
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

let pathJoin = function (...args) {
    if (Array.isArray(args))
        return args.reduce((prev, cur) => path.join(prev, cur), "")
    return path.join(args)
}


contextBridge.exposeInMainWorld(
    "fs", {
        pathJoin,
        getCurrentPath: () => currentDir,
        getCurrentFolderContent: () => getFolderContent(),
        getSpecialFolderContent: (specialPath) => getFolderContent(specialPath),
        openFolder: (folderName) => changePath(folderName),
        closeFolder: () => changePath(".."),
        goBack: () => goBack()
    }
)

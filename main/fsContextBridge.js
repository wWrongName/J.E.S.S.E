const { contextBridge } = require("electron")
const fs = require("fs")
const path = require("path")

const config = require(path.join(__dirname, "../config"))


let dirHistory = [__dirname]

let getCurrentPath = () => dirHistory[dirHistory.length - 1]

let pathJoin = function (args) {
    if (Array.isArray(args)) {
        if (!args.length)
            return getCurrentPath()
        if (args.length === 1)
            return args[0]
        return args.reduce((prev, cur) => path.join(prev, cur), "")
    }
    return path.join(args)
}

let changePath = function (folderName="") {
    let end = dirHistory.length - 1
    let newPath = path.join(dirHistory[end], folderName)
    let pathRelative = path.relative(newPath, dirHistory[end])

    dirHistory.push(newPath)
    dirHistory[end] = pathRelative

    if (dirHistory.length > config.path_history_size)
        dirHistory.unshift()
}

let goBack = function () {
    let end = dirHistory.length - 1
    let newPath = path.join(dirHistory[end], dirHistory[end - 1])
    dirHistory.splice(dirHistory.length - 2, 2, newPath)
}

let getFolderContent = function (dirPath=[getCurrentPath()]) {
    return new Promise((resolve, reject) => {
        fs.readdir(pathJoin(dirPath), {withFileTypes: true, encoding: "utf-8"}, (err, files) => {
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

let writeFile = function (fileName, text) {
    return new Promise((resolve, reject) => {
        const data = new Uint8Array(Buffer.from(text))
        fs.writeFile(path.join(getCurrentPath(), fileName), data, err => {
            if (err) {
                console.log(err)
                reject({err: err})
                return
            }
            resolve({success: true})
        })
    })
}

let createFolder = function (folderName) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path.join(getCurrentPath(), folderName), err => {
            if (err) {
                console.log(err)
                reject({err: err})
                return
            }
            resolve({success: true})
        })
    })
}

let deleteDirent = function (dirent) {
    return new Promise((resolve, reject) => {
        if (dirent.isDir)
            fs.rmdir(path.join(getCurrentPath(), dirent.name), err => {
                if (err) {
                    console.log(err)
                    reject({err: err})
                    return
                }
                resolve({success: true})
            })
        fs.unlink(path.join(getCurrentPath(), dirent.name), err => {
            if (err) {
                console.log(err)
                reject({err: err})
                return
            }
            resolve({success: true})
        })
    })
}

contextBridge.exposeInMainWorld(
    "fs", {
        getSpecialFolderContent: getFolderContent,
        openFolder: (folderName) => changePath(folderName),
        closeFolder: () => changePath(".."),
        getCurrentFolderContent: getFolderContent,
        createFile: fileName => writeFile(fileName, ""),
        createFolder: folderName => createFolder(folderName),
        delete: direntName => deleteDirent(direntName),
        getSep : path.sep,
        getCurrentPath,
        pathJoin,
        goBack
    }
)

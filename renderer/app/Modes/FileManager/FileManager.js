import React, { useEffect, useState } from "react"
import _ from "lodash"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotateLeft, faQuestion, faBoxOpen, faFolderOpen, faRectangleXmark, faTrash, faFolder, faFileLines } from '@fortawesome/free-solid-svg-icons'

import ErrorModal from "../../../shared/components/Modal/ErrorModal"

import "./fileManager.css"

const FILE_MANAGER_DIRENT_CLASS = "click-class"


function FileManagerPage (props) {

    let getFolderContent = function () {
        window.fs.getCurrentFolderContent()
        .then(res => {
            setActiveDirent()
            setLocalDirents(res.content)
        })
        .catch(e => {
            setModalBody(e.err.toString())
        })
    }

    useEffect(getFolderContent, [])

    let [modalBody, setModalBody] = useState()
    let [activeDirent, setActiveDirent] = useState()
    let [localDirents, setLocalDirents] = useState([])

    let controls = {
        openProject : {
            name : "open project",
            icon : <FontAwesomeIcon icon={faBoxOpen} />,
            action : () => {
                let projectRoot = _.cloneDeep(localDirents[activeDirent])
                openFolder(localDirents[activeDirent])
                openProject(projectRoot)
            }
        },
        openFolder : {
            name : "open folder",
            icon : <FontAwesomeIcon icon={faFolderOpen} />,
            action : () => openDirent(localDirents[activeDirent])
        },
        closeFolder : {
            name : "close folder",
            icon : <FontAwesomeIcon icon={faRectangleXmark} />,
            action : () => closeFolder()
        },
        deleteDirent : {
            name : "delete",
            icon : <FontAwesomeIcon icon={faTrash} />,
            action : undefined
        },
        goBack : {
            name : "back",
            icon : <FontAwesomeIcon icon={faRotateLeft} />,
            action : () => goBack()
        }
    }
    let controlOrder = ["openProject", "openFolder", "closeFolder", "goBack", "deleteDirent"]

    let renderDirent = function (dirent, index) {
        let icon
        if (dirent.isFile)
            icon = <FontAwesomeIcon icon={faFileLines} />
        else if (dirent.isDir)
            icon = <FontAwesomeIcon icon={faFolder} />
        else 
            icon = <FontAwesomeIcon icon={faQuestion} />
        return (
            <div className={`mx-auto p-2 dir-ent-button ${FILE_MANAGER_DIRENT_CLASS}`} 
                onClick={() => setActiveDirent(index)} 
                onDoubleClick={() => openDirent(dirent)}
                active-dirent={(activeDirent === index).toString()}
                key={index}
            >
                <div className={`dir-ent-icon d-flex justify-content-center  ${FILE_MANAGER_DIRENT_CLASS}`}>
                    {icon}
                </div>
                <div className={`d-flex justify-content-center ${FILE_MANAGER_DIRENT_CLASS}`}>
                    {dirent.name}
                </div>
            </div>
        )
    }

    let openDirent = function (dirent) {
        if (!dirent)
            return
        if (dirent.isDir)
            openFolder(dirent.name)
        else if (dirent.isFile)
            openFile(dirent.name)
        else {
            if(openFolder(dirent.name) === -1)
                openFile(dirent.name)
        }
    }

    let openFolder = function (folderName) {
        try {
            window.fs.openFolder(folderName)
            getFolderContent()
        } catch (e) {
            return -1
        }
    }

    let closeFolder = function () {
        try {
            window.fs.closeFolder()
            getFolderContent()
        } catch (e) {
            return -1
        }
    }

    let goBack = function () {
        try {
            window.fs.goBack()
            getFolderContent()
        } catch (e) {
            return -1
        }
    }
    
    let openFile = function (fileName) {
        console.log("open file")
    }

    let openProject = function (dirent) {
        let projectObj = {
            rootDir : window.fs.getCurrentPath(),
            tree : [
                // {type} : true/false,
                // name : ""
                // content : []
            ]
        }
        fillFileTree([projectObj.rootDir], []).then(res => {
            projectObj.tree = res
            console.log(res)
            props.state.setProjectFiles(projectObj)
            props.state.openPage("editor")
        })
    }

    let fillFileTree = function (dirPath, objPathIndexes) {
        return new Promise(resolve => {
            let treeNode = []
            let promises = [], indexes = []
            window.fs.getSpecialFolderContent(dirPath)
            .then(dirents => {
                dirents.content.forEach((dirent, index) => {
                    let nestedTreeNode = {name: dirent.name}
                    if (dirent.isFile && objPathIndexes.length) 
                        nestedTreeNode.index = objPathIndexes
                    if (dirent.isDir) {
                        indexes.push(index)
                        promises.push(fillFileTree(dirPath.concat(dirent.name), objPathIndexes.concat([index])))
                    }
                    treeNode.push(nestedTreeNode)
                })
                Promise.all(promises).then(res => {
                    res.map((fileTree, index) => treeNode[indexes[index]].content = fileTree)
                    resolve(treeNode)
                })
            })
            .catch(e => {
                // call errModal
                resolve([])
            })
        })
    }

    let handlePageClick = function (e) {
        try {
            if (e.target.className.search(FILE_MANAGER_DIRENT_CLASS) === -1)
                setActiveDirent()
        } catch (e) {}
    }

    let itemsLen = localDirents.length

    return(
        <>
            <ErrorModal modalbody={modalBody} onHide={() => setModalBody()} show={modalBody}/>
            <div className="pb-3 h-100 overflow-auto" onClickCapture={handlePageClick}>
                <div className={`d-flex justify-content-center align-items-center fm-header`}>
                    {controlOrder.map((controller, index) => {
                        let button = controls[controller]
                        return(
                            <div className={`mx-2 file-manager-controller text-center ${FILE_MANAGER_DIRENT_CLASS}`} onClick={button.action}>
                                {button.icon} {button.name}
                            </div>
                        )
                    })}
                </div>
                {/* <div className="light-divider mx-5"></div> */}
                <div className="d-flex flex-wrap mx-4 my-5 pt-4">
                    {localDirents.map((dirent, index) => {
                        return renderDirent(dirent, index)
                    })}
                </div>
                <div className="fm-footer py-2 px-5 d-flex justify-content-between align-items-center"> 
                    <div className="text-truncate w-75">
                        {window.fs.getCurrentPath()}
                    </div>
                    <div className={`text-center`}>
                        {localDirents.length} {itemsLen === 1 ? "item" : "items"}
                    </div>
                </div>
            </div>
        </> 
    )
}

function FileManagerAside (props) {
    return(
        <>fileManagerAside</>
    )
}

export {
    FileManagerAside,
    FileManagerPage
}

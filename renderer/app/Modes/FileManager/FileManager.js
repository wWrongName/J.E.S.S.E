import React, { useEffect, useState } from "react"
import _ from "lodash"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotateLeft, faQuestion, faBoxOpen, faFolderOpen, faRectangleXmark, faTrash, faFolder, faFileLines, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'

import ErrorModal from "../../../shared/components/Modal/ErrorModal"

import "./fileManager.css"
import traverseAndRender from "../../../shared/utils/traverseAndRender"

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
                if (activeDirent !== undefined)
                    openFolder(localDirents[activeDirent].name)
                openProject()
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

    let openProject = function () {
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
                        nestedTreeNode.indexes = objPathIndexes
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
                            <div className={`mx-2 file-manager-controller text-center ${FILE_MANAGER_DIRENT_CLASS}`} onClick={button.action} key={index}>
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
                        {itemsLen} {itemsLen === 1 ? "item" : "items"}
                    </div>
                </div>
            </div>
        </> 
    )
}

function FileManagerAside (props) {

    let chevronOpenClose = function (id) {
        let el1 = document.querySelector(`.${id} .aside-fs-group-header .aside-chevron`)
        let el = document.querySelector(`.${id} .chevron-after`)

        if (el.getAttribute("opened") === "false") {
            el.setAttribute("opened", "true")
            el.style.height = "max-content"
            el1.style.transform = `rotate(90deg)`
        } else {
            el.setAttribute("opened", "false")
            el.style.height = 0
            el1.style.transform = `rotate(0)`
        }
    }

    let compareIndexes = function (indexex0, indexes1) {
        if (indexex0.length === indexes1.length)
            return indexex0.every((el, i) => el === indexes1[i])
        return false
    }

    let fileIsNotOpened = function (dirent) {
        if (dirent.indexes)
            return props.state.openedFiles.find(file => compareIndexes(file.indexes, dirent.indexes) && dirent.name === file.name) === undefined
        return props.state.openedFiles.find(file => file.name === dirent.name) === undefined
    }

    let setPath = function (dirent) {
        let {rootDir, tree} = props.state.projectFiles
        tree = _.cloneDeep(tree)
        return dirent.indexes.reduce((prevString, curIndex) => {
            let newPath = window.fs.pathJoin(prevString, tree[curIndex].name)
            tree = tree[curIndex].content
            return newPath
        }, rootDir)
    }

    let setOpenedFiles = function (path, dirent) {
        let openedFiles = props.state.openedFiles
        openedFiles.push({
            name : dirent.name,
            path : path,
            indexes : dirent.indexes
        })
        props.state.setOpenedFiles(openedFiles)
        props.state.setProjectFiles({...props.state.projectFiles, forceUpd : true})
    }

    let openFile = function (dirent) {
        if (fileIsNotOpened(dirent)) {
            if (dirent.indexes) {
                setOpenedFiles(setPath(dirent), dirent)
            } else {
                setOpenedFiles(props.state.projectFiles.rootDir, dirent)
            }
        }
    }

    let [openDirs, setOpenDirs] = useState([])

    let renderFileTree = function (groupList) {
        let expDir = function (indexes) {
            let filtered = openDirs.filter(el => el !== indexes)
            if (filtered.length !== openDirs.length)
                setOpenDirs(filtered)
            else {
                openDirs.push(indexes)
                setOpenDirs(openDirs)
                props.state.setProjectFiles({...props.state.projectFiles, forceUpd : !props.state.projectFiles.forceUpd})
            }
        }

        let listUI = traverseAndRender(groupList, (dirent, indexes) => {
            let offset = indexes.map(() => <div className="ps-2"></div>)
            offset.push(<div className="ps-2"></div>)
            indexes = indexes.toString()
        
            if (!dirent.content) // this is File
                return( 
                    <div key={indexes} className="d-flex aside-fs-dirent" onDoubleClick={() => openFile(dirent)}>
                        {offset}
                        <div>
                            {dirent.name}
                        </div>
                    </div>
                )
            if (dirent.content) { // this is Directory
                return (
                    <div key={indexes} className="d-flex aside-fs-dirent" onClick={() => {expDir(indexes)}}>
                        {offset}
                        <div className={`d-flex align-items-center`}>
                            <FontAwesomeIcon icon={faChevronRight} className="aside-chevron"/>
                            <div className="ms-2">{dirent.name}</div>
                        </div>
                    </div>
                )
            }
        }, [], openDirs)

        return(listUI)
    }

    let renderAsideGroup = function (title, groupList) {
        let id = "chevron-" + title
        return(
            <div className={id}>
                <div className={`d-flex align-items-center aside-fs-group-header ms-2 mt-1 ${title}`} onClick={() => {chevronOpenClose(id)}}>
                    <FontAwesomeIcon icon={faChevronRight} className="aside-chevron" opened="true"/>
                    <div className="ms-2">{title}</div>
                </div>
                <div className="chevron-after d-flex">
                    <div className="w-100">
                        {renderFileTree(groupList)}
                    </div>
                </div> 
                <div className="aside-divider ms-4 me-2 mt-1" />
            </div>
        )
    }

    let projectContent = props.state.projectFiles.tree ? props.state.projectFiles.tree : []

    return(
        <div className="py-1 overflow-auto aside-fs-card">
            {renderAsideGroup("open", props.state.openedFiles)}
            {renderAsideGroup("project", projectContent)}
        </div>
    )
}

export {
    FileManagerAside,
    FileManagerPage
}

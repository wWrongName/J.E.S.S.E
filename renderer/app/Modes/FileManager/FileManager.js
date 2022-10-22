import React, { useEffect, useState } from "react"
import _ from "lodash"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotateLeft, faQuestion, faBoxOpen, faFolderOpen, faRectangleXmark, faTrash, faFolder, faFileLines, faChevronRight, faPlusCircle, faFolderClosed, faFile, faFileCirclePlus, faFolderPlus, faX, faXmark } from '@fortawesome/free-solid-svg-icons'

import ErrorModal from "../../../shared/components/Modal/ErrorModal"
import eventEmitter from "../../../shared/utils/eventEmitter"

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
            try {
                setModalBody(e.err.toString())
            } catch (err) {
                setModalBody(e.toString())
            }
        })
    }

    useEffect(getFolderContent, [])
    const [pageCompact, setPageCompact] = useState(false)
    useEffect(() => {
        return eventEmitter.subscribe("drag_aside_border", borderOffset => {
            setPageCompact((window.innerWidth - borderOffset < 520).toString())
        })
    }, [])

    let [modalBody, setModalBody] = useState()
    let [activeDirent, setActiveDirent] = useState()
    let [localDirents, setLocalDirents] = useState([])

    let controls = {
        openProject : {
            name : "open project",
            icon : <FontAwesomeIcon icon={faBoxOpen} />,
            action : () => {
                let folderRes = 0
                if (activeDirent !== undefined)
                    folderRes = openFolder(localDirents[activeDirent].name)
                if (folderRes === 0)
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
            action : () => {
                window.fs.delete(localDirents[activeDirent])
                .then(() => getFolderContent())
            }
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
            let res = window.fs.openFolder(folderName)
            if (res === -1)
                return res
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
        props.state.setOpenedFiles([])
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

    let [mkDirentForm, chMkDirentForm] = useState(false)

    let handlePageClick = function (e) {
        try {
            if (e.target.className.search(FILE_MANAGER_DIRENT_CLASS) === -1)
                setActiveDirent()
        } catch (e) {}
    }

    let validateFileName = function (name) {
        return name
    }

    let validateFolderName = function (name) {
        return name
    }

    let createDirent = function (type) {
        let promise
        if (type === "file") {
            promise = window.fs.createFile(validateFileName(document.getElementById("fs-create-file").value))
        }
        if (type === "folder") {
            promise = window.fs.createFolder(validateFolderName(document.getElementById("fs-create-folder").value))
        }
        chMkDirentForm(false)
        promise.then(() => getFolderContent()).catch(e => console.log(e))
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
                            <div title={pageCompact ? button.name : ""} className={`d-flex align-items-center mx-2 file-manager-controller text-center ${FILE_MANAGER_DIRENT_CLASS}`} onClick={button.action} key={index.toString()} page-compact={pageCompact.toString()}>
                                {button.icon} <div className="file-manager-controller-text ms-1">{button.name}</div>
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
                    <div className={`text-center d-flex align-items-center text-truncate`}>
                        <FontAwesomeIcon icon={faPlusCircle} className="me-2 file-manager-controller" onClick={() => {chMkDirentForm(!mkDirentForm)}} />
                        <div>{itemsLen} {itemsLen === 1 ? "item" : "items"}</div>
                    </div>
                    { mkDirentForm && 
                        <div className="fs-add-dirent p-1">
                            <div className="pb-1 d-flex">
                                <input id="fs-create-file" className="text-center fs-add-input px-2" placeholder="file" />
                                <div className="fs-create-button px-2 ms-1 d-flex align-items-center" onClick={() => createDirent("file")}>
                                    <FontAwesomeIcon icon={faFileCirclePlus} />
                                </div>
                            </div>
                            <div className="fs-add-divider"></div>
                            <div className="pt-1 d-flex">
                                <input id="fs-create-folder" className="text-center fs-add-input px-2" placeholder="folder" />
                                <div className="fs-create-button px-2 ms-1 d-flex align-items-center" onClick={() => createDirent("folder")}>
                                    <FontAwesomeIcon icon={faFolderPlus}/>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="ms-2 text-truncate">
                        {window.fs.getCurrentPath()}
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

    let compareIndexes = function (indexes0, indexes1) {
        if (indexes0.length === indexes1.length)
            return indexes0.every((el, i) => el === indexes1[i])
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
            let newPath = window.fs.pathJoin([prevString, tree[curIndex].name])
            tree = tree[curIndex].content
            return newPath
        }, rootDir)
    }

    let setOpenedFiles = function (path, dirent) {
        window.fs.readFile(path, dirent.name)
        .then(result => {
            let openedFiles = props.state.openedFiles
            openedFiles = openedFiles.map(file => {
                if (file.active)
                    file.active = false
                return file
            })
            openedFiles.push({
                name : dirent.name,
                path : path,
                indexes : dirent.indexes || [],
                code : result.data,
                active : true
            })
            props.state.setOpenedFiles(openedFiles)
        })
        .catch(error => {
            console.log(error.err)
        })
    }

    let openFile = function (e, dirent) {
        if (fileIsNotOpened(dirent)) {
            if (dirent.indexes) {
                setOpenedFiles(setPath(dirent), dirent)
            } else {
                setOpenedFiles(props.state.projectFiles.rootDir, dirent)
            }
        } else {
            if (e.target.tagName === "path" || e.target.tagName === "svg")
                return
            let openedFiles = props.state.openedFiles
            openedFiles = openedFiles.map(file => {
                if (file.active)
                    file.active = false
                if (file.name === dirent.name && compareIndexes(file.indexes, dirent.indexes || []))
                    file.active = true
                return file
            })
            props.state.setOpenedFiles(openedFiles)
        }
    }


    let closeFile = function (dirent) {
        let files = props.state.openedFiles
        let prevIndex = null
        files = files.filter((file, index) => {
            if (file.path + file.name !== dirent.path + dirent.name)
                return true
            if (file.active)
                prevIndex = index
        })
        if (files.length && prevIndex !== null)
            files[prevIndex !== files.length ? prevIndex : prevIndex - 1].active = true
        props.state.setOpenedFiles(files)
    }

    let [openDirs, setOpenDirs] = useState([])

    let renderFileTree = function (groupList, allowRm) {
        let expDir = function (indexes, e) {
            let filtered = openDirs.filter(el => el !== indexes)
            let chevron = document.getElementById(indexes)
            if (filtered.length !== openDirs.length) {
                chevron.style.transform = "rotate(0)"
                setOpenDirs(filtered)
            } else {
                chevron.style.transform = "rotate(90deg)"
                openDirs.push(indexes)
                setOpenDirs(openDirs)
                props.state.setProjectFiles({...props.state.projectFiles, forceUpd : !props.state.projectFiles.forceUpd})
            }
        }

        let activeItem = props.state.openedFiles.find(file => file.active)
        if (!activeItem || !activeItem.indexes)
            activeItem = ""

        let listUI = traverseAndRender(groupList, (dirent, indexes) => {
            let offset = indexes.map(() => <div className="ps-2"></div>)
            offset.push(<div className="ps-2"></div>)
            indexes = indexes.toString()

            let customClasses = dirent.active || activeItem.indexes && ((!activeItem.indexes.length && activeItem.name === dirent.name) || activeItem.indexes.toString() === indexes) ? "active-aside-fs-item" : ""
            if (!dirent.content) // this is File
                return (
                    <div 
                        key={indexes} 
                        className={`d-flex justify-content-start aside-fs-dirent ${customClasses}`} 
                        onDoubleClick={e => {
                            if (allowRm)
                                return
                            openFile(e, dirent)
                        }}
                        onClick={e => {
                            if (!allowRm)
                                return
                            openFile(e, dirent)
                        }}
                    >
                        { allowRm && 
                            <div className="aside-close-file-button ms-4" onClick={() => closeFile(dirent)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </div> || <></>
                        }
                        <div className="d-flex">
                            {offset}
                            <div>
                                {dirent.name}
                            </div>
                        </div>
                    </div>
                )
            if (dirent.content) { // this is Directory
                return (
                    <div key={indexes} className={`d-flex aside-fs-dirent ${customClasses}`} onClick={e => {expDir(indexes, e)}}>
                        {offset}
                        <div className={`d-flex align-items-center`}>
                            <FontAwesomeIcon icon={faChevronRight} className="aside-chevron" id={indexes} style={{transform : "rotate(0)"}} />
                            <div className="ms-2">{dirent.name}</div>
                        </div>
                    </div>
                )
            }
        }, [], openDirs)

        return(listUI)
    }

    let renderAsideGroup = function (title, groupList, customClasses="", allowRm) {
        let id = "chevron-" + title
        return(
            <div className={`${id} ${customClasses}`}>
                <div className={`d-flex align-items-center aside-fs-group-header ms-2 mt-1 ${title}`} onClick={() => {chevronOpenClose(id)}}>
                    <FontAwesomeIcon icon={faChevronRight} className="aside-chevron" opened="true"/>
                    <div className="ms-2">{title}</div>
                </div>
                <div className="chevron-after d-flex">
                    <div className="w-100">
                        {renderFileTree(groupList, allowRm)}
                    </div>
                </div> 
                <div className="aside-divider ms-4 me-2 mt-1" />
            </div>
        )
    }

    let projectContent = props.state.projectFiles.tree ? props.state.projectFiles.tree : []
    // let projectName = ""
    // if (props.state.projectFiles.rootDir) {
    //     projectName = props.state.projectFiles.rootDir.split(window.fs.getSep)
    //     projectName = projectName[projectName.length - 1]
    //     projectName = `project - ${projectName}`
    // } else {
    //     projectName = "project"
    // }

    return(
        <div className="py-1 aside-fs-card overflow-auto">
            {renderAsideGroup("open", props.state.openedFiles, "", true)}
            {renderAsideGroup("project", projectContent, "project-fs-group")}
        </div>
    )
}

export {
    FileManagerAside,
    FileManagerPage
}

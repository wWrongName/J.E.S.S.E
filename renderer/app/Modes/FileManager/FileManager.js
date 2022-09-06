import React, { useEffect, useState } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestion, faBoxOpen, faFolderOpen, faRectangleXmark, faTrash, faFolder, faFileLines } from '@fortawesome/free-solid-svg-icons'

import ErrorModal from "../../../shared/components/Modal/ErrorModal"

import "./fileManager.css"

const FILE_MANAGER_DIRENT_CLASS = "dir-ent-button"


function FileManagerPage (props) {

    let getFolderContent = function () {
        window.fs.getCurrentFolderContent()
        .then(res => {
            props.state.setProjectFiles(res.content)
        })
        .catch(e => {
            setModalBody(e.err.toString())
        })
    }

    useEffect(getFolderContent, [])

    let [modalBody, setModalBody] = useState()
    let [activeDirent, setActiveDirent] = useState()

    let controls = {
        openProject : {
            name : "open project",
            icon : <FontAwesomeIcon icon={faBoxOpen} />,
            action : undefined
        },
        openFolder : {
            name : "open folder",
            icon : <FontAwesomeIcon icon={faFolderOpen} />,
            action : () => openDirent(props.state.projectFiles[activeDirent])
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
        }
    }
    let controlOrder = ["openProject", "openFolder", "closeFolder", "deleteDirent"]

    let renderDirent = function (dirent, index) {
        let icon
        if (dirent.isFile)
            icon = <FontAwesomeIcon icon={faFileLines} />
        else if (dirent.isDir)
            icon = <FontAwesomeIcon icon={faFolder} />
        else 
            icon = <FontAwesomeIcon icon={faQuestion} />
        return (
            <div className={`mx-auto p-2 ${FILE_MANAGER_DIRENT_CLASS}`} 
                onClick={() => setActiveDirent(index)} 
                onDoubleClick={() => openDirent(dirent)}
                active-dirent={(activeDirent === index).toString()}
                key={index}
            >
                <div className="dir-ent-icon d-flex justify-content-center">
                    {icon}
                </div>
                <div className="d-flex justify-content-center">
                    {dirent.name}
                </div>
            </div>
        )
    }

    let openDirent = function (dirent) {
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
    
    let openFile = function (fileName) {
        console.log("open file")
    }

    let handlePageClick = function (e) {
        try {
            if (e.target.className.search(FILE_MANAGER_DIRENT_CLASS) === -1)
                setActiveDirent()
        } catch (e) {}
    }

    return(
        <>
            <ErrorModal modalbody={modalBody} onHide={() => setModalBody()} show={modalBody}/>
            <div className="py-3 h-100 overflow-auto" onClickCapture={handlePageClick}>
                <div className="d-flex justify-content-center align-items-center mb-3">
                    {controlOrder.map((controller, index) => {
                        let button = controls[controller]
                        return(
                            <div className="mx-2 file-manager-controller" onClick={button.action}>
                                {button.icon} {button.name}
                            </div>
                        )
                    })}
                </div>
                {/* <div className="light-divider mx-5"></div> */}
                <div className="d-flex flex-wrap m-4">
                    {props.state.projectFiles.map((dirent, index) => {
                        return renderDirent(dirent, index)
                    })}
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

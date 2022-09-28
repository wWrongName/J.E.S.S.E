import React from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import "./fileCard.css"


function FileCard (props) {
    let closeFile = function (path, name) {
        let files = props.openedFiles
        let prevIndex = null
        files = files.filter((file, index) => {
            if (file.path + file.name !== path + name)
                return true
            if (file.active)
                prevIndex = index
        })
        if (files.length && prevIndex !== null)
            files[prevIndex !== files.length ? prevIndex : prevIndex - 1].active = true
        props.setOpenedFiles(files)
    }

    let openFile = function (path, name) {
        let files = props.openedFiles
        files = files.map(file => {
            if (file.active)
                file.active = false
            if (file.path + file.name === path + name)
                file.active = true
            return file
        })
        props.setOpenedFiles(files)
    }

    let customClasses = props.active ? "active-file-card" : ""

    return(
        <div className={`pt-1 file-card-wrap ${customClasses}`} active-fc={customClasses} onDoubleClick={() => openFile(props.path, props.text)}>
            <div className={`d-flex align-items-center file-card pe-2 px-2 ${customClasses}`}>
                <div className="px-2">{props.text}</div>
                <FontAwesomeIcon icon={faXmark} className="close-file-button" onClick={() => closeFile(props.path, props.text)}/>
            </div>
        </div>
    )
}

export default FileCard
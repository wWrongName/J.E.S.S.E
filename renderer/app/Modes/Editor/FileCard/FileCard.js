import React from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import "./fileCard.css"


function FileCard (props) {
    let closeFile = function (path, name) {
        let files = props.openedFiles
        files = files.filter(file => file.path + file.name !== path + name)
        props.setOpenedFiles(files)
    }

    return(
        <div className="p-2">
            <div className="d-flex align-items-center file-card pe-2">
                <div className="mx-2">{props.text}</div>
                <FontAwesomeIcon icon={faXmark} className="close-file-button" onClick={() => closeFile(props.path, props.text)}/>
            </div>
        </div>
    )
}

export default FileCard
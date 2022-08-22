import React from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import "./fileCard.css"


function FileCard (props) {
    return(
        <div className="p-2">
            <div className="d-flex align-items-center file-card pe-2">
                <div className="mx-2">{props.text}</div>
                <FontAwesomeIcon icon={faXmark} className="close-file-button" />
            </div>
        </div>
    )
}

export default FileCard
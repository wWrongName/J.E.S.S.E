import React, { useEffect } from "react"

import "./header.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faBars, faX, faJ } from '@fortawesome/free-solid-svg-icons'
import Controller from "./winControl.js"

const controller = new Controller()


function Header () {
    useEffect(() => controller.init())

    return(
        <header id="titlebar">
            <div className="draggable d-flex justify-content-between align-items-center h-100">
                <div className="icon mx-3">
                    <FontAwesomeIcon icon={faJ} />
                </div>
                {/* <div className="title">J.E.S.S.E.</div> */}
                <div className="controls mx-2 d-flex">
                    <div className="win-button roll-up">
                        <FontAwesomeIcon icon={faMinus} />
                    </div>
                    <div className="win-button minimize-maximize">
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                    <div className="win-button close">
                        <FontAwesomeIcon icon={faX} />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header

import React, { useEffect } from "react"

import "./draggable.css"


function Draggable (props) {

    let dragTheBorder = function (e) {
        if (e.clientX > WINCONFIG.minWAside && e.clientX < window.innerWidth - WINCONFIG.minWPages)
            document.documentElement.style.setProperty("--aside-border", e.clientX + "px")
    }

    let createListener = function () {
        document.addEventListener("mousemove", dragTheBorder)
    }

    let removeListener = function () {
        document.removeEventListener("mousemove", dragTheBorder)
    }

    return (
        <div className="draggable-aside-border" 
            onMouseDown={createListener}
            onMouseUp={removeListener}
            onMouseLeave={removeListener}
        />
    )
}

export default Draggable

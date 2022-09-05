import React, { useEffect } from "react"

import "./draggable.css"


function Draggable (props) {

    let dragTheBorder = function (e) {
        if (e.clientX)
            document.documentElement.style.setProperty("--aside-border", e.clientX + "px");
    }

    let createListener = function (e) {
        document.addEventListener("mousemove", dragTheBorder)
    }

    let removeListener = function () {
        document.removeEventListener("mousemove", dragTheBorder)
    }

    return (
        <div className="draggable-aside-border" 
            onMouseDown={e => createListener(e)}
            onMouseUp={removeListener}
        />
    )
}

export default Draggable

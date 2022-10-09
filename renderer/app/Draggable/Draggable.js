import React, { useEffect } from "react"

import eventEmitter from "../../shared/utils/eventEmitter"

import "./draggable.css"


function Draggable (props) {

    useEffect(() => {
        return eventEmitter.subscribe("drag_aside_border", borderOffset => {
            document.documentElement.style.setProperty("--aside-border", borderOffset + "px")
        })
    }, [])

    let dragTheBorder = function (e) {
        if (e.clientX > WINCONFIG.minWAside && e.clientX < window.innerWidth - WINCONFIG.minWPages)
            eventEmitter.emit("drag_aside_border", e.clientX)
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

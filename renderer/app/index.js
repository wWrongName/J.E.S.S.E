import React, { useState } from "react"
import ReactDOM from "react-dom/client"

import "./index.css"
import "../shared/css/cardShadow.css"
import "../shared/css/dividers.css"
import 'bootstrap/dist/css/bootstrap.min.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCode, faFolderTree, faFileExport, faShield, faEllipsis } from '@fortawesome/free-solid-svg-icons'

import Aside from "./Aside/Aside"
import Pages from "./Pages/Pages"
import Header from "./Header/Header"
import Draggable from "./Draggable/Draggable"
import {FileManagerAside, FileManagerPage} from "./Modes/FileManager/FileManager"

window.addEventListener("resize", function(event) {
    let asideBorder = getComputedStyle(document.body).getPropertyValue("--aside-border").replace("px", "")
    let winSizeX = window.innerWidth
    if (winSizeX - asideBorder < WINCONFIG.minWPages)
        document.documentElement.style.setProperty("--aside-border", winSizeX - WINCONFIG.minWPages + "px")
})

function Root () {
    let [projectFiles, setProjectFiles] = useState([])
    let [openedFiles, setOpenedFiles] = useState([])

    let fsState = {
        projectFiles, setProjectFiles,
        openedFiles, setOpenedFiles
    }

    const items = [
        {
            name : "editor",
            icon : <FontAwesomeIcon icon={faCode} />,
            navbar: true,
        },
        {
            name : "files",
            icon : <FontAwesomeIcon icon={faFolderTree} />,
            aside : <FileManagerAside state={fsState} />,
            page : <FileManagerPage state={fsState} />,
        },
        {
            name : "deploy",
            icon : <FontAwesomeIcon icon={faFileExport} />,
        },
        {
            name : "security",
            icon : <FontAwesomeIcon icon={faShield} />,
        },
        {
            name : "settings",
            icon : <FontAwesomeIcon icon={faEllipsis} />,
        }
    ]

    let [activeItem, setActiveItem] = useState(1)

    let openPage = function (name) {
        items.forEach((item, index) => {
            if (item.name === name) 
                setActiveItem(index)
        })
    }

    return(
        <>
            <Header />
            <Aside items={items} openPage={openPage} activeItem={items[activeItem]} />
            <Draggable />
            <Pages activeItem={items[activeItem]} />
        </>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
)

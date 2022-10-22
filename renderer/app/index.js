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
import {SettingsPage} from "./Modes/Settings/Settings"
import {EditorPage} from "./Modes/Editor/Editor"

window.addEventListener("resize", function(event) {
    let asideBorder = getComputedStyle(document.body).getPropertyValue("--aside-border").replace("px", "")
    let winSizeX = window.innerWidth
    if (winSizeX - asideBorder < WINCONFIG.minWPages)
        document.documentElement.style.setProperty("--aside-border", winSizeX - WINCONFIG.minWPages + "px")
})

function Root () {
    let [projectFiles, setProjectFiles] = useState({})
    let [openedFiles, setOpenedFiles] = useState([])
    let [activeItem, setActiveItem] = useState(4)

    let openPage = function (name) {
        items.forEach((item, index) => {
            if (item.name === name)
                setActiveItem(index)
        })
    }

    let fsState = {
        setProjectFiles, projectFiles,
        setOpenedFiles, openedFiles,
        openPage
    }

    let fileManagerAside = <FileManagerAside state={fsState} />

    const items = [
        {
            name : "editor",
            icon : <FontAwesomeIcon icon={faCode} />,
            aside : fileManagerAside,
            page : <EditorPage state={fsState} />,
        },
        {
            name : "files",
            icon : <FontAwesomeIcon icon={faFolderTree} />,
            aside : fileManagerAside,
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
            aside : undefined,
            page : <SettingsPage />
        }
    ]

    return(
        <>
            <Header />
            <Aside items={items} openPage={openPage} activeItem={activeItem} />
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

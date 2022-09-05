import React, { useState } from "react"
import ReactDOM from "react-dom/client"

import "./index.css"
import "../shared/css/cardShadow.css"
import 'bootstrap/dist/css/bootstrap.min.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCode, faFolderOpen, faFileExport, faShield, faEllipsis } from '@fortawesome/free-solid-svg-icons'

import Aside from "./Aside/Aside"
import Pages from "./Pages/Pages"
import Header from "./Header/Header"
import Draggable from "./Draggable/Draggable"


function Root () {
    const items = [
        {
            name : "editor",
            icon : <FontAwesomeIcon icon={faCode} />,
            navbar: "true"
        },
        {
            name : "files",
            icon : <FontAwesomeIcon icon={faFolderOpen} />,
            navbar: "true"
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

    let [activeItem, setActiveItem] = useState(items[0])

    let openPage = function (name) {
        items.forEach(item => {
            if (item.name === name) 
                setActiveItem(item)
        })
    }

    return(
        <>
            <Header />
            <Aside items={items} openPage={openPage} />
            <Draggable />
            <Pages activeItem={activeItem} />
        </>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
)

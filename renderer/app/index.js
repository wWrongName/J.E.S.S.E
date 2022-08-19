import React, { useState } from "react"
import ReactDOM from "react-dom/client"

import "./index.css"
import "../shared/css/cardShadow.css"
import 'bootstrap/dist/css/bootstrap.min.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCode, faFolderOpen, faFileExport, faShield } from '@fortawesome/free-solid-svg-icons'

import Navbar from "./Navbar/Navbar"
import Aside from "./Aside/Aside"
import Pages from "./Pages/Pages"


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
            <Aside items={items} openPage={openPage} />
            <Navbar activeItem={activeItem} />
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

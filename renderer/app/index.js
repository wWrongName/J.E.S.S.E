import React from "react"
import ReactDOM from "react-dom"

import "./index.css"
import "../shared/css/cardShadow.css"

import Navbar from "./Navbar/Navbar"
import Aside from "./Aside/Aside"
import Pages from "./Pages/Pages"


function Root () {
    return(
        <>
            <Aside /> 
            <Navbar /> 
            <Pages />
        </>
    )
}

ReactDOM.render(
    <Root />,
    document.getElementById("root")
)
import React from "react"

import "./pages.css"

import TopPanel from "./TopPanel/TopPanel"


function Pages (props) {
    let page
    try {
        page = props.activeItem.page
    } catch (e) {
        page = <></>
    }

    return(
        <div className="pages card-shadow-flat">
            {props.activeItem.navbar && <TopPanel />}
            {page}
        </div>
    )
}

export default Pages
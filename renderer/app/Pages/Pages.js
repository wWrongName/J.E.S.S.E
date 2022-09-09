import React from "react"

import "./pages.css"


function Pages (props) {
    let page
    try {
        page = props.activeItem.page
    } catch (e) {
        page = <></>
    }

    return(
        <div className="pages card-shadow-flat">
            {page}
        </div>
    )
}

export default Pages
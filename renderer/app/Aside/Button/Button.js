import React from "react"

import "./button.css"


function Button (props) {
    let customClasses = props.customClasses ? props.customClasses : ""

    return(
        <div className={`d-flex justify-content-center align-items-center aside-button ${customClasses}`}>
            {props.nested}
        </div>
    )
}

function ButtonActive (props) {
    let customClasses = props.customClasses ? props.customClasses : ""

    return <Button nested={props.nested} customClasses={customClasses + " active-aside-button"}/>
}

export {
    Button,
    ButtonActive
}
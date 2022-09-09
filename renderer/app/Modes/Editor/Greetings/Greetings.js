import React from "react"

import "./greetings.css"


function Greetings(props) {
    return (
        <div className="h-75 d-flex align-items-center">
            <div className="col">
                <div className="greetings-title text-center">
                    J.E.S.S.E.
                </div> 
                <div className="greetings-divider mx-5 mb-4"/> 
                <div className="greetings mx-auto px-2 py-1">
                    Test version
                </div>
            </div>
        </div>
    )
}

export default Greetings

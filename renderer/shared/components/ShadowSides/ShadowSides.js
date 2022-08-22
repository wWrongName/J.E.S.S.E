import React, { useState } from "react"

import "./shadowSides.css"


function ShadowSides (props) {
    let [showShadows, setShadows] = useState(false)
    
    return(
        <>
            {showShadows &&
                <div>
                    <div className="panel-side-left"></div>
                    <div className="panel-side-right"></div>
                </div> 
            }
            <div onMouseEnter={() => setShadows(true)} onMouseLeave={() => setShadows(false)}>
                {props.nested}
            </div>
        </>
    )
}

export default ShadowSides

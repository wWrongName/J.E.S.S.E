import React, { useState } from "react"

import "./shadowSides.css"


function ShadowSides (props) {
    let [showShadows, setShadows] = useState(false)
    
    let scrollLeft = function (e) {
        let ee = document.querySelector(props.scrollLeft)
        ee.scrollLeft += (e.deltaY >> 2)
    }

    return(
        <>
            {showShadows &&
                <div>
                    <div className="panel-side-left"></div>
                    <div className="panel-side-right"></div>
                </div> 
            }
            <div onMouseEnter={() => setShadows(true)} onMouseLeave={() => setShadows(false)} onWheel={e => scrollLeft(e)} >
                {props.nested}
            </div>
        </>
    )
}

export default ShadowSides

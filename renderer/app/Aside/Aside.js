import React from "react"

import "./aside.css"

import { Button, ButtonActive } from "./Button/Button"


function Aside (props) {
    
    return(
        <div>
            <div className="aside card-shadow-flat">
                {props.items.map((item, index) => {
                    return(
                        <div key={index} onClick={() => props.openPage(item.name)}>
                            <Button nested={item.icon} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Aside

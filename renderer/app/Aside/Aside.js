import React from "react"

import "./aside.css"

import { Button, ButtonActive } from "./Button/Button"


function Aside (props) {
    return(
        <div className="aside card-shadow-flat py-2">
            <div>
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

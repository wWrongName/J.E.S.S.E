import React from "react"

import "./aside.css"

import { Button, ButtonActive } from "./Button/Button"


function Aside (props) {
    return(
        <div className="aside card-shadow-flat py-2">
            <div>
                {props.items.map((item, index) => {
                    if (index === props.items.length - 1)
                        return <></>
                    return(
                        <div key={index} onClick={() => props.openPage(item.name)}>
                            <Button nested={item.icon} />
                        </div>
                    )
                })}
                <div className="aside-settings" key="settings" onClick={() => props.openPage(props.items[props.items.length-1].name)}>
                    <Button nested={props.items[props.items.length-1].icon} />
                </div>
            </div>
        </div>
    )
}

export default Aside

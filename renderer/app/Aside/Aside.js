import React from "react"
import ShadowSides from "../../shared/components/ShadowSides/ShadowSides"

import "./aside.css"

import { Button, ButtonActive } from "./Button/Button"


function Aside (props) {
    let aside
    try {
        aside = props.items[props.activeItem].aside
    } catch (e) {
        aside = <></>
    }

    return(
        <div className="aside card-shadow-flat">
            <ShadowSides nested={
                <div className="d-flex aside-selector px-2">
                    {props.items.map((item, index) => {
                        return(
                            <div key={index} onClick={() => props.openPage(item.name)}>
                                { props.activeItem === index &&
                                    <ButtonActive nested={item.icon} /> || 
                                    <Button nested={item.icon} />
                                }
                            </div>
                        )
                    })}
                </div>
            }  scrollLeft={".aside-selector"}/>
            {aside}
        </div>
    )
}

export default Aside

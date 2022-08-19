import React from "react"

import "./navbar.css"


function Navbar (props) {
    return(
        <div active-nav={props.activeItem.navbar + ""}>
            <div className="nav card-shadow-flat">
                
            </div>
        </div>
    )
}

export default Navbar
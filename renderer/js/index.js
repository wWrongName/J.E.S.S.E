import React from "react"
import ReactDOM from "react-dom"


function Root () {
    return(
        <>
            <h1>💖 Hello World!</h1>
            <p>Welcome to your Electron application.</p>
        </>
    )
}

ReactDOM.render(
    <Root />,
    document.getElementById("root")
)
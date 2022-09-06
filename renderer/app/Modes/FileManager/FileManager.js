import React, { useEffect } from "react"


function FileManagerPage (props) {
    console.log(props)

    useEffect(() => {
        window.fs.getCurrentFolderContent()
        .then(res => {
            props.state.setProjectFiles(res.content)
        })
        .catch(err => console.log(err))
    }, [])

    return(
        <>
            {props.state.projectFiles.map((dirent, index) => {
                return (
                    <div key={dirent.name}>
                        {dirent.name}<br/>
                    </div>
                )
            })}
        </>
    )
}

function FileManagerAside (props) {
    return(
        <>123</>
    )
}

export {
    FileManagerAside,
    FileManagerPage
}

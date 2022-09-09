import React from "react"

import FileCard from "../../Modes/Editor/FileCard/FileCard"
import Greetings from "./Greetings/Greetings"
import ShadowSides from "../../../shared/components/ShadowSides/ShadowSides"

import "./editor.css"


function EditorPage(props) {


    return (
        <>
            { props.state.openedFiles.length &&
                <ShadowSides 
                    nested={
                        <div className="top-panel d-flex">
                            {props.state.openedFiles.map((file, index) => {
                                return (
                                    <FileCard
                                        text={file.name}
                                        path={file.path}
                                        openedFiles={props.state.openedFiles}
                                        setOpenedFiles={props.state.setOpenedFiles}
                                        key={index}
                                    />
                                )
                            })}
                        </div>
                    } 
                    scrollLeft={".top-panel"}
                /> || <Greetings />
            }
        </>
    )
}

export {
    EditorPage
}

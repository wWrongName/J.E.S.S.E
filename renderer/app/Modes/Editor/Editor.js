import React, { useState } from "react"

import FileCard from "../../Modes/Editor/FileCard/FileCard"
import Greetings from "./Greetings/Greetings"
import ShadowSides from "../../../shared/components/ShadowSides/ShadowSides"
import TextArea from "./TextArea/TextArea"

import "./editor.css"


function EditorPage(props) {
    if (props.state.openedFiles.length) {
        return (
            <div className="h-100">
                <ShadowSides 
                    nested={
                        <div className="top-panel d-flex">
                            {props.state.openedFiles.map((file, index) => {
                                return (
                                    <FileCard
                                        text={file.name}
                                        path={file.path}
                                        active={file.active}
                                        openedFiles={props.state.openedFiles}
                                        setOpenedFiles={props.state.setOpenedFiles}
                                        key={index.toString()}
                                    />
                                )
                            })}
                        </div>
                    } 
                    scrollLeft={".top-panel"}
                />
                <div className="d-flex h-100 text-monospace">
                    <TextArea 
                        openedFiles={props.state.openedFiles} 
                        setOpenedFiles={props.state.setOpenedFiles}
                    />
                </div>
            </div>
        )
    } else 
        return <Greetings />
}

export {
    EditorPage
}

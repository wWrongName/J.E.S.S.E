import React, { useState } from "react"

import FileCard from "../../Modes/Editor/FileCard/FileCard"
import Greetings from "./Greetings/Greetings"
import ShadowSides from "../../../shared/components/ShadowSides/ShadowSides"
import TextArea from "./TextArea/TextArea"

import "./editor.css"


function EditorPage(props) {
    let [text, setText] = useState("123\n123\n123\n1g23\n12f3\n123\n")

    if (props.state.openedFiles.length) {
        let activeFile = props.state.openedFiles.find(file => file.active)
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
                                        key={index}
                                    />
                                )
                            })}
                        </div>
                    } 
                    scrollLeft={".top-panel"}
                />
                <div className="d-flex h-100 text-monospace">
                    <TextArea code={activeFile.code}/>
                </div>
            </div>
        )
    } else 
        return <Greetings />
}

export {
    EditorPage
}

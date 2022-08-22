import React from "react"

import "./topPanel.css"

import FileCard from "./FileCard/FileCard"
import ShadowSides from "../../../shared/components/ShadowSides/ShadowSides"


function TopPanel (props) {
    return(
        <div>
            <ShadowSides nested={
                <div className="top-panel d-flex">
                    <FileCard text="newFasdile"/>
                    <FileCard text="newFasdile"/>
                    <FileCard text="newFasdile"/>
                    <FileCard text="newFasdile"/>
                    <FileCard text="newFasdile"/>
                </div>
            }/>
        </div>
    )
}

export default TopPanel
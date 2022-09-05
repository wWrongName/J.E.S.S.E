import React, { useEffect } from "react"

import "./topPanel.css"

import FileCard from "./FileCard/FileCard"
import ShadowSides from "../../../shared/components/ShadowSides/ShadowSides"



function TopPanel (props) {

    return(
        <div>
            <ShadowSides 
                nested={
                    <div className="top-panel d-flex">
                        <FileCard text="new1Fasdile"/>
                        <FileCard text="new2Fasdile"/>
                        <FileCard text="newF3asdile"/>
                        <FileCard text="newF1asdile"/>
                        <FileCard text="new321Fasdile"/>
                        <FileCard text="newF123asdile"/>
                        <FileCard text="new123Fasdile"/>
                        <FileCard text="newF32asdile"/>
                        <FileCard text="new123Fasdile"/>
                        <FileCard text="123newFasdile"/>
                        <FileCard text="new123Fasdile"/>
                        <FileCard text="ne123wFasdile"/>
                    </div>
                } scrollLeft={".top-panel"}
            />
        </div>
    )
}

export default TopPanel
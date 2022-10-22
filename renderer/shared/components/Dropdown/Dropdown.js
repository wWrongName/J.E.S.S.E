import React, {useEffect, useState} from "react"
import { Dropdown, Form, InputGroup, DropdownButton } from "react-bootstrap"

import "./dropdown.css"

const CustomDropdown = function (props) {
    return (
        <InputGroup className="mb-3 w-100">
            <InputGroup.Text className="w-25">
                {props.name}
            </InputGroup.Text>
            <DropdownButton
                title={props.items[props.i]}
            >
                {props.items.map((item, i) => <Dropdown.Item 
                    key={i.toString()}
                    eventKey={i.toString()}
                    onClick={() => {props.action(i)}}
                    className="settings-dropdown-item"
                >
                    {item}
                </Dropdown.Item>)}
            </DropdownButton>
        </InputGroup>
    )
}

export default CustomDropdown

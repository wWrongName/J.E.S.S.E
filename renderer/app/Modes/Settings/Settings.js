import React, {useState} from "react"
import { Form, InputGroup } from "react-bootstrap"

import Dropdown from "../../../shared/components/Dropdown/Dropdown"


import "./settings.css"
let SettingsPage = function () {
    const settingsMap = {
        privateKey : {
            name : "Private key",
            data : "a1j34jb5j"
        },
        lang : {
            name : "Default language",
            data : ["English", "Русский"]
        },
        compiler : {
            name : "Compiler version",
            data : ""
        },
        defaultNetwork : {
            name : "Default network",
            data : []
        },
        defPath : {
            name : "Default work space",
            data : ""
        }
    }


    let renderDataField = (item) => {
        if (typeof item.data === "object") {
            if (Array.isArray(item.data)) {
                return (
                    <Dropdown />
                )
            }
        } 
        if (typeof item.data === "string") {
            return (
                <InputGroup className="mb-3">
                    <InputGroup.Text className="w-50">
                        {item.name}
                    </InputGroup.Text>
                    <Form.Control
                        aria-label="Default"
                        value={item.data}
                        aria-describedby="inputGroup-sizing-default"
                    />
                </InputGroup>
            )
        }
        throw new Error(`wrong data type`)
    }

    const [filter, setFilter] = useState("")

    let filtered = Object.keys(settingsMap).filter(item => new RegExp(`.*${filter}.*`).test(settingsMap[item].name.toLowerCase()))
    return (
        <div className="py-2 px-3">
            <Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="..."
                    className="settings-search-field"
                    aria-label="..."
                    onChange={e => setFilter(e.target.value.toLowerCase())}
                />
            </Form>
            <div className="my-4">
                {filtered.map(prop => {
                    return (
                        <div>{renderDataField(settingsMap[prop])}</div>
                    )
                })}
            </div>
        </div>
    )
}

export {
    SettingsPage
}
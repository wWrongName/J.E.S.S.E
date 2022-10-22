import React, {useEffect, useState} from "react"
import { Form, InputGroup } from "react-bootstrap"

import CustomDropdown from "../../../shared/components/Dropdown/Dropdown"
import eventEmitter from "../../../shared/utils/eventEmitter"
import { settings } from "../../../shared/utils/settings"

import "./settings.css"


let SettingsPage = function () {
    const [settingsMap, setSMap] = useState(settings.glob)
    useEffect(() => eventEmitter.subscribe("settings", () => {
        setSMap({...settings.glob, force: !settingsMap.force})
    }), [])

    let renderDataField = (item, propName) => {
        if (typeof item.data === "object") {
            if (Array.isArray(item.data)) {
                return (
                    <CustomDropdown name={item.name} items={item.data} action={value => {
                        eventEmitter.emit("settings", {name: propName, value})
                    }} i={item.active}/>
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
                        value={item.data}
                        onChange={e => eventEmitter.emit("settings", {name: propName, value: e.target.value})}
                    />
                </InputGroup>
            )
        }
        throw new Error(`wrong data type`)
    }

    const [filter, setFilter] = useState("")

    let filtered = Object.keys(settingsMap).filter(item => item !== "force" && new RegExp(`.*${filter}.*`).test(settingsMap[item].name.toLowerCase()))
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
                {filtered.map((prop, i) => {
                    return (
                        <div key={i.toString()}>{renderDataField(settingsMap[prop], prop)}</div>
                    )
                })}
            </div>
        </div>
    )
}

export {
    SettingsPage
}
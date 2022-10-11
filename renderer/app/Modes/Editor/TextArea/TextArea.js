import React, { useRef, useState, useEffect } from "react"
import { FixedSizeList as List } from "react-window"

import eventEmitter from "../../../../shared/utils/eventEmitter"
import {commands, Document} from "../../../../shared/utils/Document"
import colorScheme from "../../../../shared/colorSchemes/basicJSol"

import "./textArea.css"

const CODE_DOM_ID = "code-dom"

let TextArea = (props) => {
    let activeFile = props.openedFiles.find(file => file.active)

    const [cursor, setCursor] = useState({x : 0, y : 0})
    const [code, setCode] = useState({prevChunkBorder : 0, model : [], strBuffer : [], maxStr : 0, doc : new Document(), cursor})
    const [listSize, setListSize] = useState({width: 0, height: 0})
    const sizeRef = useRef()

    useEffect(() => {
        let element = document.getElementById(CODE_DOM_ID).firstChild
        let scroll = function (e) {
            e.preventDefault()
            if (e.shiftKey)
                element.scrollLeft += (e.deltaY / 2)
            else
                element.scrollTop += (e.deltaY / 2)
        }
        let detectMouseEnter = () => element.addEventListener("wheel", scroll, { passive: false, capture: false })
        let rmDetector = () => document.removeEventListener("wheel", scroll)
        document.addEventListener("mouseover", detectMouseEnter)
        document.addEventListener("mouseleave", rmDetector)
        return () => {
            document.removeEventListener("mouseover", detectMouseEnter)
            document.removeEventListener("mouseleave", rmDetector)
            document.removeEventListener("wheel", scroll)
        }
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDownEvent)
        return () => document.removeEventListener('keydown', handleKeyDownEvent)
    }, [cursor])

    let handleKeyDownEvent = e => {
        try {
            if (specKeyPressed(e))
                return
            else if (numPressed(e))
                return
            else if (keyPressed(e))
                return
        } catch (e) {
            console.log(e)
        }
    }

    let keyPressed = e => {
        if (e.code.search("Key") === 0) {
            cursor.x = code.doc.InsertChar(code.model, cursor, e.key).getLastCommand().x
        } else if (e.key.length === 1) {
            cursor.x = code.doc.InsertChar(code.model, cursor, e.key).getLastCommand().x
        } else {
            throw new Error("Unresolved key event")
        }
        setCursorPosition(cursor.x + 1)
        return true
    }

    let numPressed = e => {
        if (e.code.search("Digit") === 0) {
            code.doc.InsertChar(code.model, cursor, e.key)
            setCursorPosition(cursor.x + 1)
            return true
        }
    }

    let specKeyPressed = e => {
        if (e.ctrlKey) {
            if (e.code === "KeyZ") {
                let cNote = {x : 0, y : 0}
                if (e.shiftKey) {
                    let res = code.doc.Redo(code.model).getLastCommand()
                    cNote.x = res.x
                    cNote.y = res.y
                    if (res.command === commands.insert)
                        cNote.x++
                    if (res.command === commands.enter)
                        cNote.y++
                } else {
                    let res = code.doc.Undo(code.model).getLastUCommand()
                    cNote.x = res.x
                    cNote.y = res.y
                }
                setCursorPosition(cNote.x, cNote.y)
            }
            return true
        } else {
            let {x, y} = cursor
            switch (e.code) {
                case "Enter": {
                    let {y} = code.doc.Enter(code.model, cursor).getLastCommand()
                    setCursorPosition(0, y + 1)
                    break
                }
                case "Tab": {
                    let {x} = code.doc.Tab(code.model, cursor).getLastCommand()
                    setCursorPosition(x)
                    break
                }
                case "Backspace": {
                    let {x, y} = code.doc.Backspace(code.model, cursor).getLastCommand()
                    setCursorPosition(x, y)
                    break
                }
                case "Delete": {
                    code.doc.Delete(code.model, cursor)
                    setCursorPosition()
                    break
                }
                case "ArrowDown": {
                    if (y + 1 < code.model.length) {
                        let strLen = code.model[y + 1].length
                        if (strLen - 1 <= x) {
                            if (!strLen)
                                setCursorPosition(0, y + 1)
                            else
                                setCursorPosition(strLen - 1, y + 1)
                        } else
                            setCursorPosition(x, y + 1)
                    }
                    break 
                }
                case "ArrowUp": {
                    if (y - 1 < 0)
                        break
                    let len = code.model[y - 1].length
                    if (len < x)
                        setCursorPosition(len - 1, y - 1)
                    else
                        setCursorPosition(x, y - 1)
                    break
                }
                case "ArrowLeft": {
                    if (x - 1 < 0) {
                        if (y - 1 < 0)
                            break
                        setCursorPosition(code.model[y - 1].length - 1, y - 1)
                    } else {
                        setCursorPosition(x - 1)
                    }
                    break
                }
                case "ArrowRight": {
                    if (x + 1 < code.model[y].length) {
                        setCursorPosition(x + 1)
                    } else {
                        if (y + 1 < code.model.length)
                            setCursorPosition(0, y + 1)
                    }
                    break
                }
                default:
                    return false
            }
            return true
        }
    }

    let updateListSize = function (x, y) {
        let width, height
        if (Number.isInteger(x))
            width = x
        else {
            if (sizeRef.current)
                width = sizeRef.current.offsetWidth
            else 
                width = WINCONFIG.minWPages
        }
        if (Number.isInteger(y))
            height = y
        else {
            if (sizeRef.current)
                height = sizeRef.current.offsetHeight
            else 
                height = 0
        }
        setListSize({ width, height })
    }

    let [leftOffset, setLeftOffset] = useState(0)
    useEffect(() => {
        let unsubscribe = eventEmitter.subscribe("drag_aside_border", borderOffset => {
            updateListSize(window.innerWidth - borderOffset)
        })
        let codeDom = document.getElementById(CODE_DOM_ID).firstChild
        let updScrollLeft = () => {
            let newOffset = codeDom.scrollLeft
            if (newOffset !== leftOffset) {
                setLeftOffset(newOffset)
                document.querySelectorAll(".editor-str-num").forEach(el => {
                    el.style.left = newOffset + "px"
                })
            }
        }
        updScrollLeft()
        codeDom.addEventListener("scroll", updScrollLeft)
        return () => {
            codeDom.removeEventListener("scroll", updScrollLeft)
            unsubscribe()
        }
    }, [leftOffset])

    useEffect(() => {
        window.addEventListener("resize", updateListSize)
        updateListSize()
        return () => window.removeEventListener('resize', updateListSize)
    }, [sizeRef.current])

    const [prevActiveFile, setPrevActiveFile] = useState(activeFile)
    useEffect(() => {
        prevActiveFile.cursor = cursor
        if (Array.isArray(activeFile.model)) {
            setCode({ prevChunkBorder : -1, model : activeFile.model, strBuffer : [], maxStr: activeFile.maxStr, doc : activeFile.doc })
            setCursor(activeFile.cursor)
        } else {
            setCode({ prevChunkBorder : 0, model : [], strBuffer : [], maxStr: 0, doc : new Document(), cursor: {x: 0, y: 0} })
            setCursor({x: 0, y: 0})
        }
        setPrevActiveFile(activeFile)
    }, [props.openedFiles])

    useEffect(() => {
        convertCodeToModel(activeFile.code)
    }, [code])

    let setCursorPosition = (x=cursor.x, y=cursor.y) => setCursor({ x : Number(x), y : Number(y) })

    let removeChar = (x, y) => {
        activeFile.model[y].splice(x, 1)
        setCursorPosition(x, y)
    }

    let insertChar = (x, y, char) => {
        activeFile.model[y].splice(x, 0, char)
        setCursorPosition(x, y)
    }

    let convertCodeToModel = (rawCode) => {
        let maxStr = code.maxStr
        if (code.prevChunkBorder === -1 || rawCode === null) { // data has already converted and saved into openedFiles
            return
        }
        if (code.prevChunkBorder === 0 && (code.model.length || code.strBuffer.length))
            return
        if (code.prevChunkBorder === rawCode.length) {
            let files = props.openedFiles.map(file => {
                if (file.active) {
                    let lastStr = code.model[code.model.length-1]
                    if (lastStr[lastStr.length-1] !== "\r")
                        lastStr.push("\r")
                    file.code = null
                    file.model = code.model
                    file.doc = code.doc
                    file.maxStr = maxStr
                    file.cursor = cursor
                }
                return file
            })
            props.setOpenedFiles(files)
            return
        }

        let strBuffer = code.strBuffer
        let curChunkBorder = Math.min(code.prevChunkBorder + WINCONFIG.renderingChunkSize, rawCode.length)
        for (let i = code.prevChunkBorder; i < curChunkBorder; i++) {
            let char = rawCode[i]
            if (char === '\n') {
                maxStr = Math.max(maxStr, strBuffer.length)
                code.model.push(strBuffer)
                strBuffer = []
                continue
            } else {
                strBuffer.push(char)
            }
        }
        if (curChunkBorder === rawCode.length) {
            maxStr = Math.max(maxStr, strBuffer.length)
            code.model.push(strBuffer)
            strBuffer = []
        }
        setCode({ prevChunkBorder : curChunkBorder, model : code.model, strBuffer, maxStr, doc : code.doc, cursor })
    }

    let handleCursorAction = e => {
        let x = e.target.getAttribute("x")
        let y = e.target.parentElement.getAttribute("y")
        setCursorPosition(x, y)
    }

    let handleCursorActionCleanStr = e => {
        let y = e.target.getAttribute("y")
        if (y === null)
            return
        let children = e.target.childNodes
        setCursorPosition(children[children.length-1].getAttribute("x"), y)
    }

    let renderCodeString = function (strModel, index) {
        let strDOM = []

        let renderWord = (word, color=colorScheme.default) => {
            for (let char of word) {
                let x = strDOM.length.toString()
                strDOM.push(
                    <span 
                        key={x} 
                        x={x} 
                        className={`${index === cursor.y && strDOM.length === cursor.x ? "editor-char" : ""}`} 
                        onMouseDown={handleCursorAction}
                        style={{color}}
                    >
                        {char === ' ' || char === "\r" ? <>&nbsp;</> : char}
                    </span>
                )
            }
        }

        let lexemeBuffer = ""
        for (let i in strModel) {
            let char = strModel[i]
            let detected = colorScheme.words[char]
            if (detected !== undefined) {
                renderWord(lexemeBuffer)
                renderWord(char, colorScheme.colors[detected])
                lexemeBuffer = ""
                continue
            }
            lexemeBuffer += char
            if (char === " " || char === "\r") {
                renderWord(lexemeBuffer)
                lexemeBuffer = ""
                continue
            }
            detected = colorScheme.words[lexemeBuffer]
            if (detected !== undefined) {
                if (detected === "type-name" && i < strModel.length-1 && strModel[Number(i)+1] !== " " && !Number.isNaN(Number(strModel[Number(i)+1])))
                    continue
                renderWord(lexemeBuffer, colorScheme.colors[detected])
                lexemeBuffer = ""
            }
        }
        
        let customClass = cursor.y === index ? "active-editor-code-str" : ""
        return (
            <div key={index.toString()} y={index} className={`editor-code-str ${customClass}`} onMouseDown={handleCursorActionCleanStr}>
                {strDOM}
            </div>
        )
    }

    return (
        <div id={CODE_DOM_ID} ref={sizeRef}>
           <List
                innerElementType="ul"
                itemCount={code.model.length}
                itemSize={20}
                height={listSize.height}
                width={listSize.width}
            >
                {({ index, style }) => {
                    return (
                        <div style={{...style, minWidth: code.maxStr * 10 + "px"}} className="d-flex align-items-center editor-string">
                            <div className={`editor-str-num ${cursor.y === index ? "active-editor-str-num" : ""}`} style={{left: leftOffset}}>{index + 1}</div>{renderCodeString(code.model[index], index)}
                        </div>
                    );
                }}
            </List>
        </div>
    )
}

export default TextArea

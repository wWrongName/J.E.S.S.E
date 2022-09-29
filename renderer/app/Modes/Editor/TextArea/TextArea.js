import React, { useRef, useState, useEffect } from "react"
import { FixedSizeList as List } from "react-window"

import "./textArea.css"


let TextArea = (props) => {
    let activeFile = props.openedFiles.find(file => file.active)

    const [code, setCode] = useState({prevChunkBorder : 0, model : [], strBuffer : []})
    const [cursor, setCursor] = useState({x : 0, y : 0})
    const [listSize, setListSize] = useState({width: 0, height: 0})
    const sizeRef = useRef()

    useEffect(() => {
        let updateSize = function () {
            if (sizeRef.current)
                setListSize({
                    width : sizeRef.current.offsetWidth - 17,
                    height : sizeRef.current.offsetHeight - 5
                })
        }
        window.addEventListener('resize', updateSize)
        updateSize()
        return window.removeEventListener.bind(window, 'resize', updateSize)
    }, [sizeRef.current])

    useEffect(() => {
        if (Array.isArray(activeFile.model))
            setCode({ prevChunkBorder : -1, model : activeFile.model, strBuffer : [] })
        else
            setCode({ prevChunkBorder : 0, model : [], strBuffer : [] })
    }, [props.openedFiles])

    useEffect(() => {
        convertCodeToModel(activeFile.code)
    }, [code])

    let setCursorPosition = (x, y) => setCursor({ x : x, y : y })

    let removeChar = (x, y) => {
        // получить строку model
        // удалить model элемент
        // переместить курсор
    }

    let insertChar = (x, y) => {
        // получить строку model
        // добавить новый объект, перезадать индексы элементов строки
        // переместить курсор 
    }

    let convertCodeToModel = (rawCode) => {
        if (code.prevChunkBorder === -1 || rawCode === null) { // data has already converted and saved into openedFiles
            return
        }
        if (code.prevChunkBorder === 0 && (code.model.length || code.strBuffer.length))
            return
        if (code.prevChunkBorder === rawCode.length) {
            let files = props.openedFiles.map(file => {
                if (file.active) {
                    file.code = null
                    file.model = code.model
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
                code.model.push(strBuffer)
                strBuffer = []
                continue
            } else {
                strBuffer.push(char)
            }
        }
        if (curChunkBorder === rawCode.length) {
            code.model.push(strBuffer)
            strBuffer = []
        }
        setCode({ prevChunkBorder : curChunkBorder, model : code.model, strBuffer })
    }

    let renderCodeString = function (strModel, index) {
        let strDOM = []
        for (let char of strModel) {
            strDOM.push(
                <span key={strDOM.length.toString()} className="">
                    {char === ' ' ? <>&nbsp;</> : char}
                </span>
            )
        }
        return (
            <div key={index.toString()} className="editor-code-str">
                {strDOM}
            </div>
        )
    }

    return (
        <div id="code-dom" className="ps-3" ref={sizeRef}>
           <List
                innerElementType="ul"
                itemCount={code.model.length}
                itemSize={20}
                height={listSize.height}
                width={listSize.width}
            >
                {({ index, style }) => {
                    return (
                        <div style={style} className="d-flex align-items-center editor-string">
                            <div className="editor-str-num">{index + 1}</div>{renderCodeString(code.model[index], index)}
                        </div>
                    );
                }}
            </List>
        </div>
    )
}

export default TextArea

import React,{ useState } from "react"

import "./textArea.css"


let TextArea = (props) => {
    let [codeDOM, setCodeDom] = useState([])
    let [cursor, setCursor] = useState({x : 0, y : 0})

    let setCursorPosition = (x, y) => setCursor({ x : x, y : y })

    let removeChar = (x, y) => {
        // получить строку DOM
        // удалить DOM элемент
        // переместить курсор
    }

    let insertChar = (x, y) => {
        // получить строку DOM
        // добавить новый объект, перезадать индексы элементов строки
        // переместить курсор 
    }

    let convertCodeToDOM = (code) => {
        codeDOM = []
        let strBuffer = []
        for (let char of code) {
            if (char === '\n') {
                let strDOM = <div key={codeDOM.length.toString()} className="editor-code-str">
                    {strBuffer}
                </div>
                codeDOM.push(strDOM)
                strBuffer = []
                continue
            }
            let charDOM, index = strBuffer.length.toString()
            if (char === ' ') {
                charDOM = <span key={index} className="">
                    &nbsp;
                </span>
            } else {
                charDOM = <span key={index}>
                    {char}
                </span>
            }
            strBuffer.push(charDOM)
        }
        codeDOM.push(
            <div key={codeDOM.length.toString()} className="editor-code-str">
                {strBuffer}
            </div>
        )
    }

    convertCodeToDOM(props.code)
    
    return (
        <div id="code-dom" className="px-3 py-2">
            {
                codeDOM.map((str, i) => (
                    <div className="d-flex align-items-center editor-string">
                        <div className="editor-str-num">{i}</div>{str}
                    </div>
                ))
            }
        </div>
    )
}

export default TextArea
